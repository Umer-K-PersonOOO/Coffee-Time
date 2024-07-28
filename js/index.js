// List of images in the folder
const images = [
  { src: "thumbnail/allenerie1.avif", alt: "allenerie1" },
  { src: "thumbnail/allenerie2.avif", alt: "allenerie2" },
  { src: "thumbnail/allenerie3.avif", alt: "allenerie3" },
  { src: "thumbnail/batensan1.webp", alt: "batensan1" },
  { src: "thumbnail/batensan2.webp", alt: "batensan2" },
  { src: "thumbnail/batensan3.webp", alt: "batensan3" },
  { src: "thumbnail/batensan4.webp", alt: "batensan4" },
  { src: "thumbnail/batensan5.webp", alt: "batensan5" },
  { src: "thumbnail/batensan6.webp", alt: "batensan6" },
  { src: "thumbnail/batensan7.webp", alt: "batensan7" },
  { src: "thumbnail/batensan8.webp", alt: "batensan8" },
  { src: "thumbnail/batensan9.webp", alt: "batensan9" },
  { src: "thumbnail/batensan10.webp", alt: "batensan10" },
  { src: "thumbnail/batensan11.webp", alt: "batensan11" },
  { src: "thumbnail/batensan12.webp", alt: "batensan12" },
  { src: "thumbnail/candypaintcafe1.avif", alt: "candypaintcafe1" },
  { src: "thumbnail/candypaintcafe2.avif", alt: "candypaintcafe2" },
  { src: "thumbnail/candypaintcafe3.avif", alt: "candypaintcafe3" },
  { src: "thumbnail/kgynh1.avif", alt: "kgynh1" },
  { src: "thumbnail/kgynh2.avif", alt: "kgynh2" },
  { src: "thumbnail/kgynh3.avif", alt: "kgynh3" },
  { src: "thumbnail/kgynh4.avif", alt: "kgynh4" },
  { src: "thumbnail/kgynh5.avif", alt: "kgynh5" },
  { src: "thumbnail/kgynh6.avif", alt: "kgynh6" },
  { src: "thumbnail/kgynh7.avif", alt: "kgynh7" },
  { src: "thumbnail/kgynh8.avif", alt: "kgynh8" },
  { src: "thumbnail/kgynh9.avif", alt: "kgynh9" },
  { src: "thumbnail/kgynh10.avif", alt: "kgynh10" },
  { src: "thumbnail/kgynh11.avif", alt: "kgynh11" },
  { src: "thumbnail/lixizu1.avif", alt: "lixizu1" },
  { src: "thumbnail/lixizu2.avif", alt: "lixizu2" },
  { src: "thumbnail/lixizu3.avif", alt: "lixizu3" },
  { src: "thumbnail/lixizu4.avif", alt: "lixizu4" },
  { src: "thumbnail/lixizu5.avif", alt: "lixizu5" },
  { src: "thumbnail/lixizu6.avif", alt: "lixizu6" },
  { src: "thumbnail/mistiousstar1.avif", alt: "mistiousstar1" },
  { src: "thumbnail/mistiousstar2.avif", alt: "mistiousstar2" },
  { src: "thumbnail/mistiousstar3.avif", alt: "mistiousstar3" },
  { src: "thumbnail/mistiousstar4.avif", alt: "mistiousstar4" },
  { src: "thumbnail/nekopon1.avif", alt: "nekopon1" },
  { src: "thumbnail/nekopon2.avif", alt: "nekopon2" },
  { src: "thumbnail/nekopon3.avif", alt: "nekopon3" },
  { src: "thumbnail/nekopon4.avif", alt: "nekopon4" },
  { src: "thumbnail/nekopon5.avif", alt: "nekopon5" },
  { src: "thumbnail/pinlin1.avif", alt: "pinlin1" },
  { src: "thumbnail/pinlin2.avif", alt: "pinlin2" },
  { src: "thumbnail/pinlin3.avif", alt: "pinlin3" },
  { src: "thumbnail/pinlin4.avif", alt: "pinlin4" },
  { src: "thumbnail/pinlin5.avif", alt: "pinlin5" },
  { src: "thumbnail/pinlin6.avif", alt: "pinlin6" },
  { src: "thumbnail/pinlin7.avif", alt: "pinlin7" },
  { src: "thumbnail/pinlin8.avif", alt: "pinlin8" },
  { src: "thumbnail/pinlin9.avif", alt: "pinlin9" },
  { src: "thumbnail/pinlin10.avif", alt: "pinlin10" },
  { src: "thumbnail/pinlin11.avif", alt: "pinlin11" },
  { src: "thumbnail/pinlin12.avif", alt: "pinlin12" },
  { src: "thumbnail/pinlin13.avif", alt: "pinlin13" },
  { src: "thumbnail/rumikuu1.avif", alt: "rumikuu1" },
  { src: "thumbnail/rumikuu2.avif", alt: "rumikuu2" },
  { src: "thumbnail/rumikuu3.avif", alt: "rumikuu3" },
  { src: "thumbnail/rumikuu4.avif", alt: "rumikuu4" },
  { src: "thumbnail/rumikuu5.avif", alt: "rumikuu5" },
  { src: "thumbnail/rumikuu6.avif", alt: "rumikuu6" },
  { src: "thumbnail/rumikuu7.avif", alt: "rumikuu7" },
  { src: "thumbnail/rumikuu8.avif", alt: "rumikuu8" },
  { src: "thumbnail/rumikuu9.avif", alt: "rumikuu9" },
  { src: "thumbnail/rumikuu10.avif", alt: "rumikuu10" },
  { src: "thumbnail/rumikuu11.avif", alt: "rumikuu11" },
  { src: "thumbnail/rumikuu12.avif", alt: "rumikuu12" },
  { src: "thumbnail/rumikuu13.avif", alt: "rumikuu13" },
  { src: "thumbnail/rumikuu14.avif", alt: "rumikuu14" },
  { src: "thumbnail/rumikuu15.avif", alt: "rumikuu15" },
  { src: "thumbnail/rumikuu16.avif", alt: "rumikuu16" },
  { src: "thumbnail/rumikuu17.avif", alt: "rumikuu17" },
  { src: "thumbnail/rumikuu18.avif", alt: "rumikuu18" },
  { src: "thumbnail/rumikuu19.avif", alt: "rumikuu19" },
  { src: "thumbnail/rumikuukc1.avif", alt: "rumikuukc1" },
  { src: "thumbnail/rumikuukc2.avif", alt: "rumikuukc2" },
];

// Pick 9 random images from the list (side effect: mutates the input array)
function shuffle(array) {
  let selectedItems = [];
  while (selectedItems.length < 9 && array.length > 0) {
    const randomIndex = Math.floor(Math.random() * array.length);
    selectedItems.push(array[randomIndex]);
    array.splice(randomIndex, 1);
  }
  return selectedItems;
}
const modal = document.getElementById("modal");
modal.onclick = function () {
  modal.style.display = "none";
};
const selectedImages = shuffle(images);
// Create HTML for the selected images
const photoGrid = document.getElementById("photo-grid");
const modalImg = document.getElementById("modal-image");

selectedImages.forEach((item) => {
  const img = new Image();
  img.src = item.src;
  img.alt = item.alt;

  img.onload = () => {
    const cardDiv = document.createElement("img");
    cardDiv.className = "card";
    cardDiv.src = item.src;
    cardDiv.alt = item.alt;

    cardDiv.onclick = function () {
      modal.style.display = "block";
      modalImg.src = this.src;
    };

    modalImg.onclick = function () {
      modal.style.display = "block";
      modalImg.src = this.src;
    };

    if (img.width > img.height) {
      cardDiv.classList.add("card-wide");
    }

    photoGrid.appendChild(cardDiv);
  };
});
