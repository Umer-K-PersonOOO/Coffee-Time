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
    setTimeout(function() {
        extraArtworkContainer.style.opacity = '1';
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

}

function showItems(ids) {
    ids.forEach(function(id) {
        var item = document.getElementById(id);
        if (item) {
            item.style.display = 'block';
        }
    });
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




