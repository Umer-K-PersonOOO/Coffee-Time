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

