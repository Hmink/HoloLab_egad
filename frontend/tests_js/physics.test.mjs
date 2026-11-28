import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import * as THREE from "../web/vendor/three/three.module.js";
import { LabPhysics, initPhysics, FIXED_DT } from "../web/src/physics.js";
await initPhysics();
const profiles = JSON.parse(
  fs.readFileSync(new URL("../web/profiles.json", import.meta.url)),
);
function fixture(kind = "beaker", scale = 0.67) {
  const table = new THREE.Mesh(new THREE.BoxGeometry(30, 0.14, 9));
  table.position.set(0, -1.7, -1.5);
  table.updateMatrixWorld(true);
  const physics = new LabPhysics(table);
  const group = new THREE.Group();
  group.scale.setScalar(scale);
  group.add(
    new THREE.Mesh(
      new THREE.LatheGeometry(
        profiles.profiles[kind].map(([y, r]) => new THREE.Vector2(r, y)),
        32,
      ),
    ),
  );
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.77, 0.012));
  ring.position.y = -1.02;
  ring.userData.noPhysics = true;
  group.add(ring);
  const item = {
    id: 1,
    stock: { kind },
    mixture: { volume_ml: 50 },
    target: { x: 0, y: 1, z: 0 },
    pitch: 0,
    yaw: 0,
    roll: 0,
    group,
    ring,
    sealed: false,
  };
  group.position.copy(item.target);
  const e = physics.add(item);
  return {
    physics,
    item,
    e,
    step: (n = 1) => {
      for (let i = 0; i < n; i++) physics.step(FIXED_DT);
    },
    min: () => physics.bounds(e, e.body.rotation(), physics.position(e)).min.y,
  };
}
test("Table static body exactly matches visible mesh world coordinates and thickness", () => {
  const f = fixture();
  try {
    assert.equal(f.physics.table.top, -1.63);
    assert.equal(f.physics.table.size.y, 0.14);
    assert.equal(f.physics.tableBody.isFixed(), true);
    assert.ok(f.e.body.isDynamic());
    assert.ok(f.e.body.isCcdEnabled());
  } finally {
    f.physics.dispose();
  }
});
test("Release from height falls, contacts the table, and settles rather than hovering", () => {
  const f = fixture();
  try {
    f.physics.beginGrab(f.item);
    f.step(10);
    const y = f.physics.position(f.e).y;
    f.physics.release(f.item, false);
    assert.ok(f.e.body.isDynamic());
    f.step(12);
    assert.ok(f.physics.position(f.e).y < y - 0.1);
    f.step(500);
    assert.ok(f.min() > f.physics.table.top - 0.003);
    assert.ok(f.min() < f.physics.table.top + 0.04);
    assert.ok(f.e.body.isSleeping() || Math.abs(f.e.body.linvel().y) < 0.02);
  } finally {
    f.physics.dispose();
  }
});
test("Kinematic floor uses scaled, rotated lowest collider points, not the pivot or selection ring", () => {
  const f = fixture("flask", 0.9);
  try {
    f.physics.beginGrab(f.item);
    f.physics.setTarget(f.item, { x: 0, y: -20, z: 0 }, 1.3, 0.4, 0.7);
    f.step(120);
    assert.ok(f.min() >= f.physics.table.top - 0.0001);
    assert.ok(f.physics.position(f.e).y > f.physics.table.top + 0.4);
  } finally {
    f.physics.dispose();
  }
});
test("Release near table remains stable and can be picked up again without a pose jump", () => {
  const f = fixture();
  try {
    f.physics.beginGrab(f.item);
    f.physics.setTarget(f.item, { x: 0, y: -10, z: 0 });
    f.step(160);
    f.physics.release(f.item, false);
    f.step(200);
    const before = f.e.body.translation();
    f.physics.beginGrab(f.item);
    const after = f.e.body.translation();
    assert.ok(
      Math.hypot(before.x - after.x, before.y - after.y, before.z - after.z) <
        1e-6,
    );
    f.physics.setTarget(f.item, { x: 1, y: 1, z: 0 });
    f.step(60);
    assert.ok(f.physics.position(f.e).y > 0.9);
  } finally {
    f.physics.dispose();
  }
});
test("Moving hand release inherits recent bounded velocity; tracking freeze suppresses throw", () => {
  const f = fixture();
  try {
    f.physics.beginGrab(f.item);
    for (let i = 0; i < 30; i++) {
      f.physics.setTarget(f.item, { x: i * 0.02, y: 1, z: 0 });
      f.step();
    }
    f.physics.release(f.item, true);
    assert.ok(f.e.body.linvel().x > 0.1);
    assert.ok(f.e.body.linvel().x <= 12);
    f.physics.beginGrab(f.item);
    f.physics.freezeHeld(f.item);
    f.physics.release(f.item, true);
    assert.equal(f.e.body.linvel().x, 0);
  } finally {
    f.physics.dispose();
  }
});
test("20 consecutive grab/drop cycles, multiple vessel shapes and rotations: no table tunneling", () => {
  let maximumPenetration = 0;
  for (const kind of ["beaker", "flask", "tube"]) {
    const f = fixture(kind);
    try {
      for (let n = 0; n < 20; n++) {
        f.physics.beginGrab(f.item);
        f.physics.setTarget(
          f.item,
          { x: 0, y: 1 + (n % 4) * 0.2, z: 0 },
          ((n % 3) - 1) * 0.8,
          0.2,
          0,
        );
        f.step(90);
        f.physics.release(f.item, false);
        for (let k = 0; k < 360; k++) {
          f.step();
          maximumPenetration = Math.max(
            maximumPenetration,
            f.physics.table.top - f.min(),
          );
          assert.ok(
            f.min() > f.physics.table.top - 0.004,
            kind +
              " cycle " +
              n +
              " penetrated: " +
              (f.physics.table.top - f.min()),
          );
        }
      }
    } finally {
      f.physics.dispose();
    }
  }
  console.log("60 drops maximum penetration (scene units)", maximumPenetration);
});
test("High downward velocity CCD does not tunnel through 0.14-unit tabletop", () => {
  const f = fixture();
  try {
    f.e.body.setLinvel({ x: 0, y: -15, z: 0 }, true);
    for (let i = 0; i < 120; i++) {
      f.step();
      assert.ok(f.min() > f.physics.table.top - 0.005);
    }
  } finally {
    f.physics.dispose();
  }
});
test("Fixed accumulator caps tab stalls and body removal frees physics entry", () => {
  const f = fixture();
  try {
    f.physics.step(10);
    assert.equal(f.physics.totalSteps, 12);
    f.physics.remove(f.item);
    assert.equal(f.physics.entries.size, 0);
    assert.equal(f.physics.world.bodies.len(), 1 + f.physics.walls.length);
  } finally {
    f.physics.dispose();
  }
});

test("Release velocity uses real frame time consistently at 30, 60 and 144 render Hz", () => {
  const speeds = [];
  for (const rate of [30, 60, 144]) {
    const f = fixture();
    try {
      f.physics.beginGrab(f.item);
      for (let n = 1; n <= rate * 2; n++) {
        f.physics.setTarget(f.item, { x: (n / rate) * 1.5, y: 1, z: 0 });
        f.physics.step(1 / rate);
      }
      f.physics.release(f.item, true);
      speeds.push(f.e.body.linvel().x);
    } finally {
      f.physics.dispose();
    }
  }
  assert.ok(
    Math.max(...speeds) - Math.min(...speeds) < 0.005,
    JSON.stringify(speeds),
  );
  assert.ok(
    speeds.every((n) => n > 0.075 && n < 0.09),
    JSON.stringify(speeds),
  );
});
test("Numerical out-of-bounds fault is recovered before integration without a giant correction velocity", () => {
  const f = fixture();
  try {
    f.step(2);
    f.e.body.setTranslation({ x: 5, y: 0, z: 0 }, true);
    f.step();
    const b = f.physics.bounds(
      f.e,
      f.e.body.rotation(),
      f.physics.position(f.e),
    );
    assert.ok(b.max.x < f.physics.limits.xMax + 0.005);
    assert.equal(f.physics.recoveryCount, 1);
    assert.ok(Math.hypot(f.e.body.linvel().x, f.e.body.linvel().z) < 0.001);
  } finally {
    f.physics.dispose();
  }
});
test("Nonfinite targets are ignored and ordinary held targets do not recenter the vessel", () => {
  const f = fixture();
  try {
    f.physics.beginGrab(f.item);
    const before = { ...f.item.target };
    f.physics.setTarget(f.item, { x: NaN, y: 1, z: 0 });
    assert.deepEqual(f.item.target, before);
    f.physics.setTarget(f.item, { x: 50, y: 1, z: 0 });
    f.step(180);
    assert.ok(f.physics.position(f.e).x > 2);
    assert.equal(f.physics.recoveryCount, 0);
  } finally {
    f.physics.dispose();
  }
});
