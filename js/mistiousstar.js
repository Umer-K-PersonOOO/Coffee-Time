const mistiousstarImages = [
  ["artwork/mistiousstar1.jpg", "Fire Emblem, Pokemon, Rhea", ["#b0ddd2", "#bfd072", "#a6bc58"]],
  ["artwork/mistiousstar2.jpg", "Fire Emblem, Elise, Sakura", ["#ecca76", "#edecea", "#d34543"]],
  ["artwork/mistiousstar3.jpg", "Genshin Impact, Keqing", ["#ae56ce", "#eed5d1", "#432287"]],
  ["artwork/mistiousstar4.jpg", "Genshin Impact, Pokemon, Klee, Scorbunny", ["#f9cb76", "#f47123", "#d63e4d"]],
];

const defaultMistiousGradient = ["#86e6e0", "#b8c4f1", "#dca9ef"];
const mistiousSvg = document.getElementById("mistiousstar-doodles");
const mistiousGrid = document.getElementById("mistiousstar-portrait-grid");
const BG_W = 160;
const BG_H = 90;
let currentMistiousGradient = defaultMistiousGradient.map(hexToRgb);
let gradientAnimationFrame = 0;

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(123456);

function r(min, max) {
  return min + (max - min) * rand();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function createSVG(tag, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);

  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }

  return el;
}

function starPoints(cx, cy, outerR, innerR, points = 5, rotation = -90) {
  const pts = [];
  const step = Math.PI / points;
  const rot = (rotation * Math.PI) / 180;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = rot + i * step;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    pts.push(`${x},${y}`);
  }

  return pts.join(" ");
}

function addStar(x, y, size, rotate = 0, opacity = 0.72) {
  mistiousSvg.appendChild(
    createSVG("polygon", {
      points: starPoints(x, y, size, size * 0.42, 5, rotate - 90),
      fill: "none",
      stroke: `rgba(255,255,255,${opacity})`,
      "stroke-width": 0.55,
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
    })
  );
}

function addSquare(x, y, size, rotate = 0, opacity = 0.52) {
  mistiousSvg.appendChild(
    createSVG("rect", {
      x: x - size / 2,
      y: y - size / 2,
      width: size,
      height: size,
      fill: `rgba(255,255,255,${opacity})`,
      transform: `rotate(${rotate} ${x} ${y})`,
    })
  );
}

function addTriangle(x, y, size, rotate = 0, opacity = 0.52) {
  const h = size * 0.9;
  const points = [
    `${x},${y - h / 2}`,
    `${x - size / 2},${y + h / 2}`,
    `${x + size / 2},${y + h / 2}`,
  ].join(" ");

  mistiousSvg.appendChild(
    createSVG("polygon", {
      points,
      fill: `rgba(255,255,255,${opacity})`,
      transform: `rotate(${rotate} ${x} ${y})`,
    })
  );
}

function addDashedCurve(
  startX,
  startY,
  c1X,
  c1Y,
  c2X,
  c2Y,
  endX,
  endY,
  width = 0.5,
  dash = "3 2.5",
  opacity = 0.62
) {
  mistiousSvg.appendChild(
    createSVG("path", {
      d: `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`,
      fill: "none",
      stroke: `rgba(255,255,255,${opacity})`,
      "stroke-width": width,
      "stroke-linecap": "round",
      "stroke-dasharray": dash,
    })
  );
}

function addSolidCurve(startX, startY, c1X, c1Y, c2X, c2Y, endX, endY, width = 0.75, opacity = 0.58) {
  mistiousSvg.appendChild(
    createSVG("path", {
      d: `M ${startX} ${startY} C ${c1X} ${c1Y}, ${c2X} ${c2Y}, ${endX} ${endY}`,
      fill: "none",
      stroke: `rgba(255,255,255,${opacity})`,
      "stroke-width": width,
      "stroke-linecap": "round",
    })
  );
}

function drawDoodles() {
  if (!mistiousSvg) return;

  mistiousSvg.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const sx = r(-15, BG_W + 5);
    const sy = r(-5, BG_H + 5);
    const ex = sx + r(-35, 45);
    const ey = sy + r(-14, 24);

    addDashedCurve(
      sx,
      sy,
      sx + r(12, 36),
      sy + r(-18, 12),
      ex + r(-35, 18),
      ey + r(-10, 18),
      ex,
      ey,
      r(0.35, 0.7),
      `${r(2.2, 4.2).toFixed(2)} ${r(1.8, 3.4).toFixed(2)}`,
      r(0.4, 0.75)
    );
  }

  addSolidCurve(-4, 82, 12, 55, 45, 50, 61, 90, 0.85, 0.55);
  addSolidCurve(122, 94, 138, 72, 150, 67, 166, 69, 0.85, 0.55);
  addSolidCurve(78, -4, 86, 8, 76, 24, 86, 36, 0.7, 0.55);
  addSolidCurve(126, 14, 138, 27, 151, 28, 154, 10, 0.7, 0.55);
  addSolidCurve(88, 4, 96, 15, 114, 15, 126, 20, 0.7, 0.52);

  const starPositions = [
    [3, 10, 2.1],
    [28, 38, 1.9],
    [24, 66, 2.8],
    [39, 5, 2.0],
    [64, 68, 1.8],
    [71, 40, 1.6],
    [93, 5, 2.5],
    [104, 50, 3.5],
    [153, 24, 3.0],
    [141, 7, 1.8],
  ];

  starPositions.forEach(([x, y, size]) => {
    addStar(x, y, size, r(-12, 12), r(0.52, 0.82));
  });

  for (let i = 0; i < 16; i++) {
    addSquare(r(4, BG_W - 4), r(5, BG_H - 5), r(1.0, 3.0), r(0, 45), r(0.35, 0.58));
  }

  for (let i = 0; i < 10; i++) {
    addTriangle(r(5, BG_W - 5), r(5, BG_H - 5), r(1.8, 3.8), r(0, 360), r(0.35, 0.58));
  }
}

function renderMistiousGrid() {
  if (!mistiousGrid) return;

  shuffleArray([...mistiousstarImages]).forEach(([src, captionText, gradientColors]) => {
    const card = document.createElement("figure");
    card.className = "mistiousstar-portrait-card image-wrapper";
    card.addEventListener("pointerenter", () => setMistiousGradient(gradientColors));
    card.addEventListener("pointerleave", () => setMistiousGradient(defaultMistiousGradient));

    const img = new Image();
    img.src = src;
    img.alt = captionText;
    img.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.className = "caption";
    caption.innerText = captionText;

    card.append(img, caption);
    mistiousGrid.appendChild(card);
  });
}

function setMistiousGradient(colors) {
  const targetGradient = colors.map(hexToRgb);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (gradientAnimationFrame) {
    cancelAnimationFrame(gradientAnimationFrame);
    gradientAnimationFrame = 0;
  }

  if (prefersReducedMotion) {
    writeMistiousGradient(targetGradient);
    return;
  }

  const startGradient = currentMistiousGradient.map((color) => [...color]);
  const startedAt = performance.now();
  const duration = 760;

  function animateGradient(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = easeInOutCubic(progress);
    const nextGradient = startGradient.map((startColor, index) =>
      startColor.map((channel, channelIndex) =>
        Math.round(channel + (targetGradient[index][channelIndex] - channel) * eased)
      )
    );

    writeMistiousGradient(nextGradient);

    if (progress < 1) {
      gradientAnimationFrame = requestAnimationFrame(animateGradient);
    } else {
      gradientAnimationFrame = 0;
    }
  }

  gradientAnimationFrame = requestAnimationFrame(animateGradient);
}

function writeMistiousGradient(colors) {
  const root = document.documentElement;

  currentMistiousGradient = colors.map((color) => [...color]);
  root.style.setProperty("--mistious-bg1", rgbToCss(colors[0]));
  root.style.setProperty("--mistious-bg2", rgbToCss(colors[1]));
  root.style.setProperty("--mistious-bg3", rgbToCss(colors[2]));
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");

  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function rgbToCss([r, g, b]) {
  return `rgb(${r}, ${g}, ${b})`;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

drawDoodles();
renderMistiousGrid();
