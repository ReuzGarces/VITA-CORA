import { MISSION_DATE, shiftDay } from "./model.js";

export const NUTRITION_STORAGE_KEY = "bitacora-orbital-nutricion-v1";
const OMISSION_REASONS = new Set(["tiempo", "apetito", "sabor", "disponibilidad", "otro", "reservado"]);

export const DAYS = Array.from({ length: 7 }, (_, i) => shiftDay(MISSION_DATE, i - 6));
export const MEALS = { desayuno: "Desayuno", almuerzo: "Almuerzo", cena: "Cena" };
export const METRICS = {
  energia: { name: "Energía", unit: "kcal", goal: 2300 },
  magnesio: { name: "Magnesio", unit: "mg", goal: 420 },
  vitaminaD: { name: "Vitamina D", unit: "µg", goal: 25 },
  calcio: { name: "Calcio", unit: "mg", goal: 1000 }
};

export const FOOD_TYPES = {
  termoestabilizado: {
    name: "Termoestabilizados en bolsa",
    description: "Bolsa sellada con tratamiento térmico. Se sirve directamente o se calienta según la ración."
  },
  uht: {
    name: "Raciones con leche UHT",
    description: "Incluye leche ultrapasteurizada (UHT) en envase aséptico, estable a temperatura ambiente mientras esté cerrado."
  }
};

export const SPACE_MENU = {
  "avena-uht": {
    name: "Avena con leche UHT y almendras", type: "uht",
    values: { energia: 620, magnesio: 164, vitaminaD: 6, calcio: 430 }
  },
  "granola-uht": {
    name: "Granola con leche UHT y nueces", type: "uht", quick: true,
    values: { energia: 660, magnesio: 150, vitaminaD: 7, calcio: 410 }
  },
  "porotos-arroz": {
    name: "Porotos rojos con arroz", type: "termoestabilizado", quick: true,
    values: { energia: 780, magnesio: 168, vitaminaD: 1, calcio: 170 }
  },
  "estofado-vacuno": {
    name: "Estofado de vacuno", type: "termoestabilizado",
    values: { energia: 810, magnesio: 123, vitaminaD: 2, calcio: 180 }
  },
  "guiso-atun": {
    name: "Guiso de atún", type: "termoestabilizado",
    values: { energia: 910, magnesio: 145, vitaminaD: 13, calcio: 290 }
  },
  "sopa-arvejas": {
    name: "Sopa de arvejas partidas", type: "termoestabilizado",
    values: { energia: 530, magnesio: 110, vitaminaD: 1, calcio: 130 }
  },
  "budin-chocolate": {
    name: "Budín de chocolate", type: "termoestabilizado",
    values: { energia: 260, magnesio: 42, vitaminaD: 2, calcio: 210 }
  }
};

// Keep previously saved foods readable and keep their original estimated totals.
export const FOODS = {
  ...SPACE_MENU,
  avena: { name: "Avena con leche y almendras", values: { energia: 620, magnesio: 164, vitaminaD: 6, calcio: 430 } },
  cereal: { name: "Cereal fortificado con frutos secos", values: { energia: 660, magnesio: 150, vitaminaD: 7, calcio: 410 } },
  quinoa: { name: "Bandeja de pollo, quinoa y verduras", values: { energia: 850, magnesio: 164, vitaminaD: 4, calcio: 275 } },
  wrap: { name: "Wrap de garbanzos con yogur", values: { energia: 800, magnesio: 162, vitaminaD: 4, calcio: 340 } },
  salmon: { name: "Bandeja de salmón, arroz y verduras", values: { energia: 930, magnesio: 106, vitaminaD: 16, calcio: 355 } },
  lentejas: { name: "Guiso de lentejas con leche fortificada", values: { energia: 880, magnesio: 125, vitaminaD: 14, calcio: 390 } }
};

const makeMeal = (food, portion = 100, reason = "") => ({ status: "eaten", food, portion, reason });

export function initialNutrition() {
  return Object.fromEntries(DAYS.map((day, i) => {
    const long = [1, 3, 6].includes(i);
    const meals = {
      desayuno: makeMeal(i % 2 ? "granola-uht" : "avena-uht"),
      almuerzo: long ? makeMeal("porotos-arroz", 25, "tiempo") : makeMeal(i % 2 ? "estofado-vacuno" : "porotos-arroz"),
      cena: makeMeal(i === 2 ? "estofado-vacuno" : "guiso-atun")
    };
    if (i === 4) delete meals.cena;
    if (i === 5) meals.almuerzo = { status: "skipped", reason: "apetito" };
    return [day, { work: long ? "largo" : "habitual", meals }];
  }));
}

export function loadNutrition() {
  try {
    const saved = JSON.parse(localStorage.getItem(NUTRITION_STORAGE_KEY));
    if (!saved || typeof saved !== "object") return initialNutrition();
    const defaults = initialNutrition();
    for (const date of DAYS) {
      const day = saved[date];
      if (!day || typeof day.meals !== "object" || !day.meals) continue;
      const meals = {};
      for (const key of Object.keys(MEALS)) {
        const meal = day.meals[key];
        if (meal?.status === "skipped" && OMISSION_REASONS.has(meal.reason)) meals[key] = meal;
        if (meal?.status === "eaten" && Object.hasOwn(FOODS, meal.food) && [25, 50, 75, 100].includes(meal.portion)) meals[key] = meal;
      }
      defaults[date] = { work: ["habitual", "largo"].includes(day.work) ? day.work : "", meals };
    }
    return defaults;
  } catch {
    return initialNutrition();
  }
}

export function estimate(day) {
  const meals = Object.values(day.meals);
  const totals = Object.fromEntries(Object.keys(METRICS).map(metric => [metric, 0]));
  for (const meal of meals.filter(meal => meal.status === "eaten")) {
    for (const metric of Object.keys(totals)) {
      totals[metric] += FOODS[meal.food].values[metric] * meal.portion / 100;
    }
  }
  return { count: meals.length, totals };
}

export function findTimePattern(days) {
  return Object.values(days).filter(day => {
    const lunch = day.meals.almuerzo;
    return day.work === "largo" && lunch?.reason === "tiempo" &&
      (lunch.status === "skipped" || lunch.portion < 50);
  });
}

const ODS = "https://ods.od.nih.gov/factsheets/";
const NASA = "https://standards.nasa.gov/system/files/tmp/NASA-STD-3001%20Vol%202%20Rev%20F.pdf#page=117";

export const NUTRIENTS = [
  ["vitamina", "Vitamina A", "700 / 900 µg RAE", "Puede dificultar la visión con poca luz.", ODS + "VitaminA-HealthProfessional/"],
  ["vitamina", "B1 · Tiamina", "1,1 / 1,2 mg", "Puede afectar los nervios. En casos graves puede comprometer el corazón.", ODS + "Thiamin-HealthProfessional/"],
  ["vitamina", "B2 · Riboflavina", "1,1 / 1,3 mg", "Pueden aparecer grietas en las comisuras de la boca.", ODS + "Riboflavin-HealthProfessional/"],
  ["vitamina", "B3 · Niacina", "14 / 16 mg NE", "En casos graves puede causar pelagra, con dermatitis, diarrea y alteraciones neurológicas.", ODS + "Niacin-HealthProfessional/"],
  ["vitamina", "B5 · Ácido pantoténico", "5 mg", "Una deficiencia grave puede causar fatiga, ardor u hormigueo en manos y pies.", ODS + "PantothenicAcid-Consumer/"],
  ["vitamina", "B6", "1,3 mg", "Puede causar anemia, dermatitis o alteraciones de los nervios.", ODS + "VitaminB6-HealthProfessional/"],
  ["vitamina", "B7 · Biotina", "30 µg", "Una deficiencia poco frecuente puede causar caída del pelo y sarpullido.", ODS + "Biotin-HealthProfessional/"],
  ["vitamina", "B9 · Folato", "400 µg DFE", "Puede causar anemia, fatiga y dificultad para concentrarse.", ODS + "Folate-HealthProfessional/"],
  ["vitamina", "B12", "2,4 µg", "Puede causar anemia, hormigueo o problemas de equilibrio. Los síntomas pueden tardar años en aparecer.", ODS + "VitaminB12-Consumer/"],
  ["vitamina", "Vitamina C", "75 / 90 mg", "Puede causar sangrado de encías y cicatrización lenta. Una deficiencia grave y prolongada puede causar escorbuto.", ODS + "VitaminC-Consumer/"],
  ["vitamina", "Vitamina D", "25 µg · NASA", "Puede producir debilidad muscular y afectar la mineralización de los huesos.", ODS + "VitaminD-HealthProfessional/", NASA],
  ["vitamina", "Vitamina E", "15 mg", "Una deficiencia puede afectar los nervios y la coordinación.", ODS + "VitaminE-HealthProfessional/"],
  ["vitamina", "Vitamina K", "90 / 120 µg", "Puede aumentar la tendencia al sangrado por problemas de coagulación.", ODS + "VitaminK-HealthProfessional/"],
  ["mineral", "Calcio", "1.000 mg", "Una ingesta baja sostenida puede contribuir a la fragilidad ósea.", ODS + "Calcium-Consumer/"],
  ["mineral", "Magnesio", "320 / 420 mg", "Puede provocar fatiga y debilidad. Si progresa, pueden aparecer calambres u hormigueo.", ODS + "Magnesium-HealthProfessional/"],
  ["mineral", "Hierro", "18 / 8 mg", "Puede causar anemia, fatiga y menor capacidad para hacer esfuerzo físico.", ODS + "Iron-HealthProfessional/"],
  ["mineral", "Potasio", "2.600 / 3.400 mg", "Un nivel bajo en sangre puede causar debilidad muscular. En casos graves puede alterar el ritmo cardíaco.", ODS + "Potassium-HealthProfessional/"],
  ["mineral", "Sodio y cloruro", "1.500 mg de sodio · 2.300 mg de cloruro", "La alteración del sodio en sangre puede reflejar un problema en el equilibrio de agua y sodio. La bitácora estima el consumo de la dieta.", "https://medlineplus.gov/spanish/pruebas-de-laboratorio/prueba-de-sodio-en-la-sangre/"],
  ["mineral", "Fósforo", "700 mg", "Puede provocar debilidad muscular o dolor óseo.", ODS + "Phosphorus-Consumer/"],
  ["mineral", "Zinc", "8 / 11 mg", "Puede afectar el gusto y el olfato, y retrasar la cicatrización.", ODS + "Zinc-Consumer/"],
  ["mineral", "Yodo", "150 µg", "Una deficiencia sostenida puede afectar la función de la tiroides y causar su agrandamiento, conocido como bocio.", ODS + "Iodine-HealthProfessional/"],
  ["mineral", "Cobre", "900 µg", "Puede causar anemia y, en algunos casos, problemas de coordinación.", ODS + "Copper-HealthProfessional/"],
  ["mineral", "Selenio", "55 µg", "Una deficiencia grave se ha asociado con una enfermedad del músculo cardíaco en ciertas poblaciones.", ODS + "Selenium-HealthProfessional/"]
];
