import { dateLabel, duration, loadSleepState, missionDay, MISSION_DATE } from "./model.js";
import { DAYS, MEALS, METRICS, FOOD_TYPES, FOODS, SPACE_MENU, NUTRIENTS, loadNutrition, NUTRITION_STORAGE_KEY, estimate, findTimePattern } from "./nutricion-datos.js";
import { startGalley } from "./nutricion-arte.js";

const get = id => document.getElementById(id);
const foodSelect = get("meal-food");
const formatNumber = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1, useGrouping: "always" });
const format = (value, metric) => formatNumber.format(value) + " " + metric.unit;
const fatigueLabels = ["", "muy baja", "baja", "moderada", "alta", "muy alta"];
const sleepState = loadSleepState();
const sleepRecords = new Map(sleepState.data[sleepState.active].records.map(record => [record.date, record]));

let days = loadNutrition();
let selectedDay = MISSION_DATE;
let selectedMeal = "almuerzo";
let selectedMetric = "energia";
let selectedFilter = "all";

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function selectionButton(container, value, label, description, onSelect) {
  const button = node("button", null, "nutrition-select");
  button.type = "button";
  button.value = value;
  button.append(node("strong", label));
  if (description) button.append(node("small", description));
  button.addEventListener("click", () => onSelect(value));
  container.append(button);
}

function renderSelections() {
  const day = days[selectedDay];
  for (const button of get("nutrition-days").children) {
    const count = estimate(days[button.value]).count;
    button.setAttribute("aria-pressed", button.value === selectedDay);
    button.lastElementChild.textContent = count + "/3 comidas";
    button.setAttribute("aria-label", "Día " + missionDay(button.value) + ", " + dateLabel(button.value) + ", " + count + " de 3 comidas registradas");
  }
  for (const button of get("meal-slots").children) {
    const meal = day.meals[button.value];
    button.setAttribute("aria-pressed", button.value === selectedMeal);
    button.lastElementChild.textContent = meal?.status === "eaten" ? meal.portion + " %" : meal?.status === "skipped" ? "Omitida" : "Pendiente";
  }
}

function renderForm() {
  const day = days[selectedDay];
  const meal = day.meals[selectedMeal];
  get("meal-date").textContent = "Día " + missionDay(selectedDay) + " · " + dateLabel(selectedDay, "full");
  get("meal-count").textContent = estimate(day).count + " de 3 comidas";
  get("meal-status").value = meal?.status ?? "pending";
  foodSelect.querySelector("[data-previous-food]")?.remove();
  if (meal?.food && !Object.hasOwn(SPACE_MENU, meal.food)) {
    const previous = new Option(FOODS[meal.food].name + " (menú anterior)", meal.food);
    previous.dataset.previousFood = "";
    foodSelect.add(previous);
  }
  foodSelect.value = meal?.food ?? "";
  get("meal-portion").value = meal?.portion ?? "100";
  get("meal-reason").value = meal?.reason ?? "";
  get("meal-work").value = day.work;
  const sleep = sleepRecords.get(selectedDay);
  const context = get("meal-context");
  context.replaceChildren(node("strong", "Sueño y fatiga del panel"));
  context.append(node("p", sleep ? "Sueño: " + duration(sleep.minutes) + " · Fatiga " + fatigueLabels[sleep.fatigue] + " (" + sleep.fatigue + "/5)" : "Sin registro de sueño y fatiga para este día."));
  get("meal-feedback").textContent = "";
  updateMealFields();
}

function updateMealFields() {
  const status = get("meal-status").value;
  const eaten = status === "eaten";
  const needsReason = status === "skipped" || (eaten && Number(get("meal-portion").value) < 100);
  get("food-fields").hidden = !eaten;
  foodSelect.disabled = !eaten;
  get("meal-portion").disabled = !eaten;
  get("reason-field").hidden = !needsReason;
  get("meal-reason").disabled = !needsReason;
  get("reason-field").firstElementChild.textContent = status === "skipped" ? "¿Por qué omitiste la comida?" : "¿Por qué comiste menos?";
  renderPreparation();
}

function renderPreparation() {
  const food = FOODS[foodSelect.value];
  get("meal-preparation").textContent = food
    ? FOOD_TYPES[food.type]?.description ?? "Alimento del menú anterior."
    : "Elige una ración para ver cómo se conserva y prepara.";
}

function renderPattern() {
  const matches = findTimePattern(days);
  const show = matches.length >= 3;
  const showIntake = matches.filter(day => {
    const { count, totals } = estimate(day);
    return count === 3 && totals.energia < METRICS.energia.goal && totals.magnesio < METRICS.magnesio.goal;
  }).length;
  get("pattern-title").textContent = show ? "Se repitió la falta de tiempo" : "Patrón de almuerzos";
  const skipped = matches.some(day => day.meals.almuerzo.status === "skipped");
  let description = "La demo muestra un aviso si coinciden tres turnos largos con almuerzos de menos de media porción u omitidos por falta de tiempo.";
  if (show) {
    const behavior = skipped ? "omitiste el almuerzo o comiste menos de la mitad" : "comiste menos de la mitad del almuerzo";
    description = "En " + matches.length + " turnos largos " + behavior + " y marcaste «falta de tiempo».";
    if (showIntake > 0) description += " En " + (showIntake === 1 ? "1 día con registro completo" : showIntake + " días con registro completo") + " el aporte estimado de energía y magnesio quedó bajo la meta simulada.";
  } else if (matches.length > 0) {
    description += " Coincidencias en esta semana: " + matches.length + " de 3.";
  }
  get("pattern-text").textContent = description;
  get("pattern-action").hidden = !show;
  get("pattern-link").hidden = !show;
  get("pattern-title").closest("section").classList.toggle("found", show);
}

function renderIntake() {
  const metric = METRICS[selectedMetric];
  const { count, totals: selectedTotals } = estimate(days[selectedDay]);
  get("intake-caption").textContent = count === 3 ? "Día " + missionDay(selectedDay) + " · Registro completo" :
    count > 0 ? "Día " + missionDay(selectedDay) + " · Suma parcial de las comidas registradas" : "Día " + missionDay(selectedDay) + " · Sin registro de comidas";
  get("intake-goal").textContent = "Meta: " + format(metric.goal, metric);
  for (const button of get("intake-metrics").children) {
    const item = METRICS[button.value];
    const value = selectedTotals[button.value];
    button.lastElementChild.textContent = count ? format(value, item) : "—";
    button.setAttribute("aria-pressed", button.value === selectedMetric);
  }

  const estimates = DAYS.map(date => ({ date, ...estimate(days[date]) }));
  const maximum = Math.max(metric.goal * 1.12, ...estimates.map(day => day.totals[selectedMetric]));
  const bars = get("intake-bars");
  bars.style.setProperty("--goal-height", metric.goal / maximum);
  bars.replaceChildren(...estimates.map(({ date, count: entries, totals }) => {
    const value = totals[selectedMetric];
    const column = node("div", null, "intake-column");
    column.setAttribute("role", "listitem");
    column.setAttribute("aria-label", "Día " + missionDay(date) + ": " + (entries ? format(value, metric) + (entries === 3 ? ", completo" : ", parcial") : "sin registros"));
    column.title = column.getAttribute("aria-label");
    column.classList.toggle("current", date === selectedDay);
    const track = node("div", null, "intake-track");
    const bar = node("div", entries ? "" : "—", "intake-bar");
    bar.classList.toggle("partial", entries > 0 && entries < 3);
    bar.classList.toggle("empty", entries === 0);
    bar.style.setProperty("--bar-height", (100 * value / maximum) + "%");
    track.append(bar);
    column.append(track, node("span", String(missionDay(date)), "intake-day"));
    return column;
  }));
}

function normalized(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

function sourceLink(label, url) {
  const link = node("a", label, "text-button");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener";
  return link;
}

function renderNutrients() {
  const query = normalized(get("nutrient-search").value);
  const entries = NUTRIENTS.filter(([type, name]) =>
    (selectedFilter === "all" || type === selectedFilter) && normalized(type + " " + name).includes(query)
  );
  get("nutrient-count").textContent = entries.length
    ? entries.length + (entries.length === 1 ? " ficha" : " fichas")
    : "Sin resultados. Prueba otro nombre o cambia el filtro.";
  get("nutrient-grid").replaceChildren(...entries.map(([type, name, value, effect, source, standard]) => {
    const details = node("details", null, "nutrient-item");
    const summary = node("summary");
    summary.append(node("small", type === "vitamina" ? "Vitamina" : "Mineral"), node("strong", name), node("span", value, "nutrient-value"));
    const copy = node("div", null, "nutrient-copy");
    copy.append(node("strong", "Qué puede ocurrir si hay deficiencia"), node("p", effect), sourceLink("Fuente sobre este nutriente", source));
    if (standard) copy.append(sourceLink("Referencia de NASA para vuelo espacial", standard));
    details.append(summary, copy);
    return details;
  }));
}

function renderDay() {
  renderSelections();
  renderForm();
  renderIntake();
}

get("week-range").textContent = dateLabel(DAYS[0]) + " – " + dateLabel(DAYS.at(-1));
for (const date of DAYS) {
  selectionButton(get("nutrition-days"), date, "Día " + missionDay(date), "0/3 comidas", value => {
    selectedDay = value;
    renderDay();
  });
}
for (const [key, label] of Object.entries(MEALS)) {
  selectionButton(get("meal-slots"), key, label, "Pendiente", value => {
    selectedMeal = value;
    renderSelections();
    renderForm();
  });
}
for (const [key, metric] of Object.entries(METRICS)) {
  selectionButton(get("intake-metrics"), key, metric.name, "—", value => {
    selectedMetric = value;
    renderIntake();
  });
}
foodSelect.add(new Option("Elige una ración", ""));
for (const [type, category] of Object.entries(FOOD_TYPES)) {
  const group = node("optgroup");
  group.label = category.name;
  for (const [key, food] of Object.entries(SPACE_MENU)) {
    if (food.type === type) group.append(new Option(food.name, key));
  }
  foodSelect.append(group);
}
foodSelect.addEventListener("change", renderPreparation);

for (const food of Object.values(SPACE_MENU).filter(food => food.quick)) {
  const item = node("li");
  item.append(
    node("strong", food.name),
    node("p", FOOD_TYPES[food.type].description),
    node("p", Object.entries(METRICS).map(([metric, units]) =>
      format(food.values[metric], units) + " de " + units.name.slice(0, 1).toLowerCase() + units.name.slice(1)
    ).join(" · ") + " por porción simulada.")
  );
  get("quick-foods").append(item);
}
for (const id of ["meal-status", "meal-portion"]) get(id).addEventListener("change", updateMealFields);

get("meal-form").addEventListener("submit", event => {
  event.preventDefault();
  const day = days[selectedDay];
  const status = get("meal-status").value;
  const reason = get("meal-reason").disabled ? "" : get("meal-reason").value;
  day.work = get("meal-work").value;
  if (status === "pending") delete day.meals[selectedMeal];
  if (status === "skipped") day.meals[selectedMeal] = { status, reason };
  if (status === "eaten") day.meals[selectedMeal] = { status, reason, food: get("meal-food").value, portion: Number(get("meal-portion").value) };
  let message = "Registro guardado en este navegador.";
  try {
    localStorage.setItem(NUTRITION_STORAGE_KEY, JSON.stringify(days));
  } catch {
    message = "Registro actualizado durante esta sesión. El navegador no permitió guardarlo.";
  }
  renderDay();
  renderPattern();
  get("meal-feedback").textContent = message;
});

for (const button of document.querySelectorAll("[data-filter]")) {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    for (const filter of document.querySelectorAll("[data-filter]")) {
      filter.setAttribute("aria-pressed", filter === button);
    }
    renderNutrients();
  });
}
get("nutrient-search").addEventListener("input", renderNutrients);

renderDay();
renderPattern();
renderNutrients();
startGalley(get("galley-art"), get("galley-toggle"));
