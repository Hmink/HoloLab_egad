/** Hollow compound collider for the Fe immersion lesson only, in scene units.
 * Closed convex hulls fill a vessel's mouth and cannot represent immersion.
 * Sixteen wall sectors + a bottom preserve an opening without disabling contact.
 */
export function hollowBeakerHulls(scale, sealed = false) {
  const hulls = [],
    point = (r, a, y) => [
      Math.sin(a) * r * scale.x,
      y * scale.y,
      Math.cos(a) * r * scale.z,
    ];
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8,
      b = ((i + 1) * Math.PI) / 8,
      points = [];
    for (const y of [-0.76, 0.84])
      for (const [r, t] of [
        [0.65, a],
        [0.735, a],
        [0.735, b],
        [0.65, b],
      ])
        points.push(...point(r, t, y));
    hulls.push(new Float32Array(points));
  }
  for (const [bottom, top] of sealed
    ? [
        [-0.82, -0.71],
        [0.85, 0.99],
      ]
    : [[-0.82, -0.71]]) {
    const points = [];
    for (const y of [bottom, top])
      for (let i = 0; i < 16; i++)
        points.push(...point(0.72, (i * Math.PI) / 8, y));
    hulls.push(new Float32Array(points));
  }
  return hulls;
}
