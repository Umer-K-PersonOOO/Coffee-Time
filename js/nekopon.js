const artworkContainer = document.getElementById('artwork-stuff');
const stickerContainer = document.getElementById('stickers');
const decalContainer = document.getElementById('decals');

function toggleVisibility() {
    var button = document.querySelector('.hider-button');
    var extraArtworkContainer = document.getElementById('extra-artwork-container');
    
    // Toggle visibility of button
    button.style.opacity = '0';
    button.style.display = 'none';
    // Show extra artwork container
    extraArtworkContainer.style.display = 'grid';
    resizeNekoponDiamondBackground();
    setTimeout(function() {
        extraArtworkContainer.style.opacity = '1';
        resizeNekoponDiamondBackground();
    }, 50); // Delay to ensure transition kicks in smoothly
}

function itemsAll() {
    showItems([artworkContainer.id, stickerContainer.id, decalContainer.id]);
    updateActiveButton('items-all-button');
}

function itemsPrints() {
    hideAllItems();
    showItems([artworkContainer.id]);
    updateActiveButton('items-prints-button');
}

function itemsStickers() {
    hideAllItems();
    showItems([stickerContainer.id]);
    updateActiveButton('items-sticker-button');
}

function itemsDecals() {
    hideAllItems();
    showItems([decalContainer.id]);
    updateActiveButton('items-decals-button');
}

function hideAllItems() {
    // var items = document.querySelectorAll('.item');
    // items.forEach(function(item) {
    //     item.style.display = 'none';
    // });
    
    artworkContainer.style.display = 'none';
    stickerContainer.style.display = 'none';
    decalContainer.style.display = 'none';

    requestAnimationFrame(resizeNekoponDiamondBackground);

}

function showItems(ids) {
    ids.forEach(function(id) {
        var item = document.getElementById(id);
        if (item) {
            item.style.display = 'block';
        }
    });
    requestAnimationFrame(resizeNekoponDiamondBackground);
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

const nekoponDefaultDiamondColor = '215, 116, 124';
const nekoponImageDiamondColors = {
    'nekopon2.jpg': '86, 146, 214',
    'nekopon3.jpg': '204, 72, 80',
    'nekopon4.jpg': '125, 59, 192',
    'cat_festival.webp': '19, 16, 53',
    'snow_queen.jpg': '126, 178, 216',
    'kaguya.jpg': '226, 86, 118',
    'annaversity.webp': '218, 124, 162',
    'nekopon5.jpg': '126, 110, 214',
    'haruki.webp': '220, 176, 211',
    'bath_time.webp': '122, 96, 144',
    'ChaldeaGuru.webp': '210, 228, 139',
    'cat_cafe.webp': '210, 178, 104',
    'rosa_sticker.webp': '102, 170, 214',
    'valentine_sticker.jpg': '222, 92, 118',
    'kirijo_sticker.jpg': '168, 92, 190',
    'demon_sticker.webp': '200, 64, 68',
    'snow_sticker.webp': '132, 190, 222',
    'p3_sticker.webp': '228, 116, 142',
    'modernia_decal.webp': '116, 148, 202',
    'dorothy_decal.webp': '212, 112, 166',
    'rapi_decal.webp': '224, 78, 72',
    'anis_decal.jpg': '236, 168, 78',
};

const nekoponDiamondLayout = [
    ['10%', '7%', 'clamp(48px, 7vw, 136px)', 4, '-8deg', 0.42, '5px', 0.92, '7.2s', '-1s', '18px', '-18px', '3deg'],
    ['68%', '9%', 'clamp(38px, 5.3vw, 104px)', 3, '7deg', 0.34, '4px', 0.84, '8.4s', '-2.2s', '-18px', '18px', '-4deg'],
    ['90%', '17%', 'clamp(54px, 8vw, 154px)', 5, '-12deg', 0.38, '6px', 0.9, '9.1s', '-3.8s', '-22px', '-16px', '4deg'],
    ['34%', '24%', 'clamp(34px, 4.8vw, 92px)', 2, '10deg', 0.4, '3px', 0.82, '6.8s', '-1.8s', '14px', '20px', '-3deg'],
    ['7%', '35%', 'clamp(50px, 7.4vw, 142px)', 5, '6deg', 0.36, '5px', 0.88, '8.7s', '-4.3s', '20px', '-20px', '4deg'],
    ['58%', '39%', 'clamp(62px, 8.7vw, 168px)', 4, '-6deg', 0.32, '7px', 0.94, '9.6s', '-5.1s', '-26px', '16px', '-4deg'],
    ['94%', '49%', 'clamp(40px, 5.8vw, 112px)', 3, '13deg', 0.42, '4px', 0.84, '7.8s', '-2.6s', '-16px', '22px', '3deg'],
    ['24%', '55%', 'clamp(66px, 9.5vw, 184px)', 2, '-10deg', 0.3, '7px', 0.96, '10.2s', '-5.8s', '26px', '12px', '4deg'],
    ['76%', '64%', 'clamp(50px, 7vw, 136px)', 5, '8deg', 0.36, '5px', 0.9, '8.9s', '-3.2s', '-22px', '-20px', '-4deg'],
    ['11%', '73%', 'clamp(38px, 5.5vw, 106px)', 3, '-5deg', 0.44, '4px', 0.84, '7.4s', '-1.4s', '18px', '-16px', '3deg'],
    ['47%', '79%', 'clamp(56px, 8vw, 154px)', 4, '14deg', 0.34, '5px', 0.9, '9.4s', '-4.9s', '-24px', '18px', '-4deg'],
    ['90%', '88%', 'clamp(64px, 9vw, 176px)', 5, '-7deg', 0.32, '6px', 0.95, '10.6s', '-6.2s', '-28px', '-18px', '4deg'],
    ['32%', '95%', 'clamp(42px, 6vw, 116px)', 2, '6deg', 0.4, '4px', 0.86, '7.9s', '-2.9s', '18px', '20px', '-3deg'],
];

function createNekoponDiamondBackground() {
    document.body.classList.add('nekopon-diamond-page');
    document.body.style.setProperty('--nekopon-diamond-rgb', nekoponDefaultDiamondColor);

    const diamondBackground = document.createElement('div');
    diamondBackground.className = 'nekopon-diamond-background';
    diamondBackground.setAttribute('aria-hidden', 'true');

    nekoponDiamondLayout.forEach(function(chain) {
        const chainElement = document.createElement('div');
        chainElement.className = 'nekopon-diamond-chain';
        chainElement.style.setProperty('--chain-x', chain[0]);
        chainElement.style.setProperty('--chain-y', chain[1]);
        chainElement.style.setProperty('--diamond-size', chain[2]);
        chainElement.style.setProperty('--chain-angle', chain[4]);
        chainElement.style.setProperty('--chain-opacity', chain[5]);
        chainElement.style.setProperty('--chain-blur', chain[6]);
        chainElement.style.setProperty('--chain-scale', chain[7]);
        chainElement.style.setProperty('--chain-duration', chain[8]);
        chainElement.style.setProperty('--chain-delay', chain[9]);
        chainElement.style.setProperty('--chain-drift-x', chain[10]);
        chainElement.style.setProperty('--chain-drift-y', chain[11]);
        chainElement.style.setProperty('--chain-rotate', chain[12]);

        for (let i = 0; i < chain[3]; i++) {
            const diamond = document.createElement('span');
            diamond.className = 'nekopon-chain-diamond';
            chainElement.appendChild(diamond);
        }

        diamondBackground.appendChild(chainElement);
    });

    document.body.prepend(diamondBackground);
    resizeNekoponDiamondBackground();
}

function resizeNekoponDiamondBackground() {
    document.body.style.setProperty(
        '--nekopon-diamond-height',
        `${document.documentElement.scrollHeight}px`
    );
}

function getNekoponDiamondColor(target) {
    const img = target.querySelector('img');
    const src = img?.getAttribute('src') || '';
    const filename = src.split('/').pop();

    return nekoponImageDiamondColors[filename] || nekoponDefaultDiamondColor;
}

function attachNekoponDiamondHover() {
    const hoverTargets = document.querySelectorAll(
        '#artwork-stuff .image-wrapper, #stickers .image-wrapper, #decals .image-wrapper'
    );

    hoverTargets.forEach(function(target) {
        target.addEventListener('pointerenter', function() {
            document.body.style.setProperty('--nekopon-diamond-rgb', getNekoponDiamondColor(target));
        });

        target.addEventListener('pointerleave', function() {
            document.body.style.setProperty('--nekopon-diamond-rgb', nekoponDefaultDiamondColor);
        });
    });
}

createNekoponDiamondBackground();
attachNekoponDiamondHover();
window.addEventListener('resize', resizeNekoponDiamondBackground, { passive: true });
