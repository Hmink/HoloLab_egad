import * as THREE from '../vendor/three/three.module.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const POURABLE_KINDS = new Set(['beaker', 'flask', 'tube', 'bottle', 'dropper']);
/** Educational incompressible, well-mixed liquid. No CFD or empirical flow prediction.
 * World-horizontal free surface; weighted cross-section quadrature conserves fill fraction.
 */
export class PourableContainer {
  constructor(item, profile) {
    this.item = item;
    this.profile = profile;
    this.capacity = item.stock.capacity_ml;
    this.normal = new THREE.Vector3(0, 1, 0);
    this.mouth = new THREE.Vector3();
    this.center = new THREE.Vector3();
    this.axis = new THREE.Vector3();
    this.local = new THREE.Vector3();
    this.inverse = new THREE.Quaternion();
    this.samples = [];
    this.totalWeight = 0;
    this.heights = new Float64Array(24 * 24);
    const bottom = profile[0][0], top = profile.at(-1)[0];
    for (let j = 0; j < 24; j++) {
      const y = bottom + (j + 0.5) / 24 * (top - bottom), radius = this.radius(y);
      for (let k = 0; k < 24; k++) {
        const r = radius * Math.sqrt((k + 0.5) / 24), a = k * 2.399963;
        const w = radius * radius;
        this.samples.push({x: r * Math.cos(a), y, z: r * Math.sin(a), w});
        this.totalWeight += w;
      }
    }
    this.rimY = item.mouthY;
    this.rimRadius = profile.at(-1)[1];
    this.spilledMl = 0;
    this.flowMlPerSecond = 0;
    this.target = null;
    this.overflowing = false;
    this.plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    this.lastQuaternion = new THREE.Quaternion(0, 0, 0, 0);
    this.lastVolume = -1;
    this.level = bottom;
  }
  get volume() { return this.item.mixture.volume_ml; }
  get mixture() { return this.item.mixture; }
  radius(y) {
    for (let i = 1; i < this.profile.length; i++) {
      const [a, r] = this.profile[i - 1], [b, s] = this.profile[i];
      if (y <= b) return r + (s - r) * clamp((y - a) / (b - a), 0, 1);
    }
    return this.profile.at(-1)[1];
  }
  updatePose() {
    const g = this.item.group;
    this.inverse.copy(g.quaternion).invert();
    this.normal.set(0, 1, 0).applyQuaternion(this.inverse);
    this.axis.set(0, 1, 0).applyQuaternion(g.quaternion);
    // Lowest point of the actual opening, not the origin/centre of the vessel.
    const h = Math.hypot(this.normal.x, this.normal.z);
    this.local.set(h > 1e-6 ? -this.rimRadius * this.normal.x / h : 0,
      this.rimY, h > 1e-6 ? -this.rimRadius * this.normal.z / h : 0);
    this.mouth.copy(this.local).applyMatrix4(g.matrixWorld);
    this.center.set(0, this.rimY, 0).applyMatrix4(g.matrixWorld);
    if (this.volume !== this.lastVolume || Math.abs(g.quaternion.dot(this.lastQuaternion)) < 0.99999) {
      let lo = Infinity, hi = -Infinity;
      this.samples.forEach((p, i) => {
        const h = p.x * this.normal.x + p.y * this.normal.y + p.z * this.normal.z;
        this.heights[i] = h; lo = Math.min(lo, h); hi = Math.max(hi, h);
      });
      const target = clamp(this.volume / this.capacity, 0, 1) * this.totalWeight;
      // Smooth quadrature prevents quantized surface jumps at very low volume.
      const band = (hi - lo) / 24;
      for (let j = 0; j < 18; j++) {
        const mid = (lo + hi) / 2;
        let weight = 0;
        for (let i = 0; i < this.samples.length; i++)
          weight += this.samples[i].w * clamp((mid - this.heights[i]) / band + 0.5, 0, 1);
        if (weight < target) lo = mid; else hi = mid;
      }
      this.level = (lo + hi) / 2;
      this.lastVolume = this.volume;
      this.lastQuaternion.copy(g.quaternion);
      this.surfaceDirty = true;
    }
    this.plane.constant = g.position.y + this.level * g.scale.y;
    return this;
  }
  rate() {
    if (this.item.sealed || this.volume <= 1e-8) return 0;
    const tilt = Math.acos(clamp(this.axis.y, -1, 1));
    const lip = this.local.dot(this.normal);
    if (tilt < Math.PI / 4 || (this.level < lip - 0.015 && tilt < Math.PI * 0.97)) return 0;
    // Retains finite flow at inversion: drain completely, never exponential residue.
    const base = this.item.stock.kind === 'dropper' ? 0.8 :
      this.item.stock.kind === 'tube' ? 4 : this.item.stock.kind === 'beaker' ? 32 : 18;
    return base * clamp((tilt - Math.PI / 4) / (Math.PI * 0.75), 0.08, 1);
  }
  receivePoint(from) {
    if (this.item.sealed || this.axis.y < 0.35) return null;
    const dy = this.axis.dot(this.center.clone().sub(from)) / -this.axis.y;
    if (dy < 0.01 || dy > 4) return null;
    const hit = new THREE.Vector3(from.x, from.y - dy, from.z);
    const local = this.item.group.worldToLocal(hit.clone());
    if (Math.hypot(local.x, local.z) > this.rimRadius * 0.98) return null;
    return hit;
  }
}
/** Remove an aliquot including dissolved/suspended species; escaped gas and solid tools stay.
 * Used for spills. Every removed amount is returned for the spill ledger (no silent loss).
 */
export function withdraw(mix, requested) {
  const amount = Number.isFinite(requested) ? Math.min(Math.max(0, requested), mix.volume_ml) : 0;
  const f = mix.volume_ml > 0 ? amount / mix.volume_ml : 0;
  const packet = {volume_ml: amount, mol: {}, origins: {}, protein_g: 0, indicator_g: 0};
  for (const field of ['mol', 'origins']) for (const [k, n] of Object.entries(mix[field] || {})) {
    if (field === 'mol' && ['Fe', 'Cu'].includes(k)) continue;
    packet[field][k] = n * f;
    mix[field][k] = Math.max(0, n - packet[field][k]);
  }
  for (const k of ['protein_g', 'indicator_g']) {
    packet[k] = (mix[k] || 0) * f;
    if (k in mix) mix[k] -= packet[k];
  }
  mix.volume_ml = Math.max(0, mix.volume_ml - amount);
  return packet;
}
