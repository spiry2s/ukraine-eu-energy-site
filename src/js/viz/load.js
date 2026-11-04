import * as d3 from "../vendor/d3.js";
import { mountCharts } from "./chart.js";
import { mountMaps } from "./map.js";

export function mountVisuals(root = document) {
  mountCharts(root, d3);
  mountMaps(root, d3);
}
