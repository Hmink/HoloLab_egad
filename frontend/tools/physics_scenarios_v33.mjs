/** Deterministic Rapier acceptance scenarios. No physical webcam or human gestures. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
export async function runScenarios(root) {
  const THREE = await import(
    pathToFileURL(path.join(root, "web/vendor/three/three.module.js"))
  );
  const { LabPhysics, initPhysics, FIXED_DT } = await import(
    pathToFileURL(path.join(root, "web/src/physics.js"))
  );
  await initPhysics();
  const profiles = JSON.parse(
    fs.readFileSync(path.join(root, "web/profiles.json")),
  );
  const results = [];
  function fixture(kind = "beaker") {
    const table = new THREE.Mesh(new THREE.BoxGeometry(30, 0.14, 9));
    table.position.set(0, -1.7, -1.5);
    table.updateMatrixWorld(true);
    const p = new LabPhysics(table);
    let next = 1;
    const add = (x = 0, y = 1, z = 0, k = kind) => {
      const group = new THREE.Group();
      group.scale.setScalar(0.67);
      group.add(
        new THREE.Mesh(
          new THREE.LatheGeometry(
            profiles.profiles[k].map(([y, r]) => new THREE.Vector2(r, y)),
            32,
          ),
        ),
      );
      const o = {
        id: next++,
        stock: { kind: k },
        mixture: { volume_ml: 50 },
        target: { x, y, z },
        pitch: 0,
        yaw: 0,
        roll: 0,
        group,
        sealed: false,
      };
      group.position.copy(o.target);
      const e = p.add(o);
      return { o, e };
    };
    const step = (n = 1, dt = FIXED_DT) => {
      for (let i = 0; i < n; i++) p.step(dt);
    };
    const gap = (e) =>
      p.bounds(e, e.body.rotation(), p.position(e)).min.y - p.table.top;
    return { p, add, step, gap };
  }
  async function scenario(name, fn) {
    const f = fixture();
    try {
      const data = fn(f);
      results.push({ name, ...data });
    } catch (e) {
      results.push({ name, passed: false, error: String(e) });
    } finally {
      f.p.dispose();
    }
  }
  await scenario(
    "release_from_height_and_near_table",
    ({ p, add, step, gap }) => {
      const { o, e } = add();
      p.beginGrab(o);
      step(10);
      p.release(o, false);
      step(12);
      const fell = p.position(e).y < 0.9;
      step(500);
      const highGap = gap(e);
      p.beginGrab(o);
      p.setTarget(o, { x: 0, y: -10, z: 0 });
      step(150);
      p.release(o, false);
      step(400);
      return {
        passed: fell && highGap >= -0.005 && gap(e) < 0.04,
        high_gap: highGap,
        near_gap: gap(e),
      };
    },
  );
  await scenario(
    "fast_release_is_bounded_and_stays_in_workspace",
    ({ p, add, step, gap }) => {
      const { o, e } = add();
      p.beginGrab(o);
      for (let i = 0; i < 20; i++) {
        p.setTarget(o, { x: i * 0.4, y: 1, z: 0 });
        step(1, 1 / 60);
      }
      p.release(o, true);
      const v = e.body.linvel();
      let maxX = 0,
        maxPen = 0;
      for (let i = 0; i < 900; i++) {
        step();
        const b = p.bounds(e, e.body.rotation(), p.position(e));
        maxX = Math.max(maxX, b.max.x);
        maxPen = Math.max(maxPen, -gap(e));
      }
      return {
        passed:
          Math.hypot(v.x, v.y, v.z) <= 0.401 && maxX <= 4.21 && maxPen < 0.005,
        release_m_s: v,
        max_hull_x: maxX,
        max_penetration: maxPen,
        recoveries: p.recoveryCount ?? null,
      };
    },
  );
  await scenario(
    "kinematic_target_jump_has_finite_speed",
    ({ p, add, step }) => {
      const { o, e } = add(-2);
      p.beginGrab(o);
      const before = p.position(e);
      p.setTarget(o, { x: 3, y: 1, z: 0 });
      step();
      const after = p.position(e),
        speed =
          (Math.hypot(
            after.x - before.x,
            after.y - before.y,
            after.z - before.z,
          ) *
            0.1) /
          FIXED_DT;
      return { passed: speed <= 0.751, peak_held_m_s: speed };
    },
  );
  for (const fast of [false, true])
    await scenario(
      fast ? "fast_hand_contact" : "gentle_hand_contact",
      ({ p, add, step, gap }) => {
        const a = add(-1.5, -1.06),
          b = add(0, -1.06);
        step(450);
        p.beginGrab(a.o);
        let peak = 0,
          displacement = 0,
          maxPen = 0;
        const origin = p.position(b.e);
        for (let i = 0; i < 240; i++) {
          p.setTarget(a.o, {
            x: fast ? 2.2 : -1.5 + Math.min(i * 0.006, 1.65),
            y: -1.06,
            z: 0,
          });
          step();
          const v = b.e.body.linvel();
          peak = Math.max(peak, Math.hypot(v.x, v.z));
          displacement = Math.max(
            displacement,
            Math.hypot(
              p.position(b.e).x - origin.x,
              p.position(b.e).z - origin.z,
            ),
          );
          maxPen = Math.max(maxPen, -gap(a.e), -gap(b.e));
        }
        p.release(a.o, false);
        step(600);
        return {
          passed:
            peak < (fast ? 0.66 : 0.35) &&
            displacement < (fast ? 4.2 : 1.5) &&
            maxPen < 0.005,
          peak_horizontal_m_s: peak,
          max_displacement_scene: displacement,
          max_penetration: maxPen,
          recoveries: p.recoveryCount ?? null,
        };
      },
    );
  await scenario(
    "four_edges_held_and_dynamic_remain_inside",
    ({ p, add, step, gap }) => {
      const { o, e } = add();
      let outside = 0,
        pen = 0;
      for (const goal of [
        { x: -30, y: -1, z: 0 },
        { x: 30, y: -1, z: 0 },
        { x: 0, y: -1, z: -30 },
        { x: 0, y: -1, z: 30 },
      ]) {
        p.beginGrab(o);
        p.setTarget(o, goal, 0.7, 0.2, 0.3);
        step(200);
        p.release(o, true);
        for (let i = 0; i < 320; i++) {
          step();
          const b = p.bounds(e, e.body.rotation(), p.position(e));
          outside = Math.max(
            outside,
            -4.2 - b.min.x,
            b.max.x - 4.2,
            -1.8 - b.min.z,
            b.max.z - 1.5,
          );
          pen = Math.max(pen, -gap(e));
        }
      }
      return {
        passed: outside < 0.005 && pen < 0.005,
        max_outside_scene: outside,
        max_penetration: pen,
        recoveries: p.recoveryCount ?? null,
      };
    },
  );
  await scenario(
    "20_grab_release_cycles_and_regrab",
    ({ p, add, step, gap }) => {
      const { o, e } = add();
      let pen = 0,
        jump = 0;
      for (let n = 0; n < 20; n++) {
        const before = p.position(e);
        p.beginGrab(o);
        const after = p.position(e);
        jump = Math.max(
          jump,
          Math.hypot(
            before.x - after.x,
            before.y - after.y,
            before.z - after.z,
          ),
        );
        p.setTarget(
          o,
          { x: Math.sin(n) * 1.3, y: 0.6 + (n % 3) * 0.2, z: 0 },
          (n % 3) * 0.4,
          0,
          0,
        );
        step(130);
        p.release(o, n % 2 === 0);
        for (let i = 0; i < 400; i++) {
          step();
          pen = Math.max(pen, -gap(e));
        }
      }
      return {
        passed: pen < 0.005 && jump < 1e-6,
        cycles: 20,
        max_penetration: pen,
        regrab_position_jump: jump,
        recoveries: p.recoveryCount ?? null,
      };
    },
  );
  await scenario("60_seconds_untouched_settle", ({ p, add, step, gap }) => {
    const { e } = add();
    step(600);
    const before = p.position(e);
    step(7200);
    const after = p.position(e);
    const drift = Math.hypot(
      after.x - before.x,
      after.y - before.y,
      after.z - before.z,
    );
    return {
      passed: drift < 0.005 && gap(e) >= -0.005,
      simulation_seconds: 60,
      drift_scene: drift,
      sleeping: e.body.isSleeping(),
      recoveries: p.recoveryCount ?? null,
    };
  });
  await scenario(
    "tracking_gap_and_frame_stall_do_not_throw",
    ({ p, add, step }) => {
      const { o, e } = add();
      p.beginGrab(o);
      p.setTarget(o, { x: 2, y: 1, z: 0 });
      step(20);
      p.freezeHeld(o);
      step(20);
      p.release(o, true);
      const frozenSpeed = Math.hypot(...Object.values(e.body.linvel()));
      p.beginGrab(o);
      p.setTarget(o, { x: -2, y: 1, z: 0 });
      step(1, 0.8);
      p.release(o, true);
      const stallSpeed = Math.hypot(...Object.values(e.body.linvel()));
      return {
        passed: frozenSpeed < 1e-6 && stallSpeed < 1e-6,
        frozen_m_s: frozenSpeed,
        stall_m_s: stallSpeed,
      };
    },
  );
  return {
    project: root,
    physical_camera_tested: false,
    scenarios: results,
    passed: results.every((r) => r.passed),
  };
}
if (process.argv[2]) {
  const r = await runScenarios(path.resolve(process.argv[2]));
  const text = JSON.stringify(r, null, 2);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], text);
  else console.log(text);
  if (!r.passed) process.exitCode = 1;
}
