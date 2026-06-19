const viewportUnit = (() => {
  const root = document.documentElement;
  let lastWidth = 0;

  function viewportWidth() {
    return Math.round(root.clientWidth || window.innerWidth || window.visualViewport?.width);
  }

  function viewportHeight() {
    return window.visualViewport?.height || window.innerHeight || root.clientHeight;
  }

  function setViewportUnit({ force = false } = {}) {
    const nextWidth = viewportWidth();
    const widthChanged = Math.abs(nextWidth - lastWidth) > 2;
    const mobileHeightOnlyResize = window.visualViewport && nextWidth <= 900;

    if (!force && !widthChanged && mobileHeightOnlyResize) return;

    lastWidth = nextWidth;
    root.style.setProperty("--app-vh", `${viewportHeight() * 0.01}px`);
  }

  setViewportUnit({ force: true });
  window.addEventListener("resize", () => setViewportUnit(), { passive: true });
  window.visualViewport?.addEventListener("resize", () => setViewportUnit(), { passive: true });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => setViewportUnit({ force: true }), 250);
  });

  return { refresh: () => setViewportUnit({ force: true }) };
})();

document.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("shrink");
        var x = document.getElementById("tags");
        if (x.style.display === "flex") {
          x.style.display = "none";
          document
            .querySelector(".hamburger")
            ?.setAttribute("aria-expanded", "false");
        }
    } else {
        header.classList.remove("shrink");
    }
});

function myFunction() {
    var x = document.getElementById("tags");
    var button = document.querySelector(".hamburger");
    if (x.style.display === "flex") {
      x.style.display = "none";
      button?.setAttribute("aria-expanded", "false");
    } else {
      x.style.display = "flex";
      button?.setAttribute("aria-expanded", "true");
    }
  }

const sidebar = document.getElementById("artist-sidebar");
const openSidebarButton = document.getElementById("open-sidebar");
if (sidebar && openSidebarButton) {
  window.addEventListener("scroll", closeSidebar);
  window.addEventListener("load", centerButton);
}

  function toggleSidebar() {
    if (!sidebar || !openSidebarButton) return;
    if (sidebar.style.right === '0px') {
        sidebar.style.right = '-66vw';
        openSidebarButton.style.right = '0px';
    } else {
        sidebar.style.right = '0px';
        openSidebarButton.style.right = '66vw';
    }
}

function closeSidebar() {
  if (!sidebar || !openSidebarButton) return;
  sidebar.style.right = '-66vw';
  openSidebarButton.style.right = '0px';
}

function centerButton() {
  if (!openSidebarButton) return;
  openSidebarButton.style.removeProperty("top");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
