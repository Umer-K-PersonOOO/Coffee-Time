var can = Canvallax({
  className: "bg-canvas opacity-toggle",
  damping: 40,
});

var backCan = Canvallax({
  className: "bg-canvas ",
  damping: 40,
});

(function () {
  var origWidth = (width = document.body.clientWidth),
    origHeight = (height = document.body.scrollHeight);

  function updateCanvasDimensions() {
    height = document.body.scrollHeight;
    width = document.body.clientWidth;

    var heightScale = height / origHeight;

    can.elements.forEach((element) => {
      element.maxX = width;
      element.origY = element.origY || element.y;
      element.y = element.origY * heightScale;
    });

  }

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var stars = [],
    number = 300,
    i = 0,
    distance;

  for (; i < number; i++) {
    distance = randomRange(0.1, 0.3);
    stars.push(
      Canvallax.Circle({
        x: Math.random() * width,
        y: Math.random() * height * 0.9,
        distance: distance,
        size: 4,
        fill: "#fff",
        zIndex: 9,
      })
    );
  }

  can.add(stars);
  backCan.add(stars);

  window.addEventListener("resize", function () {
    height = document.body.scrollHeight;
    width = document.body.clientWidth;

    var i = can.elements.length,
      max = document.body.clientWidth,
      heightScale = height / origHeight;

    while (i--) {
      can.elements[i].maxX = max;
      can.elements[i].origY = can.elements[i].origY || can.elements[i].y;
      can.elements[i].y = can.elements[i].origY * heightScale;
    }
  });

  function bestCandidateSampler(width, height, numCandidates) {
    var samples = [];

    function findDistance(a, b) {
      var dx = a[0] - b[0],
        dy = a[1] - b[1];
      return dx * dx + dy * dy;
    }

    function findClosest(c) {
      var i = samples.length,
        sample,
        closest,
        distance,
        closestDistance;

      while (i--) {
        sample = samples[i];
        distance = findDistance(sample, c);

        if (!closestDistance || distance < closestDistance) {
          closest = sample;
          closestDistance = distance;
        }
      }

      return closest;
    }

    function getSample() {
      var bestCandidate,
        bestDistance = 0,
        i = 0,
        c,
        d;

      c = [Math.random() * width, Math.random() * height];

      if (samples.length < 1) {
        bestCandidate = c;
      } else {
        for (; i < numCandidates; i++) {
          c = [Math.random() * width, Math.random() * height];
          d = findDistance(findClosest(c), c);

          if (d > bestDistance) {
            bestDistance = d;
            bestCandidate = c;
          }
        }
      }

      samples.push(bestCandidate);
      return bestCandidate;
    }

    getSample.all = function () {
      return samples;
    };
    getSample.samples = samples;

    return getSample;
  }

  var getCandidate = bestCandidateSampler(width, height, 10);

  portrait_artwork = [
    ["batensan2.jpg", "Genshin Impact, Venti, Lumine", "#446c8f", "#ded4b3"],
    ["batensan8.jpg", "Genshin Impact, Venti, Lumine", "#cfac6a", "#f9f4d6"],
    ["batensan1.jpg", "The Great Ace Attorney", "#7e424a", "#40384f"],
    ["batensan11.jpg", "Professor Layton", "#275b70", "#f9eda1"],
    ["batensan12.jpg", "Holostars, Bettel", "#e6b4ab", "#c3d7d8"],
    ["batensan3.jpg", "Demon Slayer", "#473f57", "#e4ad86"],
  ];

  landscape_artwork = [
    [
      "batensan10.jpg",
      "The Legend of Zelda: Breath of the Wild, Zelda, Link",
      "#3c5c85",
      "#cec398",
    ],
    ["batensan7.jpg", "Demon Slayer, Shinobu, Kanae", "#ddc3cc", "#fdf6ee"],
    ["batensan6.jpg", "Moon Observatory, Ven", "#607391", "#ead5c0"],
    ["batensan9.jpg", "Genshin Impact, Venti", "#5e8da7", "#fbddb9"],
    ["batensan4.jpg", "Nier:Automata", "#4b6e94", "#ddbf99"],
    ["batensan5.jpg", "Nier:Automata", "#ffffff", "#aad2b2"],
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const selectedPortraitImages = shuffleArray(portrait_artwork);
  const selectedLandscapeImages = shuffleArray(landscape_artwork);
  const extraArtworkContainer = document.getElementById(
    "extra-artwork-container"
  );

  function doubleLandscape(landscape_array) {
    const landscape_artwork_src = landscape_array.pop();
    const landscape_artwork2_src = landscape_array.pop();

    const imageWrapper = document.createElement("div");
    const imageWrapper2 = document.createElement("div");
    imageWrapper.className = "image-wrapper one-half";
    imageWrapper2.className = "image-wrapper one-half";

    const img = new Image();
    img.src = "artwork/" + landscape_artwork_src[0];
    img.alt = landscape_artwork_src[1];
    addEventListener(imageWrapper, landscape_artwork_src);
    const img2 = new Image();
    img2.src = "artwork/" + landscape_artwork2_src[0];
    img2.alt = landscape_artwork2_src[1];
    addEventListener(imageWrapper2, landscape_artwork2_src);

    imageWrapper.appendChild(img);
    imageWrapper2.appendChild(img2);

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerText = landscape_artwork_src[1];
    const caption2 = document.createElement("div");
    caption2.className = "caption";
    caption2.innerText = landscape_artwork2_src[1];

    imageWrapper.appendChild(caption);
    imageWrapper2.appendChild(caption2);

    return [imageWrapper, imageWrapper2];
  }

  function triplePortrait(portrait_array) {
    const portrait_artwork_src = portrait_array.pop();
    const portrait_artwork2_src = portrait_array.pop();
    const portrait_artwork3_src = portrait_array.pop();

    const imageWrapper = document.createElement("div");
    const imageWrapper2 = document.createElement("div");
    const imageWrapper3 = document.createElement("div");

    imageWrapper.className = "image-wrapper one-thirds";
    imageWrapper2.className = "image-wrapper one-thirds";
    imageWrapper3.className = "image-wrapper one-thirds";

    const img = new Image();
    img.src = "artwork/" + portrait_artwork_src[0];
    img.alt = portrait_artwork_src[1];
    addEventListener(imageWrapper, portrait_artwork_src);
    const img2 = new Image();
    img2.src = "artwork/" + portrait_artwork2_src[0];
    img2.alt = portrait_artwork2_src[1];
    addEventListener(imageWrapper2, portrait_artwork2_src);
    const img3 = new Image();
    img3.src = "artwork/" + portrait_artwork3_src[0];
    img3.alt = portrait_artwork3_src[1];
    addEventListener(imageWrapper3, portrait_artwork3_src);

    imageWrapper.appendChild(img);
    imageWrapper2.appendChild(img2);
    imageWrapper3.appendChild(img3);

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerText = portrait_artwork_src[1];
    const caption2 = document.createElement("div");
    caption2.className = "caption";
    caption2.innerText = portrait_artwork2_src[1];
    const caption3 = document.createElement("div");
    caption3.className = "caption";
    caption3.innerText = portrait_artwork3_src[1];

    imageWrapper.appendChild(caption);
    imageWrapper2.appendChild(caption2);
    imageWrapper3.appendChild(caption3);

    return [imageWrapper, imageWrapper2, imageWrapper3];
  }

  function left_port_right_land(portrait_array, landscape_array) {
    const portrait_artwork_src = portrait_array.pop();
    const landscape_artwork_src = landscape_array.pop();

    const imageWrapper = document.createElement("div");
    const imageWrapper2 = document.createElement("div");

    imageWrapper.className = "image-wrapper one-thirds";
    imageWrapper2.className = "image-wrapper two-thirds";

    const img = new Image();
    img.src = "artwork/" + portrait_artwork_src[0];
    img.alt = portrait_artwork_src[1];
    addEventListener(imageWrapper, portrait_artwork_src);
    const img2 = new Image();
    img2.src = "artwork/" + landscape_artwork_src[0];
    img2.alt = landscape_artwork_src[1];
    addEventListener(imageWrapper2, landscape_artwork_src);

    imageWrapper.appendChild(img);
    imageWrapper2.appendChild(img2);

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerText = portrait_artwork_src[1];
    const caption2 = document.createElement("div");
    caption2.className = "caption";
    caption2.innerText = landscape_artwork_src[1];

    imageWrapper.appendChild(caption);
    imageWrapper2.appendChild(caption2);

    return [imageWrapper, imageWrapper2];
  }

  function right_port_left_landscape(portrait_array, landscape_array) {
    const portrait_artwork_src = portrait_array.pop();
    const landscape_artwork_src = landscape_array.pop();

    const imageWrapper = document.createElement("div");
    const imageWrapper2 = document.createElement("div");

    imageWrapper.className = "image-wrapper two-thirds";
    imageWrapper2.className = "image-wrapper one-thirds";

    const img = new Image();
    img.src = "artwork/" + landscape_artwork_src[0];
    img.alt = landscape_artwork_src[1];
    addEventListener(imageWrapper, landscape_artwork_src);
    const img2 = new Image();
    img2.src = "artwork/" + portrait_artwork_src[0];
    img2.alt = portrait_artwork_src[1];
    addEventListener(imageWrapper2, portrait_artwork_src);

    imageWrapper.appendChild(img);
    imageWrapper2.appendChild(img2);

    const caption = document.createElement("div");
    caption.className = "caption";
    caption.innerText = landscape_artwork_src[1];
    const caption2 = document.createElement("div");
    caption2.className = "caption";
    caption2.innerText = portrait_artwork_src[1];

    imageWrapper.appendChild(caption);
    imageWrapper2.appendChild(caption2);

    return [imageWrapper, imageWrapper2];
  }

  function tripleSet(selectedPortraitImages, selectedLandscapeImages) {
    ans = [];

    if (Math.random() >= 0.5) {
      const set1 = left_port_right_land(
        selectedPortraitImages,
        selectedLandscapeImages
      );
      const set2 = right_port_left_landscape(
        selectedPortraitImages,
        selectedLandscapeImages
      );
      const set3 = left_port_right_land(
        selectedPortraitImages,
        selectedLandscapeImages
      );
      ans.push(set1[0], set1[1], set2[0], set2[1], set3[0], set3[1]);
    } else {
      const set1 = right_port_left_landscape(
        selectedPortraitImages,
        selectedLandscapeImages
      );
      const set2 = left_port_right_land(
        selectedPortraitImages,
        selectedLandscapeImages
      );
      const set3 = right_port_left_landscape(
        selectedPortraitImages,
        selectedLandscapeImages
      );
      ans.push(set1[0], set1[1], set2[0], set2[1], set3[0], set3[1]);
    }
    return ans;
  }

  function addEventListener(element, array) {
    element.addEventListener("mouseenter", () => {
      document.body.style.setProperty("--start", array[2]);
      document.body.style.setProperty("--end", array[3]);
    });
    element.addEventListener("mouseleave", () => {
      document.body.style.setProperty("--start", "#2879a6");
      document.body.style.setProperty("--end", "#ecd5c1");
    });
  }
  const imagePatterns = [
    doubleLandscape(selectedLandscapeImages),
    triplePortrait(selectedPortraitImages),
    tripleSet(selectedPortraitImages, selectedLandscapeImages),
  ];
  shuffleArray(imagePatterns);
  for (const pattern of imagePatterns) {
    for (const image of pattern) {
      extraArtworkContainer.appendChild(image);
    }
  }

  const landscape_artwork_src = landscape_artwork.pop();

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-wrapper large-image";
  const img = new Image();
  img.src = "artwork/" + landscape_artwork_src[0];
  img.alt = landscape_artwork_src[1];
  addEventListener(imageWrapper, landscape_artwork_src);
  imageWrapper.appendChild(img);
  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerText = landscape_artwork_src[1];
  imageWrapper.appendChild(caption);
  extraArtworkContainer.appendChild(imageWrapper);

  const images = extraArtworkContainer.querySelectorAll("img");
  checkImagesLoaded(images, updateCanvasDimensions);
})();
