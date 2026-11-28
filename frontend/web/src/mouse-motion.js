/** Pure mouse-to-pose mapping. Angles are continuous; physics bounds speed/contact. */
export function mousePose(mode, start, point, world) {
  const dx = point.x - start.x, dy = point.y - start.y;
  if (mode === 'rotate') return { position: {...start.position}, roll: start.roll - dx * .009, yaw: start.yaw, pitch: start.pitch + dy * .009 };
  if (mode === 'depth') return { position: {...start.position, z: start.position.z - dy * .012}, roll:start.roll,yaw:start.yaw,pitch:start.pitch };
  return {position:{x:world.x+start.offset.x,y:world.y+start.offset.y,z:start.position.z},roll:start.roll,yaw:start.yaw,pitch:start.pitch};
}
