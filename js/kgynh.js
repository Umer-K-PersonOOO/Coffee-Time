portrait_artwork = [
  ["kgynh1.jpg", "Chainsaw Man, Makima"],
  ["kgynh4.jpg", "Chainsaw Man, Yoru"],
  ["kgynh9.jpg", "Genshin Impact, Beidou, Ningguang"],
];

landscape_artwork = [
  ["kgynh2.jpg", "Chainsaw Man, Power"],
  ["kgynh3.jpg", "Chainsaw Man, Power, Denji"],
  ["kgynh5.jpg", "Chainsaw Man, Danji, Makima"],
  ["kgynh6.jpg", "Chainsaw Man, Angel Devil"],
  ["kgynh7.jpg", "Chainsaw Man, Yoru, Asa"],
  ["kgynh8.jpg", "Genshin Impact, Beidou, Ningguang"],
  ["kgynh10.jpg", "Genshin Impact, Beidou, Ningguang"],
  ["kgynh11.jpg", "Hunter x Hunter, Kurapika"],
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
  const img2 = new Image();
  img2.src = "artwork/" + landscape_artwork2_src[0];
  img2.alt = landscape_artwork2_src[1];

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
  const img2 = new Image();
  img2.src = "artwork/" + landscape_artwork_src[0];
  img2.alt = landscape_artwork_src[1];

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
  const img2 = new Image();
  img2.src = "artwork/" + portrait_artwork_src[0];
  img2.alt = portrait_artwork_src[1];

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

function addImagesTwopules(selectedPortraitImages, selectedLandscapeImages) {
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
    ans.push(set1, set2, set3);
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
    ans.push(set1, set2, set3);
  }
  ans.splice(
    Math.floor(Math.random() * 3),
    0,
    doubleLandscape(selectedLandscapeImages)
  );
  return ans;
}

sizedImages = addImagesTwopules(
  selectedPortraitImages,
  selectedLandscapeImages
);
for (let i = 0; i < sizedImages.length; i++) {
  extraArtworkContainer.appendChild(sizedImages[i][0]);
  extraArtworkContainer.appendChild(sizedImages[i][1]);
}
