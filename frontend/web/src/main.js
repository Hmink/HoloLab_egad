import { filterCatalog } from "./catalog-browser.js";
import { EGAD } from "./egad.js";
import { renderAssessment } from "./egad-panel.js";
import { initMouseShell } from "../ui/shell.js";
import { mousePose } from "./mouse-motion.js";
import { readSpillLedger, addSpill } from "./spill-ledger.js";
import { ReactionHints } from "./reaction-hints.js";
import { StudentInteractionLogger } from "./student-logger.js";
import { ExperimentalTutor } from "./ai-tutor.js";
import { LiquidSimulation } from "./liquid-simulation.js";
import { withdraw } from "./pourable.js";
import { Lessons, lessonStocks } from "./lessons.js";
import { Bench } from "./bench.js";
import { setupReactionLibrary } from "./reaction-ui.js";
import { LabRenderer } from "./render3d.js";
import { HandCapture } from "./capture.js";
import { HandTracks, observation } from "./tracks.js";
import { Interaction, TRACKING_HOLD_MS } from "./interaction.js";
import { PourAssist } from "./pour-assist.js";
import { Metrics } from "./metrics.js";
import { containRect } from "./coordinates.js";
import { clamp } from "./filters.js";

const $ = (id) => document.getElementById(id);
const setText = (node, text) => {
  if (node.textContent !== text) node.textContent = text;
};
const message = (text) => setText($("message"), text);
const video = $("camera"),
  overlay = $("hands-overlay"),
  context = overlay.getContext("2d");
const metrics = new Metrics(),
  tracks = new HandTracks();
let bench, lessons, liquids, reactionHints;
const spillLedger = [];
const learningLogger = new StudentInteractionLogger(), tutor = new ExperimentalTutor();
let egad, egadRequest = 0;
let lastLearningFeedback = 0;
function learning(event) {
  const detail = { ...event, lesson: lessons?.model?.lesson.id,
    source: event.from ?? event.source, target: event.to ?? event.target,
    reaction: event.type === "reaction" ? event.id : event.reaction,
    quality: event.quality || "valid" };
  learningLogger.record(event.type, detail);
  egad?.observe(detail);
  if(event.type==="lesson-start"){egadRequest++;$("egad-local-result").replaceChildren();$("egad-local-status").textContent="";$("catalog-category").value="all";$("catalog-search").value="";renderAssessment($("egad-results"),null);}
  const now = performance.now();
  if (["spill", "pour", "reaction", "blocked", "answer", "tracking-gap", "lesson-start"].includes(event.type)) {
    const reply=tutor.advise(detail,lessons?.model?.lesson);
    const priority=["answer", "reaction", "blocked", "lesson-start"].includes(event.type);
    if ((reply.code !== "guide" || event.type === "lesson-start") && (priority || now-lastLearningFeedback>500)) {
      setText($("tutor-feedback"), reply.text);
      lastLearningFeedback=now;
    }
  }
}
let catalog,
  stocks,
  view,
  interaction,
  capture,
  selected = null,
  nextId = 1,
  group = "tool",
  page = 0,
  allowRisk = true;
let mouseMode = "move", historyUndo = [], historyRedo = [], restoringHistory = false;
function checkpoint(){ if(!restoringHistory){historyUndo.push(structuredClone(session()));if(historyUndo.length>30)historyUndo.shift();historyRedo=[];} }
async function historyStep(from,to){if(!from.length || restoringHistory || holdingAnything())return; const previous=from[from.length-1]; const current=structuredClone(session());restoringHistory=true;try{await loadSession(previous);from.pop();to.push(current);}finally{restoringHistory=false;}}
let mouse = null,
  mirror = true,
  epoch = 0,
  alertUntil = 0,
  last = performance.now(),
  lastUI = 0,
  lastQuality = 0,
  inputSource = "none";
let viewing = false,
  benchmarkNotice = false,
  lastInputTime = -1,
  latestResult = null,
  overlayDirty = true;
const pendingSettings = new Map();
// Hand assist (camera input only; mouse control is unchanged).
const pourAssist = new PourAssist(), assistPhase = new Map();
const SWAP_HANDEDNESS = { Left: "Right", Right: "Left" };
// Receivers held still (kinematic) while a vessel is being poured into them, so the source
// cannot push them over. Released shortly after the source leaves or is let go.
const protectedTargets = new Map(); // target id -> {target, source, until}
function protectTarget(target, source) {
  if (!target || target.mouseOwned || interaction.owners(target).length) return;
  if (!protectedTargets.has(target.id)) {
    view.physics.beginGrab(target);
    target.assistHeld = true;
  }
  protectedTargets.set(target.id, { target, source, until: Infinity });
}
function updateProtection(now) {
  for (const [id, p] of protectedTargets) {
    const sourceHeld = p.source.mouseOwned || interaction.owners(p.source).length > 0;
    const stillAligned = sourceHeld && pourAssist.states.get(p.source.id)?.target === id;
    if (stillAligned) { p.until = Infinity; continue; }
    if (p.until === Infinity) p.until = now + (sourceHeld ? 300 : 1500); // let a dropped source settle
    if (now >= p.until || !view.objects.includes(p.target)) {
      protectedTargets.delete(id);
      p.target.assistHeld = false; // the per-frame ownership sync releases it if nobody holds it
    }
  }
}
// Hands are less precise than a mouse: pick by distance to the vessel's axis on screen
// (base to mouth), so a pinch around the middle of a narrow tube still grabs it.
function handPick(point) {
  const hit = view.pick(point);
  if (hit) return hit;
  let best = null, bestDistance = HAND_PICK_PX;
  for (const item of view.objects) {
    const a = view.toScreen(item.group.position), b = view.toScreen(view.mouth(item));
    const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy || 1;
    const t = clamp(((point.x - a.x) * dx + (point.y - a.y) * dy) / len2, 0, 1);
    const d = Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
    if (d < bestDistance) { best = item; bestDistance = d; }
  }
  return best;
}
const HAND_PICK_PX = 70;
const ASSIST_RATE_ML_S = 1.5; // assisted stream: about one dose (2 mL) in 1.3 s
// A vessel let go while lined up over another one would drop onto it and tip over.
// Instead it glides back (still kinematic) to where it was picked up, then is released.
function setDownSafely(object) {
  const origin = object.grabOrigin;
  if (!origin) return false;
  object.assistHeld = true; // stays kinematic while it glides back
  view.physics.setTarget(object, { ...origin, y: origin.y + 0.05 }, 0, object.yaw, object.pitch);
  setTimeout(() => (object.assistHeld = false), 1200);
  message(`Đã thả tay khi ${object.stock.name} còn ở trên bình khác: bình được đặt lại chỗ cũ để không làm đổ.`);
  return true;
}
let handAssist = true;
try { handAssist = localStorage.getItem("hololab-hand-assist") !== "off"; } catch {}
function gripOffset(object) {
  // Grip a vessel around the middle of its height, so it hangs from the pinch like a real one.
  const height = (object.mouthY || 0.85) * (object.group?.scale?.y || 1);
  return { x: 0, y: -0.55 * height };
}
function assistPour(object, position, roll, pointer, now) {
  if (!object.pourable) return { position, roll };
  object.pourable.updatePose();
  const candidates = view.objects
    .filter((o) => o !== object && o.pourable && !o.sealed)
    .map((o) => {
      o.pourable.updatePose();
      return { id: o.id, name: o.stock.name, center: o.pourable.center, upright: o.pourable.axis.y,
        fill: o.mixture.volume_ml / Math.max(1e-9, o.stock.capacity_ml) };
    });
  const r = pourAssist.apply({
    source: { id: object.id, position: object.group.position, mouth: object.pourable.mouth,
      volume: object.mixture.volume_ml, flowing: object.pourable.flowMlPerSecond > 0 },
    candidates, position, roll, pointer, now, project: (p) => view.toScreen(p),
  });
  if (r.target) protectTarget(view.objects.find((o) => o.id === r.target.id), object);
  object.pourable.rateCap = r.phase === "pouring" ? ASSIST_RATE_ML_S : undefined;
  const previous = assistPhase.get(object.id);
  if (previous !== r.phase) {
    assistPhase.set(object.id, r.phase);
    if (r.phase === "aligned" && previous !== "pouring")
      message(`Đã căn miệng ${object.stock.name} trên ${r.target.name}. Giữ yên tay để rót; nhấc tay đi để dừng.`);
    else if (r.phase === "pouring") message(`Đang rót vào ${r.target.name}… Nhấc tay đi để dừng.`);
    else if (r.phase === "done")
      message(`Đã rót khoảng ${pourAssist.options.doseMl} mL vào ${r.target.name}. Nhích tay rồi giữ yên để rót thêm, hoặc nhấc bình ra.`);
    else if (r.phase === "full") message(`${r.target.name} đã gần đầy; dừng rót. Nhấc tay đi.`);
  }
  return r;
}
function setHandAssist(on) {
  handAssist = on;
  if (interaction) interaction.assist = on;
  pourAssist.enabled = on;
  pourAssist.reset();
  assistPhase.clear();
  try { localStorage.setItem("hololab-hand-assist", on ? "on" : "off"); } catch {}
  const box = $("hand-assist");
  if (box) box.checked = on;
}
let applyingSettings = false;
function holdingAnything() {
  return !!mouse || !!bench?.owner || [...interaction.hands.values()].some(h => h.object);
}
function queueSetting(name, value) {
  pendingSettings.set(name, value);
  setText($("settings-notice"), holdingAnything()
    ? "Đã nhận thay đổi. Thả bình để áp dụng cấu hình camera/tracking an toàn."
    : "Đang áp dụng cấu hình…");
  void flushSettings();
}
async function flushSettings() {
  if (applyingSettings || !pendingSettings.size || holdingAnything() || $("start-camera").disabled) return;
  applyingSettings = true;
  try {
    while (pendingSettings.size && !holdingAnything()) {
      const [name,value] = pendingSettings.entries().next().value;
      pendingSettings.delete(name);
      if (name === "backend") {
        interaction.reset(); tracks.reset(); lastInputTime = -1;
        await capture.switchBackend(value);
        latestResult = null;
      } else if (name === "camera") await capture.applyCameraQuality(value);
      else if (name === "size") capture.setInferenceWidth(value);
      else if (name === "mirror") {
        tracks.reset(); interaction.reset();
        mirror = value;
        video.style.transform = mirror ? "scaleX(-1)" : "none";
      }
    }
    setText($("settings-notice"), pendingSettings.size ? "Thay đổi tiếp theo sẽ áp dụng sau khi thả bình." : "Đã áp dụng cấu hình.");
  } catch (error) {
    setText($("settings-notice"), "Chưa áp dụng được: " + error.message);
  } finally { applyingSettings = false; }
}
const chemistryEvents = [],
  pending = new Set();
const solidDwell = new Map();
const edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [0, 17],
  [17, 18],
  [18, 19],
  [19, 20],
];

async function post(path, payload) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error || r.statusText);
  return data;
}
function download(name, data) {
  const a = document.createElement("a");
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
function stockIcon(kind) {
  const special={"solid":"M8 40L31 20L44 30L22 53Z", "iron-strip":"M22 5H28V59H22Z", "litmus":"M8 20H42V30H8Z M24 30V58", "balance":"M5 45H45V58H5Z M12 42H38V35H12Z M16 49H29V54H16Z", "lamp":"M14 32Q5 58 16 58H34Q45 58 36 32Z M22 32V24H28V32 M25 23Q14 13 25 4Q36 13 25 23"};
  if(special[kind])return `<svg viewBox="0 0 50 64" aria-hidden="true"><path d="${special[kind]}" fill="#99b7c8" stroke="#42667e" stroke-width="1.5"/></svg>`;
  const shape =
    kind === "flask"
      ? "M18 5 L32 5 L32 21 L44 54 Q45 58 40 58 L10 58 Q5 58 6 54 L18 21 Z"
      : kind === "tube"
        ? "M17 5 L33 5 L33 48 Q33 59 25 59 Q17 59 17 48 Z"
        : kind === "dropper"
          ? "M21 20 L29 20 L28 49 L25 59 L22 49 Z"
          : kind === "beaker"
            ? "M8 7 L42 7 L41 54 Q41 58 36 58 L14 58 Q9 58 9 54 Z"
            : "M20 5 L30 5 L30 16 L39 23 L39 54 Q39 58 34 58 L16 58 Q11 58 11 54 L11 23 L20 16 Z";
  return `<svg viewBox="0 0 50 64" aria-hidden="true"><path d="${shape}" fill="#65cdd81c" stroke="#a8dbe5" stroke-width="1.5"/><path d="M15 35H35 M15 43H35 M15 50H35" stroke="#5cbfc6" opacity=".6"/></svg>`;
}
function renderCards() {
  const filtered = filterCatalog(catalog.stocks, {allowed:lessons?.active?lessons.allowed:null,category:$("catalog-category")?.value||"all",query:$("catalog-search")?.value||""}),
    pages = Math.max(1, Math.ceil(filtered.length / 24));
  page = (page + pages) % pages;
  $("cards").replaceChildren();
  for (const stock of filtered.slice(page * 24, page * 24 + 24)) {
    const button = document.createElement("button");
    button.className = "card";
    button.dataset.stock = stock.id;
    button.innerHTML =
      stockIcon(stock.kind) +
      '<div><strong></strong><div class="formula"></div><div class="hazard"></div></div>';
    button.querySelector("strong").textContent = stock.name;
    button.querySelector(".formula").textContent = stock.formula;
    button.title = `${stock.name} · ${stock.formula}`;
    if (stock.group === "risk")
      button.querySelector(".hazard").textContent = "Minh họa định tính";
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const p = { x: event.clientX, y: event.clientY };
      const obj = spawn(stock.id, p);
      beginMouse(obj, p, true);
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener("focus", () => reactionHints?.show(stock,lessons?.model?.lesson.id));
    $("cards").appendChild(button);
  }
  setText($("page-label"), `Trang ${page + 1}/${pages}`);
  document
    .querySelectorAll("[data-group]")
    .forEach((b) => b.classList.toggle("active", b.dataset.group === group));
}
function action(name) {
  if (["tool", "chemical", "risk-tab"].includes(name)) {
    group = name === "risk-tab" ? "risk" : name;
    page = 0;
    $("catalog-category").value = name === "tool" ? "vessels" : name === "chemical" ? "liquids" : "risk";
    renderCards();
    return;
  }
  if (name === "prev" || name === "next") {
    page += name === "prev" ? -1 : 1;
    renderCards();
    return;
  }
  if (name === "risk") {
    allowRisk = !allowRisk;
    setText(
      $("risk-mode"),
      allowRisk
        ? "Tự do · Hiệu ứng minh họa"
        : "Hướng dẫn · Chặn nguy cơ đã biết",
    );
  }
}
function pick(point) {
  if (bench?.active || applyingSettings) return null;
  const element = document.elementFromPoint(point.x, point.y);
  const card = element?.closest("[data-stock]");
  if (card) return { type: "inventory", stock: card.dataset.stock };
  const tab = element?.closest("[data-group]");
  if (tab)
    return {
      type: "action",
      action: tab.dataset.group === "risk" ? "risk-tab" : tab.dataset.group,
    };
  const button = element?.closest("[data-action]");
  if (button) return { type: "action", action: button.dataset.action };
  const object = handAssist ? handPick(point) : view.pick(point);
  return object ? { type: "object", object } : null;
}
function createObject(stockId, position, options = {}) {
  if (lessons?.active && !lessons.canSpawn(stockId)) {
    message("Hóa chất này không thuộc bài học hiện tại.");
    return null;
  }
  if (view.objects.length >= 16) {
    message("Bàn đã có 16 vật thể. Bỏ mẫu cũ trước khi lấy thêm.");
    return null;
  }
  const stock = stocks.get(stockId);
  if (!stock) throw new Error("Hóa chất/dụng cụ chưa có trong danh mục");
  const item = {
    id: options.id || nextId++,
    stock,
    lessonKey: stock.id.startsWith("lesson-") ? stock.id : null,
    mixture: structuredClone(options.mixture || stock.mixture),
    target: view.clampPosition(position),
    roll: options.roll || 0,
    yaw: options.yaw || 0,
    pitch: options.pitch || 0,
    sealed: options.sealed || false,
    version: 0,
    mouseOwned: false,
  };
  nextId = Math.max(nextId, item.id + 1);
  view.add(item);
  item.label = document.createElement("div");
  item.label.className = "object-label";
  item.label.innerHTML = "<b></b><span></span>";
  item.label.querySelector("b").textContent = `#${item.id} ${stock.name}`;
  $("labels").appendChild(item.label);
  refreshMixture(item);
  select(item);
  $("empty").hidden = true;
  return item;
}
function spawn(stockId, point) {
  if (lessons?.active) return lessons.objects.get(stockId) || null;
  checkpoint();
  let item;
  try {
    item = createObject(stockId, view.toWorld(point, 0));
  } catch (error) {
    message(error.message);
    return null;
  }
  if (item)
    message(`Đã lấy ${item.stock.name}. Giữ chuột để kéo, thả chuột để đặt.`);
  return item;
}
function select(item) {
  selected = item;
  if (item) learning({type:"select", source:item.id, stock:item.stock.id});
  reactionHints?.show(item?.stock, lessons?.model?.lesson.id);
  for (const o of view.objects) {
    o.ring.visible = o === item;
    o.label.classList.toggle("selected", o === item);
  }
  inspector();
}
function refreshMixture(item) {
  view.updateMixture(item);
  item.label.querySelector("span").textContent = item.mixture.qualitative
    ? "định tính"
    : item.stock.kind === "solid"
      ? `${item.mixture.solid_copper_g.toFixed(2)} g`
      : `${item.mixture.volume_ml.toFixed(1)} mL`;
  inspector();
}
function inspector() {
  const lessonDescription = lessons?.describe(selected);
  if (lessonDescription) {
    setText($("object-name"), lessonDescription.name);
    setText($("object-metrics"), lessonDescription.metrics);
    setText($("object-species"), lessonDescription.species);
    return;
  }
  if (!selected) {
    setText($("object-name"), "Chưa chọn dụng cụ");
    setText(
      $("object-metrics"),
      "Chọn bình để xem lượng chất, nhiệt độ và trạng thái mô hình.",
    );
    setText($("object-species"), "");
    return;
  }
  const o = selected,
    m = o.mixture;
  const state = m.qualitative
    ? "Minh họa định tính"
    : m.unknown
      ? "Chưa xác định"
      : "Mô hình có giới hạn";
  setText($("object-name"), `#${o.id} ${o.stock.name} · ${state}`);
  const temp =
    m.temperature_K === null
      ? "T: chưa có mô hình"
      : `T ≈ ${(m.temperature_K - 273.15).toFixed(2)} °C`;
  setText(
    $("object-metrics"),
    `${m.qualitative ? "Thể tích minh họa" : `V: ${m.volume_ml.toFixed(1)}/${o.stock.capacity_ml} mL`} · ${temp} · Góc ${Math.round((o.roll * 180) / Math.PI)}° · z ${o.target.z.toFixed(2)} · Nắp ${o.sealed ? "đóng" : "mở"}`,
  );
  const amounts = Object.entries(m.mol)
    .filter(([key, n]) => n > 1e-9 && key !== "H2O")
    .map(
      ([k, n]) =>
        `${catalog.species[k].formula}: ${(n * 1000).toFixed(2)} mmol`,
    );
  amounts.push(
    ...Object.entries(m.escaped_mol)
      .filter(([, n]) => n > 1e-9)
      .map(
        ([k, n]) =>
          `${catalog.species[k].formula} đã thoát: ${(n * 1000).toFixed(2)} mmol`,
      ),
  );
  setText($("object-species"), amounts.join(" | ") || m.note);
}
function move(object, position, roll, yaw, pitch) {
  view.physics.setTarget(
    object,
    view.clampPosition(position),
    roll,
    yaw,
    pitch,
  );
}
function park(object, reason) {
  const overReceiver = handAssist && pourAssist.states.get(object.id)?.target != null;
  pourAssist.reset(object.id);
  assistPhase.delete(object.id);
  if (object.pourable) object.pourable.rateCap = undefined;
  // The remaining hand still owns a shared object; only the last release makes it dynamic.
  if (!object.mouseOwned && interaction.owners(object).length === 0) {
    if (overReceiver && setDownSafely(object)) return;
    view.physics.release(object, reason === "gesture");
  }
  if (reason !== "gesture") message("Đã thả bình; mở tay rồi gắp lại.");
}
function beginMouse(object, p, isNew = false, mode = mouseMode, pointerId = null) {
  if (!object || interaction.owners(object).length || viewing || applyingSettings) return;
  if (mouse) return;
  if (!isNew) checkpoint();
  view.physics.beginGrab(object);
  const at = view.toWorld(p, object.target.z);
  mouse = {
    object, mode: isNew ? "move" : mode, pointerId,
    start: {x:p.x,y:p.y,position:{...object.target},roll:object.roll,yaw:object.yaw,pitch:object.pitch},
    offset: isNew
      ? { x: 0, y: 0 }
      : { x: object.target.x - at.x, y: object.target.y - at.y },
  };
  mouse.start.offset = mouse.offset;
  object.mouseOwned = true;
  select(object);
}
function endMouse() {
  if (mouse) {
    mouse.object.mouseOwned = false;
    park(mouse.object, "gesture");
    view.rack?.snap(mouse.object);
  }
  mouse = null;
}
function clearDesk() {
  lessons?.detach();
  $("alert").hidden = true;
  alertUntil = 0;
  epoch++;
  interaction.reset();
  tracks.reset();
  endMouse();
  for (const o of [...view.objects]) {
    view.remove(o);
    o.label.remove();
  }
  selected = null;
  nextId = 1;
  view.clearSpills();
  spillLedger.length = 0;
  solidDwell.clear();
  inspector();
  $("empty").hidden = false;
  reactionHints?.show(null);
}
function removeSelected() {
  if (lessons?.active) {
    message("Dùng Làm lại bài để chuẩn bị lại đúng bộ dụng cụ.");
    return;
  }
  if (!selected || bench.active) return;
  const item = selected;
  interaction.owners(item).forEach((h) => interaction.release(h, "delete"));
  if (mouse?.object === item) endMouse();
  chemistryEvents.push({
    type: "discard",
    id: item.id,
    mixture: item.mixture,
    t: performance.now(),
  });
  view.remove(item);
  item.label.remove();
  selected = null;
  inspector();
  $("empty").hidden = view.objects.length > 0;
}
function warning(text, now) {
  const el = $("alert");
  el.replaceChildren();
  const title = document.createElement("strong");
  title.textContent = "TÌNH HUỐNG NGUY HIỂM · MINH HỌA";
  el.append(title, document.createTextNode(text));
  el.hidden = false;
  alertUntil = now + 6500;
}
async function pour(source, target, _manual = false, amount = null) {
  amount ??= lessons?.active ? 2 : source.stock.kind === "dropper" ? 0.2 : 10;
  if (lessons?.active) return lessons.pour(source, target, amount);
  if (pending.has(source.id) || pending.has(target.id)) return;
  const expectedEpoch = epoch,
    aVersion = source.version,
    bVersion = target.version;
  pending.add(source.id);
  pending.add(target.id);
  const serialize = (o) => ({
    id: o.id,
    stock: o.stock.id,
    mixture: o.mixture,
    sealed: o.sealed,
  });
  try {
    const data = await post("/api/transfer", {
      source: serialize(source),
      target: serialize(target),
      allow_risk: allowRisk,
      amount_ml: amount,
    });
    const now = performance.now();
    if (
      epoch !== expectedEpoch ||
      !view.objects.includes(source) ||
      !view.objects.includes(target) ||
      aVersion !== source.version ||
      bVersion !== target.version
    )
      return;
    // Commit the reserved aliquot atomically even if the hand changes while HTTP is in flight.
    message(data.message);
    if (!data.ok) {
      if (data.message.includes("chặn")) warning(data.message, now);
      learning({type:"blocked",source:source.stock.id,target:target.stock.id,reason:data.message});
      return data;
    }
    source.mixture = data.source;
    target.mixture = data.target;
    source.version++;
    target.version++;
    refreshMixture(source);
    refreshMixture(target);
    view.stream(source, target, now + 300);
    if (data.effect) {
      view.effect(target, data.effect, now);
      if (data.effect !== "bubbles") warning(data.message, now);
    }
    chemistryEvents.push({
      t: now,
      source: source.id,
      target: target.id,
      effect: data.effect,
      reaction: data.reaction_id,
      amount_ml: data.target.qualitative ? null : data.amount_ml,
      generated_mol: data.generated_mol,
      message: data.message,
    });
    learning({type:source.stock.kind === "solid" ? "solid-add" : "pour",source:source.stock.id,target:target.stock.id,amount_ml:data.amount_ml});
    if(data.reaction_id)learning({type:"reaction",id:data.reaction_id,source:source.stock.id,target:target.stock.id});
    if (chemistryEvents.length > 3000) chemistryEvents.shift();
    return data;
  } catch (error) {
    message(`Không rót được: ${error.message}`);
  } finally {
    pending.delete(source.id);
    pending.delete(target.id);
  }
}
function spill(source, amount, target, now) {
  const packet = withdraw(source.mixture, amount);
  if (!packet.volume_ml) return;
  source.version++;
  source.pourable.spilledMl += packet.volume_ml;
  const pos = source.pourable.mouth.clone();
  pos.y = view.physics.table.top + 0.015;
  if (target) pos.x += target.pourable.rimRadius * target.group.scale.x;
  view.puddle(pos, packet.volume_ml, source.mixture.color);
  const reason = target ? "overflow" : "missed-opening";
  learning({type:"spill", source:source.lessonKey || source.id,target:target?.lessonKey || target?.id || null,reason,amount_ml:packet.volume_ml});
  addSpill(spillLedger, source.id, target?.id ?? null, reason, packet);
  if (lessons.active) { lessons.refresh(source); lessons.update(); }
  else refreshMixture(source);
  message(target ? "Bình nhận đã đầy: phần dư tràn ra bàn." : "Dung dịch đã rót ra bàn. Đưa miệng nguồn lên đúng miệng bình nhận.");
}

// Preserve V3.4's discrete solid-sample placement independently of liquid flow.
function transferSolidSamples(now) {
  for (const item of view.objects) {
    if (item.stock.kind !== "solid") continue;
    const eligible = item.mouseOwned || interaction.validOwners(item, now);
    const target = eligible && item.mixture.solid_copper_g > 1e-9 ? view.pourTarget(item) : null;
    if (!target) { solidDwell.delete(item.id); continue; }
    let state = solidDwell.get(item.id);
    if (!state || state.target !== target.id) {
      state = {target:target.id,since:now,last:-Infinity};
      solidDwell.set(item.id,state);
    }
    if (now-state.since >= 300 && now-state.last >= 550) {
      state.last=now;
      void pour(item,target);
    }
  }
}

function result(data) {
  const now = performance.now();
  data.ageMs = Math.max(0, performance.timeOrigin + now - data.capturedAt);
  metrics.track(now, data);
  latestResult = data;
  if (viewing || data.ageMs > 400) {
    if (bench?.active) bench.release();
    return;
  }
  const aspect =
    (data.width || video.videoWidth) /
      Math.max(1, data.height || video.videoHeight) || 16 / 9;
  // Worker input is mirrored. Toggle display only by reflecting those points once.
  // Field test (real webcam, 11/2026): MediaPipe's Left/Right came out swapped for this
  // pipeline, so swap the label here; landmarks are untouched.
  const observations = data.hands.map((h) =>
    observation(h.landmarks, SWAP_HANDEDNESS[h.label] || h.label, h.score, aspect, !mirror),
  );
  const inputTime = data.timestamp;
  if (inputTime <= lastInputTime) return;
  lastInputTime = inputTime;
  tracks.update(observations, inputTime);
  for(const tr of tracks.tracks) {
    const uncertain=!tr.observed || tr.ambiguous;
    if(uncertain !== tr.loggedUncertain) {
      if(uncertain) learning({type:"tracking-gap",hand:tr.id,quality:"cv_uncertain"});
      else if(tr.loggedUncertain)learning({type:"tracking-restored",hand:tr.id,quality:"cv_uncertain"});
      tr.loggedUncertain=uncertain;
    }
  }
  if (bench.active) {
    bench.process(tracks.tracks, inputTime, now, interaction.margin);
    for (const tr of tracks.tracks) {
      const h = interaction.stateFor(tr);
      h.track = tr;
      h.lastReceived = now;
      h.lastValid = inputTime;
      h.pointer = {
        x:
          clamp(
            (tr.pose.x - interaction.margin) / (1 - 2 * interaction.margin),
            0,
            1,
          ) * innerWidth,
        y:
          clamp(
            (tr.pose.y - interaction.margin) / (1 - 2 * interaction.margin),
            0,
            1,
          ) * innerHeight,
      };
    }
  } else interaction.update(tracks.tracks, inputTime, now);
  overlayDirty = true;
}
function drawOverlay(now) {
  context.clearRect(0, 0, innerWidth, innerHeight);
  if (viewing) return;
  const r = video.getBoundingClientRect(),
    fit = containRect(
      r.width,
      r.height,
      video.videoWidth || 1280,
      video.videoHeight || 720,
    );
  for (const h of interaction.hands.values()) {
    const index = h.track.slot;
    const age = now - h.lastReceived;
    if (age > TRACKING_HOLD_MS && !h.object) continue;
    const visualGrace = Math.min(
      500,
      Math.max(180, 1600 / Math.max(1, metrics.hz(now))),
    );
    const color = index === 0 ? "#65e5c3" : "#f8bf6c";
    const visible = h.track.observed && !h.track.ambiguous && age < visualGrace;
    if (visible) {
      context.strokeStyle = color;
      context.lineWidth = 1.5;
      context.globalAlpha = 0.62;
      for (const [a, b] of edges) {
        const p = h.track.pose.points[a],
          q = h.track.pose.points[b];
        context.beginPath();
        context.moveTo(
          r.left + fit.x + p.x * fit.width,
          r.top + fit.y + p.y * fit.height,
        );
        context.lineTo(
          r.left + fit.x + q.x * fit.width,
          r.top + fit.y + q.y * fit.height,
        );
        context.stroke();
      }
    }
    if (handAssist && visible && h.pointer && !h.object) {
      // Show which vessel a pinch here would grab.
      const hit = pick(h.pointer);
      if (hit?.type === "object") {
        const a = view.toScreen(hit.object.group.position), b = view.toScreen(view.mouth(hit.object));
        context.globalAlpha = 0.35;
        context.strokeStyle = color;
        context.lineCap = "round";
        context.lineWidth = 22;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
        context.lineCap = "butt";
      }
    }
    if (h.pointer) {
      context.globalAlpha = visible ? 1 : 0.45;
      context.strokeStyle = color;
      context.lineWidth = h.object ? 3 : 2;
      const p = h.pointer;
      context.beginPath();
      context.arc(p.x, p.y, h.object ? 13 : 10, 0, Math.PI * 2);
      context.stroke();
      if (visible) {
        context.fillStyle = h.object ? color : "#ffd06e";
        context.beginPath();
        context.arc(p.x, p.y, 3, 0, Math.PI * 2);
        context.fill();
      }
      context.font = "bold 11px Segoe UI,Arial";
      context.fillStyle = color;
      context.fillText(index === 0 ? "A" : "B", p.x + 14, p.y - 10);
    }
  }
  context.globalAlpha = 1;
}
function updateUI(now) {
  const hands = [...interaction.hands.values()];
  for (let i = 0; i < 2; i++) {
    const h = hands.find((h) => h.track.slot === i),
      node = $(i === 0 ? "hand-a" : "hand-b"),
      id = i === 0 ? "A" : "B";
    if (!h || (now - h.lastReceived > TRACKING_HOLD_MS && !h.object)) {
      setText(node, `Tay ${id} · chưa nhận diện`);
      continue;
    }
    const sameLabel = hands.some(other => other !== h && other.track.observed &&
      h.track.observed && other.track.label === h.track.label);
    const label =
      h.track.label === null || sameLabel
        ? "đang xác định"
        : h.track.label === "Left"
          ? "Trái"
          : "Phải";
    const status = h.track.ambiguous
      ? (h.object ? "giao tay · tạm giữ" : "giao tay · chưa gắp")
      : h.missing || now - h.lastReceived > 500
        ? (h.object ? `mất dấu · thả sau ${Math.max(0, (TRACKING_HOLD_MS - (now-h.lastConfirmed))/1000).toFixed(1)} s` : "mất dấu · đã thả")
        : now - h.lastValid > 300
          ? "mẫu chậm · tạm dừng rót"
          : {
              IDLE: "Đã nhận diện",
              HOVER: "Trên dụng cụ",
              GRABBING: "Đang gắp",
              PINCH_START: "Đang xác nhận gắp",
              DRAGGING: "Đang di chuyển",
              ROTATING: "Đang xoay",
              RELEASING: "Đang thả",
              RELEASED: "Đã thả",
            }[h.state] || h.state;
    setText(
      node,
      `Tay ${id} · ${label} · ${status}${h.object ? ` · ${h.object.stock.name}` : ""}`,
    );
  }
  setText(
    $("hand-technical"),
    hands
      .map(
        (h) =>
          `Tay ${h.track.slot === 0 ? "A" : "B"}: ${h.state}, pinch ${h.track.pose.ratio.toFixed(2)}, vật ${h.object?.id || "—"}`,
      )
      .join(" | "),
  );
  setText(
    $("lab-title"),
    bench.active
      ? "Chuẩn độ axit–bazơ"
      : lessons?.model?.lesson.title || "Bàn thí nghiệm 3D",
  );
  setText($("render-fps"), `${metrics.fps(now).toFixed(0)} FPS render`);
  setText(
    $("track-fps"),
    `Tracking: ${metrics.hz(now).toFixed(1)} Hz · ${capture.delegate || "chưa bật"}`,
  );
  setText(
    $("latency"),
    `Tuổi mẫu hiện tại: ${latestResult ? Math.round(Math.max(0,performance.timeOrigin+now-latestResult.capturedAt)) : "—"} ms · DPR ${view.pixelRatio.toFixed(2)}`,
  );
  const cam = capture.cameraReport();
  setText(
    $("camera-resolution"),
    video.srcObject
      ? `${cam.settings.width || cam.video_width}×${cam.settings.height || cam.video_height} · ${Math.round(cam.settings.frameRate || 0)} FPS camera · ảnh CV ${cam.input_width || "—"}×${cam.input_height || "—"}${cam.note ? " · " + cam.note : ""}`
      : "Camera chưa bật / video đầu vào",
  );
  if (!holdingAnything() && !applyingSettings) capture.adaptCamera(now, {
    fps: metrics.fps(now),
    inferenceMs: latestResult?.inferenceMs || 0,
    ageMs: latestResult?.ageMs || 0,
  });
  const lastFrame = metrics.renders.at(-1), prevFrame = metrics.renders.at(-2);
  setText($("pipeline-metrics"), `Lấy ảnh ${cam.transport || "—"}: ${latestResult?.captureMs?.toFixed(1) ?? "—"} ms · Chờ Worker: ${latestResult?.queueMs?.toFixed(1) ?? "—"} ms · Chuẩn bị ảnh: ${latestResult?.preprocessMs?.toFixed(1) ?? "—"} ms · MediaPipe: ${latestResult?.modelMs?.toFixed(1) ?? "—"} ms · Frame render: ${lastFrame && prevFrame ? (lastFrame.t-prevFrame.t).toFixed(1) : "—"} ms · Xác nhận cử chỉ gần nhất: ${metrics.gestures.at(-1)?.debounceMs?.toFixed(0) ?? "—"} ms · Physics: bước 120 Hz (thời gian mô phỏng) · Giới hạn tracking ${capture.maxHz} Hz, camera ${Math.round(cam.settings.frameRate || 0)} FPS. Độ trễ đầu–cuối: chưa đo.`);
  inspector();
  if (metrics.current) {
    const remain = Math.max(0, 60 - (now - metrics.current.start) / 1000);
    setText($("benchmark"), `Đang đo · ${remain.toFixed(0)} s`);
    benchmarkNotice = true;
  } else if (benchmarkNotice) {
    benchmarkNotice = false;
    setText($("benchmark"), "Đo 60 giây");
    message(
      `Đã đo: ${metrics.lastReport.render_fps.toFixed(1)} FPS render, ${metrics.lastReport.tracking_hz.toFixed(1)} Hz tracking. Xuất kết quả để lưu.`,
    );
  }
}
function tick(now) {
  requestAnimationFrame(tick);
  const start = performance.now(),
    realDt = Math.max(0, (now - last) / 1000),
    dt = Math.min(0.1, realDt);
  last = now;
  interaction.sweep(now);
  updateProtection(now);
  void flushSettings();

  bench.tick(dt, now);
  for (const item of view.objects) {
    const owners = interaction.owners(item);
    // assistHeld: hand assist keeps a receiver still while pouring, or sets a vessel down.
    const held = item.mouseOwned || owners.length > 0 || !!item.assistHeld;
    const valid =
      item.mouseOwned || (!!item.assistHeld && owners.length === 0) ||
      owners.every(
        (h) =>
          h.track.observed &&
          !h.track.ambiguous &&
          !h.missing &&
          now - h.lastReceived < 500,
      );
    view.physics.ownership(item, held, valid);
  }
  view.physics.step(realDt, bench.active);
  if (!bench.active) {
    liquids.tick(dt, now);
    transferSolidSamples(now);
  }
  lessons?.tick(dt, now);
  view.render(dt, now);
  if (lessons?.active) lessons.positionLabels();
  else
    for (const item of view.objects) {
      const p = view.toScreen(item.group.position),
        transform = `translate(${clamp(p.x - view.rect.left, 125, view.rect.width - 125).toFixed(1)}px,${clamp(p.y - view.rect.top + 65, 40, view.rect.height - 55).toFixed(1)}px) translateX(-50%)`;
      if (item.labelTransform !== transform) {
        item.label.style.transform = transform;
        item.labelTransform = transform;
      }
    }
  if (overlayDirty) {
    drawOverlay(now);
    overlayDirty = false;
  }
  if (now - lastUI > 150) {
    updateUI(now);
    lastUI = now;
    overlayDirty = true;
  }
  if (!$("alert").hidden && now > alertUntil) $("alert").hidden = true;
  if (now - lastQuality > 3000 && $("quality").value === "auto") {
    const fps = metrics.fps(now);
    let ratio = view.pixelRatio;
    if (fps > 0 && fps < 50) ratio = Math.max(0.65, ratio - 0.1);
    else if (fps > 57) ratio = Math.min(1, ratio + 0.05);
    view.quality(ratio);
    lastQuality = now;
  }
  metrics.render(now, performance.now() - start, view.physics.lastStepCost);
}
function resize() {
  view.resize();
  lessons?.visuals.resize();
  overlay.width = innerWidth;
  overlay.height = innerHeight;
  interaction.width = innerWidth;
  interaction.height = innerHeight;
  overlayDirty = true;
  // Rebase on the next valid observation instead of jumping after a viewport change.
  interaction.rebaseOnNextSample();
  for (const item of view.objects)
    if (view.physics.entries.get(item.id)?.held)
      view.physics.setTarget(item, view.clampPosition(item.target));
}
async function loadSession(raw) {
  const spills = readSpillLedger(raw?.spills);
  const rackIds=raw?.rack_ids ?? [];
  if(!Array.isArray(rackIds)||rackIds.length>3||rackIds.some(id=>!Number.isInteger(id)||id<1))throw Error("Dữ liệu giá đỡ không hợp lệ.");
  const restoreRack=()=>{for(const id of rackIds){const o=view.objects.find(o=>o.id===id);if(o)view.rack.snap(o);}};
  if (raw?.schema === "hololab-lesson-1") {
    lessons.start(raw.model?.lesson, raw);
    spillLedger.splice(0, spillLedger.length, ...spills);
    restoreRack();
    return;
  }
  const data = await post("/api/session", raw);
  clearDesk();
  spillLedger.splice(0, spillLedger.length, ...spills);
  allowRisk = data.allow_risk;
  for (const row of data.objects) {
    const pos =
      row.position ||
      view.toWorld(
        {
          x: view.rect.left + row.normalized.x * view.rect.width,
          y: view.rect.top + row.normalized.y * view.rect.height,
        },
        0,
      );
    createObject(row.stock, pos, row);
  }
  restoreRack();
  chemistryEvents.splice(0, chemistryEvents.length, ...data.events);
  setText(
    $("risk-mode"),
    allowRisk
      ? "Tự do · Hiệu ứng minh họa"
      : "Hướng dẫn · Chặn nguy cơ đã biết",
  );
  message("Đã mở phiên. Vị trí được giữ trong vùng bàn nhìn thấy.");
}
function session() {
  const rack_ids=view.objects.filter(o=>o.rackSlot!=null).map(o=>o.id);
  if (lessons?.active) return {...lessons.snapshot(), spills: structuredClone(spillLedger),rack_ids};
  return {
    schema: "hololab3-session-1",
    rack_ids,
    allow_risk: allowRisk,
    objects: view.objects.map((o) => ({
      id: o.id,
      stock: o.stock.id,
      mixture: o.mixture,
      position: o.target,
      roll: o.roll,
      yaw: o.yaw,
      pitch: o.pitch,
      sealed: o.sealed,
    })),
    events: chemistryEvents,
    spills: structuredClone(spillLedger),
  };
}
function bind() {
  document
    .querySelectorAll("[data-group]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          action(b.dataset.group === "risk" ? "risk-tab" : b.dataset.group)),
    );
  document
    .querySelectorAll("[data-action]")
    .forEach((b) => (b.onclick = () => action(b.dataset.action)));
  $("start-camera").onclick = async () => {
    $("start-camera").disabled = true;
    try {
      interaction.reset();
      tracks.reset();
      if (!(await capture.start())) return;
      document.body.classList.add("camera-on");
      inputSource = "webcam";
      lastInputTime = -1;
      message("Camera đã bật. Chụm cái và trỏ trên một thẻ để gắp.");
    } catch (error) {
      await capture.stopVideo();
      message(error.message);
    } finally {
      $("start-camera").disabled = false;
    }
  };
  $("stop-camera").onclick = () => {
    document.body.classList.remove("camera-on");
    capture.stopVideo();
    interaction.parkAll("camera-stop");
    tracks.reset();
    inputSource = "none";
  };
  $("video-input").onclick = () => $("video-file").click();
  $("video-file").onchange = async (e) => {
    if (!e.target.files[0]) return;
    try {
      interaction.reset();
      tracks.reset();
      await capture.start(e.target.files[0]);
      inputSource = "video";
      lastInputTime = -1;
      message("Đang xử lý video đã chọn, không phải webcam trực tiếp.");
    } catch (error) {
      message(error.message);
    }
  };
  $("fullscreen").onclick = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  $("help-button").onclick = () => $("help").showModal();
  $("close-help").onclick = () => $("help").close();
  $("mirror").onchange = (e) => {
    queueSetting("mirror", e.target.checked);
  };
  $("reach").onchange = (e) => {
    interaction.margin = Number(e.target.value);
    interaction.rebaseOnNextSample();
  };
  $("pinch").oninput = (e) => {
    interaction.setThreshold(Number(e.target.value));
    setText(
      $("pinch-value"),
      `${interaction.close.toFixed(2)} / ${interaction.open.toFixed(2)}`,
    );
  };
  $("quality").onchange = (e) => {
    if (e.target.value !== "auto") view.quality(Number(e.target.value));
  };
  $("tracking-backend").onchange = (e) => {
    queueSetting("backend", e.target.value);
  };
  $("gesture-mode").onchange = (e) => {
    interaction.setMode(e.target.value);
  };
  $("park").onclick = () => {
    interaction.parkAll();
    endMouse();
  };
  $("clear").onclick = () => {
    clearDesk();
    message("Bàn trống. Lấy dụng cụ mới từ kho.");
  };
  $("view-mode").onclick = () => {
    interaction.parkAll("view");
    endMouse();
    viewing = !viewing;
    view.controls.enabled = viewing;
    if (!viewing) {
      view.camera.position.set(0, 0, view.homeCameraZ);
      view.controls.target.set(0, 0, 0);
      view.controls.update();
      view.camera.updateMatrixWorld();
    }
    setText($("view-mode"), viewing ? "Trở lại điều khiển" : "Xem góc 3D");
    message(
      viewing
        ? "Đang xem góc 3D bằng chuột; cử chỉ tạm dừng."
        : "Đã trở lại góc thao tác.",
    );
  };
  $("save").onclick = () =>
    download("HoloLab_phien_thi_nghiem.json", session());
  $("load").onclick = () => $("session-file").click();
  $("session-file").onchange = async (e) => {
    if (e.target.files[0])
      try {
        await loadSession(JSON.parse(await e.target.files[0].text()));
      } catch (error) {
        message(`Không mở phiên: ${error.message}`);
      }
    e.target.value = "";
  };
  $("experiment").onchange = async (e) => {
    if (e.target.value)
      try {
        await loadSession(
          await (await fetch(`/api/experiment/${e.target.value}`)).json(),
        );
      } catch (error) {
        message(error.message);
      }
    e.target.value = "";
  };
  $("benchmark").onclick = () => {
    if (metrics.current) return;
    metrics.begin(performance.now(), {
      version: "3.5.0",
      input_source: inputSource,
      delegate: capture.delegate || null,
      width: innerWidth,
      height: innerHeight,
      user_agent: navigator.userAgent,
      quality: $("quality").value,
      initial_dpr: view.pixelRatio,
      objects: view.objects.length,
      titration: bench.active,
      camera_settings: capture.cameraReport(),
      physics_engine: "Rapier 0.17.3",
      physics_step_s: 1 / 120,
      inference_width: capture.inferenceWidth,
      tracking_cap_hz: capture.maxHz,
    });
  };
  $("export-metrics").onclick = () => {
    if (!metrics.lastReport) {
      message("Chưa có kết quả. Bật camera và nhấn Đo 60 giây trước.");
      return;
    }
    download("HoloLab_benchmark.json", {
      ...metrics.lastReport,
      final_dpr: view.pixelRatio,
      physics_engine: "Rapier 0.17.3",
      physics_step_s: 1 / 120,
      camera: capture.cameraReport(),
      gesture_events: interaction.events,
    });
  };
  const canvas = view.renderer.domElement;
  canvas.addEventListener("contextmenu", e => { if(!viewing)e.preventDefault(); });
  canvas.addEventListener("pointerdown", e => {
    if (![0,2].includes(e.button) || bench.active || viewing || mouse) return;
    const p={x:e.clientX,y:e.clientY}, object=view.pick(p);
    if(object){ e.preventDefault();beginMouse(object,p,false,e.button===2?"rotate":mouseMode,e.pointerId);if(mouse)canvas.setPointerCapture(e.pointerId); }
  });
  addEventListener("pointermove", e => {
    if(!mouse || (mouse.pointerId!==null && mouse.pointerId!==e.pointerId))return;
    const o=mouse.object, p={x:e.clientX,y:e.clientY};
    const pose=mousePose(mouse.mode,mouse.start,p,view.toWorld(p,mouse.start.position.z));
    move(o,pose.position,pose.roll,pose.yaw,pose.pitch);
  });
  const finishPointer=e=>{if(mouse && (mouse.pointerId===null || mouse.pointerId===e.pointerId))endMouse();};
  addEventListener("pointerup",finishPointer);
  addEventListener("pointercancel",finishPointer);
  canvas.addEventListener("lostpointercapture",finishPointer);
  addEventListener("blur",endMouse);
  view.renderer.domElement.addEventListener(
    "wheel",
    (e) => {
      if (selected && !viewing) {
        e.preventDefault();
        selected.target = view.clampPosition({
          ...selected.target,
          z: clamp(selected.target.z - e.deltaY * 0.002, -1.8, 1.5),
        });
        if(mouse){mouse.start.position.z=selected.target.z;}
        view.physics.editPose(selected);
      }
    },
    { passive: false },
  );
  addEventListener("keydown", (e) => {
    if (
      ["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)
    )
      return;
    if (bench.active) {
      if (e.key === " " || e.key === "Escape") {
        e.preventDefault();
        bench.release();
      }
      return;
    }
    const key = e.key.toLowerCase(),
      o = selected;
    if (key === " ") {
      e.preventDefault();
      interaction.parkAll();
      endMouse();
    }
    if (key === "g") {
      $("gesture-mode").value = interaction.mode === "move" ? "rotate" : "move";
      $("gesture-mode").dispatchEvent(new Event("change"));
    }
    if (key === "r") clearDesk();
    if (key === "t") action("tool");
    if (key === "c") action("chemical");
    if (key === "h") action("risk-tab");
    if (key === "s") action("risk");
    if (key === "[") action("prev");
    if (key === "]") action("next");
    if (key === "e") download("HoloLab_phien_thi_nghiem.json", session());
    if (key === "o") $("session-file").click();
    if (!o) return;
    if (key === "a") o.roll += 0.13;
    if (key === "d") o.roll -= 0.13;
    if (key === "w") o.roll = o.pitch = 0;
    if (key === "j") o.yaw += 0.13;
    if (key === "l") o.yaw -= 0.13;
    if (["a", "d", "w", "j", "l"].includes(key)) view.physics.editPose(o);
    if (key === "k") {
      if (
        lessons?.active &&
        !o.sealed &&
        o.stock.openVessel &&
        !view.physics.canSeal(o)
      ) {
        message("Nhấc thanh sắt khỏi miệng cốc trước khi đậy nắp.");
        return;
      }
      o.sealed = !o.sealed;
      o.version++;
      view.updateMixture(o);
    }
    if (key === "backspace" || key === "delete") {
      e.preventDefault();
      removeSelected();
    }
    if (key === "p") {
      const target = view.pourTarget(o);
      if (target) pour(o, target, true);
      else message("Đưa miệng nguồn lên trên miệng bình nhận rồi nhấn P.");
    }
  });
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      interaction.parkAll("hidden");
      metrics.finish(performance.now(), "tab-hidden");
    }
  });
  addEventListener("beforeunload", () => capture.close());
}
async function launch() {
  [catalog] = await Promise.all([(await fetch("/api/catalog")).json()]);
  stocks = new Map(catalog.stocks.map((s) => [s.id, s]));
  const profiles = await (await fetch("/profiles.json")).json();
  await document.fonts.ready;
  view = new LabRenderer($("three"), profiles);
  await view.initPhysics();
  interaction = new Interaction(
    {
      pick,
      spawn,
      action,
      toWorld: (p, z) => view.toWorld(p, z),
      move,
      select,
      park,
      acquire: (object) => {
        view.physics.beginGrab(object);
        object.grabOrigin = { ...object.target }; // where to set it down safely (hand assist)
      },
      gripOffset,
      pourAssist: assistPour,
      preserveFreeOrientation: true,
    },
    { width: innerWidth, height: innerHeight, assist: handAssist },
  );
  setHandAssist(handAssist);
  $("hand-assist").onchange = (e) => {
    interaction.parkAll("mode");
    setHandAssist(e.target.checked);
    message(e.target.checked
      ? "Hỗ trợ tay: bật. Vật nằm dưới tay, giữ độ sâu, tự căn miệng bình; giữ yên để rót."
      : "Hỗ trợ tay: tắt. Độ sâu theo khoảng cách tay đến camera; tự căn và nghiêng bình để rót.");
  };
  capture = new HandCapture(video, result, (text) =>
    setText($("camera-status"), text),
  );
  capture.nativeAvailable = catalog.native_tracking;
  capture.onReconfigure = () => interaction.rebaseOnNextSample();
  bench = new Bench(view, () => {
    interaction.parkAll("mode");
    endMouse();
    if (viewing) {
      viewing = false;
      view.controls.enabled = false;
      view.camera.position.set(0, 0, view.homeCameraZ);
      view.controls.target.set(0, 0, 0);
      view.controls.update();
      view.camera.updateMatrixWorld();
      setText($("view-mode"), "Xem góc 3D");
    }
  });
  $("buret-tool").onclick = () => {
    if (!bench.active) bench.toggle();
  };
  $("sidebar-toggle").onclick = () => {
    const mobile = innerWidth <= 800;
    const open = mobile
      ? !document.body.classList.contains("lesson-menu-open")
      : document.body.classList.contains("sidebar-closed");
    document.body.classList.toggle("lesson-menu-open", mobile && open);
    document.body.classList.toggle("sidebar-closed", !open);
    $("sidebar-toggle").setAttribute(
      "aria-expanded",
      String(open),
    );
  };
  const toggleSupplies = () => {
    document.body.classList.remove("lesson-menu-open");
    document.body.classList.toggle("supplies-closed");
    $("supplies-toggle").setAttribute("aria-expanded", String(!document.body.classList.contains("supplies-closed")));
  };
  $("supplies-toggle").onclick = toggleSupplies;
  $("supplies-close").onclick = toggleSupplies;
  setupReactionLibrary();
  $("camera-quality").onchange = (e) =>
    queueSetting("camera", e.target.value);
  $("camera-auto").onchange = (e) => {
    capture.autoCameraQuality = e.target.checked;
    capture.cameraPolicy.reset();
  };
  video.addEventListener("resize", () => {
    overlayDirty = true;
    interaction.rebaseOnNextSample();
  });
  $("tracking-size").onchange = (e) => {
    queueSetting("size", Number(e.target.value));
  };
  $("tracking-rate").onchange = (e) => {
    capture.setMaxHz(Number(e.target.value));
  };
  const lessonData = await (await fetch("/data/lessons-thpt.json")).json();
  egad = new EGAD(await (await fetch("/data/egad-rubrics.json")).json());
  for (const stock of lessonStocks(lessonData)) {
    stocks.set(stock.id, stock);
    catalog.stocks.push(stock);
  }
  const hintData = await (await fetch("/data/reaction-hints.json")).json();
  reactionHints = new ReactionHints($("reaction-hints"),catalog,lessonData,hintData);
  lessons = new Lessons(lessonData, {
    view,
    bench,
    create: createObject,
    clear: clearDesk,
    message,
    cards: renderCards,
    inspect: inspector,
    resize,
    learning,
  });
  $("titration-mode").onclick = () => {
    if (lessons.active) clearDesk();
    bench.toggle();
  };
  $("buret-tool").onclick = () => {
    if (lessons.active) clearDesk();
    if (!bench.active) bench.toggle();
  };
  liquids = new LiquidSimulation(view, {
    transfer: (a, b, amount) => pour(a, b, true, amount),
    spill,
    eligible: (o, now) => {
      const owners = interaction.owners(o);
      return o.mouseOwned || (!owners.length && !viewing) || interaction.validOwners(o, now);
    },
  });
  const recordInteraction = interaction.record.bind(interaction);
  interaction.record = event => {
    recordInteraction(event);
    metrics.gesture(performance.now(),event);
    learning({type:event.type, hand:event.hand, source:event.object, reason:event.reason,
      quality:["recover", "expired", "tracking-timeout", "stalled-camera"].includes(event.reason || event.type)?"cv_uncertain":"valid"});
  };
  $("learning-consent").onchange = e => {
    learningLogger.setEnabled(e.target.checked);
    egad.setEnabled(e.target.checked);
    egadRequest++;$("egad-local-result").replaceChildren();$("egad-local-status").textContent="";
    if(!e.target.checked)renderAssessment($("egad-results"),null);
    setText($("learning-status"),e.target.checked?"Đang ghi sự kiện trên máy; không ghi video hoặc điểm bàn tay.":"Không ghi dữ liệu. Bật tùy chọn nếu đồng ý ghi nhật ký thử nghiệm.");
    if(e.target.checked)learning({type:"logging-enabled"});
  };
  $("learning-export").onclick=()=>download("HoloLab_nhat_ky_hoc_tap.json",{...learningLogger.export(),egad:egad.export()});
  $("learning-clear").onclick=()=>{learningLogger.clear();egad.clear();egadRequest++;$("egad-local-result").replaceChildren();$("egad-local-status").textContent="";renderAssessment($("egad-results"),null);$("learning-response").value="";setText($("learning-status"),"Đã xóa nhật ký trên máy.");};
  $("learning-save-answer").onclick=async()=>{
    if(!learningLogger.enabled){setText($("learning-status"),"Cần đồng ý ghi nhật ký trước khi lưu câu trả lời.");return;}
    try {
      const assessment=egad.analyze(lessons?.model?.lesson.id,$("learning-response").value,$("learning-stage").value);
      learning({type:"explanation",stage:assessment.stage,response:assessment.answer});
      renderAssessment($("egad-results"),assessment,egad.history);
      const requestId=++egadRequest;
      $("egad-local-result").replaceChildren();$("egad-local-status").textContent="";
      if($("egad-local-model").checked){
        setText($("egad-local-status"),"Đang hỏi mô hình trên máy; mô phỏng vẫn tiếp tục. Tối đa khoảng 25 giây.");
        try{
          const response=await fetch("/api/egad/local",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({consent:true,lesson:assessment.lesson,answer:assessment.answer})});
          const local=await response.json();if(!response.ok)throw Error(local.error||"Mô hình không phản hồi.");
          if(requestId!==egadRequest||!egad.enabled||lessons?.model?.lesson.id!==assessment.lesson)return;
          assessment.local_model=local;
          const host=$("egad-local-result"),heading=document.createElement("strong");heading.textContent="Mô hình cục bộ · nhãn dự đoán: "+local.label;host.append(heading);
          for(const c of local.concepts){const p=document.createElement("p");p.textContent=c.reason+" — Bằng chứng: "+c.evidence.join("; ");host.append(p);}
          const p=document.createElement("p");p.textContent=local.feedback;host.append(p);
          setText($("egad-local-status"),"Phân tích llama.cpp riêng với rubric bên dưới; cả hai chưa được giáo viên xác nhận.");
        }catch(error){if(requestId!==egadRequest)return;setText($("egad-local-status"),error.message);}
      }
      setText($("learning-status"),"Đã phân tích trên máy. Nhãn dự đoán có thể sai; xem bằng chứng và trả lời bổ sung.");
    } catch(error){setText($("learning-status"),error.message);}
  };
  bind();
  initMouseShell({
    lessons:lessonData.lessons,
    setMode:mode=>{endMouse();mouseMode=mode;}, release:endMouse,
    title:()=>$("lab-title").textContent,
    snapshot:()=>structuredClone(session()), restore:async data=>{endMouse();checkpoint();await loadSession(data);},
    start:id=>{endMouse();checkpoint();lessons.start(id);},
    free:()=>{endMouse();checkpoint();clearDesk();},
    reset:()=>{endMouse();checkpoint();if(lessons.active)lessons.start(lessons.model.lesson.id);else clearDesk();},
    remove:()=>{endMouse();checkpoint();removeSelected();},
    upright:()=>{if(!selected || viewing || interaction.owners(selected).length)return;checkpoint();selected.roll=selected.pitch=0;view.physics.editPose(selected);},
    undo:()=>historyStep(historyUndo,historyRedo),redo:()=>historyStep(historyRedo,historyUndo),
  });
  $("catalog-search").oninput=()=>{page=0;renderCards();};
  $("catalog-category").onchange=()=>{page=0;renderCards();};
  resize();
  renderCards();
  new ResizeObserver(resize).observe($("workspace"));
  message("Sẵn sàng. Chọn bài và thực hành bằng chuột; camera là tùy chọn.");
  // Test harness uses the same production methods; it is opt-in and never enabled on a normal launch.
  if (new URLSearchParams(location.search).has("test"))
    window.__lab = {
      view,
      bench,
      lessons,
      interaction,
      tracks,
      capture,
      metrics,
      liquids,
      spillLedger,
      learningLogger,
      egad,
      tutor,
      spawn,
      move,
      park,
      beginMouse,
      endMouse,
      createObject,
      session,
      loadSession,
      pour,
      clearDesk,
      result,
      select,
      stocks,
      reactionHints,
      replay: (observations, t) => {
        tracks.update(observations, t);
        interaction.update(tracks.tracks, t);
      },
      state: () => ({
        objects: view.objects.map((o) => ({
          id: o.id,
          position: { ...o.target },
          mix: o.mixture,
        })),
        hands: [...interaction.hands.values()].map((h) => ({
          id: h.id,
          state: h.state,
          object: h.object?.id,
          pointer: h.pointer,
          label: h.track.label,
        })),
      }),
    };
  requestAnimationFrame(tick);
}
launch().catch((error) => {
  console.error(error);
  message(
    `Không khởi động được: ${error.message}. Mở bằng START_WINDOWS.bat, không mở file HTML trực tiếp.`,
  );
});
