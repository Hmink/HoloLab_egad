import * as THREE from "../vendor/three/three.module.js";
import { hollowBeakerHulls } from "./lesson-geometry.js";
import RAPIER from "../vendor/rapier/rapier.mjs";

// A 1.1-scene-unit beaker is about 11 cm high. Masses below are kg.
export const METRES_PER_UNIT = 0.1;
export const FIXED_DT = 1 / 120;
export const PHYSICS_TUNING = Object.freeze({
  heldSpeed: 0.75, // m/s; only large target jumps are rate-limited.
  contactSpeed: 0.14, // m/s near another vessel: a finite, gentle push.
  heldAngularSpeed: 4, // rad/s, also bounded when landmarks jump.
  throwGain: 0.55,
  throwSpeed: 0.4, // m/s; table is only tens of centimetres deep.
  horizontalSpeed: 0.65, // m/s, exceptional collision-energy guard.
  angularSpeed: 8,
  linearDamping: 1.1,
  angularDamping: 2.4,
  tableFriction: 0.82,
  toolFriction: 0.75,
  restitution: 0.02,
});
const SKIN = 0.003; // 0.3 mm: held objects must stay fully above the tabletop.
const toMetres = (v) => ({
  x: v.x * METRES_PER_UNIT,
  y: v.y * METRES_PER_UNIT,
  z: v.z * METRES_PER_UNIT,
});
const toScene = (v) => ({
  x: v.x / METRES_PER_UNIT,
  y: v.y / METRES_PER_UNIT,
  z: v.z / METRES_PER_UNIT,
});
let initialized;
export function initPhysics() {
  return (initialized ??= RAPIER.init());
}

/** Rapier owns every free-desk mesh pose. Hand targets only drive kinematic bodies. */
export class LabPhysics {
  constructor(tableMesh) {
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.world.timestep = FIXED_DT;
    this.world.lengthUnit = 1;
    this.world.numSolverIterations = 12;
    this.world.numInternalPgsIterations = 1;
    this.world.integrationParameters.contact_natural_frequency = 60;
    this.world.maxCcdSubsteps = 4;
    this.world.integrationParameters.normalizedAllowedLinearError = 0.00005;
    this.entries = new Map();
    this.accumulator = 0;
    this.time = 0;
    this.lastStepCost = 0;
    this.recoveryCount = 0;
    this.totalSteps = 0;
    this.vector = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.euler = new THREE.Euler(0, 0, 0, "XYZ");
    tableMesh.updateWorldMatrix(true, false);
    const size = new THREE.Vector3(),
      position = new THREE.Vector3(),
      rotation = new THREE.Quaternion();
    tableMesh.matrixWorld.decompose(position, rotation, size);
    const p = tableMesh.geometry.parameters;
    size.set(
      Math.abs(size.x * p.width),
      Math.abs(size.y * p.height),
      Math.abs(size.z * p.depth),
    );
    if (Math.abs(rotation.x) > 1e-6 || Math.abs(rotation.z) > 1e-6)
      throw Error("Table must remain horizontal");
    this.table = { position, rotation, size, top: position.y + size.y / 2 };
    this.tableBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed()
        .setTranslation(
          position.x * METRES_PER_UNIT,
          position.y * METRES_PER_UNIT,
          position.z * METRES_PER_UNIT,
        )
        .setRotation(rotation),
    );
    this.tableCollider = this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(
        (size.x * METRES_PER_UNIT) / 2,
        (size.y * METRES_PER_UNIT) / 2,
        (size.z * METRES_PER_UNIT) / 2,
      )
        .setFriction(PHYSICS_TUNING.tableFriction)
        .setRestitution(PHYSICS_TUNING.restitution),
      this.tableBody,
    );
    this.walls = [];
    this.setWorkspace({
      xMin: -4.2,
      xMax: 4.2,
      zMin: -1.8,
      zMax: 1.5,
      top: 2.25,
    });
  }
  /** Conservative rectangular volume inside the normal interaction camera frustum.
   * Resize while holding is deferred, so a new wall never teleports a held vessel.
   */
  setWorkspace(limits) {
    if (
      this.limits &&
      Object.keys(limits).every(
        (k) => Math.abs(this.limits[k] - limits[k]) < 1e-6,
      )
    )
      return;
    if ([...this.entries.values()].some((e) => e.held)) {
      this.pendingWorkspace = limits;
      return;
    }
    this.pendingWorkspace = null;
    for (const body of this.walls) this.world.removeRigidBody(body);
    this.walls = [];
    this.limits = { ...limits };
    const t = this.table,
      l = this.limits;
    l.xMin = Math.max(l.xMin, t.position.x - t.size.x / 2 + 0.05);
    l.xMax = Math.min(l.xMax, t.position.x + t.size.x / 2 - 0.05);
    l.zMin = Math.max(l.zMin, t.position.z - t.size.z / 2 + 0.05);
    l.zMax = Math.min(l.zMax, t.position.z + t.size.z / 2 - 0.05);
    const thick = 0.25,
      height = l.top - t.top + thick;
    const wall = (x, y, z, w, h, d) => {
      const body = this.world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed().setTranslation(
          x * METRES_PER_UNIT,
          y * METRES_PER_UNIT,
          z * METRES_PER_UNIT,
        ),
      );
      this.world.createCollider(
        RAPIER.ColliderDesc.cuboid(
          (w * METRES_PER_UNIT) / 2,
          (h * METRES_PER_UNIT) / 2,
          (d * METRES_PER_UNIT) / 2,
        )
          .setFriction(0.45)
          .setRestitution(0),
        body,
      );
      this.walls.push(body);
    };
    const cx = (l.xMin + l.xMax) / 2,
      cz = (l.zMin + l.zMax) / 2;
    const cy = t.top + height / 2 - thick / 2;
    wall(
      l.xMin - thick / 2,
      cy,
      cz,
      thick,
      height,
      l.zMax - l.zMin + 2 * thick,
    );
    wall(
      l.xMax + thick / 2,
      cy,
      cz,
      thick,
      height,
      l.zMax - l.zMin + 2 * thick,
    );
    wall(cx, cy, l.zMin - thick / 2, l.xMax - l.xMin, height, thick);
    wall(cx, cy, l.zMax + thick / 2, l.xMax - l.xMin, height, thick);
    wall(cx, l.top + thick / 2, cz, l.xMax - l.xMin, thick, l.zMax - l.zMin);
    for (const e of this.entries.values()) this.recover(e, true);
  }
  /** Hulls use scaled local mesh vertices, including child pivots. Decorative rings/liquid are excluded. */
  geometry(item) {
    if (item.stock.openVessel && item.stock.kind === "beaker")
      return hollowBeakerHulls(item.group.scale, item.sealed);
    const root = item.group,
      hulls = [];
    root.updateWorldMatrix(true, true);
    const inverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const scale = new THREE.Matrix4().makeScale(
      root.scale.x,
      root.scale.y,
      root.scale.z,
    );
    root.traverse((node) => {
      if (node === item.cap && !item.sealed) return;
      if (
        !node.isMesh ||
        node.userData.noPhysics ||
        node === item.ring ||
        node === item.liquid
      )
        return;
      let parent = node.parent;
      while (parent && parent !== root) {
        if (parent.userData.noPhysics) return;
        parent = parent.parent;
      }
      const a = node.geometry?.attributes.position;
      if (!a) return;
      const transform = new THREE.Matrix4()
        .copy(scale)
        .multiply(inverse)
        .multiply(node.matrixWorld);
      const unique = new Map();
      for (let i = 0; i < a.count; i++) {
        const v = new THREE.Vector3()
          .fromBufferAttribute(a, i)
          .applyMatrix4(transform);
        unique.set(`${v.x.toFixed(6)},${v.y.toFixed(6)},${v.z.toFixed(6)}`, v);
      }
      const vertices = new Float32Array(
        [...unique.values()].flatMap((v) => [v.x, v.y, v.z]),
      );
      if (vertices.length >= 12) hulls.push(vertices);
    });
    if (!hulls.length) throw Error("No physical mesh for " + item.stock.kind);
    return hulls;
  }
  add(item) {
    const hulls = this.geometry(item);
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(
          item.target.x * METRES_PER_UNIT,
          item.target.y * METRES_PER_UNIT,
          item.target.z * METRES_PER_UNIT,
        )
        .setRotation(item.group.quaternion)
        .setCcdEnabled(true)
        .setSoftCcdPrediction(0.02)
        .setLinearDamping(PHYSICS_TUNING.linearDamping)
        .setAngularDamping(PHYSICS_TUNING.angularDamping)
        .setCanSleep(true),
    );
    const e = {
      item,
      body,
      hulls,
      colliders: [],
      held: false,
      paused: false,
      history: [],
      freeze: false,
      sealed: item.sealed,
      restTime: 0,
      velocity: new THREE.Vector3(),
      velocitySamples: 0,
      lastSafe: null,
    };
    this.entries.set(item.id, e);
    this.buildColliders(e);
    let at;
    try {
      at = this.initialPosition(e, item.target, item.group.quaternion);
    } catch (error) {
      this.world.removeRigidBody(body);
      this.entries.delete(item.id);
      throw error;
    }
    body.setTranslation(toMetres(at), true);
    // Queries made before the first step must see the relocated spawn pose.
    this.world.propagateModifiedBodyPositionsToColliders();
    this.sync(e, true);
    return e;
  }
  /** Place NEW bodies without overlap. Never moves an existing/held object.
   * Starting two dynamic hulls inside each other injects solver separation energy.
   * AABBs reject distant pairs; shape queries preserve the empty space inside
   * hollow vessels. Queries are synchronized before any candidate is tested.
   */
  initialPosition(e, requested, rotation) {
    const origin = this.constrain(e, requested, rotation);
    this.world.propagateModifiedBodyPositionsToColliders();
    const neighbours = [...this.entries.values()]
      .filter((o) => o !== e)
      .map((o) => ({
        entry: o,
        bounds: this.bounds(o, o.body.rotation(), this.position(o)),
      }));
    const free = (p) => {
      const b = this.bounds(e, rotation, p);
      return neighbours.every(({ entry, bounds: n }) => {
        if (
          ["x", "y", "z"].some(
            (a) => b.max[a] + 0.02 < n.min[a] || b.min[a] - 0.02 > n.max[a],
          )
        )
          return true;
        return e.colliders.every((c) =>
          entry.colliders.every((other) => {
            const contact = other.contactShape(
              c.shape,
              toMetres(p),
              rotation,
              0.002,
            );
            return !contact || contact.distance >= 0.002;
          }),
        );
      });
    };
    if (free(origin)) return origin;
    for (let ring = 1; ring <= 50; ring++) {
      for (let i = 0; i < 24; i++) {
        const angle = (i * Math.PI) / 12;
        const p = this.constrain(
          e,
          {
            x: origin.x + Math.cos(angle) * ring * 0.2,
            y: origin.y,
            z: origin.z + Math.sin(angle) * ring * 0.2,
          },
          rotation,
        );
        if (free(p)) return p;
      }
    }
    throw Error("Bàn đã kín ở độ cao này. Hãy cất bớt dụng cụ trước khi thêm.");
  }
  buildColliders(e) {
    e.boundsCache = null;
    for (const c of e.colliders) this.world.removeCollider(c, true);
    e.colliders = [];
    const mass = this.mass(e.item) / e.hulls.length;
    for (const points of e.hulls) {
      const desc = RAPIER.ColliderDesc.roundConvexHull(
        points.map((n) => n * METRES_PER_UNIT),
        0.0005,
      );
      if (!desc) throw Error("Invalid collider geometry");
      e.colliders.push(
        this.world.createCollider(
          desc
            .setContactSkin(0.0003)
            .setMass(mass)
            .setFriction(PHYSICS_TUNING.toolFriction)
            .setRestitution(PHYSICS_TUNING.restitution),
          e.body,
        ),
      );
    }
  }
  mass(item) {
    return (
      (item.stock.kind === "balance" ? 0.8 : 0.15) +
      Math.max(0, item.mixture?.volume_ml || 0) / 1000
    );
  }
  /** A newly added lid must not overlap a tool crossing the mouth, including
   * a strip that is above the liquid and therefore not chemically immersed.
   * Query only on a lid action; the normal physics/gesture loop is unchanged.
   */
  canSeal(item) {
    if (!item.stock.openVessel || item.sealed) return true;
    const e = this.entries.get(item.id);
    if (!e) return false;
    const points = hollowBeakerHulls(item.group.scale, true).at(-1);
    const desc = RAPIER.ColliderDesc.roundConvexHull(
      points.map((n) => n * METRES_PER_UNIT),
      0.0005,
    );
    if (!desc) return false;
    this.world.propagateModifiedBodyPositionsToColliders();
    return [...this.entries.values()].every(
      (other) =>
        other === e ||
        other.colliders.every((c) => {
          const contact = c.contactShape(
            desc.shape,
            e.body.translation(),
            e.body.rotation(),
            0.001,
          );
          return !contact || contact.distance >= 0.001;
        }),
    );
  }
  updateItem(item) {
    const e = this.entries.get(item.id);
    if (!e) return;
    if (e.sealed !== item.sealed) {
      e.hulls = this.geometry(item);
      this.buildColliders(e);
      e.sealed = item.sealed;
    }
    const mass = this.mass(item) / e.colliders.length;
    e.colliders.forEach((c) => c.setMass(mass));
    e.body.recomputeMassPropertiesFromColliders();
  }
  beginGrab(item) {
    this.rack?.unsnap(item);
    const e = this.entries.get(item.id);
    if (!e || e.held) return;
    this.sync(e, true); // Anchor against the actual body pose, not a stale target.
    e.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    e.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    e.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    e.held = true;
    e.freeze = false;
    e.history = [];
    e.velocity.set(0, 0, 0);
    e.velocitySamples = 0;
    e.velocityElapsed = 0;
    e.lastFloorGap = null;
    e.restTime = 0;
  }
  release(item, inherit = true) {
    const e = this.entries.get(item.id);
    if (!e || !e.held) return;
    const velocity = new THREE.Vector3();
    // Velocity is sampled once per rendered frame with REAL elapsed time, not
    // accelerated catch-up substeps. No impulse is applied on release.
    if (inherit && !e.freeze && e.velocitySamples >= 2)
      velocity
        .copy(e.velocity)
        .multiplyScalar(PHYSICS_TUNING.throwGain)
        .clampLength(0, PHYSICS_TUNING.throwSpeed);
    // Retain the actual current pose. No jump to an unconsumed hand target.
    e.held = false;
    e.freeze = false;
    e.history = [];
    e.restTime = 0;
    e.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    e.body.setLinvel(velocity, true);
    e.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.sync(e, true);
  }
  freezeHeld(item) {
    const e = this.entries.get(item.id);
    if (!e?.held || e.freeze) return;
    e.freeze = true;
    e.history = [];
    e.velocity.set(0, 0, 0);
    e.velocitySamples = 0;
    e.velocityElapsed = 0;
    this.sync(e, true);
    e.body.setNextKinematicTranslation(e.body.translation());
    e.body.setNextKinematicRotation(e.body.rotation());
    e.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    e.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
  }
  bounds(e, rotation, at = { x: 0, y: 0, z: 0 }) {
    const cache = e.boundsCache;
    if (
      cache &&
      cache.x === at.x &&
      cache.y === at.y &&
      cache.z === at.z &&
      cache.qx === rotation.x &&
      cache.qy === rotation.y &&
      cache.qz === rotation.z &&
      cache.qw === rotation.w
    )
      return cache.value;
    const min = { x: Infinity, y: Infinity, z: Infinity },
      max = { x: -Infinity, y: -Infinity, z: -Infinity };
    const q = this.quaternion.copy(rotation),
      v = this.vector;
    for (const hull of e.hulls)
      for (let i = 0; i < hull.length; i += 3) {
        v.set(hull[i], hull[i + 1], hull[i + 2]).applyQuaternion(q);
        for (const axis of ["x", "y", "z"]) {
          const n = v[axis] + at[axis];
          if (n < min[axis]) min[axis] = n;
          if (n > max[axis]) max[axis] = n;
        }
      }
    const border = 0.0005 / METRES_PER_UNIT;
    for (const axis of ["x", "y", "z"]) {
      min[axis] -= border;
      max[axis] += border;
    }
    const value = { min, max };
    e.boundsCache = {
      x: at.x,
      y: at.y,
      z: at.z,
      qx: rotation.x,
      qy: rotation.y,
      qz: rotation.z,
      qw: rotation.w,
      value,
    };
    return value;
  }
  constrain(e, position, rotation) {
    const p = { x: position.x, y: position.y, z: position.z },
      b = this.bounds(e, rotation, p),
      t = this.table;
    if (
      b.max.x >= t.position.x - t.size.x / 2 &&
      b.min.x <= t.position.x + t.size.x / 2 &&
      b.max.z >= t.position.z - t.size.z / 2 &&
      b.min.z <= t.position.z + t.size.z / 2
    ) {
      p.y += Math.max(0, t.top + SKIN - b.min.y);
    }
    const l = this.limits;
    if (l) {
      for (const [axis, low, high] of [
        ["x", l.xMin, l.xMax],
        ["z", l.zMin, l.zMax],
        ["y", t.top + SKIN, l.top],
      ]) {
        const minOffset = b.min[axis] - position[axis],
          maxOffset = b.max[axis] - position[axis];
        p[axis] = Math.max(
          low - minOffset + SKIN,
          Math.min(high - maxOffset - SKIN, p[axis]),
        );
      }
    }
    return p;
  }
  setTarget(
    item,
    position,
    roll = item.roll,
    yaw = item.yaw,
    pitch = item.pitch,
  ) {
    const e = this.entries.get(item.id);
    if (!e) return;
    if (
      ![
        position.x,
        position.y,
        position.z,
        roll || 0,
        yaw || 0,
        pitch || 0,
      ].every(Number.isFinite)
    )
      return;
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(pitch || 0, yaw || 0, roll || 0),
    );
    item.target = this.constrain(e, position, q);
    item.roll = roll || 0;
    item.yaw = yaw || 0;
    item.pitch = pitch || 0;
  }
  /** Single explicit keyboard/wheel edit, never a second per-frame dynamic pose writer. */
  editPose(item) {
    const e = this.entries.get(item.id);
    if (!e) return;
    this.setTarget(item, item.target);
    if (!e.held) {
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(item.pitch, item.yaw, item.roll),
      );
      e.body.setTranslation(toMetres(item.target), true);
      e.body.setRotation(q, true);
      e.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      e.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      this.sync(e, true);
    }
  }
  ownership(item, held, valid = true) {
    const e = this.entries.get(item.id);
    if (!e) return;
    if (held) {
      this.beginGrab(item);
      if (!valid) this.freezeHeld(item);
      else e.freeze = false;
    } else if (e.held) this.release(item, false);
  }
  position(e) {
    return toScene(e.body.translation());
  }
  sync(e, includeGoal = false) {
    const { item, body } = e,
      p = toScene(body.translation()),
      q = body.rotation();
    item.group.position.set(p.x, p.y, p.z);
    item.group.quaternion.set(q.x, q.y, q.z, q.w);
    if (!e.held || includeGoal) {
      item.target = { x: p.x, y: p.y, z: p.z };
      this.euler.setFromQuaternion(item.group.quaternion, "XYZ");
      item.pitch = this.euler.x;
      item.yaw = this.euler.y;
      item.roll = this.euler.z;
    }
  }
  /** Supplement Rapier CCD with a conservative tabletop velocity constraint.
   * Kinematic poses and dynamic meshes are never projected after release.
   * Sweep the full rotated collider support, then limit only the approaching
   * body velocity. Rapier still integrates gravity and solves contact/friction.
   */
  guardTable(e) {
    if (e.held || e.body.isSleeping()) return;
    const body = e.body,
      at = this.position(e),
      current = new THREE.Quaternion().copy(body.rotation());
    const v = toScene(body.linvel()),
      w = body.angvel(),
      speed = Math.hypot(w.x, w.y, w.z);
    const next = current.clone();
    if (speed > 1e-8)
      next.premultiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(w.x, w.y, w.z).divideScalar(speed),
          speed * FIXED_DT,
        ),
      );
    const b = this.bounds(e, next, at),
      t = this.table;
    if (
      b.max.x < t.position.x - t.size.x / 2 ||
      b.min.x > t.position.x + t.size.x / 2 ||
      b.max.z < t.position.z - t.size.z / 2 ||
      b.min.z > t.position.z + t.size.z / 2
    )
      return;
    const gap = b.min.y - t.top;
    const g = 9.81 / METRES_PER_UNIT;
    // Includes one full substep of gravity: conservative against solver integration order.
    const allowed = gap / FIXED_DT;
    if (v.y * FIXED_DT - g * FIXED_DT * FIXED_DT < -gap) {
      body.setLinvel(
        {
          x: body.linvel().x,
          y: Math.max(v.y, -allowed + g * FIXED_DT) * METRES_PER_UNIT,
          z: body.linvel().z,
        },
        true,
      );
    }
    const currentGap = this.bounds(e, current, at).min.y - t.top;
    const verticalDrift = Math.abs(currentGap - (e.lastFloorGap ?? currentGap));
    e.lastFloorGap = currentGap;
    if (
      Math.abs(currentGap) < 0.012 &&
      Math.hypot(v.x, v.z) < 0.12 &&
      verticalDrift < 0.0005 &&
      speed < 0.25
    ) {
      e.restTime += FIXED_DT;
      if (e.restTime > 0.65) {
        body.sleep();
        e.restTime = 0;
      }
    } else e.restTime = 0;
  }
  /** Slow an infinitely-massive kinematic hand close to another tool.
   * Rapier shape casts cap translation; contact tests also guard rotation.
   * Collisions remain enabled and a tiny contact allowance permits gentle pushes.
   */
  safeHeldMotion(e, p, q) {
    const at = this.position(e),
      current = e.body.rotation();
    let fraction = 1,
      near = false;
    const delta = new THREE.Vector3().copy(p).sub(at),
      distance = delta.length();
    const area = this.bounds(e, q, p);
    for (const other of this.entries.values()) {
      if (other === e) continue;
      const b = this.bounds(other, other.body.rotation(), this.position(other));
      if (
        ["x", "y", "z"].some(
          (a) => area.max[a] + 0.35 < b.min[a] || area.min[a] - 0.35 > b.max[a],
        )
      )
        continue;
      for (const c of e.colliders)
        for (const oc of other.colliders) {
          const now = oc.contactShape(c.shape, toMetres(at), current, 0.035);
          if (!now) continue;
          near = true;
          const proposed = oc.contactShape(c.shape, toMetres(p), q, 0);
          if (
            proposed &&
            proposed.distance < Math.min(-0.00015, now.distance - 0.0001)
          )
            q.copy(current); // Never rotate deeper into a neighbour.
          if (distance > 1e-8) {
            const hit = oc.castShape(
              { x: 0, y: 0, z: 0 },
              c.shape,
              toMetres(at),
              q,
              toMetres(delta),
              0,
              1,
              false,
            );
            if (hit)
              fraction = Math.min(
                fraction,
                Math.min(
                  1,
                  hit.time_of_impact + 0.00008 / (distance * METRES_PER_UNIT),
                ),
              );
          }
        }
    }
    if (near && distance > 0)
      fraction = Math.min(
        fraction,
        (PHYSICS_TUNING.contactSpeed * FIXED_DT) / (distance * METRES_PER_UNIT),
      );
    p.copy(at).addScaledVector(delta, fraction);
    return this.constrain(e, p, q);
  }
  guardWorkspace(e) {
    if (e.held || e.body.isSleeping()) return;
    const body = e.body,
      velocity = body.linvel(),
      angular = body.angvel();
    const horizontal = Math.hypot(velocity.x, velocity.z);
    if (horizontal > PHYSICS_TUNING.horizontalSpeed) {
      const factor = PHYSICS_TUNING.horizontalSpeed / horizontal;
      velocity.x *= factor;
      velocity.z *= factor;
    }
    const spin = Math.hypot(angular.x, angular.y, angular.z);
    if (spin > PHYSICS_TUNING.angularSpeed) {
      const f = PHYSICS_TUNING.angularSpeed / spin;
      body.setAngvel(
        { x: angular.x * f, y: angular.y * f, z: angular.z * f },
        true,
      );
    }
    const at = this.position(e),
      q = new THREE.Quaternion().copy(body.rotation());
    const speed = Math.hypot(angular.x, angular.y, angular.z);
    if (speed > 1e-8)
      q.premultiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(angular.x, angular.y, angular.z).divideScalar(
            speed,
          ),
          Math.min(speed, PHYSICS_TUNING.angularSpeed) * FIXED_DT,
        ),
      );
    const b = this.bounds(e, q, at),
      l = this.limits;
    for (const [axis, low, high] of [
      ["x", l.xMin, l.xMax],
      ["z", l.zMin, l.zMax],
      ["y", -Infinity, l.top],
    ]) {
      const lower = ((low + SKIN - b.min[axis]) * METRES_PER_UNIT) / FIXED_DT;
      const upper = ((high - SKIN - b.max[axis]) * METRES_PER_UNIT) / FIXED_DT;
      velocity[axis] = Math.max(lower, Math.min(upper, velocity[axis]));
    }
    body.setLinvel(velocity, false);
  }
  /** Fault recovery only. Ordinary motion uses Rapier contacts/sweeps, not pose clamps. */
  recover(e, resized = false) {
    if (e.body.isSleeping() && !resized) return false;
    const pos = this.position(e),
      q = e.body.rotation();
    const finite = [pos.x, pos.y, pos.z, q.x, q.y, q.z, q.w].every(
      Number.isFinite,
    );
    const b = finite ? this.bounds(e, q, pos) : null,
      l = this.limits;
    const outside =
      !finite ||
      b.min.y < this.table.top - 0.04 ||
      b.min.x < l.xMin - 0.04 ||
      b.max.x > l.xMax + 0.04 ||
      b.min.z < l.zMin - 0.04 ||
      b.max.z > l.zMax + 0.04 ||
      b.max.y > l.top + 0.04;
    if (!outside) {
      e.lastSafe = { position: { ...pos }, rotation: { ...q } };
      return false;
    }
    // Never recenter a held tool. Hold its own last valid pose on numerical failure.
    const safe = e.lastSafe || {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    };
    if (!e.held) {
      const rotation = finite ? q : safe.rotation;
      e.body.setTranslation(
        toMetres(this.constrain(e, finite ? pos : safe.position, rotation)),
        true,
      );
      e.body.setRotation(rotation, true);
    } else {
      e.body.setTranslation(toMetres(safe.position), true);
      e.body.setRotation(safe.rotation, true);
      this.freezeHeld(e.item);
    }
    e.body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    e.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    if (!resized) this.recoveryCount++;
    this.sync(e, true);
    return true;
  }
  step(dt, paused = false) {
    const start = performance.now();
    if (paused || !Number.isFinite(dt) || dt <= 0) {
      this.accumulator = 0;
      this.lastStepCost = 0;
      for (const e of this.entries.values()) {
        e.velocity.set(0, 0, 0);
        e.velocitySamples = 0;
      }
      return;
    }
    if (
      this.pendingWorkspace &&
      ![...this.entries.values()].some((e) => e.held)
    )
      this.setWorkspace(this.pendingWorkspace);
    const previous = new Map();
    for (const e of this.entries.values())
      if (e.held) previous.set(e, this.position(e));
    this.accumulator += Math.min(0.1, dt);
    let count = 0;
    while (this.accumulator + 1e-9 >= FIXED_DT && count < 12) {
      for (const e of this.entries.values())
        if (e.held) {
          const { item, body } = e;
          const q = new THREE.Quaternion().copy(body.rotation());
          const desired = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(item.pitch, item.yaw, item.roll),
          );
          const alpha = 1 - Math.exp(-FIXED_DT / 0.025),
            angle = q.angleTo(desired);
          q.slerp(
            desired,
            Math.min(
              alpha,
              (PHYSICS_TUNING.heldAngularSpeed * FIXED_DT) /
                Math.max(angle, 1e-8),
            ),
          );
          const at = this.position(e),
            delta = new THREE.Vector3()
              .copy(item.target)
              .sub(at)
              .multiplyScalar(alpha);
          delta.clampLength(
            0,
            (PHYSICS_TUNING.heldSpeed * FIXED_DT) / METRES_PER_UNIT,
          );
          const p = new THREE.Vector3().copy(at).add(delta);
          const safe = this.safeHeldMotion(e, p, q);
          body.setNextKinematicTranslation(toMetres(safe));
          body.setNextKinematicRotation(q);
        }
      for (const e of this.entries.values()) {
        this.recover(e);
        this.guardWorkspace(e);
        this.guardTable(e);
      }
      this.world.step();
      this.time += FIXED_DT;
      this.totalSteps++;
      for (const e of this.entries.values()) {
        this.recover(e);
        this.sync(e);
      }
      this.accumulator -= FIXED_DT;
      count++;
    }
    for (const [e, before] of previous) {
      e.velocityElapsed = (e.velocityElapsed || 0) + dt;
      if (e.freeze || dt > 0.15) {
        e.velocity.set(0, 0, 0);
        e.velocitySamples = 0;
        e.velocityElapsed = 0;
      } else if (count) {
        const elapsed = e.velocityElapsed;
        const raw = new THREE.Vector3()
          .copy(this.position(e))
          .sub(before)
          .multiplyScalar(METRES_PER_UNIT / elapsed);
        if (raw.length() <= PHYSICS_TUNING.heldSpeed * 1.15) {
          e.velocity.lerp(raw, 1 - Math.exp(-elapsed / 0.04));
          e.velocitySamples++;
        } else {
          e.velocity.set(0, 0, 0);
          e.velocitySamples = 0;
        }
        e.velocityElapsed = 0;
      }
    }
    for (const e of this.entries.values()) this.sync(e);
    this.lastStepCost = performance.now() - start;
  }
  remove(item) {
    this.rack?.unsnap(item);
    const e = this.entries.get(item.id);
    if (e) {
      this.world.removeRigidBody(e.body);
      this.entries.delete(item.id);
    }
  }
  dispose() {
    this.world.free();
    this.entries.clear();
  }
}
