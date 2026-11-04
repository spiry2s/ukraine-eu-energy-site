import { initReveal } from "./reveal.js";

initReveal(document);
enhanceTimelines(document);

if (document.querySelector('[data-component="chart"], [data-component="map"]')) {
  import("./viz/load.js")
    .then((mod) => mod.mountVisuals(document))
    .catch((error) => {
      console.error("Visual module failed to load.", error);
    });
}

function enhanceTimelines(root) {
  root.querySelectorAll('[data-component="timeline"]').forEach((timeline) => {
    const items = timeline.querySelectorAll("li");
    if (items.length < 4) return;
    timeline.classList.add("is-enhanced");
    for (let i = 3; i < items.length; i += 1) items[i].hidden = true;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Show all events";
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      for (let i = 3; i < items.length; i += 1) items[i].hidden = open;
      button.setAttribute("aria-expanded", String(!open));
      button.textContent = open ? "Show all events" : "Show fewer events";
    });
    timeline.after(button);
  });
}
