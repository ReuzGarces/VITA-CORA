import { duration, missionDay, dateLabel, loadSleepState, MISSION_DATE } from "./model.js";
import { DAYS, METRICS, estimate, loadNutrition } from "./nutricion-datos.js";
import { GROUPS, SOURCES, SYMPTOMS } from "./sintomas-datos.js";
import { symptomArt } from "./sintomas-arte.js";

const get = id => document.getElementById(id);
const search = get("sym-search");
const filters = get("sym-filters");
const results = get("sym-results");
const detail = get("ficha-sintoma");
const title = get("sym-title");
const helpBox = get("sym-help-box");
const datePicker = get("sym-date");
const number = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1, useGrouping: "always" });

let selectedGroup = "all";
let selected = requestedSymptom();
let displayedId = null;

function requestedSymptom() {
  return SYMPTOMS.find(symptom => location.hash.slice(1) === symptom.id) ?? SYMPTOMS[0];
}

function make(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function normalized(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

const searchable = new Map(SYMPTOMS.map(symptom => [
  symptom.id, normalized([symptom.name, symptom.terms, ...symptom.causes.flat()].join(" "))
]));

function renderDetail() {
  if (selected.id === displayedId) return;
  displayedId = selected.id;
  const { group, name, motif, summary, caption, causes, observe, help, refs } = selected;
  const urgent = group === "urgente";
  detail.classList.toggle("is-urgent", urgent);
  get("sym-group").textContent = GROUPS[group];
  title.textContent = name;
  get("sym-description").textContent = summary;
  get("sym-art").innerHTML = symptomArt(motif, urgent);
  get("sym-figure-caption").textContent = caption;
  get("sym-causes").replaceChildren(...causes.map(([factor, description]) => {
    const li = make("li");
    li.append(make("strong", factor), make("p", description));
    return li;
  }));
  get("sym-observe").textContent = observe;
  get("sym-help-title").textContent = urgent ? "Actúa ahora" : "Cuándo pedir ayuda";
  get("sym-help").textContent = help;
  const body = helpBox.parentElement;
  if (urgent) body.prepend(helpBox);
  else body.insertBefore(helpBox, get("sym-sources").parentElement);
  get("sym-sources").replaceChildren(...refs.map(ref => {
    const [label, href] = SOURCES[ref];
    const link = make("a", label, "text-button");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener";
    const li = make("li");
    li.append(link);
    return li;
  }));
}

function renderCatalog() {
  for (const button of filters.children) button.setAttribute("aria-pressed", button.value === selectedGroup);
  const terms = normalized(search.value).split(/\s+/).filter(Boolean);
  const matches = SYMPTOMS.filter(item =>
    (selectedGroup === "all" || item.group === selectedGroup) && terms.every(term => searchable.get(item.id).includes(term))
  );
  get("sym-result-count").textContent = matches.length + (matches.length === 1 ? " ficha" : " fichas");
  detail.hidden = matches.length === 0;
  get("sym-empty").hidden = matches.length !== 0;
  results.replaceChildren(...matches.map(item => {
    const link = make("a", item.name, "symptom-item");
    link.href = "#" + item.id;
    link.dataset.symptom = item.id;
    if (item.group === "urgente") link.append(make("small", "Aviso inmediato"));
    return link;
  }));
  if (!matches.length) return;
  if (!matches.includes(selected)) selected = matches[0];
  updateSelection();
}

function updateSelection() {
  for (const link of results.children) {
    if (link.dataset.symptom === selected.id) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  renderDetail();
}

function renderContext() {
  const date = datePicker.value;
  const sleepState = loadSleepState();
  const sleep = sleepState.data[sleepState.active].records.find(record => record.date === date);
  const fatigue = ["", "muy baja", "baja", "moderada", "alta", "muy alta"];
  get("sym-sleep-data").textContent = sleep
    ? duration(sleep.minutes) + " de sueño · Fatiga " + fatigue[sleep.fatigue] + " (" + sleep.fatigue + "/5)."
    : "Sin registro de sueño o fatiga para este día.";

  const day = loadNutrition()[date];
  if (!day) {
    get("sym-meal-data").textContent = "Sin registros de alimentación para este día.";
    return;
  }
  const { count, totals } = estimate(day);
  const work = { habitual: "Turno habitual", largo: "Turno largo" }[day.work] ?? "Turno sin registrar";
  const description = count === 0 ? "Sin comidas registradas" :
    count === 3 ? "3 de 3 comidas registradas" : count + " de 3 comidas registradas, aporte parcial";
  const amount = Object.entries(METRICS).map(([key, metric]) =>
    number.format(totals[key]) + " " + metric.unit + " de " + metric.name.replace(/^./, char => char.toLowerCase())
  );
  get("sym-meal-data").textContent = work + " · " + description + "." + (count ? " Aporte estimado: " + amount.join(" · ") + "." : "");
}

for (const [id, label] of Object.entries({ all: "Todos", ...GROUPS })) {
  const button = make("button", label, "symptom-filter");
  button.value = id;
  button.type = "button";
  filters.append(button);
}
filters.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  selectedGroup = button.value;
  renderCatalog();
});
search.addEventListener("input", renderCatalog);
results.addEventListener("click", event => {
  const link = event.target.closest("a");
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  selected = SYMPTOMS.find(item => item.id === link.dataset.symptom);
  if (location.hash !== link.hash) history.pushState(null, "", link.hash);
  updateSelection();
  if (matchMedia("(max-width: 740px)").matches) {
    detail.scrollIntoView({ block: "start" });
    title.focus({ preventScroll: true });
  }
});
window.addEventListener("popstate", () => {
  selected = requestedSymptom();
  selectedGroup = "all";
  search.value = "";
  renderCatalog();
});
for (const date of DAYS) {
  datePicker.add(new Option("Día " + missionDay(date) + " · " + dateLabel(date), date));
}
datePicker.value = MISSION_DATE;
datePicker.addEventListener("change", renderContext);
window.addEventListener("pageshow", renderContext);
renderCatalog();
renderContext();
