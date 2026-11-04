import { prefersReducedMotion, subscribeReducedMotion } from "../motion.js";

function readSeries(table) {
  return [...table.querySelectorAll("tbody tr")].map((row) => {
    const labelCell = row.querySelector("th");
    const valueCell = row.querySelector("td");
    const label = labelCell ? labelCell.textContent.trim() : "";
    const value = valueCell ? Number(valueCell.textContent.trim()) : NaN;
    return { label, value };
  }).filter((d) => d.label && Number.isFinite(d.value));
}

function drawBarChart(canvas, data, d3) {
  const max = Math.max(...data.map((d) => d.value), 0);
  const x = d3.scaleLinear().domain([0, max || 1]).range([0, 100]);
  const reduced = prefersReducedMotion();

  canvas.textContent = "";
  canvas.classList.add("is-mounted");

  const rows = d3.select(canvas)
    .selectAll(".chart-row")
    .data(data)
    .join("div")
    .attr("class", "chart-row");

  rows.append("span").text((d) => d.label);
  const bars = rows.append("svg")
    .attr("viewBox", "0 0 100 10")
    .attr("preserveAspectRatio", "none")
    .append("rect")
    .attr("height", 10)
    .attr("width", (d) => (reduced ? x(d.value) : 0))
    .attr("fill", "currentColor");
  rows.append("span").text((d) => String(d.value));

  if (reduced) return;

  bars.transition().duration(400).attr("width", (d) => x(d.value));
  const stop = subscribeReducedMotion((nowReduced) => {
    if (!nowReduced) return;
    bars.interrupt();
    bars.attr("width", (d) => x(d.value));
    stop();
  });
}

export function mountCharts(root, d3) {
  root.querySelectorAll('[data-component="chart"]').forEach((figure) => {
    const canvas = figure.querySelector('[data-mount="chart"]');
    if (!canvas || canvas.dataset.mounted === "true") return;
    if (figure.dataset.chart !== "bar") return;
    const table = figure.querySelector("table");
    const data = table ? readSeries(table) : [];
    if (!data.length || typeof d3.select !== "function") return;
    drawBarChart(canvas, data, d3);
    canvas.dataset.mounted = "true";
  });
}
