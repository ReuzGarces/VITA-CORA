export const MISSION_DATE = "2026-11-14";
export const SLEEP_STORAGE_KEY = "bitacora-orbital-v1";
const MINUTES_PER_DAY = 1440;
const DAY_MS = 86_400_000;
const REFERENCE_NIGHTS = [465, 445, 450, 435, 460, 440, 455];
export const BASELINE = Math.round(REFERENCE_NIGHTS.reduce((sum, value) => sum + value, 0) / REFERENCE_NIGHTS.length);
export const REVIEW_THRESHOLD = 60;

const SLEEP_MINUTES = [450, 435, 462, 451, 442, 458, 445, 435, 470, 460, 443, 450, 375, 360];
const FATIGUE_LEVELS = [2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 3, 4];

export const SCENARIOS = {
  trend: "Dos noches bajo la referencia",
  stable: "Historial estable",
  missing: "Noche sin registro"
};

export function shiftDay(date, offset) {
  return new Date(Date.parse(date) + offset * DAY_MS).toISOString().slice(0, 10);
}

export function missionDay(date) {
  return 43 + Math.round((Date.parse(date) - Date.parse(MISSION_DATE)) / DAY_MS);
}

export function dateLabel(date, style = "short") {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric", month: "short", ...(style === "full" ? { year: "numeric" } : {}), timeZone: "UTC"
  }).format(new Date(date)).replace(/\./g, "");
}

export function duration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? hours + " h" + (rest ? " " + rest + " min" : "") : rest + " min";
}

export function difference(minutes) {
  const offset = minutes - BASELINE;
  if (offset === 0) return "En la referencia";
  return (offset < 0 ? "−" : "+") + duration(Math.abs(offset));
}

export function isEntryDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= shiftDay(MISSION_DATE, -42) &&
    date < "9999-12-31" && Number.isFinite(Date.parse(date)) && shiftDay(date, 0) === date;
}

export function validEntry(record) {
  return record && isEntryDate(record.date) &&
    Number.isInteger(record.minutes) && record.minutes >= 0 && record.minutes <= MINUTES_PER_DAY &&
    Number.isInteger(record.fatigue) && record.fatigue >= 1 && record.fatigue <= 5;
}

export function initialState() {
  const data = Object.fromEntries(Object.keys(SCENARIOS).map(name => {
    const normal = SLEEP_MINUTES.map((minutes, index) => ({
      date: shiftDay(MISSION_DATE, index - (SLEEP_MINUTES.length - 1)),
      minutes,
      fatigue: FATIGUE_LEVELS[index]
    }));
    if (name !== "trend") {
      Object.assign(normal.at(-2), { minutes: 444, fatigue: 2 });
      Object.assign(normal.at(-1), { minutes: 455, fatigue: 2 });
    }
    if (name === "missing") normal.splice(normal.length - 2, 1);
    return [name, { records: normal, reports: [] }];
  }));
  return { active: "trend", data };
}

export function loadSleepState() {
  const defaults = initialState();
  try {
    const saved = JSON.parse(localStorage.getItem(SLEEP_STORAGE_KEY));
    if (!saved || !Object.hasOwn(SCENARIOS, saved.active)) return defaults;
    defaults.active = saved.active;
    for (const scenario of Object.keys(SCENARIOS)) {
      const data = saved.data?.[scenario];
      if (!data) continue;
      if (Array.isArray(data.records)) defaults.data[scenario].records = data.records.filter(validEntry);
      if (Array.isArray(data.reports)) defaults.data[scenario].reports = data.reports.filter(report =>
        report && typeof report.title === "string" && typeof report.note === "string" &&
        typeof report.description === "string" && isEntryDate(report.date) &&
        Array.isArray(report.recent) && report.recent.every(record => record &&
          isEntryDate(record.date) && (record.minutes === null || validEntry(record))));
    }
  } catch {
    return defaults;
  }
  return defaults;
}

export function endDate(records) {
  return records.reduce((latest, record) => record.date > latest ? record.date : latest, MISSION_DATE);
}

export function periodRows(records, count, end = endDate(records)) {
  const byDay = new Map(records.map(record => [record.date, record]));
  return Array.from({ length: count }, (_, index) => {
    const date = shiftDay(end, index - count + 1);
    return byDay.get(date) ?? { date, minutes: null, fatigue: null };
  });
}

export function evaluate(records) {
  const recent = periodRows(records, 2);
  const missing = recent.find(record => record.minutes === null);
  if (missing) return { kind: "missing", recent, missing };
  if (recent.every(record => record.minutes <= BASELINE - REVIEW_THRESHOLD)) return { kind: "trend", recent };
  return { kind: "stable", recent };
}

export function sleepNote(status) {
  const [first, last] = status.recent;
  if (status.kind === "trend") {
    return 'El ' + dateLabel(first.date) + ' dormiste ' + duration(first.minutes) + ' y el ' +
      dateLabel(last.date) + ', ' + duration(last.minutes) + '. Ambas noches quedaron al menos ' +
      duration(REVIEW_THRESHOLD) + ' bajo tu referencia de ' + duration(BASELINE) + '.';
  }
  if (status.kind === "missing") {
    return 'Falta el registro del ' + dateLabel(status.missing.date) + '. Completa esa noche para evaluar la tendencia de los últimos dos días.';
  }
  return 'Las dos noches más recientes no activan el aviso de descenso respecto a tu referencia personal.';
}
