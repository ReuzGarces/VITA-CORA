const $ = id => document.getElementById(id);
const main = $("contenido");
const controls = $("step-controls");
const disconnect = $("disconnect");
const storageKey = "bitacora-orbital-case-v1";
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
const progress = [...document.querySelectorAll(".game-progress li")];
const locationNames = ["Módulo de trabajo", "Módulo de descanso", "Módulo médico"];
const timeOptions = ["Hace un momento", "Hace unos minutos", "No se sabe"];
const readingOptions = ["No medida", "Lectura simulada: 96 %", "No hubo una lectura estable"];

const steps = {
  role: { title: "¿Qué ocurre?", copy: "Elige cómo vas a participar en el ejercicio.", visual: "Elige tu rol", symbol: "○", index: 0, template: "choose-role" },
  response: { title: "¿Te responde cuando le hablas?", copy: "Elige lo que observas para practicar el aviso a bordo.", visual: "Revisa si responde", symbol: "?", index: 0, template: "check-response" },
  call: { title: "Pide ayuda a bordo", copy: "Avisa por el canal de la tripulación. Puedes hacerlo aunque se pierda el enlace con Tierra.", visual: "Canal de tripulación", symbol: "◉", index: 1, template: "call-crew" },
  record: { title: "Anota lo que ocurrió", copy: "Con el aviso hecho, deja los datos básicos para la revisión médica.", visual: "Registra el caso", symbol: "▤", index: 2, template: "collect-data" },
  review: { title: "Revisa el informe", copy: "El informe reúne lo que observaste y lo que hiciste. Puedes guardarlo a bordo.", visual: "Informe listo para revisar", symbol: "▣", index: 3, template: "review-case" },
  done: { title: "Ejercicio terminado", copy: "Ya puedes consultar el informe de esta práctica.", visual: "Práctica completada", symbol: "★", index: 4, template: "mission-complete" }
};
const labels = {
  self: "Me cuesta respirar",
  responds: "Compañero con dificultad para respirar. Responde al hablarle.",
  unresponsive: "El compañero no responde o no se pudo confirmar que responde."
};
const savedStates = {
  onboard: "Guardado a bordo · Listo para simular el envío",
  pending: "Guardado a bordo · Pendiente de envío",
  delivered: "Envío a Tierra simulado"
};
let scenario = newScenario();
let stored = loadReport();
let view = "role";
let paused = motion.matches;

function newScenario() {
  return { role: null, situation: null, location: locationNames[0], onset: timeOptions[0], reading: readingOptions[0] };
}

function loadReport() {
  try {
    const report = JSON.parse(localStorage.getItem(storageKey));
    if (report && Object.hasOwn(labels, report.situation) && Object.hasOwn(savedStates, report.status) &&
        locationNames.includes(report.location) && timeOptions.includes(report.onset) &&
        readingOptions.includes(report.reading)) return report;
  } catch { /* The exercise is still available for this session. */ }
  return null;
}

function saveReport(report) {
  stored = report;
  try {
    localStorage.setItem(storageKey, JSON.stringify(report));
  } catch {
    renderSaved("Solo disponible durante esta sesión");
    return;
  }
  renderSaved();
}

function shownStatus(report) {
  return disconnect.checked && report.status !== "delivered" ? savedStates.pending : savedStates[report.status];
}

function reportFields(report) {
  const alert = report.situation === "unresponsive" ? "Activación de emergencia simulada" : "Aviso a tripulación simulado";
  return [
    ["Situación", labels[report.situation]], ["Módulo", report.location], ["Inicio", report.onset],
    ["Oxímetro", report.reading], ["Acción", alert]
  ];
}

function renderSaved(note) {
  const area = $("saved-case");
  area.hidden = !stored;
  if (!stored) return;
  $("saved-status").textContent = shownStatus(stored) + (note ? " · " + note : "");
  $("deliver-case").hidden = disconnect.checked || stored.status === "delivered";
}

function renderLink() {
  const label = $("link-label");
  label.textContent = disconnect.checked ? "TIERRA · SIN ENLACE" : "TIERRA · CON ENLACE";
  label.classList.toggle("no-link", disconnect.checked);
  renderSaved();
}

function renderMotion() {
  main.classList.toggle("paused", paused);
  $("pause-game").textContent = paused ? "Reproducir animación" : "Pausar animación";
}

function fillReport() {
  const list = controls.querySelector('[data-role="report"]');
  for (const [heading, value] of reportFields(scenario)) {
    const term = document.createElement("dt");
    term.textContent = heading;
    const description = document.createElement("dd");
    description.textContent = value;
    list.append(term, description);
  }
}

function show(destination, focus = true) {
  view = destination;
  const lesson = steps[destination];
  const title = $("step-title");
  const urgent = destination === "call" && scenario.situation === "unresponsive";
  title.textContent = urgent ? "Activa la respuesta de emergencia a bordo" : lesson.title;
  $("step-copy").textContent = lesson.copy;
  $("stage-label").textContent = urgent ? "Emergencia a bordo" : lesson.visual;
  $("stage-indicator").textContent = urgent ? "!" : lesson.symbol;
  main.dataset.scene = destination;
  main.classList.toggle("urgent-stage", urgent);
  for (const [index, point] of progress.entries()) {
    point.classList.toggle("done", index < lesson.index);
    if (index === lesson.index) point.setAttribute("aria-current", "step");
    else point.removeAttribute("aria-current");
  }
  controls.replaceChildren($(lesson.template).content.cloneNode(true));
  $("game-tools").hidden = destination === "done";
  $("game-back").hidden = destination === "role";
  if (destination === "call") {
    controls.querySelector('[data-role="callout"]').textContent = urgent ?
      "«Emergencia médica en [tu módulo]. Un compañero no responde»." :
      "«Necesito ayuda médica en [tu módulo]. Hay dificultad para respirar».";
  } else if (destination === "record") {
    const form = $("case-data");
    for (const name of ["location", "onset", "reading"]) form.elements.namedItem(name).value = scenario[name];
  } else if (destination === "review") {
    fillReport();
  }
  if (focus) title.focus();
}

function restart() {
  scenario = newScenario();
  show("role");
}

const actions = {
  self() { scenario.role = "self"; scenario.situation = "self"; show("call"); },
  crew() { scenario.role = "crew"; scenario.situation = null; show("response"); },
  responds() { scenario.situation = "responds"; show("call"); },
  unresponsive() { scenario.situation = "unresponsive"; show("call"); },
  call() { show("record"); },
  save() {
    saveReport({ ...scenario, status: disconnect.checked ? "pending" : "onboard" });
    show("done");
  },
  restart
};

controls.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (button) actions[button.dataset.action]();
});

function captureForm(form) {
  const values = new FormData(form);
  for (const name of ["location", "onset", "reading"]) scenario[name] = values.get(name);
}

controls.addEventListener("submit", event => {
  event.preventDefault();
  captureForm(event.target);
  show("review");
});

$("game-back").addEventListener("click", () => {
  const back = { response: "role", call: scenario.role === "crew" ? "response" : "role", record: "call", review: "record" };
  if (view === "record") captureForm($("case-data"));
  if (back[view]) show(back[view]);
});
$("game-restart").addEventListener("click", restart);
disconnect.addEventListener("change", renderLink);
$("pause-game").addEventListener("click", () => { paused = !paused; renderMotion(); });
motion.addEventListener("change", event => { paused = event.matches; renderMotion(); });
$("deliver-case").addEventListener("click", () => {
  if (stored && !disconnect.checked) saveReport({ ...stored, status: "delivered" });
});
$("download-case").addEventListener("click", () => {
  if (!stored) return;
  const lines = [
    "VITA-CORA · INFORME DE PRÁCTICA", "Perfil y datos simulados", "",
    ...reportFields(stored).map(([label, value]) => label + ": " + value),
    "", shownStatus(stored)
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.download = "vita-cora-informe-de-practica.txt";
  link.href = url;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
disconnect.checked = stored?.status === "pending";
renderLink();
renderMotion();
if (location.hash === "#companero") {
  scenario.role = "crew";
  show("response", false);
} else {
  show("role", false);
}
