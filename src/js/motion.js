const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return window.matchMedia(QUERY).matches;
}

export function subscribeReducedMotion(callback) {
  const media = window.matchMedia(QUERY);
  const onChange = () => callback(media.matches);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
