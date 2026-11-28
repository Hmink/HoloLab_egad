import * as THREE from '../vendor/three/three.module.js';
/** Fixed geometry + one world clipping plane; cap buffer is reused, not reallocated each pour. */
export function attachLiquid(item) {
  const c = item.pourable, points = c.profile.map(([y, r]) => new THREE.Vector2(r, y));
  points.unshift(new THREE.Vector2(0, c.profile[0][0]));
  points.push(new THREE.Vector2(0, c.profile.at(-1)[0]));
  item.liquid.geometry.dispose();
  item.liquid.geometry = new THREE.LatheGeometry(points, 24);
  item.liquid.material.clippingPlanes = [c.plane];
  item.liquid.material.side = THREE.DoubleSide;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2048 * 3), 3).setUsage(THREE.DynamicDrawUsage));
  const cap = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: 0xbee6ef, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false}));
  cap.name = 'liquid-free-surface';
  cap.userData.noPhysics = true;
  cap.frustumCulled = false;
  cap.renderOrder = 2;
  item.group.add(cap);
  c.cap = cap;
}
export function updateLiquid(item) {
  const c = item.pourable;
  if (!c) return;
  c.updatePose();
  item.liquid.visible = c.volume > 1e-8;
  c.cap.visible = item.liquid.visible;
  c.cap.material.color.copy(item.liquid.material.color);
  if (!c.surfaceDirty || !c.cap.visible) return;
  c.surfaceDirty = false;
  const geometry = item.liquid.geometry, a = geometry.attributes.position, ids = geometry.index;
  const points = [], seen = new Set();
  const u = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i < ids.count; i += 3) for (let j = 0; j < 3; j++) {
    u.fromBufferAttribute(a, ids.getX(i + j));
    v.fromBufferAttribute(a, ids.getX(i + (j + 1) % 3));
    const d = u.dot(c.normal) - c.level, e = v.dot(c.normal) - c.level;
    if ((d < 0) === (e < 0) || Math.abs(d - e) < 1e-10) continue;
    const p = u.clone().lerp(v, d / (d - e));
    const key = `${p.x.toFixed(5)},${p.y.toFixed(5)},${p.z.toFixed(5)}`;
    if (!seen.has(key)) { points.push(p); seen.add(key); }
  }
  const center = new THREE.Vector3();
  for (const p of points) center.add(p);
  if (points.length < 3) { c.cap.geometry.setDrawRange(0, 0); return; }
  center.divideScalar(points.length);
  const x = new THREE.Vector3(1, 0, 0);
  if (Math.abs(x.dot(c.normal)) > 0.9) x.set(0, 0, 1);
  x.cross(c.normal).normalize();
  const y = new THREE.Vector3().crossVectors(c.normal, x);
  points.sort((a, b) => Math.atan2(a.dot(y) - center.dot(y), a.dot(x) - center.dot(x)) - Math.atan2(b.dot(y) - center.dot(y), b.dot(x) - center.dot(x)));
  const out = c.cap.geometry.attributes.position;
  let index = 0;
  for (let i = 0; i < points.length && index + 3 < out.count; i++) {
    for (const p of [center, points[i], points[(i + 1) % points.length]]) out.setXYZ(index++, p.x, p.y, p.z);
  }
  c.cap.geometry.setDrawRange(0, index);
  out.needsUpdate = true;
}
