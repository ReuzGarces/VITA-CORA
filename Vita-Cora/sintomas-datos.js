export const GROUPS = {
  sueno: "Sueño y fatiga",
  digestion: "Alimentación e hidratación",
  musculos: "Músculos y nervios",
  senales: "Visión, boca y piel",
  urgente: "Aviso inmediato"
};

const MEDLINE = "https://medlineplus.gov/spanish/";
const NIH = "https://ods.od.nih.gov/factsheets/";

export const SOURCES = {
  nasaSleep: ["NASA · Sueño y turnos irregulares", "https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/"],
  nasaSpace: ["NASA · Riesgos para la salud en vuelo", "https://www.nasa.gov/humans-in-space/hhc-spaceflight-risks/"],
  nasaFood: ["NASA · Riesgos de nutrición en vuelo", "https://www.nasa.gov/hrp/risks/"],
  nasaAir: ["NASA · Dióxido de carbono a bordo", "https://www.nasa.gov/ochmo-tb-004-carbon-dioxide-2/"],
  sleep: ["MedlinePlus · Dormir bien", MEDLINE + "healthysleep.html"],
  insomnia: ["MedlinePlus · Insomnio", MEDLINE + "ency/article/000805.htm"],
  fatigue: ["MedlinePlus · Fatiga", MEDLINE + "ency/article/003088.htm"],
  headache: ["MedlinePlus · Dolor de cabeza", MEDLINE + "headache.html"],
  dizziness: ["MedlinePlus · Mareo", MEDLINE + "ency/article/003093.htm"],
  nausea: ["MedlinePlus · Náuseas y vómitos", MEDLINE + "nauseaandvomiting.html"],
  appetite: ["MedlinePlus · Apetito disminuido", MEDLINE + "ency/article/003121.htm"],
  constipation: ["MedlinePlus · Estreñimiento", MEDLINE + "constipation.html"],
  diarrhea: ["MedlinePlus · Diarrea", MEDLINE + "diarrhea.html"],
  dehydration: ["MedlinePlus · Deshidratación", MEDLINE + "dehydration.html"],
  cramps: ["MedlinePlus · Calambres", MEDLINE + "musclecramps.html"],
  weakness: ["MedlinePlus · Debilidad", MEDLINE + "ency/article/003174.htm"],
  tingling: ["MedlinePlus · Entumecimiento y hormigueo", MEDLINE + "ency/article/003206.htm"],
  anemia: ["MedlinePlus · Anemia", MEDLINE + "ency/article/000560.htm"],
  pallor: ["MedlinePlus · Palidez", MEDLINE + "ency/article/003244.htm"],
  gums: ["MedlinePlus · Encías sangrantes", MEDLINE + "ency/article/003062.htm"],
  bleeding: ["MedlinePlus · Sangrado", MEDLINE + "ency/article/000045.htm"],
  sight: ["MedlinePlus · Problemas de la visión", MEDLINE + "ency/article/003029.htm"],
  breathing: ["MedlinePlus · Dificultad respiratoria", MEDLINE + "ency/article/003075.htm"],
  chest: ["MedlinePlus · Dolor torácico", MEDLINE + "ency/article/003079.htm"],
  faint: ["MedlinePlus · Desmayo", MEDLINE + "ency/article/003092.htm"],
  confusion: ["MedlinePlus · Confusión", MEDLINE + "ency/article/003205.htm"],
  stroke: ["MedlinePlus · Accidente cerebrovascular", MEDLINE + "stroke.html"],
  emergency: ["MedlinePlus · Señales de emergencia", MEDLINE + "ency/article/001927.htm"],
  a: ["NIH · Vitamina A", NIH + "VitaminA-Consumer/"],
  b12: ["NIH · Vitamina B12", NIH + "VitaminB12-Consumer/"],
  c: ["NIH · Vitamina C", NIH + "VitaminC-Consumer/"],
  d: ["MedlinePlus · Deficiencia de vitamina D", MEDLINE + "vitaminddeficiency.html"],
  k: ["NIH · Vitamina K", NIH + "VitaminK-HealthProfessional/"]
};

function ficha(id, group, name, terms, motif, summary, caption, causes, observe, help, refs) {
  return { id, group, name, terms, motif, summary, caption, causes, observe, help, refs };
}

export const SYMPTOMS = [
  ficha("fatiga", "sueno", "Fatiga o cansancio", "agotamiento poca energía anemia", "battery",
    "Te sientes sin energía física o mental para hacer lo habitual.",
    "Compara el descanso y las comidas de los días en que tienes menos energía.",
    [
      ["Sueño y turnos", "Pocas horas de sueño, horarios que cambian o una carga de trabajo alta."],
      ["Alimentación", "Comer menos de lo habitual durante varios días puede coincidir con el cansancio."],
      ["Otras causas que evalúa salud", "Estrés, infecciones, medicamentos o anemia. El hierro, el folato (B9) y la vitamina B12 se revisan si el equipo sospecha anemia."]
    ],
    "Anota desde cuándo empezó y si cambia tras descansar. Revisa el sueño de las últimas noches, los turnos y las comidas omitidas.",
    "Avisa si persiste pese al descanso o afecta una tarea de seguridad. Si aparece junto con dolor de pecho, desmayo o falta de aire repentina, activa el protocolo a bordo.",
    ["nasaSleep", "nasaFood", "fatigue", "anemia"]),
  ficha("somnolencia", "sueno", "Sueño durante una tarea", "somnolencia diurna cabecear quedarse dormido", "sleep",
    "Te cuesta mantener los ojos abiertos o cabeceas aunque intentes seguir despierto.",
    "Quedarse dormido durante una tarea puede indicar que el descanso fue insuficiente o poco reparador.",
    [
      ["Descanso", "Pocas horas de sueño, despertares o cambios en el horario habitual."],
      ["Otros factores", "Algunos medicamentos o un trastorno del sueño pueden causar somnolencia."]
    ],
    "Anota horas y despertares de la noche anterior. Registra la tarea y el momento del turno en que te pasó.",
    "Pide relevo si afecta una tarea de seguridad y avisa al responsable. Si cuesta despertar a la persona, activa el protocolo a bordo.",
    ["sleep", "nasaSleep", "emergency"]),
  ficha("insomnio", "sueno", "Dificultad para dormir", "insomnio despertares despertar temprano", "moon",
    "Te cuesta quedarte dormido, despiertas varias veces o despiertas antes de lo previsto.",
    "Revisa el horario de descanso y qué pasó antes de acostarte.",
    [
      ["Horario y entorno", "Cambios de turno, luz o ruido durante el período de descanso."],
      ["Otros factores", "Estrés, cafeína cerca del descanso, dolor o algunos medicamentos."]
    ],
    "Anota hora de acostarte y despertar, cantidad de despertares y cambios en el horario, el ruido o la luz.",
    "Avisa al equipo de salud si se repite o afecta tu funcionamiento durante el turno.",
    ["nasaSleep", "insomnia"]),
  ficha("concentracion", "sueno", "Dificultad para concentrarse", "atención memoria olvidos niebla mental errores", "focus",
    "Te distraes con facilidad, te cuesta seguir instrucciones o cometes errores inusuales.",
    "Relaciona los errores observados con el descanso, las interrupciones y la carga de trabajo.",
    [
      ["Sueño y carga de trabajo", "La falta de sueño o los turnos irregulares pueden afectar la atención y el rendimiento."],
      ["Otros factores", "Estrés, dolor o algunos medicamentos también pueden influir."]
    ],
    "Registra qué tarea se hizo difícil y cuándo. Revisa el sueño y el turno previo.",
    "Avisa si afecta tareas de seguridad. Si aparece desorientación repentina o dificultad nueva para hablar, activa el protocolo a bordo.",
    ["nasaSleep", "sleep", "stroke", "confusion"]),
  ficha("irritabilidad", "sueno", "Irritabilidad o cambio de ánimo", "enfado estrés estado ánimo sensible ánimo bajo", "mood",
    "Te notas más irritable, sensible o desanimado de lo habitual.",
    "Observa si el cambio coincide con noches cortas, turnos exigentes o situaciones de estrés.",
    [
      ["Descanso", "Dormir poco o mal puede afectar el ánimo."],
      ["Contexto", "El estrés y las exigencias de la misión también pueden influir."]
    ],
    "Registra cuándo empezó, cómo dormiste y si el cambio afecta tu relación con la tripulación o tus tareas.",
    "Coméntalo con el responsable de salud si persiste, aumenta o afecta la convivencia o el trabajo.",
    ["sleep", "nasaSpace"]),
  ficha("cefalea", "sueno", "Dolor de cabeza", "cefalea migraña jaqueca co2 dióxido de carbono", "head",
    "Sientes dolor o presión en la cabeza. Puede venir acompañado de náuseas o sensibilidad a la luz.",
    "Registra dónde estabas y si alguien más en ese módulo tuvo síntomas parecidos.",
    [
      ["Hábitos y carga", "Revisa si coincide con poco sueño, poca agua o comidas omitidas."],
      ["Causas médicas posibles", "Cefalea tensional, migraña u otras causas que el equipo de salud puede evaluar."],
      ["Entorno de la misión", "NASA ha estudiado la relación entre el CO₂ a bordo y los dolores de cabeza. Avisa si varias personas tienen síntomas en el mismo módulo."]
    ],
    "Anota cuándo y dónde empezó, qué tan intenso fue y si lo acompañaron náuseas, fiebre o cambios visuales.",
    "Activa el protocolo a bordo ante un dolor de cabeza intenso que empieza de golpe o si aparece con pérdida súbita de fuerza, visión o habla.",
    ["headache", "nasaAir", "stroke"]),
  ficha("mareo", "musculos", "Mareo o pérdida de equilibrio", "vértigo inestabilidad gira cabeza flotar", "balance",
    "Sientes que todo gira, pierdes estabilidad o tienes la sensación de que podrías desmayarte.",
    "Distingue si sentiste que todo giraba o si creíste que ibas a desmayarte.",
    [
      ["Adaptación al movimiento", "Los cambios de gravedad pueden afectar el equilibrio y la coordinación."],
      ["Otras causas posibles", "Deshidratación, una baja de presión al cambiar de posición o problemas del oído interno."]
    ],
    "Anota el movimiento o cambio de posición previo, cuánto duró y si hubo vómitos, debilidad o alteraciones de la visión.",
    "Detén la tarea si compromete tu seguridad. Pide ayuda inmediata ante desmayo, dificultad para hablar o debilidad nueva de un lado.",
    ["nasaSpace", "dizziness", "stroke"]),
  ficha("nauseas", "digestion", "Náuseas o vómitos", "náusea vomito arcadas cinetosis mareo espacial", "stomach",
    "Sientes ganas de vomitar o devuelves lo que comiste o bebiste.",
    "Anota si empezó después de moverte, de comer una ración o de tomar un medicamento.",
    [
      ["Adaptación al vuelo", "El mareo por movimiento puede aparecer con un cambio de gravedad."],
      ["Otras causas posibles", "Una infección digestiva, un alimento o un medicamento. Perder líquidos con vómitos puede causar deshidratación."]
    ],
    "Registra cuántas veces ocurrió, si toleras líquidos y si otros tripulantes que comieron lo mismo presentan síntomas.",
    "Avisa pronto si no puedes retener líquidos o empeoras. Activa el protocolo a bordo si vomitas sangre, te desmayas o presentas confusión repentina.",
    ["nasaSpace", "nausea", "dehydration", "emergency"]),
  ficha("apetito", "digestion", "Poco apetito", "sin hambre rechazo alimentos saciedad", "meal",
    "Tienes menos ganas de comer o dejas más comida que de costumbre.",
    "Compara el tamaño de las porciones y el motivo por el que quedaron sin comer.",
    [
      ["Raciones y horarios", "El sabor, la variedad y el tiempo disponible para comer pueden influir en cuánto consumes."],
      ["Otros factores", "Náuseas, estrés, enfermedades o algunos medicamentos pueden reducir el apetito."]
    ],
    "Distingue entre falta de apetito y falta de tiempo. Revisa porciones, comidas omitidas y otros síntomas de esos días.",
    "Avisa si comes muy poco durante varios días, pierdes peso sin proponértelo o también te cuesta beber.",
    ["nasaFood", "appetite"]),
  ficha("estrenimiento", "digestion", "Estreñimiento", "deposiciones heces duras constipación dificultad evacuar", "stomach",
    "Evacúas con menos frecuencia de lo habitual o las deposiciones son duras y difíciles de eliminar.",
    "Revisa cambios en el horario de comidas y en tu consumo habitual de agua y fibra.",
    [
      ["Rutina y alimentación", "Poca fibra o líquidos, cambios de rutina o menor actividad."],
      ["Otras causas posibles", "Algunos medicamentos y trastornos digestivos pueden contribuir."]
    ],
    "Anota fecha de la última deposición, cambios de rutina, molestias y medicamentos nuevos.",
    "Informa si persiste. Pide atención urgente si aparece dolor abdominal intenso, vómitos o sangre en las deposiciones.",
    ["constipation", "emergency"]),
  ficha("diarrea", "digestion", "Diarrea", "deposiciones líquidas infección digestiva intoxicación", "stomach",
    "Haces deposiciones líquidas o acuosas con más frecuencia de lo habitual.",
    "Registra el número de episodios y si alguien más tuvo síntomas tras la misma comida.",
    [
      ["Causas frecuentes", "Infecciones digestivas, alimentos o medicamentos."],
      ["Líquidos", "La pérdida de agua y sales puede causar sed, mareo o menos orina."]
    ],
    "Anota cuándo empezó, cuántas veces ocurrió, si hubo fiebre, sangre y qué alimentos compartiste.",
    "Avisa pronto si hay sangre, fiebre o poca orina. Activa el protocolo a bordo si hay desmayo, confusión o deterioro marcado.",
    ["diarrhea", "dehydration", "emergency"]),
  ficha("sed", "digestion", "Sed intensa u orina oscura", "deshidratación boca seca poca orina agua hidratación", "drop",
    "Sientes más sed, tienes la boca seca u orinas menos y con un color más oscuro.",
    "Compara cuánto bebiste con los líquidos que pudiste haber perdido.",
    [
      ["Pérdida de líquidos", "Beber menos de lo habitual o perder líquidos por ejercicio, vómitos o diarrea puede contribuir a la deshidratación."],
      ["Otras causas", "El color de la orina también puede cambiar por medicamentos y otros problemas de salud."]
    ],
    "Anota cuánta agua bebiste, cuántas veces orinaste y si hubo vómitos o diarrea.",
    "Avisa pronto si haces muy poca orina o no puedes beber. Pide ayuda inmediata ante desmayo o confusión.",
    ["dehydration", "emergency"]),
  ficha("calambres", "musculos", "Calambres musculares", "espasmos contracción tirón magnesio potasio calcio electrolitos", "leg",
    "Un músculo se contrae sin querer y duele por unos segundos o minutos.",
    "Ubica el músculo y anota si el calambre apareció después de ejercicio o de un turno exigente.",
    [
      ["Esfuerzo y líquidos", "Sobrecarga muscular o deshidratación, especialmente después de actividad física."],
      ["Minerales", "Una alteración de electrolitos como calcio, magnesio o potasio puede influir. El equipo de salud decide si necesita medirlos."]
    ],
    "Anota el músculo, duración, ejercicio previo y si coincide con vómitos o diarrea.",
    "Coméntalo con el equipo de salud si se repite, es intenso o se acompaña de debilidad.",
    ["cramps", "dehydration"]),
  ficha("debilidad", "musculos", "Debilidad muscular general", "pérdida fuerza flojedad vitamina d", "arm",
    "Notas menos fuerza que antes, por ejemplo, al sostener objetos o hacer tu ejercicio habitual.",
    "Distingue entre sentir cansancio y perder fuerza al hacer la misma tarea.",
    [
      ["Adaptación y recuperación", "Cambios en el entrenamiento y desacondicionamiento muscular durante la misión."],
      ["Causas que evalúa salud", "Alteraciones de electrolitos, medicamentos, enfermedades o una deficiencia de vitamina D son algunas posibilidades."]
    ],
    "Anota qué tarea cambió y si la debilidad aparece en todo el cuerpo o sólo en una zona.",
    "Avisa si es nueva, progresa o afecta tareas. Si empieza de golpe en una mitad del cuerpo, activa el protocolo a bordo.",
    ["nasaSpace", "weakness", "d", "stroke"]),
  ficha("hormigueo", "musculos", "Hormigueo o adormecimiento", "dormido entumecimiento aguja mano pie vitamina b12", "hand",
    "Sientes pinchazos, adormecimiento o menos sensibilidad en una parte del cuerpo.",
    "Identifica la zona y si la sensación empezó después de apoyar o comprimir una extremidad.",
    [
      ["Presión sobre un nervio", "Una postura o equipo que oprime la zona puede provocar hormigueo temporal."],
      ["Causas que evalúa salud", "Si persiste, pueden revisarse problemas de los nervios, alteraciones metabólicas o una deficiencia de vitamina B12."]
    ],
    "Anota dónde se siente, si es en uno o ambos lados, y si cambia al mover la extremidad.",
    "Avisa si no cede o vuelve a aparecer. Si empieza de golpe en una mitad del cuerpo o junto con dificultad para hablar, activa el protocolo a bordo.",
    ["tingling", "b12", "stroke"]),
  ficha("dolor-oseo", "musculos", "Dolor óseo o muscular", "dolor hueso articulaciones agujetas vitamina d calcio", "leg",
    "Tienes dolor en un músculo, un hueso o una zona que usaste durante el trabajo o el ejercicio.",
    "Ubica el dolor y anota si hubo un golpe o cambio en la rutina de ejercicio.",
    [
      ["Esfuerzo o lesión", "Sobrecarga, cambio de entrenamiento o un golpe reciente."],
      ["Salud ósea", "La pérdida de masa ósea es un riesgo en misiones espaciales. Una deficiencia sostenida de vitamina D también puede relacionarse con dolor óseo o muscular."]
    ],
    "Marca dónde duele y si aparece con el movimiento, con la presión o en reposo.",
    "Avisa si hay dolor intenso, lesión o dificultad para mover la zona, o si el dolor persiste.",
    ["nasaSpace", "d"]),
  ficha("encias", "senales", "Sangrado de encías", "sangre cepillado escorbuto vitamina c", "mouth",
    "Ves sangre en las encías al cepillarte o fuera del cepillado.",
    "Anota si el sangrado se limita a una zona de la boca y cuándo aparece.",
    [
      ["Boca y dientes", "Inflamación de las encías, placa dental o irritación durante el cepillado."],
      ["Causas que evalúa salud", "Algunos medicamentos y problemas de coagulación. Un déficit grave y sostenido de vitamina C también puede causar sangrado de encías."]
    ],
    "Anota si es repetido, si hay dolor o inflamación y si tienes moretones o sangrado en otros lugares.",
    "Avisa si reaparece o surge sin motivo aparente. Si el sangrado no se detiene, activa el protocolo a bordo.",
    ["gums", "c", "bleeding"]),
  ficha("moretones", "senales", "Moretones sin golpe claro", "hematomas equimosis vitamina k coagulación", "bruise",
    "Aparecen marcas moradas con más facilidad que antes o en zonas donde no recuerdas un golpe.",
    "Ubica el moretón y anota si recuerdas haber golpeado la zona con el equipo.",
    [
      ["Golpes o presión", "Impactos con el equipo o las superficies de la nave."],
      ["Causas que evalúa salud", "Medicamentos o alteraciones de la coagulación. Una deficiencia importante de vitamina K puede aumentar el sangrado."]
    ],
    "Anota desde cuándo aparecen, en qué zonas y si también sangran las encías o la nariz.",
    "Avisa si se repiten sin explicación o aparecen con otros sangrados. Activa el protocolo si el sangrado no se detiene.",
    ["bleeding", "k"]),
  ficha("palidez", "senales", "Palidez persistente", "pálido anemia hierro folato vitamina b12", "face",
    "La piel se ve más clara de lo habitual, a veces junto con cansancio o mareo.",
    "Observa el cambio con una iluminación similar y registra si coincide con otros síntomas.",
    [
      ["Anemia", "Puede relacionarse con pérdida de sangre, falta de hierro, folato o vitamina B12, entre otras causas."],
      ["Otros factores", "La iluminación y los cambios de circulación también pueden modificar cómo se ve la piel."]
    ],
    "Anota desde cuándo te ves diferente y si también hay cansancio, mareo o sangrado.",
    "Avisa si persiste. Pide ayuda inmediata si la palidez aparece con desmayo, dolor de pecho o falta de aire repentina.",
    ["pallor", "anemia", "emergency"]),
  ficha("vision", "senales", "Dificultad para ver con poca luz", "vista visión nocturna borrosa ojo vitamina a", "eye",
    "Te cuesta adaptarte cuando se apagan las luces o leer en condiciones de poca iluminación.",
    "Distingue si el cambio ocurre sólo con poca luz o también en un ambiente bien iluminado.",
    [
      ["Entorno y visión", "Iluminación insuficiente o problemas oculares pueden dificultar la visión."],
      ["Causas que evalúa salud", "Una deficiencia de vitamina A puede afectar la visión nocturna."]
    ],
    "Anota si afecta a uno o ambos ojos, cuándo comenzó y si ocurre también con buena iluminación.",
    "Reporta cualquier cambio visual nuevo. Si pierdes visión de golpe o aparece dolor ocular fuerte junto con cambios visuales, activa el protocolo a bordo.",
    ["sight", "a", "stroke"]),
  ficha("falta-de-aire", "urgente", "Falta de aire repentina", "ahogo asfixia dificultad respiración disnea no respira", "lungs",
    "Comienza de golpe o la persona tiene dificultades para respirar o hablar.",
    "La dificultad respiratoria de aparición repentina requiere ayuda inmediata.",
    [
      ["Causas que debe evaluar el equipo", "Puede relacionarse con vías respiratorias, pulmones, corazón, una reacción alérgica u otro problema urgente."]
    ],
    "Avisa primero. Cuando puedas, comunica el módulo, la hora de inicio y si hay dolor de pecho u otros síntomas.",
    "Avisa ahora a la tripulación y activa el protocolo de emergencia a bordo. Si la persona no responde, comunícalo de inmediato.",
    ["breathing", "emergency"]),
  ficha("dolor-pecho", "urgente", "Dolor de pecho nuevo o intenso", "dolor tórax presión pecho opresión infarto", "chest",
    "Aparece dolor, presión u opresión nueva en el pecho.",
    "El dolor nuevo de pecho necesita una evaluación inmediata a bordo.",
    [
      ["Causas que debe evaluar el equipo", "Pueden intervenir el corazón, los pulmones, los músculos u otros órganos."]
    ],
    "Avisa primero. Cuando puedas, indica la hora de inicio y si hay falta de aire, sudoración o mareo.",
    "Avisa ahora a la tripulación y activa el protocolo de emergencia a bordo.",
    ["chest", "emergency"]),
  ficha("desmayo", "urgente", "Desmayo o falta de respuesta", "inconsciente pérdida conciencia no despierta síncope", "balance",
    "La persona perdió el conocimiento o no responde al hablarle.",
    "La pérdida de conciencia se comunica de inmediato.",
    [
      ["Causas que debe evaluar el equipo", "Puede haber una caída de presión, un problema cardíaco, una lesión u otras causas."]
    ],
    "Avisa primero. Indica en qué módulo está la persona, si responde y qué ocurrió justo antes.",
    "Activa el protocolo de emergencia a bordo de inmediato, incluso si recupera la conciencia.",
    ["faint", "emergency"]),
  ficha("confusion", "urgente", "Confusión repentina", "desorientación no reconoce módulo alteración mental no entiende", "focus",
    "La persona se desorienta de golpe, responde de forma inusual o no entiende instrucciones simples.",
    "Un cambio súbito en la orientación requiere aviso inmediato.",
    [
      ["Causas que debe evaluar el equipo", "Entre otras, pueden intervenir una lesión, un problema neurológico o una alteración metabólica."]
    ],
    "Avisa primero. Informa cuándo fue la última vez que la persona actuaba con normalidad y si tiene dificultad para hablar o mover un lado.",
    "Avisa ahora a la tripulación y activa el protocolo de emergencia a bordo.",
    ["confusion", "stroke", "emergency"]),
  ficha("perdida-subita", "urgente", "Pérdida súbita de fuerza, habla o visión", "cara caída un lado brazo derrame acv lenguaje ceguera visión súbita", "half",
    "De pronto cuesta levantar un brazo, hablar con claridad o ver por uno o ambos ojos.",
    "Avisa de inmediato aunque el síntoma dure poco o desaparezca.",
    [
      ["Causas que debe evaluar el equipo", "Un accidente cerebrovascular u otra urgencia neurológica puede presentar estas señales."]
    ],
    "Avisa primero. Anota la hora de inicio o la última vez que la persona estaba bien tan pronto como puedas.",
    "Activa el protocolo de emergencia a bordo aunque los síntomas hayan desaparecido.",
    ["stroke", "emergency"]),
  ficha("sangrado-intenso", "urgente", "Sangrado que no se detiene", "hemorragia sangre intensa herida vómito sangre", "drop",
    "La persona pierde sangre en cantidad o el sangrado continúa.",
    "Un sangrado que no se detiene requiere ayuda de inmediato.",
    [
      ["Causas que debe evaluar el equipo", "Puede provenir de una herida u otro problema de salud, incluida una alteración de la coagulación."]
    ],
    "Avisa primero. Comunica de dónde sale la sangre y si hubo una lesión.",
    "Avisa ahora a la tripulación y activa el protocolo de emergencia a bordo.",
    ["bleeding", "emergency"])
];
