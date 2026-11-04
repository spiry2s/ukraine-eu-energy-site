export function mountMaps(root, d3) {
  root.querySelectorAll('[data-component="map"]').forEach((figure) => {
    const canvas = figure.querySelector('[data-mount="map"]');
    if (!canvas || canvas.dataset.mounted === "true") return;
    if (typeof d3.geoPath !== "function") return;
    canvas.dataset.mounted = "true";
    canvas.dataset.renderer = "d3-geo";
  });
}
