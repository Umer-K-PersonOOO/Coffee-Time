const artistSidebarLinks = [
  ["candypaintcafe.html", "images/candypaintcafepfp.avif", "candypaintcafe"],
  ["burntgreentea.html", "images/burntgreenteapfp.avif", "burntgreentea"],
  ["mistiousstar.html", "images/mistiousstarpfp.avif", "mistiousstar"],
  ["batsouppe.html", "images/batsouppepfp.avif", "batsouppe"],
  ["allenerie.html", "images/alleneriepfp.avif", "allenerie"],
  ["batensan.html", "images/batensanpfp.avif", "batensan"],
  ["rumikuu.html", "images/rumikuupfp.avif", "rumikuu"],
  ["nekopon.html", "images/nekoponpfp.avif", "nekopon"],
  ["aitsuki.html", "images/aitsukipfp.avif", "aitsuki"],
  ["lixizu.html", "images/lixizupfp.avif", "lixizu"],
  ["pinlin.html", "images/pinlinpfp.avif", "pinlin"],
  ["kgynh.html", "images/kgynhpfp.avif", "kgynh"],
];

function renderArtistSidebar() {
  const sidebar = document.getElementById("artist-sidebar");
  if (!sidebar || sidebar.children.length > 0) return;

  const grid = document.createElement("div");
  grid.className = "pfp-grid";

  artistSidebarLinks.forEach(([href, src, name]) => {
    const link = document.createElement("a");
    link.href = `/${href}`;
    link.setAttribute("aria-label", `View ${name} art`);

    const img = document.createElement("img");
    img.src = src;
    img.alt = name;
    img.loading = "lazy";
    img.decoding = "async";

    link.appendChild(img);
    grid.appendChild(link);
  });

  sidebar.appendChild(grid);
}

renderArtistSidebar();
