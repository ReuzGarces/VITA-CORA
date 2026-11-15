import {
  BASELINE, MISSION_DATE, REVIEW_THRESHOLD, SCENARIOS, dateLabel, difference, duration, endDate,
  evaluate, isEntryDate, loadSleepState, missionDay, periodRows, shiftDay, sleepNote, SLEEP_STORAGE_KEY, validEntry
} from "./model.js";
import { makeSleepChart } from "./chart.js";

const get = id => document.getElementById(id);
const updateChart = makeSleepChart(get("sleep-chart"), get("point-detail"), get("chart-reading"));
const entryForm = get("entry-form");
const entryDate = get("entry-date");
const scenarioDialog = get("scenarios-dialog");
const summaryDialog = get("summary-dialog");
const summaryForm = get("summary-form");
const historyBody = get("history-body");
const summaryList = get("summary-list");
const periodButtons = [...document.querySelectorAll(".period")];
const scenarioButtons = [...document.querySelectorAll("[data-scenario]")];
const sections = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
const fatigueLabels = ["", "Muy baja", "Baja", "Moderada", "Alta", "Muy alta"];
const trendLabels = {
  trend: ["Revisar tendencia", "#i-alert"],
  stable: ["Sin aviso de tendencia", "#i-check"],
  missing: ["Falta un registro", "#i-calendar"]
};

let state = loadSleepState();
let period = 7;
let reportDraft;

function persist() {
  try {
    localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function current() {
  return state.data[state.active];
}

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function inputMessage(message = "", error = false) {
  const element = get("entry-message");
  element.textContent = message;
  element.hidden = !message;
  element.classList.toggle("error", error);
}

function setEntry(date, record, focus = false) {
  entryDate.value = date;
  get("entry-hours").value = record ? Math.floor(record.minutes / 60) : "";
  get("entry-minutes").value = record ? record.minutes % 60 : "";
  for (const input of entryForm.querySelectorAll('[name="fatigue"]')) {
    input.checked = Number(input.value) === record?.fatigue;
  }
  get("entry-submit").textContent = record ? "Actualizar registro" : "Guardar registro";
  inputMessage();
  if (focus) get("entry-hours").focus();
}

function prepareEntry() {
  const { records } = current();
  const status = evaluate(records);
  setEntry(status.missing?.date ?? shiftDay(endDate(records), 1));
}

function renderStats(records) {
  const latest = records.toSorted((left, right) => right.date.localeCompare(left.date))[0];
  get("baseline").textContent = duration(BASELINE);
  get("mission-day").textContent = "DÍA " + String(missionDay(endDate(records))).padStart(3, "0");
  get("last-sleep").textContent = latest ? duration(latest.minutes) : "—";
  const sleepDetail = get("last-detail");
  sleepDetail.textContent = latest ? dateLabel(latest.date) + " · " + difference(latest.minutes) : "Sin registros";
  sleepDetail.classList.toggle("alert", Boolean(latest && latest.minutes <= BASELINE - REVIEW_THRESHOLD));
  get("last-fatigue").replaceChildren(document.createTextNode(latest ? latest.fatigue + " " : "—"), node("span", latest ? "/ 5" : ""));
  get("fatigue-detail").textContent = latest ? fatigueLabels[latest.fatigue] + " · Autorreporte del " + dateLabel(latest.date) : "Sin autorreporte";
}

function renderTrend(records) {
  const status = evaluate(records);
  const [title, icon] = trendLabels[status.kind];
  get("trend-banner").className = "trend-banner card " + status.kind;
  get("trend-title").textContent = title;
  get("trend-message").textContent = sleepNote(status);
  get("trend-icon").setAttribute("href", icon);
}

function renderChart(records) {
  for (const button of periodButtons) {
    const active = Number(button.dataset.days) === period;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
  const rows = periodRows(records, period);
  get("missing-legend").hidden = !rows.some(row => row.minutes === null);
  updateChart(rows);
}

function renderHistory(records) {
  const rows = periodRows(records, 14).reverse().map(record => {
    const missing = record.minutes === null;
    const row = node("tr");
    const action = node("button", missing ? "Completar" : "Editar", "text-button");
    action.type = "button";
    action.dataset.date = record.date;
    action.setAttribute("aria-label", (missing ? "Completar registro del " : "Editar registro del ") + dateLabel(record.date));
    const cell = node("td");
    cell.append(action);
    row.append(
      node("td", dateLabel(record.date, "full")),
      node("td", missing ? "Sin registro" : duration(record.minutes), missing ? "muted" : ""),
      node("td", missing ? "—" : record.fatigue + " / 5"),
      node("td", missing ? "—" : difference(record.minutes), !missing && record.minutes <= BASELINE - REVIEW_THRESHOLD ? "low" : ""),
      cell
    );
    return row;
  });
  get("history-caption").textContent = "Últimos 14 días de la misión simulada";
  historyBody.replaceChildren(...rows);
}

function downloadReport(report) {
  const content = [
    "VITA-CORA · RESUMEN PARA REVISIÓN",
    "Tripulante A-01 · Perfil y datos simulados",
    "Fecha de misión: " + dateLabel(report.date, "full"),
    "",
    report.title,
    report.description,
    "Referencia personal simulada: " + duration(BASELINE),
    "",
    ...report.recent.map(record => dateLabel(record.date, "full") + " · " +
      (record.minutes === null ? "Sin registro" : duration(record.minutes) + " · Fatiga: " + record.fatigue + "/5")),
    "",
    "Nota: " + (report.note || "Sin observaciones"),
    "",
    "Fuente contextual NASA: https://www.nasa.gov/hrp/risks/",
    "Prototipo de demostración: regla de aviso simulada."
  ].join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = node("a");
  link.href = url;
  link.download = "vita-cora-" + report.date + ".txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderReports(reports) {
  if (reports.length === 0) {
    summaryList.replaceChildren(node("p", "Los resúmenes que guardes aparecerán aquí.", "empty-summary"));
    return;
  }
  summaryList.replaceChildren(...reports.toReversed().map(report => {
    const article = node("article", "", "saved-report");
    const details = node("div", "", "report-details");
    details.append(node("strong", report.title + " · " + dateLabel(report.date)),
      node("p", report.note || report.description));
    const button = node("button", "", "button quiet");
    button.type = "button";
    button.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-download"/></svg>Descargar';
    button.setAttribute("aria-label", "Descargar resumen del " + dateLabel(report.date));
    button.addEventListener("click", () => downloadReport(report));
    article.append(details, button);
    return article;
  }));
}

function render() {
  const { records, reports } = current();
  renderStats(records);
  renderChart(records);
  renderTrend(records);
  renderHistory(records);
  renderReports(reports);
  for (const button of scenarioButtons) {
    const active = button.dataset.scenario === state.active;
    button.setAttribute("aria-pressed", String(active));
    button.querySelector(".scenario-current").textContent = active ? "Activo" : "";
  }
}

function selectNav() {
  const target = location.hash || "#panel";
  for (const link of sections) {
    const active = link.hash === target;
    link.classList.toggle("selected", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}

entryDate.min = shiftDay(MISSION_DATE, -42);
entryDate.max = "9999-12-30";
entryDate.addEventListener("change", () => {
  if (isEntryDate(entryDate.value)) setEntry(entryDate.value, current().records.find(record => record.date === entryDate.value));
});
entryForm.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(entryForm);
  const date = String(data.get("date"));
  const entry = {
    date,
    minutes: Number(data.get("hours")) * 60 + Number(data.get("minutes")),
    fatigue: Number(data.get("fatigue"))
  };
  if (!validEntry(entry)) {
    inputMessage("Revisa la fecha y la duración. El máximo es 24 h en una noche.", true);
    return;
  }
  const records = current().records;
  const index = records.findIndex(record => record.date === date);
  const updating = index >= 0;
  if (updating) records[index] = entry;
  else records.push(entry);
  const saved = persist();
  render();
  setEntry(date, entry);
  inputMessage(saved ? (updating ? "Actualizaste" : "Guardaste") + " el registro del " + dateLabel(date) + "." :
    "El registro queda disponible durante esta sesión. El navegador bloqueó el guardado.", !saved);
});
historyBody.addEventListener("click", event => {
  const date = event.target.closest("button[data-date]")?.dataset.date;
  if (date) setEntry(date, current().records.find(record => record.date === date), true);
});
for (const button of periodButtons) {
  button.addEventListener("click", () => {
    period = Number(button.dataset.days);
    renderChart(current().records);
  });
}

get("open-scenarios").addEventListener("click", () => scenarioDialog.showModal());
for (const button of scenarioButtons) {
  button.addEventListener("click", () => {
    if (state.active !== button.dataset.scenario) {
      state.active = button.dataset.scenario;
      persist();
      render();
      prepareEntry();
    }
    scenarioDialog.close();
  });
}
for (const button of document.querySelectorAll(".about-open")) {
  button.addEventListener("click", () => get("about-dialog").showModal());
}
for (const button of document.querySelectorAll(".close-dialog")) {
  button.addEventListener("click", () => button.closest("dialog").close());
}
get("open-summary").addEventListener("click", () => {
  const status = evaluate(current().records);
  reportDraft = {
    title: trendLabels[status.kind][0],
    description: sleepNote(status),
    date: endDate(current().records),
    recent: status.recent.map(record => ({ ...record }))
  };
  get("draft-context").textContent = reportDraft.description;
  summaryForm.reset();
  summaryDialog.showModal();
  get("summary-note").focus();
});
summaryForm.addEventListener("submit", event => {
  event.preventDefault();
  current().reports.push({ ...reportDraft, note: get("summary-note").value.trim() });
  const saved = persist();
  renderReports(current().reports);
  summaryDialog.close();
  if (!saved) get("resumenes").querySelector(".card-heading p").textContent = "Guardado para esta sesión. El navegador bloqueó el guardado persistente.";
  location.hash = "resumenes";
  get("resumenes").scrollIntoView();
  summaryList.querySelector(".saved-report button")?.focus({ preventScroll: true });
});
window.addEventListener("hashchange", selectNav);
selectNav();
prepareEntry();
render();
