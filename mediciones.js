import { makeMeasurementArt } from "./mediciones-arte.js";

const SCENES = {
  actigrafia: [
    "El tripulante lleva un monitor en la muñeca.",
    "El monitor registra el movimiento y la luz a lo largo del día.",
    "El equipo usa esos registros para estudiar los horarios de sueño."
  ],
  sueno: [
    "Al despertar, el tripulante anota cuánto y cómo durmió.",
    "Antes de dormir, responde preguntas sobre ánimo y convivencia.",
    "El equipo compara el relato de sueño con el registro del monitor."
  ],
  cognicion: [
    "El tripulante responde a estímulos que aparecen en la pantalla.",
    "Distintas tareas exploran habilidades como atención y memoria.",
    "El equipo de investigación revisa los resultados de las pruebas."
  ],
  equilibrio: [
    "El personal prepara una evaluación de movimiento y equilibrio.",
    "La figura ilustra un cambio de postura que el equipo puede observar.",
    "El personal también puede registrar el pulso y la presión."
  ],
  personalidad: [
    "Antes del vuelo, cada tripulante responde un cuestionario.",
    "Las respuestas describen cómo suele actuar y relacionarse.",
    "NASA usa el cuestionario como contexto para su investigación sobre equipos."
  ],
  marcadores: [
    "El laboratorio recibe muestras de sangre y orina del estudio.",
    "Los marcadores son sustancias que se pueden medir en las muestras.",
    "El equipo especializado interpreta los resultados con el contexto del estudio."
  ],
  carotida: [
    "El equipo capacitado observa una arteria del cuello con un ecógrafo.",
    "La pantalla muestra un esquema de sus paredes.",
    "Las marcas indican el grosor de una pared en el esquema."
  ],
  celulas: [
    "El laboratorio estudia muestras de sangre y saliva.",
    "El esquema representa células y otras señales que se analizan.",
    "El equipo estudia cómo cambia la respuesta del cuerpo durante el vuelo."
  ],
  microbioma: [
    "El laboratorio recibe las muestras recogidas para el estudio.",
    "Los símbolos representan distintos microorganismos del cuerpo.",
    "Los investigadores comparan cómo cambia esa comunidad durante la misión."
  ]
};
const STEP_MS = 2500;
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

function element(tag, className, content = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = content;
  return node;
}

function button(label, action) {
  const control = element("button", "button quiet", label);
  control.type = "button";
  control.addEventListener("click", action);
  return control;
}

function mountScene(card) {
  const captions = SCENES[card.dataset.medida];
  const subject = card.querySelector("summary strong").textContent;
  const scene = element("figure", "measure-scene");
  const canvas = element("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const caption = element("figcaption");
  const count = element("span");
  const description = element("span");
  caption.append(count, description);

  const controls = element("div", "measure-scene-controls");
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Animación educativa de " + subject);
  const play = button("", togglePlayback);
  const next = button("Siguiente", advance);
  const restart = button("Reiniciar", replay);
  controls.append(play, next, restart);

  const progress = element("div", "measure-scene-progress");
  progress.setAttribute("aria-hidden", "true");
  const fill = element("i");
  progress.append(fill);
  scene.append(canvas, caption, controls, progress);
  card.querySelector("summary").after(scene);

  const draw = makeMeasurementArt(canvas, card.dataset.medida);
  const total = captions.length * STEP_MS;
  let time = 0;
  let timer = 0;
  let last = null;
  let playing = !motion.matches;
  let visible = false;
  let shownStep = -1;

  function render() {
    const step = Math.min(captions.length - 1, Math.floor(time / STEP_MS));
    if (step !== shownStep) {
      count.textContent = (step + 1) + " / " + captions.length;
      description.textContent = captions[step];
      shownStep = step;
    }
    const phase = Math.min(.999, (time - step * STEP_MS) / STEP_MS);
    draw(step, phase);
    fill.style.transform = "scaleX(" + time / total + ")";
  }

  function animate(now) {
    timer = 0;
    if (last !== null) time = Math.min(time + now - last, total);
    last = now;
    render();
    if (time >= total) playing = false;
    sync();
  }

  function sync() {
    const shouldDraw = playing && card.open && visible && !document.hidden;
    const action = playing ? "Pausar" : time >= total ? "Repetir" : "Reproducir";
    if (play.textContent !== action) {
      play.textContent = action;
      play.setAttribute("aria-label", action + " animación de " + subject);
    }
    if (shouldDraw) {
      if (!timer) timer = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(timer);
      timer = 0;
      last = null;
    }
  }

  function togglePlayback() {
    if (time >= total) time = 0;
    playing = !playing;
    render();
    sync();
  }

  function advance() {
    const step = Math.min(shownStep, captions.length - 1);
    time = ((step + 1) % captions.length) * STEP_MS;
    playing = false;
    render();
    sync();
  }

  function replay() {
    time = 0;
    last = null;
    playing = !motion.matches;
    render();
    sync();
  }

  const inView = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  inView.observe(canvas);
  new ResizeObserver(() => render()).observe(canvas);
  document.addEventListener("visibilitychange", sync);
  motion.addEventListener("change", () => {
    if (motion.matches) playing = false;
    sync();
  });
  card.addEventListener("toggle", () => {
    if (card.open) render();
    sync();
  });
  render();
  sync();
}

for (const card of document.querySelectorAll("details[data-medida]")) {
  function mountWhenOpen() {
    if (card.open) {
      card.removeEventListener("toggle", mountWhenOpen);
      mountScene(card);
    }
  }
  card.addEventListener("toggle", mountWhenOpen);
  mountWhenOpen();
}
