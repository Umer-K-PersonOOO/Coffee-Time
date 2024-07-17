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

  function toggleSidebar() {
    var sidebar = document.getElementById('artist-sidebar');
    var openButton = document.getElementById('open-sidebar');
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-66vw'; 
        openButton.style.right = '0px'; 
        openButton.style.opacity = '0.2';
    } else {
        sidebar.style.right = '0px';
        openButton.style.right = '66vw'; 
        openButton.style.opacity = '0.9';
    }
    setTimeout(centerButton, 300); // Adjust button position after transition
}

function centerButton() {
    var sidebar = document.getElementById('artist-sidebar');
    var openButton = document.getElementById('open-sidebar');
    var sidebarTop = sidebar.offsetTop;
    var sidebarHeight = sidebar.offsetHeight;
    var buttonHeight = openButton.offsetHeight;
    var buttonTop = sidebarTop + (sidebarHeight - buttonHeight) / 2;
    openButton.style.top = buttonTop + 'px';
}

// Center the button on initial load
window.onload = centerButton;
window.onresize = centerButton;
