const connection = navigator.connection;
const lowData =
  Boolean(connection?.saveData) ||
  /(^|slow-)2g|3g/.test(connection?.effectiveType || "");

function loadEmbed(container) {
  const iframe = document.createElement("iframe");
  iframe.src = container.dataset.embedSrc;
  iframe.title = container.dataset.embedTitle || "embedded content";
  iframe.width = "100%";
  iframe.height = "300";
  iframe.loading = "lazy";
  iframe.allowFullscreen = true;
  iframe.style.border = "0";

  container.replaceChildren(iframe);
  container.classList.add("embed-loaded");
}

document.querySelectorAll("[data-heavy-embed]").forEach((container) => {
  container.querySelector(".load-embed")?.addEventListener("click", () => loadEmbed(container));

  if (lowData) {
    document.documentElement.dataset.lowData = "true";
    return;
  }

  const loadWhenIdle = () => loadEmbed(container);
  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadWhenIdle, { timeout: 2500 });
  } else {
    setTimeout(loadWhenIdle, 1200);
  }
});
