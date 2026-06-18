// Format: ['path/to/image.jpg', 'caption', 'size-class']
const artwork = [
  ["candypaintcafe/24.webp", "pokemon, pikachu", "one-thirds"],
  ["candypaintcafe/28.webp", "pokemon, eevee", "one-thirds"],
  ["candypaintcafe/41.webp", "pokemon, sylveon", "one-thirds"],
  ["candypaintcafe/61.webp", "shiba, long boi", "one-thirds"],
  ["candypaintcafe/62.webp", "shiba, long boi", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_ENAMEL_Cat01.webp", "cat, riceball", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_ENAMEL_Cat04.webp", "cat, night theme", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_ENAMEL_Cat06.webp", "cat, cat-cus", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_STICKERS_CashRulesNook.webp", "animal crossing, tom nook", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_STICKERS_SHIBA_Dessert02.webp", "shiba, dessert", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_STICKERS_SHIBA_Donut02.webp", "shiba, donut", "one-thirds"],
  ["candypaintcafe/CPC_PHOTO_STICKERS_SHIBA_Sushi02.webp", "shiba, sushi", "one-thirds"],
];

const polaroidSizes = ["small", "large", "wide", "tall"];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createStringSvg() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("candypaint-string-svg");
  svg.setAttribute("aria-hidden", "true");

  const stringPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  stringPath.classList.add("candypaint-red-string");

  const highlightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  highlightPath.classList.add("candypaint-red-string-highlight");

  svg.append(stringPath, highlightPath);

  return { svg, stringPath, highlightPath };
}

function createPolaroidCard(image, index, scheduleStringUpdate) {
  const card = document.createElement("article");
  const size = polaroidSizes[index % polaroidSizes.length];
  card.className = `candypaint-polaroid-card ${size}`;
  card.style.setProperty("--card-tilt", `${(Math.random() - 0.5) * 7}deg`);

  const hole = document.createElement("span");
  hole.className = "candypaint-string-hole";

  const paper = document.createElement("div");
  paper.className = "candypaint-polaroid-paper";

  const photoArea = document.createElement("div");
  photoArea.className = "candypaint-photo-area";

  const img = new Image();
  img.loading = "lazy";
  img.decoding = "async";
  img.src = image[0];
  img.alt = image[1];
  img.addEventListener("load", scheduleStringUpdate);

  const caption = document.createElement("div");
  caption.className = "candypaint-polaroid-caption";

  const captionMain = document.createElement("p");
  captionMain.className = "candypaint-caption-main";
  captionMain.innerText = image[1];

  const captionDate = document.createElement("p");
  captionDate.className = "candypaint-caption-date";
  captionDate.innerText = "CPC";

  photoArea.appendChild(img);
  caption.append(captionMain, captionDate);
  paper.append(photoArea, caption);
  card.append(hole, paper);

  return card;
}

function getHolePoints(board) {
  const boardRect = board.getBoundingClientRect();

  return [...board.querySelectorAll(".candypaint-polaroid-card")].map((card) => {
    const hole = card.querySelector(".candypaint-string-hole");
    const holeRect = hole.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    return {
      x: holeRect.left + holeRect.width / 2 - boardRect.left,
      y: holeRect.top + holeRect.height / 2 - boardRect.top,
      rowY: cardRect.top - boardRect.top,
    };
  });
}

function orderPointsByGridRows(points) {
  const sorted = [...points].sort((a, b) => a.rowY - b.rowY);
  const rows = [];

  sorted.forEach((point) => {
    const lastRow = rows[rows.length - 1];

    if (!lastRow || Math.abs(lastRow.anchor - point.rowY) > 70) {
      rows.push({
        anchor: point.rowY,
        points: [point],
      });
    } else {
      lastRow.points.push(point);
      lastRow.anchor = lastRow.points.reduce((sum, p) => sum + p.rowY, 0) / lastRow.points.length;
    }
  });

  return rows.flatMap((row, index) => {
    const rowPoints = row.points.sort((a, b) => a.x - b.x);
    return index % 2 === 0 ? rowPoints : rowPoints.reverse();
  });
}

function curveToPoint(d, from, to, index) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const sameRow = Math.abs(dy) < 90;
  const direction = dx >= 0 ? 1 : -1;

  if (sameRow && distance > 130) {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const connectorStyle = index % 4;

    if (connectorStyle === 0) {
      return `${d}
        C ${from.x + dx * 0.26} ${from.y - 16},
          ${midX - direction * 34} ${midY + 32},
          ${midX} ${midY + 24}
        C ${midX + direction * 34} ${midY + 16},
          ${to.x - dx * 0.22} ${to.y - 16},
          ${to.x} ${to.y}
      `;
    }

    if (connectorStyle === 1) {
      const loopRadius = Math.min(18, Math.max(10, distance * 0.055));
      const loopStartX = midX - direction * loopRadius;
      const loopY = midY + 22;

      return `${d}
        C ${from.x + dx * 0.25} ${from.y - 16},
          ${loopStartX - direction * 26} ${loopY - 14},
          ${loopStartX} ${loopY}
        a ${loopRadius} ${loopRadius * 0.72} 0 1 1 ${direction * loopRadius * 2} 0
        C ${loopStartX + direction * 32} ${loopY + 14},
          ${to.x - dx * 0.22} ${to.y - 18},
          ${to.x} ${to.y}
      `;
    }

    if (connectorStyle === 2) {
      const loopRadius = Math.min(24, Math.max(13, distance * 0.08));
      const loopStartX = midX - direction * loopRadius;
      const loopY = midY + 32;

      return `${d}
        C ${from.x + dx * 0.24} ${from.y - 20},
          ${loopStartX - direction * 34} ${loopY - 18},
          ${loopStartX} ${loopY}
        a ${loopRadius} ${loopRadius} 0 1 1 ${direction * loopRadius * 2} 0
        a ${loopRadius} ${loopRadius} 0 1 1 ${-direction * loopRadius * 2} 0
        C ${loopStartX + direction * 38} ${loopY + 20},
          ${to.x - dx * 0.22} ${to.y - 22},
          ${to.x} ${to.y}
      `;
    }

    return `${d}
      C ${from.x + dx * 0.22} ${from.y - 18},
        ${midX - direction * 46} ${midY - 4},
        ${midX - direction * 12} ${midY + 18}
      C ${midX + direction * 18} ${midY + 38},
        ${midX + direction * 42} ${midY - 12},
        ${midX + direction * 66} ${midY + 14}
      C ${to.x - dx * 0.2} ${to.y + 28},
        ${to.x - dx * 0.14} ${to.y - 18},
        ${to.x} ${to.y}
    `;
  }

  return `${d}
    C ${from.x + dx * 0.18} ${from.y + dy * 0.35 + 46},
      ${to.x - dx * 0.18} ${to.y - dy * 0.35 - 46},
      ${to.x} ${to.y}
  `;
}

function buildStringPath(points) {
  if (!points.length) return "";

  const first = points[0];
  const last = points[points.length - 1];

  let d = `
    M ${first.x - 95} ${first.y - 12}
    C ${first.x - 62} ${first.y + 20},
      ${first.x - 38} ${first.y - 24},
      ${first.x} ${first.y}
  `;

  for (let i = 1; i < points.length; i++) {
    d = curveToPoint(d, points[i - 1], points[i], i);
  }

  return `${d}
    C ${last.x + 38} ${last.y + 20},
      ${last.x + 72} ${last.y - 22},
      ${last.x + 110} ${last.y + 4}
  `;
}

function initializePolaroidStringBoard(board, stringPath, highlightPath) {
  let rafId = 0;

  function updateString() {
    rafId = 0;

    const boardRect = board.getBoundingClientRect();
    const svg = stringPath.closest("svg");
    svg.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);

    const points = orderPointsByGridRows(getHolePoints(board));
    const d = buildStringPath(points);

    stringPath.setAttribute("d", d);
    highlightPath.setAttribute("d", d);
  }

  function scheduleStringUpdate() {
    if (rafId) return;
    rafId = requestAnimationFrame(updateString);
  }

  window.addEventListener("resize", scheduleStringUpdate);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleStringUpdate);
    resizeObserver.observe(board);

    board.querySelectorAll(".candypaint-polaroid-card, .candypaint-polaroid-card img").forEach((el) => {
      resizeObserver.observe(el);
    });
  }

  scheduleStringUpdate();

  return scheduleStringUpdate;
}

function renderCandypaintArtwork() {
  const photoGrid = document.getElementById("artwork-grid-container");
  if (!photoGrid) return;

  photoGrid.classList.add("candypaint-polaroid-board");
  photoGrid.innerHTML = "";

  const { svg, stringPath, highlightPath } = createStringSvg();
  photoGrid.appendChild(svg);

  const scheduleStringUpdate = initializePolaroidStringBoard(photoGrid, stringPath, highlightPath);
  const selectedImages = shuffleArray([...artwork]);

  selectedImages.forEach((image, index) => {
    photoGrid.appendChild(createPolaroidCard(image, index, scheduleStringUpdate));
  });

  scheduleStringUpdate();
}

renderCandypaintArtwork();
