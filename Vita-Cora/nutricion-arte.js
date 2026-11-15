const WIDTH = 400;
const HEIGHT = 180;
const CREW = [
  "......KKKKKKKK......",
  "....KKHHHHHHHHKK....",
  "...KHHWWWWWWWHHHK...",
  "..KHHWWVVVVVWWHHHK..",
  "..KHWWVVVVVVVWWNHK..",
  "..KHWWVVSSVVVWWNHK..",
  "..KHWWVSESSEVWWNHK..",
  "..KHHWSSSSSSSWHNHK..",
  "...KHHVVVVVVVHHNK...",
  "....KKHHHHHHHKKK....",
  ".....KWWWWWWWKK.....",
  "...KKHWWWWWWWNHKK...",
  "..KHHWNNNNNNWNNHHK..",
  ".KHHWWNGGONNWWNHHHK.",
  ".KHWWNNGGONNEWWNHHK.",
  ".KHWNNNNNNNNNWWNHK..",
  "..KKNNWWWWWWNNKKK...",
  "....KKKKKKKKKKK....."
];
const COLORS = {
  K: "#0e241e", H: "#d4e7c3", W: "#f8f7d7", V: "#355f50", N: "#a4bf96",
  S: "#e4b585", E: "#233d30", G: "#b8e378", O: "#e3b968"
};

export function startGalley(canvas, toggle) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    toggle.hidden = true;
    return;
  }
  let frame = 0;
  let started = null;
  let phase = 0;
  let lastTick = -1;
  let visible = false;
  let playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw(time) {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const scale = window.devicePixelRatio || 1;
    const backingWidth = Math.round(box.width * scale);
    const backingHeight = Math.round(box.height * scale);
    if (canvas.width !== backingWidth || canvas.height !== backingHeight) {
      canvas.width = backingWidth;
      canvas.height = backingHeight;
    }
    ctx.setTransform(backingWidth / WIDTH, 0, 0, backingHeight / HEIGHT, 0, 0);
    const rect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    rect(0, 0, WIDTH, HEIGHT, "#203d30");
    rect(0, 12, WIDTH, 128, "#315343");
    rect(0, 137, WIDTH, 43, "#172f26");
    rect(0, 142, WIDTH, 3, "#6e8d69");
    for (const x of [14, 164, 256, 388]) {
      rect(x, 12, 3, 124, "#557561");
      rect(x + 4, 12, 3, 124, "#294638");
    }

    rect(27, 29, 143, 93, "#142c24");
    rect(35, 22, 127, 106, "#142c24");
    rect(34, 29, 128, 92, "#97ad87");
    rect(40, 33, 116, 82, "#4d715d");
    rect(44, 39, 108, 70, "#132c37");
    for (const [x, y, offset] of [[54,48,0],[67,60,1],[92,47,2],[121,61,0],[143,48,1],[136,55,2]]) {
      rect(x, y, 2, 2, Math.floor(time) % 3 === offset ? "#f5f7cb" : "#719f91");
    }
    rect(44, 95, 108, 14, "#8ca181");
    rect(48, 91, 38, 5, "#8ca181");
    rect(60, 85, 14, 6, "#8ca181");
    rect(97, 91, 55, 5, "#a8b69c");
    rect(109, 86, 32, 5, "#a8b69c");
    rect(119, 82, 14, 4, "#a8b69c");
    rect(50, 99, 32, 3, "#657e72");
    rect(116, 100, 26, 3, "#687e6f");

    rect(292, 30, 69, 64, "#183527");
    rect(297, 35, 59, 47, "#69886a");
    rect(301, 39, 51, 39, "#142f27");
    for (let i = 0; i < 5; i++) {
      const height = [11, 15, 8, 21, 16][i];
      rect(307 + i * 8, 71 - height, 5, height, i === Math.floor(time * 1.4) % 5 ? "#dbef99" : "#79ad73");
    }
    rect(299, 86, 5, 4, "#91ce70");
    rect(307, 86, 5, 4, "#d9b268");

    CREW.forEach((row, y) => {
      Array.from(row).forEach((pixel, x) => {
        if (COLORS[pixel]) rect(177 + x * 5, 36 + y * 5 + (Math.floor(time * 2) % 2), 5, 5, COLORS[pixel]);
      });
    });

    rect(70, 128, 265, 8, "#111f19");
    rect(77, 118, 250, 10, "#a1b78a");
    rect(70, 125, 265, 5, "#b0c794");
    rect(76, 131, 253, 20, "#52734c");
    rect(88, 138, 231, 4, "#6b8a5b");
    rect(82, 151, 15, 27, "#152c22");
    rect(305, 151, 15, 27, "#152c22");

    rect(142, 109, 105, 15, "#132e25");
    rect(146, 107, 97, 14, "#c9d8a2");
    rect(150, 109, 89, 10, "#748b62");
    rect(155, 110, 39, 8, "#ebbd74");
    rect(159, 109, 11, 5, "#f5d58c");
    rect(199, 110, 19, 8, "#a5cc68");
    rect(221, 110, 13, 8, "#d78958");
    rect(259, 101, 16, 22, "#d7e4b8");
    rect(263, 94, 8, 7, "#7aab82");
    rect(262, 108, 10, 8, "#78ac75");
    const steam = Math.floor(time * 5) % 5;
    rect(163 + steam % 2 * 3, 102 - steam * 3, 2, 4, "#bfe2a0");
    rect(178 - steam % 2 * 3, 103 - steam * 3, 2, 4, "#accd9b");
  }

  function animate(now) {
    if (started === null) started = now - phase * 1000;
    phase = ((now - started) / 1000) % 30;
    const tick = Math.floor(phase * 10);
    if (tick !== lastTick) {
      draw(phase);
      lastTick = tick;
    }
    frame = requestAnimationFrame(animate);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    started = null;
    toggle.textContent = playing ? "Pausar" : "Animar";
    if (visible && playing) frame = requestAnimationFrame(animate);
  }

  toggle.addEventListener("click", () => {
    playing = !playing;
    sync();
  });
  new ResizeObserver(() => draw(phase)).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(canvas);
  draw(phase);
  sync();
}
