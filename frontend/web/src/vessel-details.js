import * as THREE from "three";

/** Small, generated textures and low-poly details. Never rebuilt per frame. */
export function addVesselDetails(view, item) {
  const { group, stock } = item,
    kind = stock.kind;
  const detail = new THREE.Group();
  detail.userData.noPhysics = true;
  detail.name = "vessel-visual-details";
  group.add(detail);
  const ceramic = new THREE.MeshStandardMaterial({
    color: 0xf2f0e6,
    roughness: 0.58,
  });
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9ebed,
    roughness: 0.16,
    metalness: 0.08,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
  });
  const profile = view.profiles.profiles[kind];
  if (!profile) return;
  const topY = Math.max(...profile.map((p) => p[0]));
  const top = profile.find((p) => p[0] === topY);
  const lipRadius = Math.max(
    ...profile.filter((p) => p[0] === topY).map((p) => p[1]),
  );
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(lipRadius, 0.016, 6, 40),
    rimMaterial,
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = top[0] - 0.012;
  detail.add(rim);
  if (kind === "beaker" || kind === "flask") {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 256, 512);
    ctx.fillStyle = "#e9f2f1";
    ctx.strokeStyle = "#e9f2f1";
    ctx.lineWidth = 3;
    ctx.font = '500 23px "Be Vietnam Pro",sans-serif';
    const max = stock.capacity_ml || 250;
    const bottom = profile[0][0],
      height = topY - bottom;
    detail.userData.graduations = [];
    for (let i = 1; i <= 5; i++) {
      const ml = Math.round((max * i) / 6);
      // Use the unchanged volume integrator: conical flask marks are NOT equally spaced.
      const fill = view.liquidGeometry(kind, ml / max);
      fill.computeBoundingBox();
      const level = fill.boundingBox.max.y;
      fill.dispose();
      detail.userData.graduations.push({ ml, level });
      const y = ((topY - level) / height) * 512;
      ctx.beginPath();
      ctx.moveTo(32, y);
      ctx.lineTo(i % 2 ? 100 : 124, y);
      ctx.stroke();
      ctx.fillText(String(ml), 135, y + 7);
    }
    ctx.font = '600 26px "Be Vietnam Pro",sans-serif';
    ctx.fillText("mL", 148, 40);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
    const outer = profile.slice(0, profile.findIndex((p) => p[0] === topY) + 1);
    const geometry = new THREE.LatheGeometry(
      outer.map(([y, r]) => new THREE.Vector2(r + 0.012, y)),
      18,
      -0.5,
      1,
    );
    const position = geometry.attributes.position,
      uv = geometry.attributes.uv;
    for (let i = 0; i < uv.count; i++)
      uv.setY(i, (position.getY(i) - bottom) / height);
    uv.needsUpdate = true;
    const marks = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      }),
    );
    marks.renderOrder = 2;
    detail.add(marks);
  }
  if (kind === "bottle") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f3f0e3";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#385758";
    ctx.fillRect(0, 0, 512, 30);
    ctx.font = '600 31px "Be Vietnam Pro",sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(stock.formula || "Dung dịch", 256, 95);
    ctx.font = '400 23px "Be Vietnam Pro",sans-serif';
    // A readable educational label, not an invented certified hazard label.
    const name =
      stock.name.length > 29 ? stock.name.slice(0, 27) + "…" : stock.name;
    ctx.fillText(name, 256, 145);
    ctx.fillText(`${stock.capacity_ml || 250} mL · Mô phỏng`, 256, 206);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(0.605, 0.605, 0.66, 20, 1, true, -0.85, 1.7),
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.8,
        side: THREE.DoubleSide,
      }),
    );
    label.position.y = -0.16;
    detail.add(label);
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(0.263, 0.025, 6, 32),
      ceramic,
    );
    band.rotation.x = Math.PI / 2;
    band.position.y = 0.88;
    detail.add(band);
  }
  // The existing cap, mouth coordinate, object identity and liquid stay intact.
  if (item.cap) {
    item.cap.material.dispose();
    item.cap.material = new THREE.MeshStandardMaterial({
      color: 0x294c50,
      roughness: 0.65,
    });
  }
}

/** Soft analytical contact cue; not a shadow map or a second scene render. */
export function makeContactShadow(view, item) {
  if (!view.contactTexture) {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d"),
      g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, "rgba(16,30,35,.8)");
    g.addColorStop(0.5, "rgba(16,30,35,.32)");
    g.addColorStop(1, "rgba(16,30,35,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    view.contactTexture = new THREE.CanvasTexture(c);
  }
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.35, 1.35),
    new THREE.MeshBasicMaterial({
      map: view.contactTexture,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.userData.noPhysics = true;
  if (item.stock.kind === "tube" || item.stock.kind === "dropper")
    shadow.scale.setScalar(0.55);
  item.contactShadow = shadow;
  view.scene.add(shadow);
}
