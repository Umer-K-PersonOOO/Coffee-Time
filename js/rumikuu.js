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
    setTimeout(function() {
        extraArtworkContainer.style.opacity = '1';
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




