document.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("shrink");
        var x = document.getElementById("tags");
        if (x.style.display === "flex") {
          x.style.display = "none";
        }
    } else {
        header.classList.remove("shrink");
    }
});

function myFunction() {
    var x = document.getElementById("tags");
    if (x.style.display === "flex") {
      x.style.display = "none";
    } else {
      x.style.display = "flex";
    }
  }

// List of images in the folder
const images = [
    'artwork/allenerie1.jpg',
    'artwork/allenerie2.jpg',
    'artwork/allenerie3.jpg',
    'artwork/batensan1.jpg',
    'artwork/batensan2.jpg',
    'artwork/batensan3.jpg',
    'artwork/batensan4.jpg',
    'artwork/batensan5.jpg',
    'artwork/batensan6.jpg',
    'artwork/batensan7.jpg',
    'artwork/batensan8.jpg',
    'artwork/batensan9.jpg',
    'artwork/batensan10.jpg',
    'artwork/batensan11.jpg',
    'artwork/batensan12.jpg',
    'artwork/candypaintcafe1.jpg',
    'artwork/candypaintcafe2.jpg',
    'artwork/candypaintcafe3.jpg',
    'artwork/kgynh1.jpg',
    'artwork/kgynh2.jpg',
    'artwork/kgynh3.jpg',
    'artwork/kgynh4.jpg',
    'artwork/kgynh5.jpg',
    'artwork/kgynh6.jpg',
    'artwork/kgynh7.jpg',
    'artwork/kgynh8.jpg',
    'artwork/kgynh9.jpg',
    'artwork/kgynh10.jpg',
    'artwork/kgynh11.jpg',
    'artwork/lixizu1.jpg',
    'artwork/lixizu2.jpg',
    'artwork/lixizu3.jpg',
    'artwork/lixizu4.jpg',
    'artwork/lixizu5.jpg',
    'artwork/lixizu6.jpg',
    'artwork/mistiousstar1.jpg',
    'artwork/mistiousstar2.jpg',
    'artwork/mistiousstar3.jpg',
    'artwork/mistiousstar4.jpg',
    'artwork/nekopon1.jpg',
    'artwork/nekopon2.jpg',
    'artwork/nekopon3.jpg',
    'artwork/nekopon4.jpg',
    'artwork/nekopon5.jpg',
    'artwork/pinlin1.jpg',
    'artwork/pinlin2.jpg',
    'artwork/pinlin3.jpg',
    'artwork/pinlin4.jpg',
    'artwork/pinlin5.jpg',
    'artwork/pinlin6.jpg',
    'artwork/pinlin7.jpg',
    'artwork/pinlin8.jpg',
    'artwork/pinlin9.jpg',
    'artwork/pinlin10.jpg',
    'artwork/pinlin11.jpg',
    'artwork/pinlin12.jpg',
    'artwork/pinlin13.jpg',
    'artwork/rumikuu1.jpg',
    'artwork/rumikuu2.jpg',
    'artwork/rumikuu3.jpg',
    'artwork/rumikuu4.jpg',
    'artwork/rumikuu5.jpg',
    'artwork/rumikuu6.jpg',
    'artwork/rumikuu7.jpg',
    'artwork/rumikuu8.jpg',
    'artwork/rumikuu9.jpg',
    'artwork/rumikuu10.jpg',
    'artwork/rumikuu11.jpg',
    'artwork/rumikuu12.jpg',
    'artwork/rumikuu13.jpg',
    'artwork/rumikuu14.jpg',
    'artwork/rumikuu15.jpg',
    'artwork/rumikuu16.jpg',
    'artwork/rumikuu17.jpg',
    'artwork/rumikuu18.jpg',
    'artwork/rumikuu19.jpg',
    'artwork/rumikuukc1.jpg',
    'artwork/rumikuukc2.jpg'
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
  

