// List of images in the folder
const images = [
    'thumbnail/allenerie1.avif',
    'thumbnail/allenerie2.avif',
    'thumbnail/allenerie3.avif',
    'thumbnail/batensan1.avif',
    'thumbnail/batensan2.avif',
    'thumbnail/batensan3.avif',
    'thumbnail/batensan4.avif',
    'thumbnail/batensan5.avif',
    'thumbnail/batensan6.avif',
    'thumbnail/batensan7.avif',
    'thumbnail/batensan8.avif',
    'thumbnail/batensan9.avif',
    'thumbnail/batensan10.avif',
    'thumbnail/batensan11.avif',
    'thumbnail/batensan12.avif',
    'thumbnail/candypaintcafe1.avif',
    'thumbnail/candypaintcafe2.avif',
    'thumbnail/candypaintcafe3.avif',
    'thumbnail/kgynh1.avif',
    'thumbnail/kgynh2.avif',
    'thumbnail/kgynh3.avif',
    'thumbnail/kgynh4.avif',
    'thumbnail/kgynh5.avif',
    'thumbnail/kgynh6.avif',
    'thumbnail/kgynh7.avif',
    'thumbnail/kgynh8.avif',
    'thumbnail/kgynh9.avif',
    'thumbnail/kgynh10.avif',
    'thumbnail/kgynh11.avif',
    'thumbnail/lixizu1.avif',
    'thumbnail/lixizu2.avif',
    'thumbnail/lixizu3.avif',
    'thumbnail/lixizu4.avif',
    'thumbnail/lixizu5.avif',
    'thumbnail/lixizu6.avif',
    'thumbnail/mistiousstar1.avif',
    'thumbnail/mistiousstar2.avif',
    'thumbnail/mistiousstar3.avif',
    'thumbnail/mistiousstar4.avif',
    'thumbnail/nekopon1.avif',
    'thumbnail/nekopon2.avif',
    'thumbnail/nekopon3.avif',
    'thumbnail/nekopon4.avif',
    'thumbnail/nekopon5.avif',
    'thumbnail/pinlin1.avif',
    'thumbnail/pinlin2.avif',
    'thumbnail/pinlin3.avif',
    'thumbnail/pinlin4.avif',
    'thumbnail/pinlin5.avif',
    'thumbnail/pinlin6.avif',
    'thumbnail/pinlin7.avif',
    'thumbnail/pinlin8.avif',
    'thumbnail/pinlin9.avif',
    'thumbnail/pinlin10.avif',
    'thumbnail/pinlin11.avif',
    'thumbnail/pinlin12.avif',
    'thumbnail/pinlin13.avif',
    'thumbnail/rumikuu1.avif',
    'thumbnail/rumikuu2.avif',
    'thumbnail/rumikuu3.avif',
    'thumbnail/rumikuu4.avif',
    'thumbnail/rumikuu5.avif',
    'thumbnail/rumikuu6.avif',
    'thumbnail/rumikuu7.avif',
    'thumbnail/rumikuu8.avif',
    'thumbnail/rumikuu9.avif',
    'thumbnail/rumikuu10.avif',
    'thumbnail/rumikuu11.avif',
    'thumbnail/rumikuu12.avif',
    'thumbnail/rumikuu13.avif',
    'thumbnail/rumikuu14.avif',
    'thumbnail/rumikuu15.avif',
    'thumbnail/rumikuu16.avif',
    'thumbnail/rumikuu17.avif',
    'thumbnail/rumikuu18.avif',
    'thumbnail/rumikuu19.avif',
    'thumbnail/rumikuukc1.avif',
    'thumbnail/rumikuukc2.avif'
  ];
  
  // Pick 9 random images from the list (side effect: mutates the input array)
  function shuffle(strings) {
    let selectedStrings = [];
    while (selectedStrings.length < 9) {
        const randomIndex = Math.floor(Math.random() * strings.length);
        selectedStrings.push(strings[randomIndex]);
        strings.splice(randomIndex, 1);
    }
    return selectedStrings;
  }
  
  const selectedImages = shuffle(images)
  // Create HTML for the selected images
  const photoGrid = document.getElementById('photo-grid');
  selectedImages.forEach(image => {
    const img = new Image();
    img.src = image;
  
    img.onload = () => {
      const cardDiv = document.createElement('img');
      cardDiv.className = 'card';
      cardDiv.src = `${image}`;
  
      if (img.width > img.height) {
        cardDiv.classList.add('card-wide');
      }
  
      photoGrid.appendChild(cardDiv);
    };
  });
  

