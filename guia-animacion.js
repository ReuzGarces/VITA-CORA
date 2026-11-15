const PALETTES = {
  pulso: { accent: "#c8f57d", soft: "#546b35", ink: "#21442f" },
  temperatura: { accent: "#ffd28f", soft: "#6c5736", ink: "#3d3926" },
  "no-responde": { accent: "#ffd592", soft: "#80694b", ink: "#42372b" },
  herida: { accent: "#f6dfaa", soft: "#7d7054", ink: "#3c3b2d" },
  desorientacion: { accent: "#ffdb9b", soft: "#846541", ink: "#3a3528" }
};
const WIDTH = 560;
const HEIGHT = 275;

export function makeIllustration(canvas) {
  const ctx = canvas.getContext("2d", { alpha: false });
  let topic = "pulso";
  let step = 0;
  let playing = false;
  let elapsed = 0;
  let frame = 0;
  let startedAt = null;
  let sceneScale = 1;
  const wrist = new Path2D("M106 179 C144 174 174 171 206 157 C226 147 236 136 249 127 L275 96 C281 89 292 89 298 96 C305 103 301 112 295 121 L280 141 C291 139 305 135 319 132 L370 120 C380 118 387 123 388 130 C390 136 386 142 379 145 L331 161 L407 147 C417 145 424 151 425 158 C426 165 421 171 412 173 L337 189 L405 181 C414 180 420 186 420 193 C420 200 414 206 407 206 L335 214 L378 214 C388 214 394 220 393 226 C393 233 387 238 378 238 L301 239 C275 239 254 231 229 222 C196 210 149 221 107 227 Z");
  const fingers = new Path2D("M332 2 L396 1 L384 29 C379 42 372 48 358 56 L329 76 L267 155 C261 163 250 164 244 158 C239 153 239 145 245 138 L289 82 L251 109 L223 143 C217 151 206 151 200 145 C195 139 196 131 203 123 L241 81 L271 50 C281 40 293 38 303 33 Z");
  const torso = new Path2D("M164 40 L196 40 C199 56 214 60 233 66 C250 71 258 86 257 103 C256 114 247 122 240 128 L241 230 L124 230 L130 127 C117 120 111 112 111 100 C111 84 123 72 141 65 C155 59 162 53 164 40 Z");
  const arm = new Path2D("M227 70 C244 64 256 70 271 87 L321 147 C327 154 327 168 324 175 C320 186 302 191 293 178 L252 123 C247 117 242 116 237 118 C224 122 211 115 207 102 C202 88 212 75 227 70 Z");
  const sleeve = new Path2D("M224 72 C243 64 257 74 270 88 L289 110 L255 132 L248 124 C243 119 239 118 234 117 C221 117 211 111 207 100 C204 88 212 77 224 72 Z");

  function shape(path, fill, stroke, width = 2.5) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.fill(path);
    ctx.stroke(path);
  }

  function box(x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  function line(points, color, width = 1.5) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (const p of points.slice(1)) ctx.lineTo(p[0], p[1]);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  function circle(x, y, radius, fill, stroke, width = 1.5) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.lineWidth = width;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    }
  }

  function label(text, x, y, color, size = 13) {
    const fontSize = Math.max(size, 11 / sceneScale);
    ctx.font = '650 ' + fontSize + 'px Geist, system-ui, sans-serif';
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  }

  function signal(x, y, tone, progress, radius = 14) {
    circle(x, y, radius + progress * radius, null, tone.soft, Math.max(1, 3 - progress * 1.5));
    circle(x, y, radius, null, tone.accent, 2.25);
    circle(x, y, 3.5, tone.accent);
  }

  function pulse(tone, time) {
    const beat = time ? (time % 1150) / 1150 : .3;
    const drop = time ? 12 + Math.cos(time / 400) * 8 : 12;
    box(76, 166, 412, 76, 18, "#14263b", "#2a455d");
    line([[95, 227], [467, 227]], "#29435b");

    shape(wrist, "#294452", "#a6c6c9");
    line([[294, 146], [280, 158], [271, 174]], "#779da5");
    line([[311, 171], [297, 186], [289, 206]], "#779da5");
    line([[241, 161], [231, 178], [219, 198]], "#628a92");
    if (step < 2) {
      ctx.save();
      ctx.translate(24, drop);
      shape(fingers, "#486471", "#c0dad8");
      line([[278, 52], [257, 75], [238, 95]], "#90b0b4");
      ctx.restore();
    }
    signal(235, 171, tone, beat, 15);

    if (step === 0) {
      line([[172, 93], [188, 93], [227, 153]], tone.accent, 2);
      box(55, 76, 117, 34, 4, "#142d23", tone.soft);
      label("DOS DEDOS", 113, 93, tone.accent, 14);
      line([[276, 143], [347, 101], [369, 101]], "#bcd8d7", 1.8);
      circle(276, 143, 2.5, "#dceeed");
      box(369, 84, 180, 34, 4, "#142d23", "#63867b");
      label("BASE DEL PULGAR", 459, 101, "#dceeed", 13);
    } else if (step === 1) {
      box(387, 38, 93, 63, 10, "#13303a", tone.soft);
      line([[398, 69], [412, 69], [420, 60], [426, 77], [435, 51], [442, 69], [466, 69]], tone.accent, 2);
      label("LATIDOS", 432, 88, tone.accent);
    } else {
      box(320, 44, 163, 83, 13, "#132c37", tone.soft);
      label("CUENTA DURANTE", 401, 64, tone.accent);
      label("1 MINUTO", 401, 91, "#e4fff9", 22);
    }
  }

  function temperature(tone, time) {
    const close = step === 0 ? 0 : step === 2 ? .55 : .3 + .22 * Math.sin(time / 670) ** 2;
    shape(torso, "#253247", "#8299ae");
    line([[154, 57], [162, 70], [179, 74], [195, 70], [203, 58]], "#678199");
    line([[127, 218], [236, 218]], "#526982");

    ctx.save();
    ctx.translate(235, 96);
    ctx.rotate(close);
    ctx.translate(-235, -96);
    shape(arm, "#624f50", "#c5a9a1");
    shape(sleeve, "#344962", "#8299ae");
    ctx.restore();

    if (step < 2) {
      const approach = step === 0 ? Math.sin(time / 500) ** 2 * 15 : 0;
      ctx.save();
      ctx.translate(241, 127 - approach);
      ctx.rotate(.36 + close);
      box(-5, -5, 25, 10, 5, "#e3c9a3", "#fff0d6");
      box(12, -11, 96, 22, 9, "#3a3337", tone.accent);
      box(58, -6, 34, 12, 3, "#1f2432", "#a99181");
      ctx.restore();
      signal(241, 127, tone, time ? (time % 1450) / 1450 : .35, 14);
    }

    if (step === 0) {
      line([[143, 151], [177, 151], [225, 130]], tone.accent, 2);
      box(56, 134, 87, 34, 4, "#29291c", tone.soft);
      label("AXILA", 99.5, 151, tone.accent, 14);
    } else if (step === 1) {
      line([[378, 190], [328, 185], [289, 173]], tone.accent, 2);
      line([[301, 168], [289, 173], [298, 183]], tone.accent, 2);
      label("ACERCA EL BRAZO", 424, 218, tone.accent, 14);
    } else {
      box(324, 67, 153, 76, 11, tone.ink, tone.accent);
      label("EJEMPLO", 400, 87, tone.accent);
      label("36,6 °C", 400, 115, "#fff2e0", 24);
    }
  }

  function astronaut(x, y, trim, skin) {
    ctx.save();
    ctx.translate(x, y);
    const outline = "#839a86";
    const suit = "#e2edd1";
    box(-53, 9, 106, 61, 17, "#59745d", outline);
    box(-43, 5, 86, 68, 17, suit, outline);
    box(-22, 24, 44, 25, 5, trim, "#5f785e");
    line([[-10, 36], [10, 36]], "#eff5de", 2.5);
    box(-39, -56, 78, 75, 18, suit, outline);
    box(-30, -45, 60, 50, 15, "#254136", "#799582");
    box(-23, -38, 46, 38, 12, skin, "#a18b70");
    ctx.fillStyle = "#3f4237";
    ctx.fillRect(-10, -25, 3, 4);
    ctx.fillRect(7, -25, 3, 4);
    line([[-4, -13], [4, -13]], "#674d40", 1.8);
    ctx.restore();
  }

  function supportPanel(x, y, w, text, tone) {
    box(x, y, w, 30, 4, "#153026", tone.soft);
    label(text, x + w / 2, y + 15, tone.accent, 14);
  }

  function radio(x, y, tone, phase) {
    box(x, y, 76, 79, 9, "#29483d", tone.accent);
    line([[x + 15, y], [x + 15, y - 22], [x + 22, y - 22]], tone.accent, 2.5);
    box(x + 11, y + 13, 54, 25, 4, "#11291f", tone.soft);
    line([[x + 17, y + 26], [x + 24, y + 26], [x + 30, y + 19], [x + 34, y + 29],
      [x + 38, y + 23], [x + 57, y + 23]], tone.accent, 2);
    signal(x + 38, y + 58, tone, phase, 8);
  }

  function restingCrew() {
    box(163, 182, 294, 21, 8, "#47695c", "#749485");
    box(167, 159, 63, 24, 9, "#5c776a", "#77968b");
    box(219, 138, 146, 45, 18, "#a6c2a5", "#d1e2be");
    box(328, 155, 112, 28, 11, "#749682", "#a4bc9a");
    box(413, 145, 25, 36, 7, "#bccdad", "#d1e2be");
    box(235, 161, 114, 16, 7, "#bad0af", "#d1e2be");
    circle(203, 152, 23, "#c79471", "#efd0a5", 2);
    line([[192, 146], [201, 146]], "#4c4337", 2);
    line([[182, 146], [180, 152], [186, 153]], "#e4b190", 1.8);
  }

  function checkResponse(tone, phase) {
    if (step < 2) {
      astronaut(125, 121, "#4b754a", "#dec099");
      restingCrew();
      if (step === 0) {
        const touch = 3 * Math.sin(phase * Math.PI) ** 2;
        line([[155, 156], [186, 140 - touch], [235, 141 - touch]], "#d3e5c3", 12);
        box(228, 134 - touch, 18, 12, 4, "#d9b58a", "#efdbad");
        signal(241, 141, tone, phase, 9);
        radio(384, 67, tone, phase);
        supportPanel(212, 66, 130, "POR SU NOMBRE", tone);
      } else {
        line([[151, 100], [218, 88], [275, 102]], "#b6c6a4", 1.5);
        const y = 99 - 4 * Math.sin(phase * Math.PI);
        line([[278, y], [278, 124]], tone.accent, 2.5);
        line([[270, y + 8], [278, y], [286, y + 8]], tone.accent, 2.5);
        signal(278, 140, tone, phase, 11);
        supportPanel(306, 67, 145, "HASTA 10 S", tone);
      }
    } else {
      supportPanel(76, 56, 196, "RESPIRACIÓN ANORMAL", tone);
      supportPanel(288, 56, 196, "RESPIRACIÓN NORMAL", tone);
      box(76, 93, 196, 118, 10, "#2f3128", tone.soft);
      box(288, 93, 196, 118, 10, "#1b3930", "#729681");
      box(137, 112, 73, 48, 7, "#273b30", tone.accent);
      box(161, 105, 25, 9, 3, "#d2c08b", tone.accent);
      line([[175, 122], [166, 137], [177, 136], [171, 149], [186, 131], [175, 133]], tone.accent, 2);
      label("RCP + DEA", 174, 185, tone.accent, 16);
      ctx.beginPath();
      ctx.ellipse(386, 136, 33, 16, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "#b4d6ae";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      signal(386, 136, { accent: "#b4d6ae", soft: "#5d8c70" }, phase, 8);
      label("VIGILA SU RESPIRACIÓN", 386, 185, "#c0dfa7", 14);
    }
  }

  function woundArm(x, y, dressed) {
    box(x, y, 187, 49, 22, "#c39572", "#ecc7a6");
    box(x + 150, y + 6, 48, 37, 9, "#c9d7ba", "#e0e9cc");
    line([[x + 10, y + 32], [x + 40, y + 33], [x + 57, y + 29]], "#a6745c", 1.6);
    if (dressed) {
      box(x + 63, y + 5, 66, 39, 5, "#f7f1d4", "#a9ad92");
      line([[x + 67, y + 33], [x + 124, y + 33]], "#c1cbb0");
    } else {
      line([[x + 81, y + 24], [x + 95, y + 17], [x + 109, y + 25]], "#833f32", 4);
    }
  }

  function pressureHand(x, y) {
    box(x - 16, y - 66, 67, 67, 14, "#a8bbb1", "#d4e1d8");
    box(x - 12, y - 7, 65, 39, 13, "#cbdcd1", "#f0f2da");
    box(x - 33, y + 12, 35, 20, 9, "#cbdcd1", "#f0f2da");
    line([[x + 4, y + 22], [x + 47, y + 22]], "#8fa99b", 1.8);
    line([[x + 6, y + 13], [x + 48, y + 13]], "#8fa99b", 1.8);
    line([[x - 12, y - 37], [x + 50, y - 37]], "#6f9382", 2.4);
  }

  function bleeding(tone, phase) {
    if (step === 0) {
      woundArm(107, 124, false);
      signal(203, 146, { accent: "#f2bc92", soft: "#94744c" }, phase, 14);
      radio(356, 99, tone, phase);
      supportPanel(95, 73, 208, "SANGRADO INTENSO", tone);
      return;
    }

    const armX = step === 1 ? 168 : 98;
    woundArm(armX, 149, true);
    pressureHand(armX + 87, 125);
    if (step === 1) {
      const dx = 4 * Math.sin(Math.PI * phase) ** 2;
      for (const x of [armX + 41, armX + 153]) {
        line([[x, 90 + dx], [x, 138]], tone.accent, 2.3);
        line([[x - 7, 127], [x, 138], [x + 7, 127]], tone.accent, 2.3);
      }
    } else {
      radio(360, 106, tone, phase);
    }
  }

  function dizziness(tone, phase) {
    astronaut(145, 142, "#4b754a", "#dec099");
    astronaut(340, 144, "#8d7445", "#b98763");
    if (step === 0) {
      line([[233, 110], [244, 110], [244, 191], [233, 191]], "#adcbb1", 7);
      line([[165, 169], [197, 157], [239, 153]], "#d3e5c3", 10);
      box(234, 147, 18, 12, 3, "#e3c495", "#efe0b5");
      line([[309, 168], [281, 155], [248, 161]], "#d3e5c3", 10);
      signal(247, 157, tone, phase, 9);
      supportPanel(226, 68, 106, "ASIDERO", tone);
    } else if (step === 1) {
      radio(241, 119, tone, phase);
      line([[389, 117], [427, 55], [465, 117], [389, 117]], tone.accent, 2.5);
      line([[427, 76], [427, 92]], tone.accent, 3);
      circle(427, 103, 2, tone.accent);
    } else {
      box(421, 88, 75, 115, 7, "#26463b", tone.accent);
      box(443, 82, 30, 13, 3, "#d2c689", tone.accent);
      for (const [index, y] of [115, 145, 175].entries()) {
        box(434, y - 5, 10, 10, 2, index <= phase * 3 ? tone.accent : tone.soft);
        line([[453, y], [483, y]], "#b9d2ac", 2.2);
      }
    }
  }

  const supportDrawings = {
    "no-responde": [checkResponse, ["COMPRUEBA Y AVISA A BORDO", "OBSERVA EL PECHO", "ACTÚA SEGÚN LA RESPIRACIÓN"]],
    herida: [bleeding, ["SI ES INTENSO, AVISA AHORA", "PRESIÓN DIRECTA Y CONTINUA", "MANTÉN LA PRESIÓN"]],
    desorientacion: [dizziness, ["DETÉN LA TAREA", "SI HAY ALARMA, AVISA AHORA", "MÓDULO · HORA · SÍNTOMAS"]]
  };

  function drawSupport(tone, time) {
    const phase = time ? (time % 1750) / 1750 : 0.4;
    box(56, 45, 448, 178, 12, "#183529", tone.soft);
    line([[57, 207], [503, 207]], "#4e6a54", 2);
    for (const x of [71, 83, 95]) box(x, 54, 5, 5, 1, "#829d70");
    const [drawCase, labels] = supportDrawings[topic];
    drawCase(tone, phase);
    supportPanel(86, 237, 388, labels[step], tone);
  }

  function draw(time) {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height || !ctx) return;
    const density = window.devicePixelRatio || 1;
    const pixelWidth = Math.max(1, Math.round(width * density));
    const pixelHeight = Math.max(1, Math.round(height * density));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
    sceneScale = Math.min(width / WIDTH, height / HEIGHT);
    const tone = PALETTES[topic];
    const gradient = ctx.createRadialGradient(width * .52, height * .52, 0, width * .52, height * .52, width * .56);
    gradient.addColorStop(0, tone.ink);
    gradient.addColorStop(1, "#13291f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.beginPath();
    for (let x = 10; x < width; x += 17) {
      for (let y = 9; y < height; y += 17) ctx.rect(x, y, 2, 2);
    }
    ctx.fillStyle = "#66867236";
    ctx.fill();
    ctx.translate((width - WIDTH * sceneScale) / 2, (height - HEIGHT * sceneScale) / 2);
    ctx.scale(sceneScale, sceneScale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const renderTopic = { pulso: pulse, temperatura: temperature }[topic] ?? drawSupport;
    renderTopic(tone, time);
  }

  function animate(now) {
    if (!playing) return;
    if (startedAt === null) startedAt = now - elapsed;
    elapsed = now - startedAt;
    draw(elapsed);
    frame = requestAnimationFrame(animate);
  }

  new ResizeObserver(() => draw(elapsed)).observe(canvas);
  document.fonts.ready.then(() => draw(elapsed));
  return (nextTopic, nextStep, shouldPlay) => {
    if (topic !== nextTopic || step !== nextStep) elapsed = 0;
    topic = nextTopic;
    step = nextStep;
    playing = shouldPlay;
    cancelAnimationFrame(frame);
    startedAt = null;
    draw(elapsed);
    if (playing) frame = requestAnimationFrame(animate);
  };
}
