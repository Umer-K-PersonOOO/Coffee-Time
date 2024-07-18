// List of images in the folder
const images = [
    'thumbnail/allenerie1.jpg',
    'thumbnail/allenerie2.jpg',
    'thumbnail/allenerie3.jpg',
    'thumbnail/batensan1.jpg',
    'thumbnail/batensan2.jpg',
    'thumbnail/batensan3.jpg',
    'thumbnail/batensan4.jpg',
    'thumbnail/batensan5.jpg',
    'thumbnail/batensan6.jpg',
    'thumbnail/batensan7.jpg',
    'thumbnail/batensan8.jpg',
    'thumbnail/batensan9.jpg',
    'thumbnail/batensan10.jpg',
    'thumbnail/batensan11.jpg',
    'thumbnail/batensan12.jpg',
    'thumbnail/candypaintcafe1.jpg',
    'thumbnail/candypaintcafe2.jpg',
    'thumbnail/candypaintcafe3.jpg',
    'thumbnail/kgynh1.jpg',
    'thumbnail/kgynh2.jpg',
    'thumbnail/kgynh3.jpg',
    'thumbnail/kgynh4.jpg',
    'thumbnail/kgynh5.jpg',
    'thumbnail/kgynh6.jpg',
    'thumbnail/kgynh7.jpg',
    'thumbnail/kgynh8.jpg',
    'thumbnail/kgynh9.jpg',
    'thumbnail/kgynh10.jpg',
    'thumbnail/kgynh11.jpg',
    'thumbnail/lixizu1.jpg',
    'thumbnail/lixizu2.jpg',
    'thumbnail/lixizu3.jpg',
    'thumbnail/lixizu4.jpg',
    'thumbnail/lixizu5.jpg',
    'thumbnail/lixizu6.jpg',
    'thumbnail/mistiousstar1.jpg',
    'thumbnail/mistiousstar2.jpg',
    'thumbnail/mistiousstar3.jpg',
    'thumbnail/mistiousstar4.jpg',
    'thumbnail/nekopon1.jpg',
    'thumbnail/nekopon2.jpg',
    'thumbnail/nekopon3.jpg',
    'thumbnail/nekopon4.jpg',
    'thumbnail/nekopon5.jpg',
    'thumbnail/pinlin1.jpg',
    'thumbnail/pinlin2.jpg',
    'thumbnail/pinlin3.jpg',
    'thumbnail/pinlin4.jpg',
    'thumbnail/pinlin5.jpg',
    'thumbnail/pinlin6.jpg',
    'thumbnail/pinlin7.jpg',
    'thumbnail/pinlin8.jpg',
    'thumbnail/pinlin9.jpg',
    'thumbnail/pinlin10.jpg',
    'thumbnail/pinlin11.jpg',
    'thumbnail/pinlin12.jpg',
    'thumbnail/pinlin13.jpg',
    'thumbnail/rumikuu1.jpg',
    'thumbnail/rumikuu2.jpg',
    'thumbnail/rumikuu3.jpg',
    'thumbnail/rumikuu4.jpg',
    'thumbnail/rumikuu5.jpg',
    'thumbnail/rumikuu6.jpg',
    'thumbnail/rumikuu7.jpg',
    'thumbnail/rumikuu8.jpg',
    'thumbnail/rumikuu9.jpg',
    'thumbnail/rumikuu10.jpg',
    'thumbnail/rumikuu11.jpg',
    'thumbnail/rumikuu12.jpg',
    'thumbnail/rumikuu13.jpg',
    'thumbnail/rumikuu14.jpg',
    'thumbnail/rumikuu15.jpg',
    'thumbnail/rumikuu16.jpg',
    'thumbnail/rumikuu17.jpg',
    'thumbnail/rumikuu18.jpg',
    'thumbnail/rumikuu19.jpg',
    'thumbnail/rumikuukc1.jpg',
    'thumbnail/rumikuukc2.jpg'
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
  

