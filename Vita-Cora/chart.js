import { BASELINE, dateLabel, duration } from "./model.js";

export function makeSleepChart(canvas, tooltip, liveRegion) {
  const ctx = canvas.getContext("2d");
  const plot = canvas.parentElement;
  let rows = [];
  let points = [];
  let selected = -1;
  let bounds;
  let chartHeight;

  function select(index, announce = false) {
    selected = index;
    draw();
    if (index < 0 || !points[index]) {
      tooltip.hidden = true;
      return;
    }
    const point = points[index];
    const value = dateLabel(point.date) + " · " + (point.minutes === null ? "Sin registro" : duration(point.minutes));
    tooltip.textContent = value;
    tooltip.hidden = false;
    const left = Math.max(0, Math.min(point.x - tooltip.offsetWidth / 2, bounds.width - tooltip.offsetWidth));
    const top = Math.max(0, Math.min(point.y - 34, chartHeight - 54));
    tooltip.style.transform = 'translate(' + left + 'px,' + top + 'px)';
    if (announce) liveRegion.textContent = value;
  }

  function draw() {
    if (!ctx || rows.length === 0) return;
    bounds = plot.getBoundingClientRect();
    const width = bounds.width;
    chartHeight = bounds.height;
    if (width < 70 || chartHeight < 70) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(chartHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const compact = width < 400;
    const left = compact ? 31 : 37;
    const right = width - 12;
    const top = 14;
    const bottom = chartHeight - 27;
    const present = rows.filter(row => row.minutes !== null);
    const low = Math.max(0, Math.min(300, Math.floor(Math.min(...present.map(row => row.minutes), BASELINE) / 60) * 60 - 60));
    const high = Math.max(540, Math.ceil(Math.max(...present.map(row => row.minutes), BASELINE) / 60) * 60);
    const tick = high - low <= 360 ? 60 : (high - low <= 720 ? 120 : 360);
    const x = index => left + (right - left) * index / Math.max(1, rows.length - 1);
    const y = minutes => bottom - (minutes - low) * (bottom - top) / (high - low);

    ctx.font = (compact ? '10' : '11') + 'px "IBM Plex Mono", monospace';
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    for (let mark = Math.ceil(low / tick) * tick; mark <= high; mark += tick) {
      ctx.strokeStyle = "#d8e2d1";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(left, y(mark));
      ctx.lineTo(right, y(mark));
      ctx.stroke();
      ctx.fillStyle = "#50634f";
      ctx.fillText(mark / 60 + " h", left - 8, y(mark));
    }

    points = rows.map((row, index) => ({ ...row, x: x(index), y: row.minutes === null ? bottom - 7 : y(row.minutes) }));
    const groups = [];
    let segment = [];
    for (const point of points) {
      if (point.minutes === null) {
        if (segment.length > 0) groups.push(segment);
        segment = [];
      } else {
        segment.push(point);
      }
    }
    if (segment.length > 0) groups.push(segment);

    const gradient = ctx.createLinearGradient(0, top, 0, bottom);
    gradient.addColorStop(0, "#50a74836");
    gradient.addColorStop(1, "#50a74806");
    for (const group of groups) {
      ctx.beginPath();
      ctx.moveTo(group[0].x, bottom);
      for (const point of group) ctx.lineTo(point.x, point.y);
      ctx.lineTo(group.at(-1).x, bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.strokeStyle = "#856226";
    ctx.lineWidth = 1.3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(left, y(BASELINE));
    ctx.lineTo(right, y(BASELINE));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = "#287342";
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    for (const group of groups) {
      ctx.beginPath();
      group.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
      ctx.stroke();
    }

    points.forEach((point, index) => {
      ctx.beginPath();
      if (point.minutes === null) {
        ctx.strokeStyle = "#63775c";
        ctx.lineWidth = 1;
        ctx.moveTo(point.x, point.y - 4);
        ctx.lineTo(point.x + 4, point.y);
        ctx.lineTo(point.x, point.y + 4);
        ctx.lineTo(point.x - 4, point.y);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.arc(point.x, point.y, selected === index ? 5 : 3, 0, 2 * Math.PI);
        ctx.fillStyle = selected === index ? "#204f31" : "#287342";
        ctx.fill();
      }

      const last = points.length - 1;
      const every = Math.max(1, Math.ceil((points.length - 1) / (compact ? 4 : 7)));
      if ((index % every === 0 && last - index >= every) || index === last) {
        ctx.textAlign = index === 0 ? "left" : index === last ? "right" : "center";
        ctx.fillStyle = "#50634f";
        ctx.fillText(dateLabel(point.date), point.x, bottom + 15);
      }
    });
  }

  canvas.addEventListener("pointermove", event => {
    if (points.length === 0) return;
    const localX = event.clientX - bounds.left;
    const { x: start } = points[0];
    const { x: end } = points.at(-1);
    if (localX < start - 12 || localX > end + 12) return select(-1);
    select(Math.max(0, Math.min(points.length - 1, Math.round((localX - start) / (end - start) * (points.length - 1)))));
  });
  canvas.addEventListener("pointerleave", () => select(-1));
  canvas.addEventListener("focus", () => select(points.length - 1, true));
  canvas.addEventListener("blur", () => select(-1));
  canvas.addEventListener("keydown", event => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key) || points.length === 0) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const target = event.key === "Home" ? 0 : event.key === "End" ? points.length - 1 : selected + direction;
    select(Math.max(0, Math.min(points.length - 1, target)), true);
  });

  new ResizeObserver(() => select(-1)).observe(plot);
  document.fonts.ready.then(draw);
  return nextRows => {
    rows = nextRows;
    select(-1);
  };
}
