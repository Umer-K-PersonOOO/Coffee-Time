portrait_artwork = [
  ["lixizu1.jpg", "Genshin Impact, Yae Miko"],
  ["lixizu2.jpg", "Genshin Impact, Ganyu"],
  ["lixizu3.jpg", "Genshin Impact, Chongyun"],
  ["lixizu4.jpg", "Genshin Impact, Keqing"],
  ["lixizu5.jpg", "Genshin Impact, Xiao"],
  ["lixizu6.jpg", "Genshin Impact, Hu Tao"],
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const selectedPortraitImages = shuffleArray(portrait_artwork);
const extraArtworkContainer = document.getElementById(
  "extra-artwork-container"
);

const artworkContainer = document.getElementById("artwork-stuff");

for (let i = 0; i < portrait_artwork.length; i++) {
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image-wrapper";

  const img = new Image();
  img.src = "artwork/" + portrait_artwork[i][0];
  img.alt = portrait_artwork[i][1];

  imageWrapper.appendChild(img);

  const caption = document.createElement("div");
  caption.className = "caption";
  caption.innerText = portrait_artwork[i][1];

  imageWrapper.appendChild(caption);
  artworkContainer.appendChild(imageWrapper);
}
