import { TubeRack } from "./tube-rack.js";
import { updatePrecipitate } from "./reaction-visuals.js";
import { PourableContainer } from "./pourable.js";
import { attachLiquid, updateLiquid } from "./liquid-visual.js";
import * as THREE from "three";
import { createCombustion, updateCombustion, disposeCombustion } from "./combustion-visual.js";
import { OrbitControls } from "../vendor/controls/OrbitControls.js";
import { buildEnvironment } from "./environment.js";
import { LabPhysics, initPhysics } from "./physics.js";
import { addVesselDetails, makeContactShadow } from "./vessel-details.js";
import { buildLessonTool } from "./lesson-visuals.js";
import { clamp } from "./filters.js";

/** Meshes use v2's vessel profiles; no GL readback or bitmap compositing per frame. */
export class LabRenderer {
  constructor(element, profiles) {
    this.element = element;
    this.profiles = profiles;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 60);
    this.camera.position.set(0, 0, 7);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.localClippingEnabled = true;
    this.spills = [];
    this.liquidElapsed = 0;
    this.renderer.setClearColor(0x08131d, 0);
    this.renderer.setPixelRatio(1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;
    this.controls.enableDamping = false;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 10;
    this.scene.add(new THREE.HemisphereLight(0xe8f8ff, 0x37616b, 2.3));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 5, 6);
    this.scene.add(light);
    this.meshes = new Map();
    this.objects = [];
    this.effects = [];
    this.streams = [];
    this.ray = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.temp = new THREE.Vector3();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    this.pixelRatio = 1;
    this.resize();
    this.glass = new THREE.MeshPhysicalMaterial({
      color: 0xd7edf0,
      metalness: 0,
      roughness: 0.14,
      transparent: true,
      opacity: 0.27,
      ior: 1.47,
      clearcoat: 0,
      clearcoatRoughness: 0.12,
      side: THREE.FrontSide,
      depthWrite: false,
      forceSinglePass: true,
      // No transmission render target: retains low-end GPU compatibility.
    });
    this.ringGeometry = new THREE.TorusGeometry(0.77, 0.012, 6, 32);
    this.dropGeometry = new THREE.SphereGeometry(0.032, 6, 4);
    this.geometryCache = new Map();
    this.effectDummy = new THREE.Object3D();
    this.up = new THREE.Vector3(0, 1, 0);
    this.environment = buildEnvironment(this);
  }
  async initPhysics() {
    await initPhysics();
    this.physics = new LabPhysics(this.environment.userData.table);
    this.updateWorkspace();
    this.rack = new TubeRack(this);
    this.physics.rack = this.rack;
  }
  resize() {
    const r = this.element.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return; // Hidden panels must never inject Infinity into physics.
    this.rect = r;
    this.camera.aspect = r.width / Math.max(1, r.height);
    this.homeCameraZ = 1.5 + Math.max(2.45, 6.4 / this.camera.aspect) / Math.tan(24 * Math.PI / 180);
    if (!this.controls?.enabled) this.camera.position.set(0, 0, this.homeCameraZ);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(r.width, r.height, false);
    this.camera.updateMatrixWorld();
    this.updateWorkspace();
  }
  updateWorkspace() {
    if (!this.physics) return;
    // Fixed interaction camera: conservative volume entirely inside its frustum.
    const front = 1.5,
      halfHeight = (this.homeCameraZ - front) * Math.tan((24 * Math.PI) / 180);
    const x = Math.max(
      1.0,
      Math.min(8.5, halfHeight * this.camera.aspect * 0.93),
    );
    this.physics.setWorkspace({
      xMin: -x,
      xMax: x,
      zMin: -1.8,
      zMax: front,
      top: halfHeight * 0.92,
    });
  }
  quality(ratio) {
    if (this.pixelRatio !== ratio) {
      this.pixelRatio = ratio;
      this.renderer.setPixelRatio(ratio);
      this.resize();
    }
  }
  toWorld(point, z = 0) {
    this.ndc.set(
      ((point.x - this.rect.left) / this.rect.width) * 2 - 1,
      1 - ((point.y - this.rect.top) / this.rect.height) * 2,
    );
    this.ray.setFromCamera(this.ndc, this.camera);
    this.plane.constant = -z;
    this.ray.ray.intersectPlane(this.plane, this.temp);
    return { x: this.temp.x, y: this.temp.y, z };
  }
  toScreen(position) {
    this.temp.set(position.x, position.y, position.z).project(this.camera);
    return {
      x: (this.temp.x * 0.5 + 0.5) * this.rect.width + this.rect.left,
      y: (0.5 - this.temp.y * 0.5) * this.rect.height + this.rect.top,
    };
  }
  clampPosition(pos) {
    const screen = this.toScreen(pos);
    const r = this.rect;
    const p = {
      x: clamp(screen.x, r.left + 60, r.right - 60),
      y: clamp(screen.y, r.top + 80, r.bottom - 95),
    };
    return this.toWorld(p, clamp(pos.z, -1.8, 1.5));
  }
  lathe(kind) {
    if (!this.geometryCache.has(kind)) {
      const points = this.profiles.profiles[kind].map(
        ([y, r]) => new THREE.Vector2(r, y),
      );
      const geometry = new THREE.LatheGeometry(points, 40);
      if (kind === "beaker") {
        const a = geometry.attributes.position;
        for (let i = 0; i < a.count; i++) {
          const x = a.getX(i),
            y = a.getY(i),
            z = a.getZ(i);
          // Integral pouring spout, tapered smoothly into the lip. Same base/pivot.
          if (y > 0.62 && z > 0) {
            const angle = Math.atan2(x, z),
              amount = Math.max(0, 1 - Math.abs(angle) / 0.4);
            a.setZ(i, z + 0.13 * amount * Math.min(1, (y - 0.62) / 0.18));
            a.setY(i, y + 0.035 * amount * Math.min(1, (y - 0.62) / 0.18));
          }
        }
        a.needsUpdate = true;
        geometry.computeVertexNormals();
      }
      this.geometryCache.set(kind, geometry);
    }
    return this.geometryCache.get(kind);
  }
  box(w, h, d, color, x = 0, y = 0, z = 0) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.42,
        metalness: 0.08,
      }),
    );
    mesh.position.set(x, y, z);
    return mesh;
  }
  add(item) {
    const group = new THREE.Group();
    group.scale.setScalar(0.67);
    group.position.copy(item.target);
    group.rotation.set(item.pitch || 0, item.yaw || 0, item.roll || 0);
    item.group = group;
    const kind = item.stock.kind;
    if (buildLessonTool(this, item)) {
      // Lesson-specific tools keep the same item/body/grab ownership path.
    } else if (this.profiles.profiles[kind]) {
      group.add(new THREE.Mesh(this.lathe(kind), this.glass));
      item.liquid = new THREE.Mesh(
        new THREE.BufferGeometry(),
        new THREE.MeshStandardMaterial({
          roughness: 0.22,
          color: 0x9dd5e8,
          transparent: true,
          opacity: 0.65,
          side: THREE.FrontSide,
          depthWrite: false,
        }),
      );
      item.liquid.renderOrder = 1;
      item.liquid.userData.noPhysics = true;
      group.add(item.liquid);
      const top = Math.max(...this.profiles.profiles[kind].map((p) => p[0]));
      item.mouthY = top;
      item.pourable = new PourableContainer(item, this.profiles.interiors[kind]);
      attachLiquid(item);
      item.cap = new THREE.Mesh(
        new THREE.CylinderGeometry(
          kind === "beaker" ? 0.76 : kind === "tube" ? 0.34 : 0.3,
          kind === "beaker" ? 0.76 : kind === "tube" ? 0.34 : 0.3,
          0.14,
          24,
        ),
        new THREE.MeshPhongMaterial({ color: 0x28414c }),
      );
      item.cap.position.y = top + 0.07;
      item.cap.visible = !!item.sealed;
      group.add(item.cap);
      if (kind === "dropper") {
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 12, 8),
          new THREE.MeshPhongMaterial({ color: 0x182833 }),
        );
        bulb.scale.y = 1.5;
        bulb.position.y = 0.88;
        group.add(bulb);
      }
    } else if (kind === "lamp") {
      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 16, 12),
        this.glass,
      );
      body.scale.y = 0.7;
      group.add(body);
      group.add(this.box(0.5, 0.14, 0.5, 0x506b76, 0, 0.43));
      group.add(this.box(0.06, 0.25, 0.06, 0xd5c79b, 0, 0.6));
    } else if (kind === "balance") {
      group.add(this.box(1.8, 0.35, 1.1, 0x29434f));
      group.add(this.box(1.4, 0.07, 0.8, 0xc0d1d8, 0, 0.25));
      group.add(this.box(0.6, 0.17, 0.02, 0x3ee9b9, 0, 0, 0.56));
    } else {
      group.add(this.box(1.1, 0.3, 0.65, 0xba693b));
    }
    addVesselDetails(this, item);
    const ring = new THREE.Mesh(
      this.ringGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x56e5c3,
        transparent: true,
        opacity: 0.8,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.02;
    ring.userData.noPhysics = true;
    group.add(ring);
    item.ring = ring;
    ring.visible = false;
    item.sediment = new THREE.Group();
    item.sediment.userData.noPhysics = true;
    group.add(item.sediment);
    this.scene.add(group);
    this.objects.push(item);
    this.updateMixture(item);
    try {
      this.physics.add(item);
    } catch (error) {
      this.remove(item);
      throw error;
    }
    makeContactShadow(this, item);
  }
  liquidGeometry(kind, ratio) {
    // Integrate volume against the original interior profile, matching the v2 model.
    const profile = this.profiles.interiors[kind];
    if (!profile) return null;
    const [bottom] = profile[0],
      top = profile.at(-1)[0],
      steps = 80,
      dy = (top - bottom) / steps;
    const radius = (y) => {
      for (let i = 1; i < profile.length; i++)
        if (y <= profile[i][0]) {
          const [y0, r0] = profile[i - 1],
            [y1, r1] = profile[i];
          return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
        }
      return profile.at(-1)[1];
    };
    let total = 0;
    const cumulative = [];
    for (let i = 0; i < steps; i++) {
      total += radius(bottom + (i + 0.5) * dy) ** 2 * dy;
      cumulative.push(total);
    }
    let index = cumulative.findIndex((v) => v >= total * ratio);
    if (index < 0) index = steps - 1;
    const level = bottom + (index + 1) * dy;
    const points = [
      new THREE.Vector2(0, bottom),
      new THREE.Vector2(radius(bottom), bottom),
    ];
    for (const [y, r] of profile)
      if (y > bottom && y < level) points.push(new THREE.Vector2(r, y));
    points.push(
      new THREE.Vector2(radius(level), level),
      new THREE.Vector2(0, level),
    );
    return new THREE.LatheGeometry(points, 24);
  }
  updateMixture(item) {
    const mix = item.mixture;
    if (item.liquid) {
      item.liquid.visible = mix.volume_ml > 0.001;
      item.liquid.material.color.fromArray(mix.color || [0.6, 0.8, 0.9]);
    }

    if (item.cap) item.cap.visible = !!item.sealed;
    for (const child of [...item.sediment.children]) {
      item.sediment.remove(child);
      child.geometry.dispose();
      child.material.dispose();
    }
    if (mix.solid_copper_g > 1e-9 && item.stock.kind !== "solid")
      item.sediment.add(this.box(0.35, 0.16, 0.25, 0xba693b, 0, -0.62));
    if (item.stock.kind === "solid")
      item.group.children[0].visible = mix.solid_copper_g > 1e-9;
    this.physics?.updateItem(item);
  }
  pick(point) {
    const r = this.rect;
    if (
      point.x < r.left ||
      point.x > r.right ||
      point.y < r.top ||
      point.y > r.bottom
    )
      return null;
    this.ndc.set(
      ((point.x - r.left) / r.width) * 2 - 1,
      1 - ((point.y - r.top) / r.height) * 2,
    );
    this.ray.setFromCamera(this.ndc, this.camera);
    let best = null,
      distance = Infinity;
    for (const item of this.objects) {
      const hit = this.ray
        .intersectObject(item.group, true)
        .find((h) => h.object.visible);
      if (hit && hit.distance < distance) {
        best = item;
        distance = hit.distance;
      }
    }
    if (best) return best;
    // Modest screen-space tolerance for narrow tubes, not global nearest selection.
    let radius = 48;
    for (const item of [...this.objects].reverse()) {
      const p = this.toScreen(item.group.position),
        d = Math.hypot(point.x - p.x, point.y - p.y);
      if (d < radius) {
        best = item;
        radius = d;
      }
    }
    return best;
  }
  mouth(item) {
    return new THREE.Vector3(0, item.mouthY || 0.85, 0).applyMatrix4(item.group.matrixWorld);
  }
  pourTarget(source) {
    if (!source.pourable && source.stock.kind !== "solid") return null;
    source.pourable?.updatePose();
    // A solid sample is added as a discrete specimen, never as a liquid stream.
    const from = source.pourable?.mouth || source.group.getWorldPosition(new THREE.Vector3());
    let best = null, distance = Infinity;
    for (const target of this.objects) {
      if (target === source || !target.pourable) continue;
      target.pourable.updatePose();
      const hit = target.pourable.receivePoint(from);
      const d = hit ? from.y - hit.y : Infinity;
      if (d < distance) { best = target; distance = d; }
    }
    return best;
  }
  stopStream(item) {
    for (const s of this.streams) if (s.source === item) s.until = 0;
  }
  puddle(position, amount, color) {
    let p = this.spills.find(p => p.mesh.position.distanceToSquared(position) < 0.5);
    if (!p) {
      if (this.spills.length >= 24) {
        p = this.spills.shift();
        p.amount = 0;
      } else {
        const mesh = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshBasicMaterial({color: 0x83bdcd, transparent: true, opacity: 0.65, depthWrite: false}));
        mesh.rotation.x = -Math.PI / 2;
        this.scene.add(mesh);
        p = {mesh, amount: 0};
      }
      p.mesh.position.copy(position);
      this.spills.push(p);
    }
    p.amount += amount;
    p.mesh.material.color.fromArray(color || [0.6, 0.8, 0.9]);
    p.mesh.scale.setScalar(Math.min(1.3, 0.12 + Math.sqrt(p.amount) * 0.09));
  }
  clearSpills() {
    for (const {mesh} of this.spills) { this.scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
    this.spills.length = 0;
  }
  stream(source, target, until) {
    if (!source.pourable) return;
    let s = this.streams.find((s) => s.source === source);
    if (!s) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.018, 1, 8),
        new THREE.MeshBasicMaterial({
          color: 0x9ae1f3,
          transparent: true,
          opacity: 0.8,
        }),
      );
      this.scene.add(mesh);
      s = { source, target, mesh, until };
      this.streams.push(s);
    }
    s.target = target;
    s.until = until;
  }
  effect(item, kind, now, intensity = 1) {
    const previous = this.effects.find(
      (e) => e.item === item && e.kind === kind,
    );
    if (previous) {
      previous.until = now + 2800;
      previous.intensity = intensity;
      return;
    }
    const color =
      {
        fire: 0xffa74b,
        splash: 0xc4e8fa,
        heat: 0xffc986,
        fumes: 0xc4d4da,
        bubbles: 0xb8ebf5,
        pressure: 0xf6b681,
      }[kind] || 0x85d7eb;
    const mesh = new THREE.InstancedMesh(
      this.dropGeometry,
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72 }),
      24,
    );
    mesh.frustumCulled = false;
    this.scene.add(mesh);
    this.effects.push({ item, kind, start: now, until: now + 2800, mesh, intensity,
      combustion: kind === "fire" ? createCombustion(this.scene,this.dropGeometry) : null });
  }
  remove(item) {
    this.physics.remove(item);
    if (item.contactShadow) {
      this.scene.remove(item.contactShadow);
      item.contactShadow.geometry.dispose();
      item.contactShadow.material.dispose();
    }
    this.scene.remove(item.group);
    this.objects = this.objects.filter((o) => o !== item);
    item.group.traverse((n) => {
      if ((n.isMesh || n.isLine) && n.material !== this.glass) {
        if (n.isInstancedMesh) n.dispose();
        if (n.geometry !== this.ringGeometry) n.geometry?.dispose();
        if (n.material?.map && n.material.map !== this.contactTexture)
          n.material.map.dispose();
        n.material?.dispose();
      }
    });
    for (const e of this.effects) if (e.item === item) {
      this.scene.remove(e.mesh);
      disposeCombustion(this.scene,e.combustion);
      e.mesh.dispose();
      e.mesh.material.dispose();
    }
    this.effects = this.effects.filter(e => e.item !== item);
    for (const s of this.streams)
      if (s.source === item || s.target === item) {
        this.scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        s.mesh.material.dispose();
      }
    this.streams = this.streams.filter(
      (s) => s.source !== item && s.target !== item,
    );
    // Profile geometries and glass are shared and live for the scene lifetime.
  }
  render(dt, now) {
    // Mesh transforms were synchronized from Rapier in the physics step.
    this.scene.updateMatrixWorld();
    this.liquidElapsed += dt;
    if (this.liquidElapsed >= 0.08) {
      for (const item of this.objects) {
        updateLiquid(item);
        if (item.liquid) {
          item.liquid.material.color.fromArray(item.mixture.color || [0.79, 0.91, 0.96]);
          item.liquid.material.opacity = 0.25;
          item.pourable.cap.material.opacity = 0.35;
          updatePrecipitate(item, this.liquidElapsed);
          item.pourable.cap.material.color.copy(item.liquid.material.color);
        }
      }
      this.liquidElapsed = 0;
    }
    for (const item of this.objects) {
      const e = this.physics.entries.get(item.id),
        shadow = item.contactShadow;
      if (!e || !shadow) continue;
      const at = this.physics.position(e),
        bottom = this.physics.bounds(e, e.body.rotation(), at).min.y;
      const gap = Math.max(0, bottom - this.physics.table.top);
      shadow.visible = item.group.visible && gap < 3;
      shadow.position.set(at.x, this.physics.table.top + 0.012, at.z);
      shadow.material.opacity = 0.32 * Math.exp(-gap * 1.8);
    }
    for (const s of this.streams) {
      s.mesh.visible =
        now < s.until &&
        this.objects.includes(s.source) &&
        (!s.target || this.objects.includes(s.target));
      if (s.mesh.visible) {
        const a = s.source.pourable.mouth,
          b = new THREE.Vector3(a.x, s.target ? this.mouth(s.target).y : this.physics.table.top + 0.01, a.z),
          direction = b.clone().sub(a);
        s.mesh.position.copy(a).add(b).multiplyScalar(0.5);
        s.mesh.scale.y = direction.length();
        s.mesh.quaternion.setFromUnitVectors(this.up, direction.normalize());
      }
    }
    const dummy = this.effectDummy;
    for (const e of this.effects) {
      if (now > e.until || !this.objects.includes(e.item)) {
        this.scene.remove(e.mesh);
        disposeCombustion(this.scene,e.combustion);
        e.mesh.dispose();
        e.mesh.material.dispose();
        continue;
      }
      const center = e.item.group.position;
      if (e.combustion) updateCombustion(e.combustion,center,now-e.start);
      const count = e.kind === "bubbles" ? Math.max(1, Math.ceil(24 * clamp(e.intensity, 0, 1))) : 24;
      e.mesh.count = count;
      for (let i = 0; i < count; i++) {
        const phase = ((now - e.start) / 1200 + i * 0.073) % 1,
          angle = i * 2.4;
        let x = Math.sin(angle) * 0.24,
          y = 0.2 + phase,
          z = Math.cos(angle) * 0.2,
          scale = 1;
        if (e.kind === "fire") {
          x *= 1 - phase;
          y = 0.4 + phase * 1.2;
          scale = 2.5 * (1 - phase) + 0.5;
        }
        if (e.kind === "splash") {
          x = Math.sin(angle) * phase * 1.3;
          y = 0.5 + 1.3 * phase - 1.6 * phase * phase;
          z = Math.cos(angle) * phase * 0.7;
        }
        if (e.kind === "pressure") {
          x = Math.sin(angle) * phase * 1.4;
          y = Math.cos(angle) * phase;
          z = phase * 0.2;
          scale = 1.5;
        }
        if (e.kind === "fumes") {
          scale = 2 + phase * 3;
          x += Math.sin(phase * 6) * 0.2;
        }
        if (e.kind === "heat") {
          scale = 0.7;
          y = 0.5 + phase * 1.1;
        }
        if (e.kind === "bubbles" && e.item.pourable) {
          const c = e.item.pourable, bottom = c.profile[0][0],
            level = c.normal.y > 0.8 ? c.level : bottom + 0.2;
          dummy.position.set(Math.sin(angle) * c.radius(bottom + 0.15) * 0.6,
            bottom + 0.04 + phase * Math.max(0.01, level-bottom-0.08),
            Math.cos(angle) * c.radius(bottom + 0.15) * 0.6).applyMatrix4(e.item.group.matrixWorld);
          scale = 0.6;
        } else dummy.position.set(center.x + x, center.y + y, center.z + z);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        e.mesh.setMatrixAt(i, dummy.matrix);
      }
      e.mesh.instanceMatrix.needsUpdate = true;
    }
    this.effects = this.effects.filter(
      (e) => now <= e.until && this.objects.includes(e.item),
    );
    this.renderer.render(this.scene, this.camera);
  }
}
