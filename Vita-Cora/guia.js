import { makeOrbitalBreak } from "./guia-pausa.js";
import { makeIllustration } from "./guia-animacion.js";
import { SUPPORT_TOPICS } from "./guia-apoyo.js";

const TOPICS = {
  pulso: {
    name: "Pulso",
    icon: "heart",
    tag: "MUÑECA · VISTA INTERIOR",
    source: ["MedlinePlus · Cómo tomar el pulso", "https://medlineplus.gov/spanish/ency/article/003399.htm"],
    steps: [
      {
        title: "Ubica dos dedos",
        text: "Pon la palma de una mano hacia arriba. Con la otra mano, apoya dos dedos en la parte interna de la muñeca, justo bajo la base del pulgar.",
        tip: "Usa el índice y el del medio.",
        caption: "El círculo marca dónde colocar los dedos."
      },
      {
        title: "Siente los latidos",
        text: "Presiona suavemente hasta sentir pequeños golpes regulares bajo tus dedos.",
        tip: "Si cuesta sentirlos, mueve los dedos un poco sin apretar fuerte.",
        caption: "La señal representa los latidos que se sienten bajo los dedos."
      },
      {
        title: "Cuenta durante un minuto",
        text: "Cuando encuentres el pulso, cuenta cada latido durante un minuto completo. Anota el total como latidos por minuto.",
        tip: "Puedes usar un reloj o el cronómetro del teléfono.",
        caption: "Cuenta durante un minuto completo."
      }
    ],
    practice: {
      label: "Latidos por minuto",
      description: "Elige un número de ejemplo para practicar el registro del pulso.",
      examples: ["68 latidos por minuto", "72 latidos por minuto", "78 latidos por minuto"]
    }
  },
  temperatura: {
    name: "Temperatura",
    icon: "thermometer",
    tag: "TERMÓMETRO DIGITAL · AXILA",
    source: ["MedlinePlus · Medición de la temperatura", "https://medlineplus.gov/spanish/ency/article/003400.htm"],
    steps: [
      {
        title: "Coloca el termómetro",
        text: "Limpia y enciende el termómetro digital. Pon la punta en el centro de la axila, directamente sobre la piel.",
        tip: "Revisa que el equipo sirva para medir en la axila.",
        caption: "El círculo marca dónde va la punta del termómetro."
      },
      {
        title: "Mantén el brazo junto al cuerpo",
        text: "Acerca el brazo al cuerpo y mantén el termómetro en su lugar hasta que el equipo avise que terminó.",
        tip: "Sigue las instrucciones del modelo que estás usando.",
        caption: "Mantén el brazo junto al cuerpo hasta que termine la medición."
      },
      {
        title: "Copia el número de la pantalla",
        text: "Anota la temperatura en grados Celsius (°C) y escribe que la mediste en la axila. Limpia el termómetro después de usarlo.",
        tip: "El lugar donde mediste ayuda a comparar registros.",
        caption: "La pantalla muestra una lectura de ejemplo."
      }
    ],
    practice: {
      label: "Temperatura en la axila",
      description: "Estos valores son de práctica. Elige uno para ver cómo aparece en el registro.",
      examples: ["36,2 °C en la axila", "36,6 °C en la axila", "37,1 °C en la axila"]
    }
  },
  ...SUPPORT_TOPICS
};

const ICONS = {
  food: '<path d="M3 3v6a3 3 0 0 0 6 0V3M6 3v18m13 0V3c-3 0-5 4-5 9h5"/>',
  orbit: '<circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="11" ry="4" transform="rotate(-35 12 12)"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  flag: '<path d="M4 21V3h14l-3 4 3 4H4M8 3v8m4-8v8"/>',
  book: '<path d="M12 6c-2.7-2-5.8-2.5-10-1v14c4.2-1.5 7.3-1 10 1 2.7-2 5.8-2.5 10-1V5c-4.2-1.5-7.3-1-10 1Zm0 0v14"/>',
  list: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 8h10M7 12h10M7 16h10"/>',
  doc: '<path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM14 3v5h4M8 12h6m-6 4h6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  heart: '<path d="M20.8 8.6c0 4.3-8.8 10.4-8.8 10.4S3.2 12.9 3.2 8.6c0-2.2 1.6-4.1 4-4.1 2 0 3.8 1.5 4.8 3 1-1.5 2.8-3 4.8-3 2.4 0 4 1.9 4 4.1Z"/><path d="M7 12h2l1.2-2 1.6 4 1.3-2H17"/>',
  thermometer: '<path d="M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Zm3-5v7"/><circle cx="12" cy="18" r="1"/>',
  alert: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
  bandage: '<rect x="3" y="7" width="18" height="10" rx="4" transform="rotate(-35 12 12)"/><path d="m9 13 6-3m-4 5 4-2"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  play: '<path d="m8 5 12 7-12 7Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  external: '<path d="M7 17 17 7M7 7h10v10"/>'
};

const get = id => document.getElementById(id);
const icon = name => '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">' + ICONS[name] + '</svg>';
const guide = get("contenido");
const breakPanel = get("pausa");
const pauseOrbital = makeOrbitalBreak(breakPanel);
const historicalPractice = {
  animo: ["Estado de ánimo", ["1 · Muy mal", "2 · Mal", "3 · Más o menos", "4 · Bien", "5 · Muy bien"]],
  cansancio: ["Cansancio", ["«Desde hace dos turnos duerme poco y hoy le costó concentrarse»."]],
  angustia: ["Angustia o estrés", ["«Puedo quedarme contigo. ¿Hay algo que necesites ahora?»"]],
  desorientacion: ["Mareo o desorientación", ["Activar la respuesta de emergencia a bordo."]]
};
const practiceTopics = Object.keys(TOPICS).filter(key => TOPICS[key].practice);
const stepPicker = get("step-picker");
const animationToggle = get("animation-toggle");
const previous = get("previous-step");
const next = get("next-step");
const practiceForm = get("practice-form");
const practiceValue = get("practice-value");
const practiceCard = get("practice-card");
const feedback = get("practice-feedback");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const draw = makeIllustration(get("diagram-canvas"));
const memoryKey = "bitacora-orbital-practice-v1";

let topic;
let step = 0;
let playing = !reducedMotion.matches;
let practiceRecords = readRecords();

function readRecords() {
  try {
    const rows = JSON.parse(localStorage.getItem(memoryKey));
    return Array.isArray(rows) ? rows.filter(record => {
      if (!record) return false;
      if (practiceTopics.includes(record.topic)) return TOPICS[record.topic].practice.examples.includes(record.value);
      return Object.hasOwn(historicalPractice, record.topic) && historicalPractice[record.topic][1].includes(record.value);
    }) : [];
  } catch {
    return [];
  }
}

function renderRecords() {
  const count = new Set(practiceRecords.filter(record => practiceTopics.includes(record.topic)).map(record => record.topic)).size;
  get("guide-completion").textContent = count + " de " + practiceTopics.length + " ejemplos de autocuidado guardados";
  get("practice-intro").textContent = practiceRecords.length ?
    "Último ejemplo guardado de cada tema." : "Los ejemplos guardados aparecerán aquí.";
  const entries = practiceRecords.map(record => {
    const item = document.createElement("li");
    const label = document.createElement("strong");
    label.textContent = Object.hasOwn(historicalPractice, record.topic)
      ? historicalPractice[record.topic][0] + " (anterior)" : TOPICS[record.topic].name;
    item.append(label, document.createTextNode(record.value));
    return item;
  });
  get("practice-list").replaceChildren(...entries);
}

function renderMotion() {
  if (!topic || topic === "pausa") return;
  animationToggle.innerHTML = icon(playing ? "pause" : "play") + (playing ? "Pausar animación" : "Reproducir animación");
  draw(topic, step, playing);
}

function renderStep() {
  const lesson = TOPICS[topic];
  const instruction = lesson.steps[step];
  const isLast = step === lesson.steps.length - 1;

  get("diagram-tag").textContent = lesson.tag;
  get("diagram-counter").textContent = String(step + 1).padStart(2, "0") + " / " + String(lesson.steps.length).padStart(2, "0");
  get("diagram-caption").textContent = instruction.caption;
  get("diagram-canvas").setAttribute("aria-label", instruction.caption);
  get("lesson-topic").innerHTML = icon(lesson.icon) + lesson.name;
  get("step-title").textContent = instruction.title;
  get("step-text").textContent = instruction.text;
  get("step-tip").textContent = instruction.tip;
  previous.disabled = step === 0;
  const nextLabel = lesson.practice ? "Practicar" : "Volver al primer paso";
  next.innerHTML = (isLast ? nextLabel : "Siguiente paso") + icon("arrow");

  [...stepPicker.children].forEach((button, index) => {
    button.toggleAttribute("data-done", index <= step);
    if (index === step) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });

  const source = get("topic-source");
  source.href = lesson.source[1];
  source.replaceChildren(lesson.source[0] + " ");
  source.insertAdjacentHTML("beforeend", icon("external"));
  practiceCard.hidden = !isLast || !lesson.practice;
  renderMotion();
}

function selectTopic() {
  const key = location.hash.slice(1);
  if ((key === "contenido" || key === "mediciones-nasa") && topic) {
    pauseOrbital();
    return;
  }

  const showBreak = key === "pausa" || key === "animo";
  const newTopic = showBreak ? "pausa" : Object.hasOwn(TOPICS, key) ? key : "pulso";
  if (newTopic === topic) return;
  if (topic === "pausa") pauseOrbital();
  else if (showBreak && topic) draw(topic, step, false);
  topic = newTopic;
  step = 0;
  guide.dataset.topic = topic;
  feedback.hidden = true;

  get("guide-player").hidden = showBreak;
  breakPanel.hidden = !showBreak;
  const showFirstAid = Object.hasOwn(SUPPORT_TOPICS, topic);
  get("practice-history").hidden = showBreak || showFirstAid;
  get("topic-source").hidden = showBreak;
  get("support-simulator").hidden = topic !== "no-responde";
  for (const link of document.querySelectorAll(".topic[data-topic]")) {
    const current = link.dataset.topic === topic;
    link.classList.toggle("selected", current);
    if (current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }

  if (showBreak) {
    practiceCard.hidden = true;
    breakPanel.scrollIntoView({ block: "nearest" });
    return;
  }

  const { practice } = TOPICS[topic];
  if (practice) {
    get("practice-description").textContent = practice.description;
    get("practice-label").textContent = practice.label;
    const placeholder = new Option("Selecciona un ejemplo", "", true, true);
    placeholder.disabled = true;
    practiceValue.replaceChildren(placeholder, ...practice.examples.map(value => new Option(value, value)));
  }
  renderStep();
  if (showFirstAid) get("guide-player").scrollIntoView({ block: "nearest" });
}

for (const element of document.querySelectorAll("[data-icon]")) element.innerHTML = icon(element.dataset.icon);
for (const element of document.querySelectorAll("[data-nav]")) element.insertAdjacentHTML("afterbegin", icon(element.dataset.nav));

for (let index = 0; index < 3; index += 1) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Paso " + (index + 1);
  button.addEventListener("click", () => {
    step = index;
    renderStep();
  });
  stepPicker.append(button);
}

previous.addEventListener("click", () => {
  if (step > 0) {
    step -= 1;
    renderStep();
    if (previous.disabled) next.focus({ preventScroll: true });
  }
});
next.addEventListener("click", () => {
  if (step < TOPICS[topic].steps.length - 1) {
    step += 1;
    renderStep();
  } else if (TOPICS[topic].practice) {
    practiceCard.scrollIntoView({ block: "nearest" });
    practiceValue.focus({ preventScroll: true });
  } else {
    step = 0;
    renderStep();
  }
});
animationToggle.addEventListener("click", () => {
  playing = !playing;
  renderMotion();
});
reducedMotion.addEventListener("change", event => {
  playing = !event.matches;
  renderMotion();
});
practiceForm.addEventListener("submit", event => {
  event.preventDefault();
  const practice = TOPICS[topic]?.practice;
  if (!practice?.examples.includes(practiceValue.value)) return;
  feedback.hidden = false;
  practiceRecords = [...practiceRecords.filter(record => record.topic !== topic), { topic, value: practiceValue.value }];
  try {
    localStorage.setItem(memoryKey, JSON.stringify(practiceRecords));
    feedback.textContent = "Ejemplo guardado en este navegador.";
  } catch {
    feedback.textContent = "Ejemplo guardado para esta sesión.";
  }
  renderRecords();
});

window.addEventListener("hashchange", selectTopic);
selectTopic();
renderRecords();
