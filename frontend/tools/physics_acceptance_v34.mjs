import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
export async function acceptance(root) {
  const T = await import(
    pathToFileURL(path.join(root, "web/vendor/three/three.module.js"))
  );
  const { LabPhysics, initPhysics, FIXED_DT } = await import(
    pathToFileURL(path.join(root, "web/src/physics.js"))
  );
  await initPhysics();
  const profiles = JSON.parse(
    fs.readFileSync(path.join(root, "web/profiles.json")),
  );
  const checks = [];
  function fixture() {
    const t = new T.Mesh(new T.BoxGeometry(30, 0.14, 9));
    t.position.set(0, -1.7, -1.5);
    t.updateMatrixWorld();
    const p = new LabPhysics(t);
    let id = 0;
    function add(x = 0, y = 1, z = 0, kind = "beaker") {
      const g = new T.Group();
      g.scale.setScalar(0.67);
      g.add(
        new T.Mesh(
          new T.LatheGeometry(
            profiles.profiles[kind].map(([y, r]) => new T.Vector2(r, y)),
            32,
          ),
        ),
      );
      const o = {
        id: ++id,
        stock: { kind },
        mixture: { volume_ml: 50 },
        group: g,
        target: { x, y, z },
        roll: 0,
        pitch: 0,
        yaw: 0,
        sealed: false,
      };
      g.position.copy(o.target);
      return { o, e: p.add(o) };
    }
    let maxPen = 0,
      outside = 0;
    const step = (n = 1, dt = FIXED_DT) => {
      for (let i = 0; i < n; i++) {
        p.step(dt);
        for (const e of p.entries.values()) {
          const b = p.bounds(e, e.body.rotation(), p.position(e)),
            l = p.limits;
          maxPen = Math.max(maxPen, p.table.top - b.min.y);
          outside = Math.max(
            outside,
            l.xMin - b.min.x,
            b.max.x - l.xMax,
            l.zMin - b.min.z,
            b.max.z - l.zMax,
            b.max.y - l.top,
          );
        }
      }
    };
    return {
      p,
      add,
      step,
      measure: () => ({ maxPen, outside, recoveries: p.recoveryCount }),
    };
  }
  async function run(name, fn) {
    const f = fixture();
    try {
      const data = await fn(f),
        m = f.measure();
      checks.push({
        name,
        ...data,
        ...m,
        passed: data.passed && m.maxPen < 0.005 && m.outside < 0.005,
      });
    } catch (e) {
      checks.push({ name, passed: false, error: String(e) });
    } finally {
      f.p.dispose();
    }
  }
  await run(
    "30 drops, regrab, varied FPS, repeated release idempotent",
    ({ p, add, step }) => {
      const a = add();
      let jump = 0;
      for (let n = 0; n < 30; n++) {
        const before = p.position(a.e);
        p.beginGrab(a.o);
        jump = Math.max(
          jump,
          new T.Vector3().copy(before).distanceTo(p.position(a.e)),
        );
        p.setTarget(a.o, { x: Math.sin(n), y: 1, z: 0 }, (n % 3) * 0.4);
        step(60, [1 / 30, 1 / 60, 1 / 144][n % 3]);
        p.release(a.o, false);
        const v = { ...a.e.body.linvel() };
        p.release(a.o, true);
        if (JSON.stringify(v) !== JSON.stringify(a.e.body.linvel()))
          throw Error("duplicate release");
        step(400);
      }
      return { passed: jump < 1e-6, cycles: 30, regrabJump: jump };
    },
  );
  await run("20 light throws remain bounded", ({ p, add, step }) => {
    const a = add();
    let peakRelease = 0,
      minimumMoving = Infinity;
    for (let n = 0; n < 20; n++) {
      p.beginGrab(a.o);
      p.setTarget(a.o, { x: -1, y: 0.8, z: 0 }, 0, 0, 0);
      step(140);
      for (let i = 0; i < 20; i++) {
        p.setTarget(a.o, { x: -1 + i * 0.07, y: 0.8, z: 0 });
        step(1, 1 / 60);
      }
      p.release(a.o, true);
      const v = a.e.body.linvel(),
        speed = Math.hypot(v.x, v.y, v.z);
      peakRelease = Math.max(peakRelease, speed);
      minimumMoving = Math.min(minimumMoving, speed);
      step(450);
    }
    return {
      passed: peakRelease <= 0.401 && minimumMoving > 0.01,
      cycles: 20,
      peakRelease,
      minimumMoving,
    };
  });
  await run("30 gentle vessel contacts", ({ p, add, step }) => {
    let peak = 0,
      moved = 0;
    for (let n = 0; n < 30; n++) {
      for (const e of [...p.entries.values()]) p.remove(e.item);
      const a = add(-1.5, -1.05),
        b = add(0, -1.05);
      step(300);
      const before = p.position(b.e);
      p.beginGrab(a.o);
      for (let i = 0; i < 200; i++) {
        p.setTarget(a.o, { x: -1.5 + i * 0.007, y: -1.05, z: 0 });
        step();
        const v = b.e.body.linvel();
        peak = Math.max(peak, Math.hypot(v.x, v.y, v.z));
      }
      moved = Math.max(
        moved,
        new T.Vector3().copy(before).distanceTo(p.position(b.e)),
      );
      p.release(a.o, false);
      step(300);
    }
    return {
      passed: peak < 0.5 && moved > 0.001 && moved < 2,
      cycles: 30,
      peak,
      moved,
    };
  });
  await run("four edges and ceiling held then dynamic", ({ p, add, step }) => {
    const a = add();
    for (const target of [
      { x: -30, y: 0, z: 0 },
      { x: 30, y: 0, z: 0 },
      { x: 0, y: 0, z: -30 },
      { x: 0, y: 0, z: 30 },
      { x: 0, y: 30, z: 0 },
    ]) {
      p.beginGrab(a.o);
      p.setTarget(a.o, target, 0.8, 0.2, 0.3);
      step(250);
      p.release(a.o, true);
      step(400);
    }
    return { passed: true };
  });
  await run("six vessels rest for 60 simulated seconds", ({ p, add, step }) => {
    const a = [];
    for (let i = 0; i < 6; i++)
      a.push(add(-3 + i * 1.2, -1, 0, i % 2 ? "flask" : "beaker"));
    step(600);
    const before = a.map((x) => p.position(x.e));
    step(7200);
    const drift = Math.max(
      ...a.map((x, i) =>
        new T.Vector3().copy(before[i]).distanceTo(p.position(x.e)),
      ),
    );
    return {
      passed: drift < 0.005 && a.every((x) => x.e.body.isSleeping()),
      seconds: 60,
      drift,
      sleeping: a.every((x) => x.e.body.isSleeping()),
    };
  });
  await run(
    "tracking interruption freezes; reacquire and stall do not throw",
    ({ p, add, step }) => {
      const a = add();
      p.beginGrab(a.o);
      p.setTarget(a.o, { x: 2, y: 1, z: 0 });
      step(10);
      p.freezeHeld(a.o);
      const before = p.position(a.e);
      step(30);
      const drift = new T.Vector3().copy(before).distanceTo(p.position(a.e));
      const held = a.e.body.isKinematic();
      p.release(a.o, true);
      const frozen = Math.hypot(...Object.values(a.e.body.linvel()));
      p.beginGrab(a.o);
      p.setTarget(a.o, { x: -2, y: 1, z: 0 });
      step(1, 0.6);
      p.release(a.o, true);
      return {
        passed:
          held &&
          drift < 1e-6 &&
          frozen < 1e-6 &&
          Math.hypot(...Object.values(a.e.body.linvel())) < 1e-6,
        drift,
        frozen,
      };
    },
  );
  await run(
    "new overlapping spawns separated before solver; existing held body unchanged",
    ({ p, add, step }) => {
      const a = add(0, -1);
      p.beginGrab(a.o);
      const before = p.position(a.e);
      const b = add(0, -1);
      p.world.propagateModifiedBodyPositionsToColliders();
      let penetration = 0;
      for (const c of a.e.colliders)
        for (const d of b.e.colliders) {
          const hit = c.contactCollider(d, 10);
          if (hit) penetration = Math.max(penetration, -hit.distance);
        }
      const jump = new T.Vector3().copy(before).distanceTo(p.position(a.e));
      step(500);
      return {
        passed: penetration === 0 && jump === 0,
        initialPenetration: penetration,
        heldJump: jump,
      };
    },
  );
  return {
    passed: checks.every((c) => c.passed),
    physicalWebcam: false,
    simulation: true,
    checks,
  };
}
if (process.argv[2]) {
  const r = await acceptance(path.resolve(process.argv[2]));
  fs.writeFileSync(process.argv[3], JSON.stringify(r, null, 2));
  console.log(JSON.stringify(r, null, 2));
  if (!r.passed) process.exitCode = 1;
}
