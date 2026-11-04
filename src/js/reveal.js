import { prefersReducedMotion, subscribeReducedMotion } from "./motion.js";

export function initReveal(root = document) {
  const nodes = [...root.querySelectorAll("[data-reveal]")];
  if (!nodes.length || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

  const pending = nodes.filter((node) => {
    const rect = node.getBoundingClientRect();
    return rect.bottom <= 0 || rect.top >= window.innerHeight;
  });
  if (!pending.length) return;

  pending.forEach((node) => node.classList.add("will-reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });

  pending.forEach((node) => {
    observer.observe(node);
    node.addEventListener("focusin", () => {
      node.classList.remove("will-reveal");
      node.classList.add("is-revealed");
      observer.unobserve(node);
    });
  });

  subscribeReducedMotion((reduced) => {
    if (!reduced) return;
    observer.disconnect();
    pending.forEach((node) => {
      node.classList.remove("will-reveal");
      node.classList.add("is-revealed");
    });
  });
}
