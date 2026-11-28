import * as THREE from "three";
import { appearance } from "./lesson-chemistry.js";
export function buildLessonTool(view, item) {
  if (item.stock.kind === "iron-strip") {
    item.ironMesh = view.box(0.13, 1.5, 0.09, 0x79858b);
    item.group.add(item.ironMesh);
    const coating = new THREE.Mesh(
      new THREE.BoxGeometry(0.137, 0.82, 0.098),
      new THREE.MeshStandardMaterial({
        color: 0xb46b3d,
        roughness: 0.64,
        metalness: 0.6,
        transparent: true,
        opacity: 0,
      }),
    );
    coating.position.y = -0.28;
    coating.userData.noPhysics = true;
    item.group.add(coating);
    item.copperCoating = coating;
    return true;
  }
  if (item.stock.kind === "litmus") {
    item.litmusMesh = view.box(0.65, 0.2, 0.025, 0xcd435d, 0, 0.28, 0.025);
    item.group.add(item.litmusMesh);
    item.group.add(view.box(0.055, 0.5, 0.055, 0x46535a, 0, -0.02, 0));
    return true;
  }
  return false;
}
export class LessonVisuals {
  constructor(view) {
    this.view = view;
    this.board = null;
    this.lastText = "";
  }
  start(lesson) {
    this.stop();
    this.lesson = lesson;
    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 512;
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.texture = texture;
    this.board = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 5),
      new THREE.MeshBasicMaterial({ map: texture }),
    );
    this.board.position.set(0, 1.3, -3.2);
    this.view.scene.add(this.board);
    this.resize();
  }
  resize() {
    if (!this.board) return;
    const visibleWidth =
      2 * (this.view.camera.position.z + 3.2) * Math.tan((24 * Math.PI) / 180) * this.view.camera.aspect;
    this.board.scale.setScalar(Math.min(1, (visibleWidth * 0.88) / 15));
  }
  updateScreen(model, status) {
    if (!this.board) return;
    const l = model.lesson,
      page = this.page || 0;
    const chemicals = l.setup
      .map((row) => {
        const s = model.data.stocks.find((s) => s.id === row.stock);
        return `${s.name}: ${s.formula}`;
      })
      .join(" · ");
    const pages = [
      [
        ["Mục tiêu", l.objective],
        ["Phương trình / sơ đồ dự đoán", l.equations[0]],
        ["Thao tác và quan sát", status],
      ],
      [
        ["Hóa chất và dụng cụ", chemicals],
        ["Điều kiện", l.conditions],
        ["Bắt đầu", l.steps[0]],
      ],
      [
        [
          "Quan sát",
          model.observed ? status : "Chưa có phản ứng được ghi nhận.",
        ],
        ["Giải thích bản chất", l.explanation],
        ["Dự đoán cần kiểm chứng", l.phenomenon],
      ],
      [
        ["Ứng dụng", l.application],
        ["An toàn", l.safety],
        ["Giới hạn", l.limits],
      ],
    ];
    const blocks = pages[page],
      key = JSON.stringify([l.title, page, blocks]);
    if (key === this.lastText) return;
    this.lastText = key;
    const c = this.context;
    c.fillStyle = "#112f3c";
    c.fillRect(0, 0, 1536, 512);
    c.fillStyle = "#66d8b4";
    c.fillRect(0, 0, 12, 512);
    c.font = '600 43px "Be Vietnam Pro",sans-serif';
    c.fillStyle = "#f2fcfa";
    c.fillText(`Lớp ${l.grade}${l.curriculum?.verified===false?" (đề xuất)":""} · ${l.title}`, 48, 60, 1440);
    const paragraph = (text, y, height) => {
      let size = 32,
        lines;
      do {
        c.font = `400 ${size}px "Be Vietnam Pro",sans-serif`;
        lines = [];
        let line = "";
        for (const w of text.split(" ")) {
          if (c.measureText(line + w).width > 1440) {
            lines.push(line);
            line = "";
          }
          line += w + " ";
        }
        lines.push(line);
        if (lines.length * (size + 7) <= height || size <= 22) break;
        size -= 2;
      } while (true);
      c.fillStyle = "#e0eff1";
      lines.forEach((line, i) => c.fillText(line, 48, y + i * (size + 7)));
    };
    blocks.forEach(([label, content], i) => {
      const top = 101 + i * 137;
      c.font = '500 24px "Be Vietnam Pro",sans-serif';
      c.fillStyle = "#79d6bc";
      c.fillText(label, 48, top);
      paragraph(content, top + 38, 88);
    });
    this.texture.needsUpdate = true;
  }

  update(item, m, dt = 0.1) {
    const a = appearance(m);
    if (item.liquid) {
      item.liquid.material.color.fromArray(a.color);
      item.liquid.material.opacity = a.solid?.mol > 0 ? 0.9 : 0.25;
    }
    if (item.copperCoating) {
      item.copperCoating.material.opacity = Math.min(
        1,
        (m.mol.Cu || 0) / 0.001,
      );
      item.copperCoating.visible = (m.mol.Cu || 0) > 1e-9;
    }
    if (item.litmusMesh)
      item.litmusMesh.material.color.set(m.litmusBlue ? 0x456cdf : 0xcd435d);
  }

  contacts(objects, model) {
    const answer = { immersed: false, litmusAbove: null, sealed: new Set() };
    for (const [key, o] of objects) if (o.sealed) answer.sealed.add(key);
    if (model.lesson.id === "iron-copper") {
      const iron = objects.get("lesson-iron"),
        vessel = objects.get("lesson-copper");
      if (iron && vessel && !vessel.sealed && vessel.liquid?.visible) {
        iron.group.updateWorldMatrix(true, false);
        vessel.group.updateWorldMatrix(true, false);
        vessel.pourable.updatePose();
        const level = vessel.pourable.level;
        for (const y of [-0.72, -0.35, 0, 0.35, 0.7]) {
          const tip = new THREE.Vector3(0, y, 0).applyMatrix4(
            iron.group.matrixWorld,
          );
          vessel.group.worldToLocal(tip);
          if (
            tip.y > -0.68 &&
            tip.dot(vessel.pourable.normal) < level &&
            Math.hypot(tip.x, tip.z) < 0.6
          ) {
            answer.immersed = true;
            break;
          }
        }
      }
    }
    if (model.lesson.id === "ammonium") {
      const paper = objects.get("lesson-litmus"),
        vessel = objects.get("lesson-ammonium");
      if (paper && vessel && !vessel.sealed) {
        paper.group.updateWorldMatrix(true, false);
        vessel.group.updateWorldMatrix(true, false);
        const tip = new THREE.Vector3(0, 0.28, 0).applyMatrix4(
            paper.group.matrixWorld,
          ),
          mouth = this.view.mouth(vessel);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(
          vessel.group.quaternion,
        );
        if (
          up.y > 0.85 &&
          tip.y - mouth.y > 0.03 &&
          tip.y - mouth.y < 0.55 &&
          Math.hypot(tip.x - mouth.x, tip.z - mouth.z) < 0.4
        )
          answer.litmusAbove = "lesson-ammonium";
      }
    }
    return answer;
  }
  stop() {
    if (this.board) {
      this.view.scene.remove(this.board);
      this.board.geometry.dispose();
      this.board.material.dispose();
      this.texture.dispose();
      this.board = null;
    }
    this.lastText = "";
  }
}
