// Format: ['path/to/image.jpg', 'caption', 'size-class']
const artwork = [
    ['candypaintcafe/24.webp', 'pokemon, pikachu', 'one-thirds'],
    ['candypaintcafe/28.webp', 'pokemon, eevee', 'one-thirds'],
    ['candypaintcafe/41.webp', 'pokemon, sylveon', 'one-thirds'],
    ['candypaintcafe/61.webp', 'shiba, long boi', 'one-thirds'],
    ['candypaintcafe/62.webp', 'shiba, long boi', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_ENAMEL_Cat01.webp', 'cat, riceball', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_ENAMEL_Cat04.webp', 'cat, night theme', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_ENAMEL_Cat06.webp', 'cat, cat-cus', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_STICKERS_CashRulesNook.webp', 'animcal crossing, tom nook', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_STICKERS_SHIBA_Dessert02.webp', 'shiba, dessert', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_STICKERS_SHIBA_Donut02.webp', 'shiba, donut', 'one-thirds'],
    ['candypaintcafe/CPC_PHOTO_STICKERS_SHIBA_Sushi02.webp', 'shiba, sushi', 'one-thirds']
  ];
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  const selectedImages = shuffleArray(artwork);
  const photoGrid = document.getElementById('artwork-grid-container');
  selectedImages.forEach(image => {
    const img = new Image();
    img.src = image[0];
    
    img.onload = () => {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper ' + image[2];
        
        // Append the image to the imageWrapper
        imageWrapper.appendChild(img);
        
        // Create a caption div and set its content
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.innerText = image[1];
        
        // Append the caption to the imageWrapper
        imageWrapper.appendChild(caption);
        
        // Append the imageWrapper to the photoGrid
        photoGrid.appendChild(imageWrapper);
  };
});
