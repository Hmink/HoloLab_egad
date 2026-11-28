import * as THREE from "three";
/** Static low-poly room. Contact cues use sprites, without shadow-map passes. */
export function buildEnvironment(view) {
  const room = new THREE.Group();
  const material = new Map();
  const mat = (c) => {
    if (!material.has(c))
      material.set(
        c,
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.65,
          metalness: 0.05,
        }),
      );
    return material.get(c);
  };
  const cube = (w, h, d, c, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c));
    m.position.set(x, y, z);
    room.add(m);
    return m;
  };
  cube(30, 14, 0.2, 0x414b57, 0, 1, -4);
  const table = cube(36, 0.14, 9, 0x68757e, 0, -1.7, -1.5);
  table.name = "lab-table";
  room.userData.table = table;
  cube(36, 0.5, 0.12, 0x344c53, 0, -1.98, 2.9);
  for (let x = -12; x < 13; x += 2.4) {
    cube(0.018, 8, 0.02, 0x45515c, x, 1, -3.87);
    cube(0.018, 0.01, 8.8, 0x68757e, x, -1.62, -1.5);
  }
  cube(12, 0.08, 0.5, 0xb8d3d4, 0, 3.2, -3.5);
  const sign = (text, x, y, w = 1.6, bg = "#f2ba54") => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#152e36";
    ctx.textAlign = "center";
    ctx.font = "bold 38px sans-serif";
    text.split("|").forEach((s, i) => ctx.fillText(s, 256, 90 + i * 60));
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, w / 2),
      new THREE.MeshBasicMaterial({ map: tx }),
    );
    m.position.set(x, y, -3.8);
    room.add(m);
  };
  sign("WEAR GOGGLES|LAB SAFETY", -3, 1.4);
  sign("HOLOLAB|VIRTUAL SCIENCE", 1.3, 2, 3, "#c6e1df");
  cube(0.85, 1.2, 0.75, 0xb24543, 3.5, -1.05, -2.5);
  cube(0.95, 0.1, 0.85, 0xe1eded, 3.5, -0.4, -2.5);
  sign("BIOHAZARD", 3.5, -0.1, 1, "#f4c5b8");
  cube(1, 0.28, 0.55, 0x38ae96, -3, -1.4, 0);
  cube(0.5, 0.02, 0.2, 0xd3e8ee, -3, -1.24, 0.04);
  cube(0.95, 0.38, 0.7, 0xd7e4e5, 2.1, -1.42, 0);
  cube(0.65, 0.18, 0.025, 0x153e50, 2.1, -1.32, 0.36);
  // A rack with visible slots/tubes, and a stirrer/pH probe: cosmetic room equipment.
  // The free-desk dynamic tools remain separate, identifiable and grabbable.
  const addMesh = (geo, material, x, y, z) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    room.add(m);
    return m;
  };
  const steel = new THREE.MeshStandardMaterial({
    color: 0xb9c6ca,
    metalness: 0.65,
    roughness: 0.3,
  });
  const ceramic = new THREE.MeshStandardMaterial({
    color: 0xe2e7e3,
    roughness: 0.48,
  });
  // Functional rack and its collision geometry are added after physics initializes.
  // Existing right-side equipment gets a readable screen, knob, probe and cable.
  const plate = addMesh(
    new THREE.CylinderGeometry(0.33, 0.33, 0.045, 24),
    ceramic,
    2.1,
    -1.2,
    0,
  );
  const knob = addMesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.08, 12),
    steel,
    2.43,
    -1.39,
    0.38,
  );
  knob.rotation.x = Math.PI / 2;
  addMesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.7, 10),
    steel,
    1.62,
    -0.95,
    -0.18,
  );
  const cable = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.62, -0.6, -0.18),
    new THREE.Vector3(1.85, -0.4, -0.2),
    new THREE.Vector3(2.32, -0.65, -0.15),
    new THREE.Vector3(2.35, -1.25, 0.04),
  ]);
  const wire = new THREE.Mesh(
    new THREE.TubeGeometry(cable, 16, 0.012, 5, false),
    mat(0x273d45),
  );
  room.add(wire);
  room.traverse((o) => {
    o.matrixAutoUpdate = false;
    o.updateMatrix();
  });
  view.scene.add(room);
  return room;
}
export function buildStation(view) {
  const g = new THREE.Group();
  const solid = new THREE.MeshStandardMaterial({
    color: 0xc3d4d9,
    roughness: 0.4,
    metalness: 0.12,
  });
  const cyan = new THREE.MeshPhongMaterial({
    color: 0x67c4df,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const mesh = (geometry, material, x, y, z) => {
    const m = new THREE.Mesh(geometry, material);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.1, 24), solid, -0.6, -1.58, 0);
  mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.7, 8), solid, -0.65, 0.3, 0);
  mesh(new THREE.BoxGeometry(0.75, 0.045, 0.08), solid, -0.3, 1.25, 0);
  mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 2.35, 16, true),
    view.glass,
    0,
    0.9,
    0,
  );
  const fill = mesh(
    new THREE.CylinderGeometry(0.066, 0.066, 2.25, 12),
    cyan,
    0,
    0.9,
    0,
  );
  const valve = mesh(
    new THREE.BoxGeometry(0.4, 0.09, 0.12),
    new THREE.MeshPhongMaterial({ color: 0xf0b450 }),
    0,
    -0.35,
    0.08,
  );
  mesh(
    new THREE.CylinderGeometry(0.018, 0.04, 0.25, 8),
    view.glass,
    0,
    -0.5,
    0,
  );
  const flask = mesh(view.lathe("flask"), view.glass, 0, -1.25, 0);
  flask.scale.setScalar(0.5);
  const liquid = mesh(
    new THREE.CylinderGeometry(0.2, 0.26, 0.24, 20),
    new THREE.MeshPhongMaterial({
      color: 0x99d9e4,
      transparent: true,
      opacity: 0.7,
    }),
    0,
    -1.43,
    0,
  );
  const drop = mesh(new THREE.SphereGeometry(0.025, 6, 4), cyan, 0, -0.94, 0);
  drop.visible = false;
  const pts = [];
  for (let i = 0; i <= 25; i++) {
    const y = 2 - i * 0.086;
    pts.push(
      new THREE.Vector3(0.085, y, 0.03),
      new THREE.Vector3(i % 5 === 0 ? 0.2 : 0.14, y, 0.03),
    );
  }
  g.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xffffff }),
    ),
  );
  const meterCanvas = document.createElement("canvas");
  meterCanvas.width = 256;
  meterCanvas.height = 128;
  const mc = meterCanvas.getContext("2d");
  const meterTexture = new THREE.CanvasTexture(meterCanvas);
  meterTexture.colorSpace = THREE.SRGBColorSpace;
  mesh(new THREE.BoxGeometry(0.9, 0.5, 0.3), solid, 1, -1.35, 0);
  const display = mesh(
    new THREE.PlaneGeometry(0.75, 0.36),
    new THREE.MeshBasicMaterial({ map: meterTexture }),
    1,
    -1.31,
    0.16,
  );
  let previousText = "";
  view.scene.add(g);
  g.visible = false;
  return {
    group: g,
    valve,
    update(model, now) {
      const text = model.value.ph.toFixed(2);
      if (text !== previousText) {
        previousText = text;
        mc.fillStyle = "#102e3d";
        mc.fillRect(0, 0, 256, 128);
        mc.fillStyle = "#83efd3";
        mc.font = "bold 48px sans-serif";
        mc.fillText("pH " + text, 8, 72);
        mc.font = "18px sans-serif";
        mc.fillText("25 C / IDEAL MODEL", 8, 110);
        meterTexture.needsUpdate = true;
      }
      const f = Math.max(0.001, 1 - model.addedMl / 50);
      fill.scale.y = f;
      fill.position.y = -0.225 + 1.125 * f;
      valve.rotation.z = (model.open * Math.PI) / 2;
      liquid.material.color.setRGB(
        0.6 + 0.35 * model.value.pink,
        0.85 - 0.6 * model.value.pink,
        0.9 - 0.15 * model.value.pink,
      );
      liquid.scale.y = 1 + model.addedMl / 50;
      drop.visible = model.open > 0;
      drop.position.y = -0.635 - ((now % 450) / 450) * 0.1;
    },
  };
}
