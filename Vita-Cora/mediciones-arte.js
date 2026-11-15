const WIDTH = 360;
const HEIGHT = 194;
const LIGHT = "#d9f598";
const MINT = "#86d6a2";
const GOLD = "#f6cb7c";
const INK = "#112c24";
const OUTLINE = "#64846b";
const PAPER = "#e6efd0";

const CREW = [
  ".....OOOOOO.....",
  "....OHHHHHHO....",
  "...OHWWWWWHHO...",
  "...OHWVVVVWHO...",
  "...OHVSSSSVHO...",
  "...OHVSEESVHO...",
  "...OHVSSSSVHO...",
  "....OVVVVVVO....",
  "...OOHHHHHHOO...",
  "..OHHOAAAOOHHO..",
  "..OHHOATAOOHHO..",
  "..OHHOOOOOOHHO..",
  "...OOHHHHHHOO...",
  "....OHHOOHHO....",
  "....OHHO.OHO....",
  "...OOOO..OOOO..."
];
const CREW_COLORS = {
  O: "#254238",
  H: "#dce8c8",
  W: "#f6f5dd",
  V: "#587b68",
  S: "#ca9871",
  E: "#342f2a",
  A: "#92ad5c",
  T: "#e9f5c2"
};

export function makeMeasurementArt(canvas, kind) {
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return () => {};
  let cssWidth = 0;

  function rect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }

  function line(points, color, width = 2) {
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const point of points.slice(1)) ctx.lineTo(...point);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function orb(x, y, radius, color, outline) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (outline) {
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function text(value, x, y, color = PAPER, size = 11) {
    ctx.font = "650 " + Math.max(size, 10 * WIDTH / cssWidth) + "px Geist, system-ui, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value, x, y);
  }

  function panel(x, y, w, h, color = "#213e32", edge = OUTLINE) {
    rect(x + 3, y + 4, w, h, "#0e241d");
    rect(x + 3, y, w - 6, h, edge);
    rect(x, y + 3, w, h - 6, edge);
    rect(x + 2, y + 2, w - 4, h - 4, color);
  }

  function cross(x, y, color, size = 4) {
    rect(x - size, y - 1, size * 2 + 1, 3, color);
    rect(x - 1, y - size, 3, size * 2 + 1, color);
  }

  function cabin() {
    rect(0, 0, WIDTH, HEIGHT, "#192f27");
    rect(0, 21, WIDTH, 115, "#29463a");
    for (const x of [14, 118, 222, 346]) {
      rect(x, 21, 2, 113, "#355347");
    }
    panel(24, 31, 104, 58, "#122b26", "#557b6b");
    for (const [x, y] of [[34, 48], [58, 40], [77, 62], [96, 46], [115, 71], [43, 75]]) rect(x, y, 2, 2, "#9abd87");
    rect(0, 141, WIDTH, 5, "#425f4e");
    rect(0, 146, WIDTH, 48, "#203e34");
    for (const x of [24, 87, 150, 213, 276, 339]) line([[x, 149], [x - 10, 194]], "#385748", 1);
    rect(0, 175, WIDTH, 2, "#294a3c");
  }

  function crew(x, y = 85, size = 4, accent = "#92ad5c") {
    const colors = { ...CREW_COLORS, A: accent };
    CREW.forEach((row, index) => {
      [...row].forEach((pixel, column) => {
        if (pixel !== ".") rect(x + column * size, y + index * size, size, size, colors[pixel]);
      });
    });
  }

  function monitor(x, y, w = 126, h = 83) {
    rect(x + w / 2 - 8, y + h, 16, 18, OUTLINE);
    rect(x + w / 2 - 24, y + h + 13, 48, 6, "#3e6150");
    panel(x, y, w, h, "#355749");
    rect(x + 8, y + 8, w - 16, h - 19, "#102e25");
    rect(x + w - 17, y + h - 7, 5, 3, LIGHT);
  }

  function badge(value, x, y, w, color = LIGHT) {
    panel(x, y, w, 21, "#132e24", "#50775a");
    text(value, x + w / 2, y + 10.5, color);
  }

  function tick(x, y, color = LIGHT) {
    line([[x - 4, y], [x - 1, y + 3], [x + 5, y - 4]], color, 2);
  }

  function trace(x, y, width, values, phase, color = MINT) {
    const points = values.map((value, index) => [x + index * width / (values.length - 1), y - value]);
    line(points, "#3c6550", 2);
    const position = phase * (points.length - 1);
    const index = Math.min(points.length - 2, Math.floor(position));
    const fraction = position - index;
    const start = points[index];
    const end = points[index + 1];
    const tip = [start[0] + (end[0] - start[0]) * fraction, start[1] + (end[1] - start[1]) * fraction];
    line([...points.slice(0, index + 1), tip], color, 2);
    rect(tip[0] - 2, tip[1] - 2, 4, 4, color);
  }

  function actigraphy(step, phase) {
    crew(46, 81, 5);
    rect(102, 123, 40, 17, "#c8d8b8");
    rect(120, 119, 11, 25, "#42604e");
    panel(115, 124, 21, 16, "#19372b", LIGHT);
    if (step === 0) {
      const size = 13 + phase * 8;
      ctx.strokeStyle = "#a9d979";
      ctx.strokeRect(125 - size, 132 - size, size * 2, size * 2);
    }
    monitor(172, 52, 147, 84);
    if (step === 1) {
      orb(203, 81, 8, GOLD);
      for (const [x, y] of [[190, 81], [214, 81], [202, 68], [202, 93]]) rect(x, y, 3, 3, GOLD);
      orb(289, 81, 9, LIGHT);
      orb(293, 77, 8, "#102e25");
    }
    trace(190, step === 1 ? 117 : 104, 111, [3, 10, 5, 19, 13, 25, 10, 4], phase);
    badge(["Monitor de muñeca", "Movimiento y luz", "Patrón de descanso"][step], 183, 157, 127);
  }

  function questionnaires(step, phase) {
    const sleep = kind === "sueno";
    crew(46, 84, 4.5, sleep ? "#8caa59" : "#c59960");
    panel(137, 36, 171, 116, PAPER, "#72936e");
    rect(149, 49, 147, 90, "#f1f4dc");
    const heading = sleep ? ["Al despertar", "Antes de dormir", "Registro personal"] : ["Antes del vuelo", "Respuestas propias", "Contexto del equipo"];
    text(heading[step], 223, 62, INK, 13);
    for (const [index, y] of [83, 104, 125].entries()) {
      panel(157, y - 5, 11, 11, "#dce8c7", "#70966c");
      if (phase * 3 >= index) tick(162, y, "#30634a");
      rect(178, y - 1, [68, 92, 54][index], 3, "#79947e");
    }
    panel(163, 163, 120, 20, "#182f25", "#5a7b5c");
    text(sleep ? ["Sueño", "Ánimo y equipo", "Autorreporte"][step] : ["Cuestionario", "Rasgos", "Previo a la misión"][step], 223, 173);
  }

  function cognition(step, phase) {
    crew(42, 87, 4.5);
    rect(20, 151, 127, 7, "#567754");
    rect(111, 145, 37, 6, "#a2bd82");
    monitor(153, 39, 163, 105);
    const lit = Math.floor(phase * 4);
    for (let index = 0; index < 4; index += 1) {
      const x = 176 + (index % 2) * 62;
      const y = 57 + Math.floor(index / 2) * 31;
      const active = index === lit || (step === 2 && index < lit);
      panel(x, y, 55, 24, active ? "#567e50" : "#21473a", active ? LIGHT : OUTLINE);
      if (index % 2 === 0) cross(x + 27, y + 12, active ? LIGHT : "#719d7d");
      else orb(x + 27, y + 12, 5, active ? GOLD : "#719d7d");
    }
    badge(["Estímulos de ejemplo", "Atención y memoria", "Resultados del equipo"][step], 164, 165, 141);
  }

  function balance(step, phase) {
    const shift = Math.round(Math.sin(phase * Math.PI * 2) * (step === 1 ? 12 : 4));
    crew(74 + shift, 65, 5);
    panel(43, 145, 151, 22, "#789365", "#a4bc86");
    for (const x of [61, 91, 121, 151]) rect(x, 152, 10, 4, GOLD);
    monitor(207, 54, 118, 82);
    trace(224, 109, 83, [3, 4, 9, 3, 22, 5, 4, 8, 3], phase, GOLD);
    rect(245, 118, 42, 3, "#7da893");
    badge(["Zona de evaluación", "Movimiento y equilibrio", "Pulso y presión"][step], 200, 157, 132);
  }

  function carotid(step, phase) {
    crew(44, 82, 5);
    rect(100, 112, 7, 12, "#c89d78");
    panel(109, 113, 21, 10, "#dce8c8", "#72947a");
    line([[128, 119], [146, 128], [176, 128], [187, 103]], "#a0c9a6");
    monitor(177, 35, 150, 109);
    const left = 195;
    const right = 308;
    for (const level of [68, 78, 103, 113]) {
      line([[left, level + 4], [223, level], [259, level + 3], [right, level - 2]], "#82b199", 2);
    }
    if (step > 0) {
      const sweep = 197 + Math.round(phase * 108);
      rect(sweep, 56, 2, 64, "#a2d7a1");
    }
    if (step === 2) {
      line([[250, 76], [250, 102]], GOLD);
      cross(250, 76, GOLD, 3);
      cross(250, 102, GOLD, 3);
    }
    badge(["Ecógrafo", "Imagen de la arteria", "Grosor de la pared"][step], 187, 164, 130);
  }

  function labs(step, phase) {
    const microbiome = kind === "microbioma";
    const cellular = kind === "celulas";
    panel(32, 133, 118, 22, "#607f65");
    const colors = microbiome ? [MINT, GOLD, "#9dc68c"] : [cellular ? "#cb8482" : "#c57570", "#ddbc81"];
    colors.forEach((color, index) => {
      const x = 51 + index * 29;
      panel(x, 71 + index * 5, 18, 63 - index * 5, "#b8cda9", "#778d76");
      rect(x + 4, 92 + index * 4, 10, 34 - index * 4, color);
      rect(x - 1, 68 + index * 5, 20, 8, "#54715e");
    });
    badge("Muestras", 48, 163, 84);
    monitor(164, 44, 163, 106);
    const offset = step === 1 ? Math.round(Math.sin(phase * Math.PI) * 5) : 0;
    if (microbiome || cellular) {
      for (const [index, [x, y]] of [[194, 80], [222, 64], [249, 87], [292, 70], [301, 112], [222, 117], [269, 115]].entries()) {
        const color = colors[index % colors.length];
        if (microbiome && index % 2) {
          panel(x - 7, y - 3 + offset, 15, 8, color, color);
        } else {
          orb(x, y + offset, index % 2 ? 5 : 8, "#294c3b", color);
          rect(x - 1, y - 1 + offset, 3, 3, color);
        }
      }
    } else {
      for (const [index, x] of [195, 225, 255, 285].entries()) {
        const height = [29, 47, 37, 53][index];
        const fill = step === 1 ? Math.min(height, Math.round(phase * height) + 4) : height;
        rect(x, 124 - fill, 14, fill, index % 2 ? GOLD : MINT);
      }
      line([[183, 125], [310, 125]], OUTLINE);
    }
    const label = step === 0 ? "Laboratorio" : step === 2 ? "Análisis especializado" : cellular ? "Células y señales" : microbiome ? "Microorganismos" : "Sustancias medidas";
    badge(label, 171, 169, 147);
  }

  const artwork = { actigrafia: actigraphy, sueno: questionnaires, cognicion: cognition, equilibrio: balance, personalidad: questionnaires, marcadores: labs, carotida: carotid, celulas: labs, microbioma: labs }[kind];

  return (step, phase) => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    cssWidth = width;
    const density = window.devicePixelRatio || 1;
    const pixelWidth = Math.round(width * density);
    const pixelHeight = Math.round(height * density);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(pixelWidth / WIDTH, 0, 0, pixelHeight / HEIGHT, 0, 0);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    cabin();
    artwork(step, phase);
  };
}
