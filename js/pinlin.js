const portraitArtwork = [
  ["pinlin2.jpg", "Arknights, Dusk", [14, 47, 42]],
  ["pinlin3.jpg", "Spirited Away, Chihiro, Haku", [25, 27, 75]],
  ["pinlin4.jpg", "Arknights, Surtr", [71, 23, 19]],
  ["pinlin6.jpg", "Cardcaptor Sakura, Tomoyo", [46, 60, 47]],
  ["pinlin7.jpg", "Puella Magi Madoka Magica, Madoka", [43, 17, 30]],
  ["pinlin10.jpg", "Chainsaw Man, Aki", [16, 16, 24]],
  ["pinlin11.jpg", "Genshin Impact, Zhongli", [70, 41, 10]],
  ["pinlin12.jpg", "Chainsaw Man, Denji, Makima", [11, 10, 28]],
];

const landscapeArtwork = [
  ["pinlin1.jpg", "Arkights, Nian", [88, 13, 34]],
  ["pinlin5.jpg", "Jujutsu Kaisen, Gojo", [8, 14, 40]],
  ["pinlin8.jpg", "Chainsaw Man, Makima", [17, 16, 21]],
  ["pinlin9.jpg", "Chainsaw Man, Power", [50, 21, 13]],
  ["pinlin13.jpg", "Chainsaw Man, Reze", [16, 5, 28]],
];

const defaultChalkColor = [247, 252, 255];
let sharedBodyChalk = null;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBodyChalkLayer(index) {
  const layer = document.createElement("div");
  layer.className = "pinlin-body-chalk-fill";
  layer.dataset.chalkLayer = index;
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);
  return layer;
}

function clampColor(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function createReusableChalkTexture(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const rand = (min, max) => min + Math.random() * (max - min);
  const jitter = (amount) => (Math.random() - 0.5) * amount;

  function drawFiber(x, y, angle, length, fiberHeight, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + jitter(0.08));
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, alpha)})`;
    ctx.fillRect(-length * 0.5, -fiberHeight * 0.5, length, fiberHeight);
    ctx.restore();
  }

  function drawDryChalkLine(a, b, brush, opacityScale = 1, sampleStep = 1.55) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const nx = -dy / len;
    const ny = dx / len;
    const samples = Math.ceil(len / sampleStep);

    for (let i = 0; i < samples; i++) {
      const t = i / samples;
      const cx = a.x + dx * t;
      const cy = a.y + dy * t;
      const side = (Math.random() - Math.random()) * brush * 0.48;
      const x = cx + nx * side + jitter(brush * 0.08);
      const y = cy + ny * side + jitter(brush * 0.08);

      drawFiber(x, y, angle, rand(8, 38), rand(1.2, 4.8), rand(0.2, 0.52));

      if (Math.random() < 0.75) { // 0.58
        drawFiber(
          x + jitter(brush * 0.14),
          y + jitter(brush * 0.14),
          angle,
          rand(12, 56),
          rand(1.8, 6.2),
          rand(0.24, 0.62)
        );
      }

      if (Math.random() < 0.052) { // 0.026
        drawFiber(
          x + jitter(brush * 0.18),
          y + jitter(brush * 0.18),
          angle,
          rand(58, 142),
          rand(1, 3.2),
          rand(0.12, 0.3)
        );
      }
    }
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.105)";
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate((-14 * Math.PI) / 180);
  ctx.translate(-size / 2, -size / 2);

  for (let y = -size * 0.35; y < size * 1.35; y += 30) {
    drawDryChalkLine(
      { x: -size * 0.4, y: y + jitter(18) },
      { x: size * 1.4, y: y + jitter(18) },
      138,
      1,
      1.45
    );
  }

  ctx.restore();

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate((7 * Math.PI) / 180);
  ctx.translate(-size / 2, -size / 2);

  for (let y = -size * 0.25; y < size * 1.25; y += 58) {
    drawDryChalkLine(
      { x: -size * 0.3, y: y + jitter(16) },
      { x: size * 1.3, y: y + jitter(16) },
      92,
      0.42,
      2.35
    );
  }

  ctx.restore();

  const dustCount = Math.round(size * size * 0.0028);

  for (let i = 0; i < dustCount; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${rand(0.05, 0.22)})`;
    ctx.fillRect(rand(0, size), rand(0, size), rand(1.4, 6.2), rand(0.6, 2.2));
  }

  return canvas.toDataURL("image/png");
}

function createStaticBodyChalkBackground() {
  const layer = createBodyChalkLayer(0);
  let activeSource = null;

  function setColor(color) {
    const [r, g, b] = (color || defaultChalkColor).map(clampColor);

    layer.style.setProperty("--chalk-r", r);
    layer.style.setProperty("--chalk-g", g);
    layer.style.setProperty("--chalk-b", b);
    layer.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  setColor(defaultChalkColor);
  layer.style.setProperty("--chalk-texture", `url("${createReusableChalkTexture()}")`);

  return {
    setSourceColor(source, color) {
      activeSource = source;
      setColor(color);
    },
    resetSourceColor(source) {
      if (activeSource !== source) {
        return;
      }

      activeSource = null;
      setColor(defaultChalkColor);
    },
  };
}

function getBodyChalkBackground() {
  if (!sharedBodyChalk) {
    sharedBodyChalk = createStaticBodyChalkBackground();
  }

  return sharedBodyChalk;
}

function createImageWrapper(artwork, className) {
  const imageWrapper = document.createElement("div");
  imageWrapper.className = `image-wrapper ${className}`;

  const img = new Image();
  img.loading = "lazy";
  img.decoding = "async";
  img.src = `artwork/${artwork[0]}`;
  img.alt = artwork[1];
  imageWrapper.appendChild(img);

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerText = artwork[1];
  imageWrapper.appendChild(caption);

  attachChalkHover(imageWrapper, artwork);

  return imageWrapper;
}

function attachChalkHover(wrapper, artwork) {
  const chalkColor = artwork[2] || defaultChalkColor;
  const bodyChalk = getBodyChalkBackground();

  wrapper.addEventListener("pointerenter", () => {
    bodyChalk.setSourceColor(wrapper, chalkColor);
  });

  wrapper.addEventListener("pointerleave", () => {
    bodyChalk.resetSourceColor(wrapper);
  });
}

function takeDoubleLandscape(landscapes) {
  return [
    createImageWrapper(landscapes.pop(), "one-half"),
    createImageWrapper(landscapes.pop(), "one-half"),
  ];
}

function takeTriplePortrait(portraits) {
  return [
    createImageWrapper(portraits.pop(), "one-thirds"),
    createImageWrapper(portraits.pop(), "one-thirds"),
    createImageWrapper(portraits.pop(), "one-thirds"),
  ];
}

function takeMixedPair(portraits, landscapes) {
  const portrait = createImageWrapper(portraits.pop(), "one-thirds");
  const landscape = createImageWrapper(landscapes.pop(), "two-thirds");
  return Math.random() >= 0.5 ? [portrait, landscape] : [landscape, portrait];
}

function appendRemainingImages(container, portraits, landscapes, finalLandscape) {
  while (landscapes.length) {
    container.appendChild(createImageWrapper(landscapes.pop(), "two-thirds"));
  }

  while (portraits.length >= 2) {
    container.appendChild(createImageWrapper(portraits.pop(), "one-half"));
    container.appendChild(createImageWrapper(portraits.pop(), "one-half"));
  }

  while (portraits.length) {
    container.appendChild(createImageWrapper(portraits.pop(), "one-thirds"));
  }

  if (finalLandscape) {
    container.appendChild(createImageWrapper(finalLandscape, "large-image"));
  }
}

function renderPinlinArtwork() {
  const container = document.getElementById("extra-artwork-container");
  if (!container) return;

  const portraits = shuffleArray([...portraitArtwork]);
  const landscapes = shuffleArray([...landscapeArtwork]);
  const finalLandscape = landscapes.pop();
  const patterns = [];

  while (landscapes.length >= 2) {
    patterns.push(takeDoubleLandscape(landscapes));
  }

  while (portraits.length >= 3) {
    patterns.push(takeTriplePortrait(portraits));
  }

  if (portraits.length && landscapes.length) {
    patterns.push(takeMixedPair(portraits, landscapes));
  }

  shuffleArray(patterns).forEach((pattern) => {
    pattern.forEach((imageWrapper) => container.appendChild(imageWrapper));
  });

  appendRemainingImages(container, portraits, landscapes, finalLandscape);
}

getBodyChalkBackground();
renderPinlinArtwork();
