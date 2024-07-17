// Format: ['path/to/image.jpg', 'caption', 'size-class']
// const artworkVertical = [
//     ['artwork/kgynh1.jpg', 'pokemon, pikachu', 'vertical-artwork'],
//     ['artwork/kgynh4.jpg', 'shiba, long boi', 'vertical-artwork'],
//     ['artwork/kgynh9.jpg', 'animcal crossing, tom nook', 'vertical-artwork'],
//   ];

// const artworkHorizontal = [
//     ['artwork/kgynh2.jpg', 'pokemon, eevee'],
//     ['artwork/kgynh3.jpg', 'pokemon, sylveon'],
//     ['artwork/kgynh5.jpg', 'shiba, long boi'],
//     ['artwork/kgynh6.jpg', 'cat, riceball'],
//     ['artwork/kgynh7.jpg', 'cat, night theme'],
//     ['artwork/kgynh8.jpg', 'cat, cat-cus'],
//     ['artwork/kgynh10.jpg', 'shiba, dessert'],
//     ['artwork/kgynh11.jpg', 'shiba, donut'],
// ];

// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

// images = [
//     ['artwork/kgynh1.jpg', 'pokemon, pikachu', 'vertical-artwork'],
//     ['artwork/kgynh4.jpg', 'shiba, long boi', 'vertical-artwork'],
//     ['artwork/kgynh9.jpg', 'animcal crossing, tom nook', 'vertical-artwork'],
//     ['artwork/kgynh2.jpg', 'pokemon, eevee'],
//     ['artwork/kgynh3.jpg', 'pokemon, sylveon'],
//     ['artwork/kgynh5.jpg', 'shiba, long boi'],
//     ['artwork/kgynh6.jpg', 'cat, riceball'],
//     ['artwork/kgynh7.jpg', 'cat, night theme'],
//     ['artwork/kgynh8.jpg', 'cat, cat-cus'],
//     ['artwork/kgynh10.jpg', 'shiba, dessert'],
//     ['artwork/kgynh11.jpg', 'shiba, donut']
// ];
//   function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }
  
//   function placeHorizontalImage(image) {
//     const img = new Image();
//     img.src = image[0];
    
//     img.onload = () => {
//         const imageWrapper = document.createElement('div');
//         imageWrapper.className = 'image-wrapper horizontal-artwork';
//         imageWrapper.appendChild(img);
//         const caption = document.createElement('div');
//         caption.className = 'caption';
//         caption.innerText = image[1];
//         imageWrapper.appendChild(caption);
//         photoGrid.appendChild(imageWrapper);
//   };
//   }

// function placeVerticalImage(image) {
//     const img = new Image();
//     img.src = image[0];
    
//     img.onload = () => {
//         const imageWrapper = document.createElement('div');
//         imageWrapper.className = 'image-wrapper vertical-artwork';
//         imageWrapper.appendChild(img);
//         const caption = document.createElement('div');
//         caption.className = 'caption';
//         caption.innerText = image[1];
//         imageWrapper.appendChild(caption);
//         photoGrid.appendChild(imageWrapper);
//     };
// }

//   const selectedImagesVertical = shuffleArray(artworkVertical);
//   const selectedImagesHorizontal = shuffleArray(artworkHorizontal);

//   const photoGrid = document.getElementById('artwork-grid-container');
//   const horizontalPhoto = new Image();
//   placeHorizontalImage(artworkHorizontal[0]);
//   placeVerticalImage(artworkVertical[0]);
//   placeHorizontalImage(artworkHorizontal[1]);


// const selectedImages = shuffleArray(images)
// // Create HTML for the selected images
// const photoGrid = document.getElementById('photo-grid');
// selectedImages.forEach(image => {
//     const img = new Image();
//   img.src = image[0];

//   img.onload = () => {
//     const cardDiv = document.createElement('img');
//     cardDiv.className = 'card';
//     cardDiv.src = `${image[0]}`;

//     if (img.width > img.height) {
//       cardDiv.classList.add('card-wide');
//     }

//     photoGrid.appendChild(cardDiv);
//   };
// });