import { mkdir, copyFile, cp, readFile, writeFile } from "node:fs/promises";
const dest = "web/vendor";
await mkdir(dest, { recursive: true });
await cp("node_modules/three/build", `${dest}/three`, { recursive: true });
await cp("node_modules/three/examples/jsm/controls", `${dest}/controls`, {
  recursive: true,
});
await copyFile("node_modules/three/LICENSE", `${dest}/THREE-LICENSE.txt`);
await copyFile(
  "node_modules/@mediapipe/tasks-vision/vision_bundle.mjs",
  `${dest}/vision_bundle.mjs`,
);
await cp("node_modules/@mediapipe/tasks-vision/wasm", `${dest}/wasm`, {
  recursive: true,
});
await copyFile(
  "node_modules/@mediapipe/tasks-vision/package.json",
  `${dest}/MEDIAPIPE-package.json`,
);
console.log("Local runtime libraries copied");

await mkdir(`${dest}/rapier`,{recursive:true});
await copyFile('node_modules/@dimforge/rapier3d-compat/rapier.es.js',`${dest}/rapier/rapier.mjs`);
await copyFile('node_modules/@dimforge/rapier3d-compat/package.json',`${dest}/rapier/package.json`);
await copyFile('licenses/MEDIAPIPE-APACHE-2.0.txt',`${dest}/rapier/LICENSE-APACHE-2.0.txt`);
