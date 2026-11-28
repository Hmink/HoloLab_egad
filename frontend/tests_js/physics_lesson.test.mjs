import test from "node:test";
import assert from "node:assert/strict";
import * as T from "../web/vendor/three/three.module.js";
import { LabPhysics, initPhysics, FIXED_DT } from "../web/src/physics.js";
await initPhysics();
test("Closing a hollow beaker lid is blocked by a strip at the mouth, not only in the liquid", () => {
  const table = new T.Mesh(new T.BoxGeometry(30, 0.14, 9));
  table.position.set(0, -1.7, -1.5);
  const p = new LabPhysics(table);
  const make = (id, stock, y, shape) => {
    const group = new T.Group();
    group.scale.setScalar(0.67);
    group.add(new T.Mesh(shape));
    return {
      id,
      stock,
      group,
      target: { x: 0, y, z: 0 },
      mixture: { volume_ml: 0 },
      roll: 0,
      pitch: 0,
      yaw: 0,
      sealed: false,
    };
  };
  try {
    const cup = make(
      1,
      { kind: "beaker", openVessel: true },
      0,
      new T.CylinderGeometry(0.72, 0.72, 1.66, 24),
    );
    p.add(cup);
    assert.equal(p.canSeal(cup), true);
    const rod = make(
      2,
      { kind: "iron-strip" },
      0.95,
      new T.BoxGeometry(0.13, 1.5, 0.09),
    );
    p.add(rod);
    // Its lower tip y=.4475 is above the 100 mL liquid level, but crosses the lid.
    assert.equal(p.canSeal(cup), false);
    p.remove(rod);
    assert.equal(p.canSeal(cup), true);
  } finally {
    p.dispose();
  }
});
test("Open lesson beaker keeps physical bottom and walls through 30 drop/regrab cycles", () => {
  const table = new T.Mesh(new T.BoxGeometry(30, 0.14, 9));
  table.position.set(0, -1.7, -1.5);
  table.updateMatrixWorld();
  const p = new LabPhysics(table);
  const group = new T.Group();
  group.scale.setScalar(0.67);
  group.add(new T.Mesh(new T.CylinderGeometry(0.72, 0.72, 1.66, 24)));
  const item = {
    id: 1,
    stock: { kind: "beaker", openVessel: true },
    mixture: { volume_ml: 100 },
    group,
    target: { x: 0, y: 1, z: 0 },
    roll: 0,
    pitch: 0,
    yaw: 0,
    sealed: false,
  };
  const e = p.add(item);
  assert.equal(e.colliders.length, 17);
  let pen = 0;
  try {
    for (let n = 0; n < 30; n++) {
      p.beginGrab(item);
      p.setTarget(item, { x: 0, y: 0.7, z: 0 }, (n % 2) * 0.7, 0, 0);
      for (let i = 0; i < 130; i++) p.step(FIXED_DT);
      p.release(item, true);
      for (let i = 0; i < 400; i++) {
        p.step(FIXED_DT);
        pen = Math.max(
          pen,
          p.table.top - p.bounds(e, e.body.rotation(), p.position(e)).min.y,
        );
      }
    }
    assert.ok(pen < 0.005);
    assert.equal(p.recoveryCount, 0);
    console.log("Hollow vessel 30 drops penetration", pen);
  } finally {
    p.dispose();
  }
});
