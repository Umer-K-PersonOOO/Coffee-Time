const allenerieArtwork = [
  ["artwork/allenerie1.jpg", "Spy x Family", ["#E38981", "#3A3D46", "#8CF2BD"]], // example
  ["artwork/allenerie2.jpg", "Genshin Impact, Dehya", ["#8D3939", "#C88A86", "#4B2E35"]],
  ["artwork/allenerie3.jpg", "Genshin Impact, Yoimiya", ["#E9A26C", "#E56F4B", "#5B3749"]],
];

const defaultAlleneriePalette = ["#E8A6B8", "#A8B7F0", "#FFFFFF"];
const ACRYLIC_TRANSITION_MS = 1250;
const DEFAULT_RETURN_DELAY_MS = 350;
const allenerieCanvas = document.getElementById("allenerie-acrylic-bg");
const allenerieScene = document.querySelector(".allenerie-scene");
const allenerieGrid = document.getElementById("allenerie-art-grid");
const allenerieTransitionCanvas = allenerieCanvas ? document.createElement("canvas") : null;
const allenerieTransitionCtx = allenerieTransitionCanvas?.getContext("2d");
let allenerieCtx = allenerieCanvas?.getContext("2d");

let W = 0;
let H = 0;
let DPR = 1;
let rand = mulberry32(14329);
let activePalette = defaultAlleneriePalette;
let drawFrame = 0;
let transitionTimer = 0;
let hasAcrylicBase = false;
let transitionPalette = null;
let cacheWarmTimer = 0;
let defaultReturnTimer = 0;
const acrylicCache = new Map();

if (allenerieCanvas && allenerieTransitionCanvas) {
  allenerieTransitionCanvas.className = "allenerie-acrylic-bg allenerie-acrylic-bg-transition";
  allenerieTransitionCanvas.setAttribute("aria-hidden", "true");
  allenerieCanvas.after(allenerieTransitionCanvas);
}

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function r(min, max) {
  return rand() * (max - min) + min;
}

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");

  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function shiftRgb(rgb, amount) {
  return rgb.map((channel) => clamp(channel + amount, 0, 255));
}

function rgbCss(rgb, alpha = 1, shift = 0) {
  const rr = clamp(rgb[0] + shift + r(-8, 8), 0, 255);
  const gg = clamp(rgb[1] + shift + r(-8, 8), 0, 255);
  const bb = clamp(rgb[2] + shift + r(-8, 8), 0, 255);
  return `rgba(${rr}, ${gg}, ${bb}, ${alpha})`;
}

function pick(arr) {
  return arr[Math.floor(r(0, arr.length))];
}

function buildAcrylicPalette(colors) {
  const [light, mid, dark] = colors.map(hexToRgb);

  return {
    stops: [light, mid, dark],
    blues: [mid, shiftRgb(mid, -24), shiftRgb(mid, 22), shiftRgb(dark, 18), dark, shiftRgb(light, -18)],
    lights: [light, shiftRgb(light, 22), shiftRgb(mid, 70), [240, 252, 248]],
    darks: [dark, shiftRgb(dark, -16), shiftRgb(mid, -46)],
    wash: mid,
  };
}

function drawBase(palette) {
  const g = allenerieCtx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, `rgb(${palette.stops[0].join(", ")})`);
  g.addColorStop(0.28, `rgb(${shiftRgb(palette.stops[1], 34).join(", ")})`);
  g.addColorStop(0.62, `rgb(${palette.stops[1].join(", ")})`);
  g.addColorStop(1, `rgb(${palette.stops[2].join(", ")})`);

  allenerieCtx.fillStyle = g;
  allenerieCtx.fillRect(0, 0, W, H);
}

function drawGrain(amount) {
  for (let i = 0; i < amount; i++) {
    const x = r(0, W);
    const y = r(0, H);
    const a = r(0.025, 0.09);

    allenerieCtx.fillStyle =
      rand() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,65,110,${a})`;
    allenerieCtx.fillRect(x, y, r(0.5, 1.8), r(0.5, 1.8));
  }
}

function drawBristleStroke({
  x,
  y,
  length,
  width,
  angle,
  curve = 0,
  rgb,
  alpha = 0.55,
  dry = 0.35,
  bristles = 90,
  groove = [0, 95, 140],
}) {
  allenerieCtx.save();
  allenerieCtx.translate(x, y);
  allenerieCtx.rotate(angle);
  allenerieCtx.lineCap = "round";
  allenerieCtx.lineJoin = "round";
  allenerieCtx.globalCompositeOperation = "source-over";

  for (let i = 0; i < bristles; i++) {
    const yy = r(-width / 2, width / 2);
    const lw = r(0.8, 4.5);

    if (rand() < dry) continue;

    const start = r(-length * 0.55, -length * 0.35);
    const end = r(length * 0.25, length * 0.55);
    const wobble = r(-12, 12);
    const c = curve + r(-35, 35);

    allenerieCtx.beginPath();
    allenerieCtx.moveTo(start, yy + r(-2, 2));
    allenerieCtx.bezierCurveTo(
      -length * 0.2,
      yy + c * 0.35 + wobble,
      length * 0.15,
      yy - c * 0.25 + wobble,
      end,
      yy + r(-4, 4)
    );

    allenerieCtx.lineWidth = lw;
    allenerieCtx.strokeStyle = rgbCss(rgb, r(alpha * 0.45, alpha), r(-18, 18));
    allenerieCtx.stroke();
  }

  allenerieCtx.globalCompositeOperation = "screen";

  for (let i = 0; i < bristles * 0.18; i++) {
    const yy = r(-width / 2, width / 2);

    allenerieCtx.beginPath();
    allenerieCtx.moveTo(r(-length * 0.52, -length * 0.35), yy);
    allenerieCtx.bezierCurveTo(
      -length * 0.12,
      yy + curve * 0.3 + r(-10, 10),
      length * 0.2,
      yy - curve * 0.22 + r(-10, 10),
      r(length * 0.28, length * 0.55),
      yy + r(-3, 3)
    );

    allenerieCtx.lineWidth = r(0.7, 2.4);
    allenerieCtx.strokeStyle = `rgba(255,255,255,${r(0.08, 0.28)})`;
    allenerieCtx.stroke();
  }

  allenerieCtx.globalCompositeOperation = "multiply";

  for (let i = 0; i < bristles * 0.14; i++) {
    const yy = r(-width / 2, width / 2);

    allenerieCtx.beginPath();
    allenerieCtx.moveTo(r(-length * 0.48, -length * 0.25), yy);
    allenerieCtx.bezierCurveTo(
      -length * 0.1,
      yy + r(-8, 8),
      length * 0.22,
      yy + r(-8, 8),
      r(length * 0.2, length * 0.52),
      yy + r(-3, 3)
    );

    allenerieCtx.lineWidth = r(0.6, 1.8);
    allenerieCtx.strokeStyle = `rgba(${groove.join(",")},${r(0.12, 0.32)})`;
    allenerieCtx.stroke();
  }

  allenerieCtx.restore();
}

function drawDryBrushPatch({ x, y, width, height, angle, rgb, alpha = 0.55, groove = [0, 100, 150] }) {
  allenerieCtx.save();
  allenerieCtx.translate(x, y);
  allenerieCtx.rotate(angle);
  allenerieCtx.lineCap = "butt";
  allenerieCtx.globalCompositeOperation = "source-over";

  const rows = Math.floor(height / 2.2);

  for (let i = 0; i < rows; i++) {
    const yy = -height / 2 + i * 2.2 + r(-1.5, 1.5);
    let cursor = -width / 2 + r(-10, 15);

    while (cursor < width / 2) {
      const seg = r(10, 70);
      const gap = r(3, 22);

      if (rand() > 0.25) {
        allenerieCtx.beginPath();
        allenerieCtx.moveTo(cursor, yy);
        allenerieCtx.lineTo(cursor + seg, yy + r(-2.2, 2.2));
        allenerieCtx.lineWidth = r(0.8, 3.8);
        allenerieCtx.strokeStyle = rgbCss(rgb, r(alpha * 0.25, alpha), r(-12, 18));
        allenerieCtx.stroke();
      }

      cursor += seg + gap;
    }
  }

  allenerieCtx.globalCompositeOperation = "multiply";

  for (let i = 0; i < 18; i++) {
    const yy = r(-height / 2, height / 2);

    allenerieCtx.beginPath();
    allenerieCtx.moveTo(-width / 2 + r(0, 40), yy);
    allenerieCtx.lineTo(width / 2 - r(0, 40), yy + r(-2, 2));
    allenerieCtx.lineWidth = r(0.5, 1.5);
    allenerieCtx.strokeStyle = `rgba(${groove.join(",")},${r(0.08, 0.2)})`;
    allenerieCtx.stroke();
  }

  allenerieCtx.restore();
}

function drawFanBrush(x, y, radius, startAngle, endAngle, rgb) {
  const count = 120;

  allenerieCtx.save();
  allenerieCtx.translate(x, y);
  allenerieCtx.lineCap = "round";

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const a = startAngle + (endAngle - startAngle) * t + r(-0.04, 0.04);
    const len = radius * r(0.48, 1.05);

    allenerieCtx.beginPath();
    allenerieCtx.moveTo(0, 0);
    allenerieCtx.quadraticCurveTo(
      Math.cos(a) * len * 0.38 + r(-15, 15),
      Math.sin(a) * len * 0.38 + r(-15, 15),
      Math.cos(a) * len,
      Math.sin(a) * len
    );

    allenerieCtx.lineWidth = r(0.7, 3.2);
    allenerieCtx.strokeStyle = rgbCss(rgb, r(0.14, 0.42), r(-10, 20));
    allenerieCtx.stroke();
  }

  allenerieCtx.restore();
}

function drawAcrylic(colors) {
  if (!allenerieCtx || !W || !H) return;

  const palette = buildAcrylicPalette(colors);
  rand = mulberry32(14329);

  drawBase(palette);

  for (let i = 0; i < 18; i++) {
    drawBristleStroke({
      x: r(-W * 0.1, W * 1.1),
      y: r(-H * 0.05, H * 1.05),
      length: r(W * 0.45, W * 0.95),
      width: r(60, 170),
      angle: r(-0.35, 0.18),
      curve: r(-90, 90),
      rgb: pick(palette.blues),
      alpha: r(0.28, 0.62),
      dry: r(0.25, 0.5),
      bristles: r(90, 180),
      groove: palette.darks[0],
    });
  }

  for (let i = 0; i < 9; i++) {
    drawBristleStroke({
      x: r(-W * 0.05, W * 1.05),
      y: r(-H * 0.02, H * 0.65),
      length: r(W * 0.24, W * 0.7),
      width: r(35, 105),
      angle: r(-0.45, 0.12),
      curve: r(-70, 90),
      rgb: pick(palette.lights),
      alpha: r(0.28, 0.72),
      dry: r(0.35, 0.65),
      bristles: r(80, 150),
      groove: palette.darks[0],
    });
  }

  for (let i = 0; i < 14; i++) {
    drawDryBrushPatch({
      x: r(0, W),
      y: r(0, H),
      width: r(W * 0.16, W * 0.5),
      height: r(38, 140),
      angle: r(-0.35, 0.12),
      rgb: rand() > 0.55 ? pick(palette.lights) : pick(palette.blues),
      alpha: r(0.22, 0.62),
      groove: palette.darks[0],
    });
  }

  drawFanBrush(W * 0.18, H * 0.34, W * 0.32, -1.1, 0.45, palette.lights[0]);
  drawFanBrush(W * 0.76, H * 0.28, W * 0.34, -2.9, -1.25, palette.lights[1]);
  drawFanBrush(W * 0.45, H * 0.78, W * 0.38, -2.8, -0.55, palette.blues[2]);

  for (let i = 0; i < 8; i++) {
    drawBristleStroke({
      x: r(-W * 0.1, W * 1.1),
      y: r(H * 0.48, H * 1.08),
      length: r(W * 0.35, W * 0.85),
      width: r(55, 155),
      angle: r(-0.25, 0.16),
      curve: r(-80, 80),
      rgb: pick(palette.darks),
      alpha: r(0.35, 0.68),
      dry: r(0.25, 0.48),
      bristles: r(90, 170),
      groove: palette.darks[0],
    });
  }

  drawGrain(Math.floor((W * H) / 360));
  allenerieCtx.fillStyle = `rgba(${palette.wash.join(", ")}, 0.08)`;
  allenerieCtx.fillRect(0, 0, W, H);
}

function drawAcrylicTo(ctx, colors) {
  if (!ctx) return;

  const previousCtx = allenerieCtx;
  allenerieCtx = ctx;
  drawAcrylic(colors);
  allenerieCtx = previousCtx;
}

function getPaletteKey(colors) {
  return colors.join("|");
}

function getAllAcrylicPalettes() {
  return [defaultAlleneriePalette, ...allenerieArtwork.map(([, , colors]) => colors)];
}

function clearAcrylicCache() {
  if (cacheWarmTimer) {
    clearTimeout(cacheWarmTimer);
    cacheWarmTimer = 0;
  }

  acrylicCache.forEach((canvas) => {
    canvas.width = 0;
    canvas.height = 0;
  });
  acrylicCache.clear();
}

function getCachedAcrylicCanvas(colors) {
  const key = getPaletteKey(colors);

  if (acrylicCache.has(key)) {
    return acrylicCache.get(key);
  }

  const cachedCanvas = document.createElement("canvas");
  const cachedCtx = cachedCanvas.getContext("2d");

  cachedCanvas.width = Math.round(W * DPR);
  cachedCanvas.height = Math.round(H * DPR);
  cachedCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
  drawAcrylicTo(cachedCtx, colors);
  acrylicCache.set(key, cachedCanvas);

  return cachedCanvas;
}

function drawCachedAcrylicTo(ctx, colors) {
  if (!ctx || !W || !H) return;

  const cachedCanvas = getCachedAcrylicCanvas(colors);
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(cachedCanvas, 0, 0, W, H);
}

function warmAcrylicCache() {
  if (!W || !H) return;

  const palettes = getAllAcrylicPalettes();
  let index = 0;

  const renderNext = () => {
    while (index < palettes.length && acrylicCache.has(getPaletteKey(palettes[index]))) {
      index += 1;
    }

    if (index >= palettes.length) {
      cacheWarmTimer = 0;
      return;
    }

    getCachedAcrylicCanvas(palettes[index]);
    index += 1;
    cacheWarmTimer = setTimeout(renderNext, 80);
  };

  cacheWarmTimer = setTimeout(renderNext, 80);
}

function hideTransitionCanvas() {
  if (!allenerieTransitionCanvas) return;

  allenerieTransitionCanvas.style.transition = "none";
  allenerieTransitionCanvas.classList.remove("is-visible");
  void allenerieTransitionCanvas.offsetWidth;
  allenerieTransitionCanvas.style.transition = "";
}

function flattenCurrentTransition() {
  if (!transitionPalette || !allenerieTransitionCanvas || !allenerieCtx) return;

  const opacity = clamp(Number(getComputedStyle(allenerieTransitionCanvas).opacity) || 0, 0, 1);

  if (opacity > 0) {
    allenerieCtx.save();
    allenerieCtx.globalAlpha = opacity;
    allenerieCtx.drawImage(allenerieTransitionCanvas, 0, 0, W, H);
    allenerieCtx.restore();
    hasAcrylicBase = true;
  }

  transitionPalette = null;
  hideTransitionCanvas();
}

function cancelDefaultReturn() {
  if (!defaultReturnTimer) return;

  clearTimeout(defaultReturnTimer);
  defaultReturnTimer = 0;
}

function scheduleDefaultReturn() {
  cancelDefaultReturn();
  defaultReturnTimer = setTimeout(() => {
    defaultReturnTimer = 0;
    scheduleAcrylicDraw(defaultAlleneriePalette);
  }, DEFAULT_RETURN_DELAY_MS);
}

function setAcrylicCanvasSize(canvas, ctx) {
  if (!canvas || !ctx) return;

  canvas.width = Math.round(W * DPR);
  canvas.height = Math.round(H * DPR);
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function getAcrylicDpr() {
  const deviceDpr = window.devicePixelRatio || 1;
  const isMobileLike = window.matchMedia?.("(max-width: 760px), (pointer: coarse)")?.matches ?? false;

  return Math.min(deviceDpr, isMobileLike ? 1 : 1.5);
}

function scheduleAcrylicDraw(colors = activePalette) {
  activePalette = colors;

  if (drawFrame) cancelAnimationFrame(drawFrame);
  if (transitionTimer) {
    clearTimeout(transitionTimer);
    transitionTimer = 0;
  }

  flattenCurrentTransition();

  drawFrame = requestAnimationFrame(() => {
    drawFrame = 0;

    if (
      !hasAcrylicBase ||
      !allenerieTransitionCanvas ||
      !allenerieTransitionCtx
    ) {
      drawCachedAcrylicTo(allenerieCtx, activePalette);
      hasAcrylicBase = true;
      hideTransitionCanvas();
      return;
    }

    const targetPalette = activePalette;
    transitionPalette = targetPalette;

    drawCachedAcrylicTo(allenerieTransitionCtx, targetPalette);
    hideTransitionCanvas();

    requestAnimationFrame(() => {
      allenerieTransitionCanvas.classList.add("is-visible");
    });

    transitionTimer = setTimeout(() => {
      drawCachedAcrylicTo(allenerieCtx, targetPalette);
      hasAcrylicBase = true;
      hideTransitionCanvas();
      if (transitionPalette === targetPalette) transitionPalette = null;
      transitionTimer = 0;
    }, ACRYLIC_TRANSITION_MS + 80);
  });
}

function resizeAcrylic() {
  if (!allenerieCanvas || !allenerieScene || !allenerieCtx) return;

  const rect = allenerieScene.getBoundingClientRect();
  const nextW = Math.max(1, Math.ceil(rect.width));
  const nextH = Math.max(1, Math.ceil(allenerieScene.scrollHeight || rect.height));
  const nextDpr = getAcrylicDpr();

  if (
    W === nextW &&
    H === nextH &&
    DPR === nextDpr &&
    allenerieCanvas.width === Math.round(nextW * nextDpr)
  ) {
    if (!hasAcrylicBase) scheduleAcrylicDraw(activePalette);
    return;
  }

  W = nextW;
  H = nextH;
  DPR = nextDpr;

  setAcrylicCanvasSize(allenerieCanvas, allenerieCtx);
  setAcrylicCanvasSize(allenerieTransitionCanvas, allenerieTransitionCtx);
  clearAcrylicCache();
  hasAcrylicBase = false;
  scheduleAcrylicDraw(activePalette);
  warmAcrylicCache();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function renderAllenerieGallery() {
  if (!allenerieGrid) return;

  const isLandscapeArtwork = ([src]) => src.includes("allenerie1");
  const portraits = shuffleArray(allenerieArtwork.filter((artwork) => !isLandscapeArtwork(artwork)));
  const landscapes = allenerieArtwork.filter(isLandscapeArtwork);

  [...portraits, ...landscapes].forEach(([src, captionText, colors]) => {
    const card = document.createElement("figure");
    card.className = `allenerie-art-card ${
      isLandscapeArtwork([src]) ? "allenerie-art-card--landscape" : "allenerie-art-card--portrait"
    } image-wrapper`;
    card.addEventListener("pointerenter", () => {
      cancelDefaultReturn();
      scheduleAcrylicDraw(colors);
    });

    const img = new Image();
    img.loading = "lazy";
    img.decoding = "async";
    img.src = src;
    img.alt = captionText;
    img.loading = "lazy";
    img.addEventListener("load", resizeAcrylic, { once: true });

    const caption = document.createElement("figcaption");
    caption.className = "caption";
    caption.innerText = captionText;

    card.append(img, caption);
    allenerieGrid.appendChild(card);
  });

  allenerieGrid.addEventListener("pointerenter", cancelDefaultReturn);
  allenerieGrid.addEventListener("pointerleave", scheduleDefaultReturn);
  allenerieGrid.addEventListener("pointercancel", scheduleDefaultReturn);
}

renderAllenerieGallery();
resizeAcrylic();
window.addEventListener("resize", resizeAcrylic, { passive: true });

if ("ResizeObserver" in window && allenerieScene) {
  new ResizeObserver(resizeAcrylic).observe(allenerieScene);
}
