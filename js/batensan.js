var can = Canvallax({
    className: 'bg-canvas',
    damping: 40
  });
  
  (function() {
    var origWidth = width = document.body.clientWidth,
        origHeight = height = document.body.scrollHeight;
    console.log(height);
    console.log(document.body.clientHeight);
  
    function createGradient(width, height) {
      var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#2879a6');
      gradient.addColorStop(1, '#ecd5c1');
      return gradient;
    }
  
    var gradient = Canvallax.Rectangle({
      width: width * 1.5,
      height: height * 1.1,
      zIndex: 1,
      fill: createGradient(width, height)
    });
  
    can.add(gradient);
  
    function updateCanvasDimensions() {
      height = document.body.scrollHeight;
      width = document.body.clientWidth;
      
      var heightScale = height / origHeight;
  
      can.elements.forEach(element => {
        element.maxX = width;
        element.origY = element.origY || element.y;
        element.y = element.origY * heightScale;
      });
  
      gradient.width = width * 1.5;
      gradient.height = height * 1.1;
      gradient.fill = createGradient(width, height);
    }
  
    function checkImagesLoaded(images, callback) {
      let imagesLoaded = 0;
      images.forEach((image) => {
        image.addEventListener('load', () => {
          imagesLoaded++;
          if (imagesLoaded === images.length) {
            callback();
          }
        });
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
          fill: '#fff',
          zIndex: 2,
        })
      );
    }
  
    
    can.add(stars);
  
    window.addEventListener('resize', function() {
      height = document.body.scrollHeight;
      width = document.body.clientWidth;
      
      // Update the gradient properties
      gradient.width = width * 1.5;
      gradient.height = height * 1.1;
      gradient.fill = createGradient(width, height);

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
            c, d;
  
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
  
      getSample.all = function() { return samples; };
      getSample.samples = samples;
  
      return getSample;
    }
  
    var getCandidate = bestCandidateSampler(width, height, 10);
  
    // Adding images to div
  
    portrait_artwork = [
      ['batensan1.jpg', 'The Great Ace Attorney'],
      ['batensan2.jpg', 'Genshin Impact, Venti, Lumine'],
      ['batensan3.jpg', 'Demon Slayer'],
      ['batensan8.jpg', 'Genshin Impact, Venti, Lumine'],
      ['batensan11.jpg', 'Professor Layton'],
      ['batensan12.jpg', 'Holostars, Bettel'],
    ];
  
    landscape_artwork = [
      ['batensan4.jpg', 'Nier:Automata'],
      ['batensan5.jpg', 'Nier:Automata'],
      ['batensan6.jpg', 'Moon Observatory, Ven'],
      ['batensan7.jpg', 'Demon Slayer, Shinobu, Kanae'],
      ['batensan9.jpg', 'Genshin Impact, Venti'],
      ['batensan10.jpg', 'The Legend of Zelda: Breath of the Wild, Zelda, Link']
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
    const extraArtworkContainer = document.getElementById('extra-artwork-container');
  
    function doubleLandscape(landscape_array) {
      const landscape_artwork_src = landscape_array.pop();
      const landscape_artwork2_src = landscape_array.pop();
  
      const imageWrapper = document.createElement('div');
      const imageWrapper2 = document.createElement('div');
      imageWrapper.className = 'image-wrapper one-half';
      imageWrapper2.className = 'image-wrapper one-half';
  
      const img = new Image();
      img.src = "artwork/" + landscape_artwork_src[0];
      img.alt = landscape_artwork_src[1];
      const img2 = new Image();
      img2.src = "artwork/" + landscape_artwork2_src[0];
      img2.alt = landscape_artwork2_src[1];
  
      imageWrapper.appendChild(img);
      imageWrapper2.appendChild(img2);
  
      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.innerText = landscape_artwork_src[1];
      const caption2 = document.createElement('div');
      caption2.className = 'caption';
      caption2.innerText = landscape_artwork2_src[1];
  
      imageWrapper.appendChild(caption);
      imageWrapper2.appendChild(caption2);
  
      return [imageWrapper, imageWrapper2];
    }
  
    function triplePortrait(portrait_array) {
      const portrait_artwork_src = portrait_array.pop();
      const portrait_artwork2_src = portrait_array.pop();
      const portrait_artwork3_src = portrait_array.pop();
  
      const imageWrapper = document.createElement('div');
      const imageWrapper2 = document.createElement('div');
      const imageWrapper3 = document.createElement('div');
  
      imageWrapper.className = 'image-wrapper one-thirds';
      imageWrapper2.className = 'image-wrapper one-thirds';
      imageWrapper3.className = 'image-wrapper one-thirds';
  
      const img = new Image();
      img.src = "artwork/" + portrait_artwork_src[0];
      img.alt = portrait_artwork_src[1];
      const img2 = new Image();
      img2.src = "artwork/" + portrait_artwork2_src[0];
      img2.alt = portrait_artwork2_src[1];
      const img3 = new Image();
      img3.src = "artwork/" + portrait_artwork3_src[0];
      img3.alt = portrait_artwork3_src[1];
  
      imageWrapper.appendChild(img);
      imageWrapper2.appendChild(img2);
      imageWrapper3.appendChild(img3);
  
      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.innerText = portrait_artwork_src[1];
      const caption2 = document.createElement('div');
      caption2.className = 'caption';
      caption2.innerText = portrait_artwork2_src[1];
      const caption3 = document.createElement('div');
      caption3.className = 'caption';
      caption3.innerText = portrait_artwork3_src[1];
  
      imageWrapper.appendChild(caption);
      imageWrapper2.appendChild(caption2);
      imageWrapper3.appendChild(caption3);
  
      return [imageWrapper, imageWrapper2, imageWrapper3];
    }
  
    function left_port_right_land(portrait_array, landscape_array) {
      const portrait_artwork_src = portrait_array.pop();
      const landscape_artwork_src = landscape_array.pop();
  
      const imageWrapper = document.createElement('div');
      const imageWrapper2 = document.createElement('div');
  
      imageWrapper.className = 'image-wrapper one-thirds';
      imageWrapper2.className = 'image-wrapper two-thirds';
  
      const img = new Image();
      img.src = "artwork/" + portrait_artwork_src[0];
      img.alt = portrait_artwork_src[1];
      const img2 = new Image();
      img2.src = "artwork/" + landscape_artwork_src[0];
      img2.alt = landscape_artwork_src[1];
  
      imageWrapper.appendChild(img);
      imageWrapper2.appendChild(img2);
  
      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.innerText = portrait_artwork_src[1];
      const caption2 = document.createElement('div');
      caption2.className = 'caption';
      caption2.innerText = landscape_artwork_src[1];
  
      imageWrapper.appendChild(caption);
      imageWrapper2.appendChild(caption2);
  
      return [imageWrapper, imageWrapper2];
    }
  
    function right_port_left_landscape(portrait_array, landscape_array) {
      const portrait_artwork_src = portrait_array.pop();
      const landscape_artwork_src = landscape_array.pop();
  
      const imageWrapper = document.createElement('div');
      const imageWrapper2 = document.createElement('div');
  
      imageWrapper.className = 'image-wrapper two-thirds';
      imageWrapper2.className = 'image-wrapper one-thirds';
  
      const img = new Image();
      img.src = "artwork/" + landscape_artwork_src[0];
      img.alt = landscape_artwork_src[1];
      const img2 = new Image();
      img2.src = "artwork/" + portrait_artwork_src[0];
      img2.alt = portrait_artwork_src[1];
  
      imageWrapper.appendChild(img);
      imageWrapper2.appendChild(img2);
  
      const caption = document.createElement('div');
      caption.className = 'caption';
      caption.innerText = landscape_artwork_src[1];
      const caption2 = document.createElement('div');
      caption2.className = 'caption';
      caption2.innerText = portrait_artwork_src[1];
  
      imageWrapper.appendChild(caption);
      imageWrapper2.appendChild(caption2);
  
      return [imageWrapper, imageWrapper2];
    }
  
    const imagePatterns = [doubleLandscape(selectedLandscapeImages), triplePortrait(selectedPortraitImages), left_port_right_land(selectedPortraitImages, selectedLandscapeImages), right_port_left_landscape(selectedPortraitImages, selectedLandscapeImages)];
    shuffleArray(imagePatterns);
    for (const pattern of imagePatterns) {
      for (const image of pattern) {
        extraArtworkContainer.appendChild(image);
      }
    }
  
    const landscape_artwork_src = landscape_artwork.pop();
  
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper large-image';
    const img = new Image();
    img.src = "artwork/" + landscape_artwork_src[0];
    img.alt = landscape_artwork_src[1];
    imageWrapper.appendChild(img);
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerText = landscape_artwork_src[1];
    imageWrapper.appendChild(caption);
    extraArtworkContainer.appendChild(imageWrapper);
  
    const images = extraArtworkContainer.querySelectorAll('img');
    checkImagesLoaded(images, updateCanvasDimensions);
  })();
  