const portraitArtwork = [
  ["pinlin2.jpg", "Arknights, Dusk", [14, 47, 42]],
  ["pinlin3.jpg", "Spirited Away, Chihiro, Haku", [25, 27, 75]],
  ["pinlin4.jpg", "Arknights, Surtr", [71, 23, 19]],
  ["pinlin6.jpg", "Cardcaptor Sakura, Tomoyo", [46, 60, 47]],
  ["pinlin7.jpg", "Puella Magi Madoka Magica, Madoka", [43, 17, 30]],
  ["pinlin10.jpg", "Chainsaw Man, Aki", [40, 55, 75]],
  ["pinlin11.jpg", "Genshin Impact, Zhongli", [41, 30, 28]],
  ["pinlin12.jpg", "Chainsaw Man, Denji, Makima", [11, 10, 28]],
];

const landscapeArtwork = [
  ["pinlin1.jpg", "Arkights, Nian", [88, 13, 34]],
  ["pinlin5.jpg", "Jujutsu Kaisen, Gojo", [10, 24, 82]],
  ["pinlin8.jpg", "Chainsaw Man, Makima", [17, 16, 21]],
  ["pinlin9.jpg", "Chainsaw Man, Power", [93, 50, 19]],
  ["pinlin13.jpg", "Chainsaw Man, Reze", [36, 23, 50]],
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBodyChalkCanvas() {
  const canvas = document.createElement("canvas");
  canvas.className = "pinlin-body-chalk-fill";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  return canvas;
}

function createImageWrapper(artwork, className) {
  const imageWrapper = document.createElement("div");
  imageWrapper.className = `image-wrapper ${className}`;

  const img = new Image();
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
  const chalkAngle = -22 + Math.random() * 28;

  const chalkColor = artwork[2] || [28, 25, 22];

  const imageChalk = createBodyChalkBackground(
    createBodyChalkCanvas(),
    chalkColor
  );

  wrapper.addEventListener("pointerenter", () => imageChalk.start(chalkAngle));
  wrapper.addEventListener("pointerleave", () => imageChalk.stop());
}

function createBodyChalkBackground(canvas, chalkColor = [28, 25, 22]) {
  let isDrawingFirstTime = false;
  let pendingFadeAfterDraw = false;
  const ctx = canvas.getContext("2d");
  const settings = {
    angle: -14,
    brushWidth: 96,
    rowGap: 48,
    segmentsPerFrame: 8,
    chalkColor,
  };

  let width = 0;
  let height = 0;
  let viewportTop = 0;
  let viewportHeight = 1;
  let dpr = 1;
  let activePasses = [];
  let animationFrame = 0;
  let fadeTimer = 0;
  let activeHovers = 0;
  let hasDrawing = false;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function jitter(amount) {
    return (Math.random() - 0.5) * amount;
  }

  function resizeCanvas() {
    const nextWidth = Math.max(
      1,
      document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth
    );
    const nextHeight = Math.max(
      1,
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.clientHeight
    );
    viewportTop = window.scrollY || document.documentElement.scrollTop || 0;
    viewportHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight);
    const nextDpr = Math.max(1, window.devicePixelRatio || 1);

    const nextCanvasWidth = Math.round(nextWidth * nextDpr);
    const nextCanvasHeight = Math.round(nextHeight * nextDpr);
    const sizeChanged = canvas.width !== nextCanvasWidth || canvas.height !== nextCanvasHeight;

    width = nextWidth;
    height = nextHeight;
    dpr = nextDpr;

    if (sizeChanged) {
      canvas.width = nextCanvasWidth;
      canvas.height = nextCanvasHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      activePasses = [];
      hasDrawing = false;
    }

    if (canvas.style.width !== `${width}px`) canvas.style.width = `${width}px`;
    if (canvas.style.height !== `${height}px`) canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function cubicPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x:
        mt * mt * mt * p0.x +
        3 * mt * mt * t * p1.x +
        3 * mt * t * t * p2.x +
        t * t * t * p3.x,
      y:
        mt * mt * mt * p0.y +
        3 * mt * mt * t * p1.y +
        3 * mt * t * t * p2.y +
        t * t * t * p3.y,
    };
  }

  function addCubic(out, p0, p1, p2, p3, steps) {
    for (let i = 1; i <= steps; i++) {
      out.push(cubicPoint(p0, p1, p2, p3, i / steps));
    }
  }

  function buildConnectedPath() {
    const out = [];
    const left = -width * 0.75;
    const right = width * 1.75;
    const startY = viewportTop - viewportHeight * 0.2;
    const finishY = viewportTop + viewportHeight * 1.3;
    const rows = Math.ceil((finishY - startY) / settings.rowGap);

    let x = left;
    let y = startY + jitter(18);

    out.push({ x, y });

    for (let i = 0; i < rows; i++) {
      const goingRight = i % 2 === 0;
      const endX = goingRight ? right : left;
      const rowY = startY + i * settings.rowGap + jitter(18);

      addCubic(
        out,
        { x, y },
        { x: x + (goingRight ? width * 0.45 : -width * 0.45), y: y + jitter(34) },
        {
          x: endX + (goingRight ? -width * 0.45 : width * 0.45),
          y: rowY + jitter(34),
        },
        { x: endX, y: rowY },
        42
      );

      if (i < rows - 1) {
        const nextY = startY + (i + 1) * settings.rowGap + jitter(18);
        addCubic(
          out,
          { x: endX, y: rowY },
          { x: endX + (goingRight ? 70 : -70), y: rowY + 22 + jitter(12) },
          { x: endX + (goingRight ? 70 : -70), y: nextY - 22 + jitter(12) },
          { x: endX, y: nextY },
          14
        );
        x = endX;
        y = nextY;
      }
    }

    return out;
  }

  function withChalkAngle(angle, drawFn) {
    ctx.save();
    ctx.translate(width / 2, viewportTop + viewportHeight / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-width / 2, -(viewportTop + viewportHeight / 2));
    drawFn();
    ctx.restore();
  }

  function drawFiber(x, y, angle, length, fiberHeight, alpha) {
    const [r, g, b] = settings.chalkColor;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + jitter(0.08));
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    ctx.fillRect(-length * 0.5, -fiberHeight * 0.5, length, fiberHeight);
    ctx.restore();
  }

  function drawDryChalkSegment(a, b, chalkAngle) {
    const brush = settings.brushWidth;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const nx = -dy / len;
    const ny = dx / len;

    withChalkAngle(chalkAngle, () => {
      const samples = Math.ceil(len / 1.2);

      for (let i = 0; i < samples; i++) {
        const t = i / samples;
        const cx = a.x + dx * t;
        const cy = a.y + dy * t;
        const side = (Math.random() - Math.random()) * brush * 0.48;
        const x = cx + nx * side + jitter(brush * 0.08);
        const y = cy + ny * side + jitter(brush * 0.08);

        drawFiber(x, y, angle, rand(5, 30), rand(0.8, 3.2), rand(0.12, 0.34));

        if (Math.random() < 0.4) {
          drawFiber(
            x + jitter(brush * 0.14),
            y + jitter(brush * 0.14),
            angle,
            rand(8, 42),
            rand(1.2, 4.5),
            rand(0.18, 0.44)
          );
        }

        if (Math.random() < 0.015) {
          drawFiber(
            x + jitter(brush * 0.18),
            y + jitter(brush * 0.18),
            angle,
            rand(45, 120),
            rand(0.7, 2.2),
            rand(0.08, 0.2)
          );
        }
      }

      for (let i = 0; i < samples * 0.35; i++) {
        const t = Math.random();
        const cx = a.x + dx * t;
        const cy = a.y + dy * t;
        const side = rand(-brush * 0.55, brush * 0.55);

        drawFiber(
          cx + nx * side + jitter(brush * 0.06),
          cy + ny * side + jitter(brush * 0.06),
          angle,
          rand(6, 36),
          rand(0.5, 2),
          rand(0.075, 0.19)
        );
      }
    });
  }

  function drawBoardDust() {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(0,0,0,${rand(0.018, 0.06)})`;
      ctx.fillRect(rand(0, width), rand(0, height), rand(1, 4), rand(0.35, 1.2));
    }

    ctx.restore();
  }

  function animate() {
    if (!activePasses.length) {
      animationFrame = 0;
      return;
    }

    activePasses.forEach((pass) => {
      for (let i = 0; i < settings.segmentsPerFrame && pass.cursor < pass.points.length; i++) {
        drawDryChalkSegment(pass.points[pass.cursor - 1], pass.points[pass.cursor], pass.angle);
        pass.cursor++;
      }
    });

    activePasses = activePasses.filter((pass) => pass.cursor < pass.points.length);

    if (activePasses.length) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animationFrame = 0;
      isDrawingFirstTime = false;

      if (pendingFadeAfterDraw && activeHovers === 0) {
        pendingFadeAfterDraw = false;
        fadeChalkOut();
      }
    }
  }

function showChalkInstantly() {
  canvas.style.display = "block";
  canvas.style.transition = "none";
  canvas.classList.add("pinlin-chalk-active");
  void canvas.offsetWidth;
  canvas.style.transition = "";
}

function showChalkWithFade() {
  canvas.style.display = "block";

  // Appear in 2.5 seconds
  canvas.style.setProperty("--chalk-fade-time", "2.5s");

  requestAnimationFrame(() => {
    canvas.classList.add("pinlin-chalk-active");
  });
}

function fadeChalkOut() {
  fadeTimer = setTimeout(() => {
    // Disappear in 10 seconds
    canvas.style.setProperty("--chalk-fade-time", "10s");
    canvas.classList.remove("pinlin-chalk-active");

    setTimeout(() => {
      if (!canvas.classList.contains("pinlin-chalk-active")) {
        canvas.style.display = "none";
      }
    }, 10000);

    fadeTimer = 0;
  }, 120);
}

  function start(angle = settings.angle) {
    activeHovers++;

    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimer = 0;
    }

    pendingFadeAfterDraw = false;

    // Already drawn once.
    // Future hovers fade in instead of snapping in.
    if (hasDrawing) {
      showChalkWithFade();
      return;
    }

    // First hover for this image.
    // Snap fully visible before drawing starts.
    resizeCanvas();
    drawBoardDust();

    hasDrawing = true;
    isDrawingFirstTime = true;

    activePasses.push({
      points: buildConnectedPath(),
      angle,
      cursor: 1,
    });

    showChalkInstantly();

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function stop() {
    activeHovers = Math.max(0, activeHovers - 1);

    if (activeHovers > 0) return;

    // If first draw is still happening, do not fade yet.
    // Keep it fully opaque until drawing completes.
    if (isDrawingFirstTime) {
      pendingFadeAfterDraw = true;
      return;
    }

    fadeChalkOut();
  }

    return { start, stop };
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

renderPinlinArtwork();
