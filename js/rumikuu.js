const dispalys = [
    document.getElementById('artwork-stuff'),
    document.getElementById('genshin-keychains'),
    document.getElementById('honkai-keychains'),
    document.getElementById('holo-pins'),
    document.getElementById('holo-decal'),
    document.getElementById('rq-stand'),
];

function toggleVisibility() {
    var button = document.querySelector('.hider-button');
    var extraArtworkContainer = document.getElementById('extra-artwork-container');
    
    // Toggle visibility of button
    button.style.opacity = '0';
    button.style.display = 'none';
    // Show extra artwork container
    extraArtworkContainer.style.display = 'grid';
    resizeRumikuuBubbleBackground();
    setTimeout(function() {
        extraArtworkContainer.style.opacity = '1';
        resizeRumikuuBubbleBackground();
    }, 50); // Delay to ensure transition kicks in smoothly
}

function itemsAll() {
    showItems(['keychains', 'prints', 'misc-one', 'misc-two', 'misc-three', 'artwork-stuff', 'genshin-keychains', 'honkai-keychains', 'holo-pins', 'holo-decal', 'rq-stand']);
    updateActiveButton('items-all-button');
}

function itemsKeychain() {
    hideAllItems();
    showItems(['keychains', 'genshin-keychains', 'honkai-keychains']);
    updateActiveButton('items-keychain-button');
}

function itemsPrints() {
    hideAllItems();
    showItems(['prints', 'artwork-stuff']);
    updateActiveButton('items-prints-button');
}

function itemsMisc() {
    hideAllItems();
    showItems(['misc-one', 'misc-two', 'misc-three', 'holo-decal', 'rq-stand']);
    updateActiveButton('items-misc-button');
}

function hideAllItems() {
    var items = document.querySelectorAll('.item');
    items.forEach(function(item) {
        item.style.display = 'none';
    });
    // TODO: Move outside of function? 
    
    dispalys.forEach(function(display) {
        display.style.display = 'none';
    });

    requestAnimationFrame(resizeRumikuuBubbleBackground);

}

function showItems(ids) {
    ids.forEach(function(id) {
        var item = document.getElementById(id);
        if (item) {
            item.style.display = 'block';
        }
    });
    requestAnimationFrame(resizeRumikuuBubbleBackground);
}

function updateActiveButton(activeButtonId) {
    var buttons = document.querySelectorAll('.filter-button');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });
    var activeButton = document.getElementById(activeButtonId);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

const rumikuuDefaultBubbleColor = '205, 208, 128';
const rumikuuImageBubbleColors = {
    'rumikuu19.jpg': '82, 158, 220',
    'rumikuu18.jpg': '112, 190, 176',
    'rumikuu16.jpg': '236, 138, 74',
    'rumikuu15.jpg': '242, 198, 100',
    'rumikuu12.jpg': '128, 104, 196',
    'rumikuu11.jpg': '210, 106, 138',
    'rumikuu10.jpg': '82, 194, 220',
    'rumikuu8.jpg': '205, 78, 86',
    'rumikuu13.jpg': '112, 184, 230',
    'rumikuu14.jpg': '132, 202, 236',
    'rumikuu2.jpg': '166, 98, 184',
    'rumikuu9.jpg': '244, 151, 74',
    'rumikuu1.jpg': '130, 146, 196',
    'rumikuu17.jpg': '230, 102, 148',
    'Genshin+Keychains+v2.webp': '232, 164, 74',
    'Honkai+Keychains+v2+Social.webp': '150, 158, 224',
    'holo.webp': '118, 196, 230',
    'Irys+standee+social.webp': '198, 112, 218',
    'Fuwamoco+Stickies+social.webp': '250, 146, 182',
};

const rumikuuBubbleLayout = [
    ['8%', '7%', 'clamp(150px, 19vw, 340px)', '64px', 0.34, 0.95, '7s', '0s', '28px', '-18px'],
    ['74%', '8%', 'clamp(95px, 12vw, 220px)', '46px', 0.28, 0.88, '8.5s', '-1.8s', '-20px', '30px'],
    ['41%', '14%', 'clamp(180px, 23vw, 420px)', '76px', 0.22, 1, '10s', '-4s', '34px', '24px'],
    ['90%', '21%', 'clamp(130px, 17vw, 320px)', '58px', 0.32, 0.92, '7.8s', '-2.6s', '-26px', '-20px'],
    ['15%', '29%', 'clamp(90px, 11vw, 230px)', '44px', 0.3, 0.84, '9s', '-3.4s', '18px', '32px'],
    ['59%', '34%', 'clamp(220px, 28vw, 500px)', '88px', 0.2, 1, '11s', '-5.2s', '-38px', '18px'],
    ['28%', '42%', 'clamp(130px, 15vw, 310px)', '58px', 0.3, 0.9, '8s', '-1.2s', '30px', '-26px'],
    ['83%', '48%', 'clamp(170px, 22vw, 390px)', '72px', 0.24, 0.98, '9.6s', '-4.6s', '-28px', '34px'],
    ['5%', '56%', 'clamp(115px, 14vw, 280px)', '50px', 0.34, 0.86, '7.4s', '-2s', '24px', '-34px'],
    ['47%', '61%', 'clamp(150px, 18vw, 360px)', '66px', 0.26, 0.93, '10.5s', '-6s', '-34px', '-18px'],
    ['94%', '68%', 'clamp(120px, 16vw, 300px)', '56px', 0.3, 0.9, '8.2s', '-2.8s', '-22px', '28px'],
    ['22%', '73%', 'clamp(210px, 25vw, 470px)', '84px', 0.22, 1, '11.4s', '-5.6s', '40px', '22px'],
    ['68%', '79%', 'clamp(100px, 13vw, 260px)', '48px', 0.32, 0.84, '7.7s', '-1s', '-18px', '-28px'],
    ['38%', '88%', 'clamp(135px, 17vw, 320px)', '60px', 0.27, 0.92, '9.3s', '-3.9s', '26px', '-24px'],
    ['86%', '94%', 'clamp(190px, 24vw, 440px)', '80px', 0.22, 0.96, '10.8s', '-6.3s', '-36px', '20px'],
];

function visibleBubbleOpacity(opacity) {
    return Math.min(0.58, opacity + 0.16);
}

function visibleBubbleBlur(blur) {
    return `${Math.max(32, parseFloat(blur) * 0.78)}px`;
}

function createRumikuuBubbleBackground() {
    document.body.classList.add('rumikuu-bubble-page');
    document.body.style.setProperty('--rumikuu-bubble-rgb', rumikuuDefaultBubbleColor);

    const bubbleBackground = document.createElement('div');
    bubbleBackground.className = 'rumikuu-bubble-background';
    bubbleBackground.setAttribute('aria-hidden', 'true');

    rumikuuBubbleLayout.forEach(function(bubble) {
        const ball = document.createElement('span');
        ball.className = 'rumikuu-background-ball';
        ball.style.setProperty('--bubble-x', bubble[0]);
        ball.style.setProperty('--bubble-y', bubble[1]);
        ball.style.setProperty('--bubble-size', bubble[2]);
        ball.style.setProperty('--bubble-blur', visibleBubbleBlur(bubble[3]));
        ball.style.setProperty('--bubble-opacity', visibleBubbleOpacity(bubble[4]));
        ball.style.setProperty('--bubble-scale', bubble[5]);
        ball.style.setProperty('--bubble-duration', bubble[6]);
        ball.style.setProperty('--bubble-delay', bubble[7]);
        ball.style.setProperty('--bubble-drift-x', bubble[8]);
        ball.style.setProperty('--bubble-drift-y', bubble[9]);
        bubbleBackground.appendChild(ball);
    });

    document.body.prepend(bubbleBackground);
    resizeRumikuuBubbleBackground();
}

function resizeRumikuuBubbleBackground() {
    document.body.style.setProperty(
        '--rumikuu-bubble-height',
        `${document.documentElement.scrollHeight}px`
    );
}

function getRumikuuBubbleColor(target) {
    const img = target.matches('img') ? target : target.querySelector('img');
    const src = img?.getAttribute('src') || '';
    const filename = src.split('/').pop();

    return rumikuuImageBubbleColors[filename] || rumikuuDefaultBubbleColor;
}

function attachRumikuuBubbleHover() {
    const hoverTargets = document.querySelectorAll('#artwork-stuff .image-wrapper, .keychains > img');

    hoverTargets.forEach(function(target) {
        target.addEventListener('pointerenter', function() {
            document.body.style.setProperty('--rumikuu-bubble-rgb', getRumikuuBubbleColor(target));
        });

        target.addEventListener('pointerleave', function() {
            document.body.style.setProperty('--rumikuu-bubble-rgb', rumikuuDefaultBubbleColor);
        });
    });
}

createRumikuuBubbleBackground();
attachRumikuuBubbleHover();
window.addEventListener('resize', resizeRumikuuBubbleBackground, { passive: true });


