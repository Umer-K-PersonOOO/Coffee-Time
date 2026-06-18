const portrait_artwork = [
  ["lixizu1.jpg", "Genshin Impact, Yae Miko", "#e8325c"],
  ["lixizu2.jpg", "Genshin Impact, Ganyu", "#69a8f2"],
  ["lixizu3.jpg", "Genshin Impact, Chongyun", "#00b6e2"],
  ["lixizu4.jpg", "Genshin Impact, Keqing", "#9040f3"],
  ["lixizu5.jpg", "Genshin Impact, Xiao", "#2bb675"],
  ["lixizu6.jpg", "Genshin Impact, Hu Tao", "#c61e38"],
];

const artworkContainer = document.getElementById("artwork-stuff");
const artworkImages = [];
const artworkSplotches = [];
let lastSplotchLayout = null;

class SplotchRandom {
  constructor() {
    this.nextGaussian = null;
  }

  float(min = 0, max = 1) {
    return min + Math.random() * (max - min);
  }

  gaussian(mean = 0, sd = 1) {
    if (this.nextGaussian !== null) {
      const value = this.nextGaussian;
      this.nextGaussian = null;
      return mean + value * sd;
    }

    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    const mag = Math.sqrt(-2.0 * Math.log(u));
    const z0 = mag * Math.cos(2.0 * Math.PI * v);
    const z1 = mag * Math.sin(2.0 * Math.PI * v);
    this.nextGaussian = z1;
    return mean + z0 * sd;
  }

  positiveGaussian(mean, sd, min = 0) {
    for (let i = 0; i < 10; i++) {
      const value = this.gaussian(mean, sd);
      if (value > min) return value;
    }
    return Math.max(min, mean * 0.35);
  }
}

const splotchParams = {
  sides: 7,
  midSigma: 0.41,
  angleSigma: 0.48,
  magnitude: 0.74,
  magnitudeSigma: 0.42,
  roundDecay: 0.73,
  inheritDelta: 0.09,
  edgeVarSpread: 0.57,
  edgeLengthInfluence: 0.22,
  baseAlpha: 0.006,
  layersPerBand: 30,
  growMs: 1500,
  releaseMinMs: 8000,
  releaseMaxMs: 11000,
};

const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function centroid(poly) {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}

function clonePoly(poly) {
  return poly.map((p) => ({ x: p.x, y: p.y, edgeVar: p.edgeVar }));
}

function pathPolygon(ctx, poly) {
  ctx.beginPath();
  ctx.moveTo(poly[0].x, poly[0].y);
  for (let i = 1; i < poly.length; i++) {
    ctx.lineTo(poly[i].x, poly[i].y);
  }
  ctx.closePath();
}

function drawPolygon(ctx, poly, fill) {
  pathPolygon(ctx, poly);
  ctx.fillStyle = fill;
  ctx.fill();
}

function makeBasePolygon({ rng, sides, centerX, centerY, radius, edgeVarSpread }) {
  const angleOffset = rng.float(-Math.PI, Math.PI);
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle = angleOffset + (i / sides) * Math.PI * 2;
    const pointRadius = radius * clamp(rng.gaussian(1, 0.1), 0.8, 1.22);
    const edgeVar = clamp(Math.exp(rng.gaussian(-0.2, edgeVarSpread)), 0.18, 1.55);
    points.push({
      x: centerX + Math.cos(angle) * pointRadius,
      y: centerY + Math.sin(angle) * pointRadius,
      edgeVar,
    });
  }

  return points;
}

function deformOnce(poly, rng, params, roundIndex = 0) {
  const c = centroid(poly);
  const nextPoly = [];

  for (let i = 0; i < poly.length; i++) {
    const curr = poly[i];
    const next = poly[(i + 1) % poly.length];
    const dx = next.x - curr.x;
    const dy = next.y - curr.y;
    const len = Math.max(0.0001, Math.hypot(dx, dy));
    const parentVar = clamp(curr.edgeVar ?? 1, 0.12, 1.75);

    const t = clamp(0.5 + rng.gaussian(0, params.midSigma), 0.06, 0.94);
    const mx = curr.x + dx * t;
    const my = curr.y + dy * t;

    const n1 = { x: -dy / len, y: dx / len };
    const away = { x: mx - c.x, y: my - c.y };
    let nx = n1.x;
    let ny = n1.y;
    if (away.x * nx + away.y * ny < 0) {
      nx = -nx;
      ny = -ny;
    }

    const angle = Math.atan2(ny, nx) + rng.gaussian(0, params.angleSigma);
    const roundDecay = Math.pow(params.roundDecay, roundIndex);
    const laterRoundNerf = roundIndex === 0 ? 1 : Math.pow(0.92, roundIndex);
    const edgeLengthScale = 1 + (parentVar - 1) * params.edgeLengthInfluence;
    const independentLengthSpread = 1 + (1 - params.edgeLengthInfluence) * 0.65;
    const meanFactor = params.magnitude * edgeLengthScale * roundDecay * laterRoundNerf;
    const sdFactor = params.magnitude * params.magnitudeSigma * independentLengthSpread * roundDecay * 0.9;
    const magFactor = rng.positiveGaussian(meanFactor, sdFactor, 0.0035);
    const mag = len * magFactor;

    const leftVar = clamp(parentVar + rng.gaussian(0, params.inheritDelta), 0.12, 1.75);
    const childVar = clamp(parentVar + rng.gaussian(0, params.inheritDelta), 0.12, 1.75);

    nextPoly.push({ x: curr.x, y: curr.y, edgeVar: leftVar });
    nextPoly.push({
      x: mx + Math.cos(angle) * mag,
      y: my + Math.sin(angle) * mag,
      edgeVar: childVar,
    });
  }

  return nextPoly;
}

function deform(poly, rounds, rng, params) {
  let out = clonePoly(poly);
  for (let round = 0; round < rounds; round++) {
    out = deformOnce(out, rng, params, round);
  }
  return out;
}

function createSplotchLayers(basePoly, params, color, alphaScale = 1) {
  const bands = [
    { baseRounds: 1, detailRounds: 3, count: params.layersPerBand, alpha: params.baseAlpha * 1.02 },
    { baseRounds: 2, detailRounds: 3, count: params.layersPerBand, alpha: params.baseAlpha * 0.95 },
    { baseRounds: 3, detailRounds: 3, count: params.layersPerBand, alpha: params.baseAlpha * 0.88 },
  ];
  const layers = [];

  for (const band of bands) {
    const bandBase = deform(basePoly, band.baseRounds, new SplotchRandom(), params);
    for (let i = 0; i < band.count; i++) {
      const rng = new SplotchRandom();
      const poly = deform(bandBase, band.detailRounds, rng, params);
      const alpha = band.alpha * alphaScale * clamp(rng.gaussian(1, 0.14), 0.72, 1.22);
      layers.push({ poly, alpha, color });
    }
  }

  return layers;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function getSplotchBounds(layers) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const layer of layers) {
    for (const point of layer.poly) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }

  const padding = 24;
  return {
    left: Math.floor(minX - padding),
    top: Math.floor(minY - padding),
    width: Math.ceil(maxX - minX + padding * 2),
    height: Math.ceil(maxY - minY + padding * 2),
  };
}

function createSplotchCache(layers, bounds) {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(bounds.width * dpr));
  canvas.height = Math.max(1, Math.ceil(bounds.height * dpr));

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, -bounds.left * dpr, -bounds.top * dpr);

  for (const layer of layers) {
    drawPolygon(ctx, layer.poly, rgba(layer.color, layer.alpha));
  }

  return {
    canvas,
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
  };
}

function drawSplotchFrame(ctx, splotch) {
  const progress = clamp(splotch.progress, 0, 1);
  if (progress <= 0) return;

  const easedProgress = easeOutCubic(progress);
  const scale = 0.84 + easedProgress * 0.16;
  const drawWidth = splotch.cache.width * scale;
  const drawHeight = splotch.cache.height * scale;
  const drawLeft = splotch.center.x - (splotch.center.x - splotch.cache.left) * scale;
  const drawTop = splotch.center.y - (splotch.center.y - splotch.cache.top) * scale;

  ctx.save();
  ctx.globalAlpha = easedProgress;
  ctx.drawImage(splotch.cache.canvas, drawLeft, drawTop, drawWidth, drawHeight);
  ctx.restore();
}

function createSplotchCanvas() {
  const canvas = document.createElement("canvas");
  canvas.className = "lixizu-splotch-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  return canvas;
}

const splotchCanvas = createSplotchCanvas();

function getStableViewportHeight() {
  const appVh = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--app-vh")
  );
  return Math.round((appVh || window.innerHeight * 0.01) * 100);
}

function fitSplotchCanvas() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const widthCss = Math.max(
    document.documentElement.clientWidth,
    document.body.clientWidth
  );
  const heightCss = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    getStableViewportHeight()
  );
  const width = Math.max(1, Math.round(widthCss * dpr));
  const height = Math.max(1, Math.round(heightCss * dpr));

  if (splotchCanvas.width !== width || splotchCanvas.height !== height) {
    splotchCanvas.width = width;
    splotchCanvas.height = height;
  }
  splotchCanvas.style.width = `${widthCss}px`;
  splotchCanvas.style.height = `${heightCss}px`;

  const ctx = splotchCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: widthCss, height: heightCss };
}

function createArtworkSplotch(img, previousSplotch) {
  const imgRect = img.getBoundingClientRect();
  if (imgRect.width <= 0 || imgRect.height <= 0) return null;

  const rng = new SplotchRandom();
  const centerX = imgRect.left + window.scrollX + imgRect.width / 2;
  const centerY = imgRect.top + window.scrollY + imgRect.height / 2;
  const radius = Math.min(imgRect.width, imgRect.height) * rng.float(0.38, 0.5);
  const base = makeBasePolygon({
    rng,
    sides: splotchParams.sides,
    centerX,
    centerY,
    radius,
    edgeVarSpread: splotchParams.edgeVarSpread,
  });
  const layers = createSplotchLayers(base, splotchParams, img.dataset.splotchColor, rng.float(1.05, 1.35));
  const bounds = getSplotchBounds(layers);

  return {
    img,
    center: centroid(base),
    cache: createSplotchCache(layers, bounds),
    progress: previousSplotch?.progress ?? 0,
    fromProgress: previousSplotch?.fromProgress ?? 0,
    targetProgress: previousSplotch?.targetProgress ?? 0,
    startedAt: previousSplotch?.startedAt ?? 0,
    duration: previousSplotch?.duration ?? 0,
    isAnimating: previousSplotch?.isAnimating ?? false,
  };
}

function getImagePageRect(img) {
  const rect = img.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
}

function getSplotchLayout() {
  return {
    dpr: Math.max(1, window.devicePixelRatio || 1),
    width: document.documentElement.clientWidth,
    images: artworkImages.map((img) => {
      const rect = getImagePageRect(img);
      return {
        img,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
    }),
  };
}

function shouldRebuildSplotches(nextLayout) {
  if (!lastSplotchLayout) return true;
  if (Math.abs(nextLayout.dpr - lastSplotchLayout.dpr) > 0.01) return true;
  if (Math.abs(nextLayout.width - lastSplotchLayout.width) > 2) return true;
  if (nextLayout.images.length !== lastSplotchLayout.images.length) return true;

  return nextLayout.images.some((nextImage, index) => {
    const previousImage = lastSplotchLayout.images[index];
    return (
      nextImage.img !== previousImage.img ||
      Math.abs(nextImage.left - previousImage.left) > 2 ||
      Math.abs(nextImage.width - previousImage.width) > 2 ||
      Math.abs(nextImage.height - previousImage.height) > 2
    );
  });
}

function syncArtworkSplotchPlacement() {
  for (const splotch of artworkSplotches) {
    const rect = getImagePageRect(splotch.img);
    if (rect.width <= 0 || rect.height <= 0) continue;

    const nextCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    const dx = nextCenter.x - splotch.center.x;
    const dy = nextCenter.y - splotch.center.y;

    splotch.center = nextCenter;
    splotch.cache.left += dx;
    splotch.cache.top += dy;
  }
}

function rebuildArtworkSplotches() {
  const previousByImage = new Map(artworkSplotches.map((splotch) => [splotch.img, splotch]));
  artworkSplotches.length = 0;

  for (const img of artworkImages) {
    const splotch = createArtworkSplotch(img, previousByImage.get(img));
    if (splotch) artworkSplotches.push(splotch);
  }

  lastSplotchLayout = getSplotchLayout();
}

function handleSplotchResize() {
  const nextLayout = getSplotchLayout();

  if (shouldRebuildSplotches(nextLayout)) {
    rebuildArtworkSplotches();
  } else {
    syncArtworkSplotchPlacement();
    lastSplotchLayout = nextLayout;
  }

  renderArtworkSplotches();
}

function renderArtworkSplotches() {
  if (!artworkSplotches.length) {
    fitSplotchCanvas().ctx.clearRect(0, 0, splotchCanvas.width, splotchCanvas.height);
    return;
  }

  const { ctx, width, height } = fitSplotchCanvas();
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";

  for (const splotch of artworkSplotches) {
    drawSplotchFrame(ctx, splotch);
  }

  ctx.restore();
}

let splotchAnimationFrame = 0;
let lastResizeWidth = document.documentElement.clientWidth;
let lastResizeDpr = Math.max(1, window.devicePixelRatio || 1);

function animateArtworkSplotches(timestamp) {
  let shouldContinue = false;

  for (const splotch of artworkSplotches) {
    if (!splotch.isAnimating) continue;

    const elapsed = timestamp - splotch.startedAt;
    const t = clamp(elapsed / splotch.duration, 0, 1);
    splotch.progress = splotch.fromProgress + (splotch.targetProgress - splotch.fromProgress) * t;

    if (t >= 1) {
      splotch.progress = splotch.targetProgress;
      splotch.isAnimating = false;
    } else {
      shouldContinue = true;
    }
  }

  renderArtworkSplotches();

  if (shouldContinue) {
    splotchAnimationFrame = requestAnimationFrame(animateArtworkSplotches);
  } else {
    splotchAnimationFrame = 0;
  }
}

function startSplotchAnimation(splotch, targetProgress, duration) {
  splotch.fromProgress = splotch.progress;
  splotch.targetProgress = targetProgress;
  splotch.startedAt = performance.now();
  splotch.duration = Math.max(1, duration);
  splotch.isAnimating = true;

  if (!splotchAnimationFrame) {
    splotchAnimationFrame = requestAnimationFrame(animateArtworkSplotches);
  }
}

function getSplotchForImage(img) {
  return artworkSplotches.find((splotch) => splotch.img === img);
}

function showImageSplotch(img) {
  const splotch = getSplotchForImage(img);
  if (!splotch) return;
  startSplotchAnimation(splotch, 1, splotchParams.growMs * (1 - splotch.progress));
}

function hideImageSplotch(img) {
  const splotch = getSplotchForImage(img);
  if (!splotch) return;
  const rng = new SplotchRandom();
  const releaseMs = rng.float(splotchParams.releaseMinMs, splotchParams.releaseMaxMs);
  startSplotchAnimation(splotch, 0, releaseMs * splotch.progress);
}

function waitForImage(img) {
  if (img.complete && img.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

const selectedPortraitImages = shuffleArray([...portrait_artwork]);

for (const [filename, captionText, color] of selectedPortraitImages) {
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-wrapper";

  const img = new Image();
  img.loading = "lazy";
  img.decoding = "async";
  img.src = "artwork/" + filename;
  img.alt = captionText;
  img.dataset.splotchColor = color;

  imageWrapper.appendChild(img);
  artworkImages.push(img);

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerText = captionText;

  imageWrapper.appendChild(caption);
  artworkContainer.appendChild(imageWrapper);

  imageWrapper.addEventListener("pointerenter", () => showImageSplotch(img));
  imageWrapper.addEventListener("pointerleave", () => hideImageSplotch(img));
}

Promise.all(artworkImages.map(waitForImage)).then(() => {
  rebuildArtworkSplotches();
  requestAnimationFrame(renderArtworkSplotches);
});

window.addEventListener("resize", () => {
  const nextWidth = document.documentElement.clientWidth;
  const nextDpr = Math.max(1, window.devicePixelRatio || 1);
  const isMobileHeightOnlyResize =
    window.visualViewport &&
    nextWidth <= 900 &&
    Math.abs(nextWidth - lastResizeWidth) <= 2 &&
    Math.abs(nextDpr - lastResizeDpr) <= 0.01;

  if (isMobileHeightOnlyResize) return;

  lastResizeWidth = nextWidth;
  lastResizeDpr = nextDpr;

  clearTimeout(window.__lixizuSplotchResizeTimer);
  window.__lixizuSplotchResizeTimer = setTimeout(handleSplotchResize, 140);
});
