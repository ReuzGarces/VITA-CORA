export const SUPPORT_TOPICS = {
  "no-responde": {
    name: "Compañero que no responde",
    icon: "alert",
    tag: "PRIMEROS AUXILIOS · PÉRDIDA DE CONCIENCIA",
    source: ["American Red Cross · Persona que no responde", "https://www.redcross.org/take-a-class/resources/learn-first-aid/unresponsive-and-breathing-person"],
    steps: [
      {
        title: "Comprueba si responde y avisa",
        text: "Si es seguro acercarte, llámalo por su nombre y toca suavemente su hombro. Si no responde, activa el aviso de emergencia a bordo de inmediato.",
        tip: "Si hay otro tripulante, pídele que avise y traiga el desfibrilador externo automático (DEA) mientras compruebas la respiración.",
        caption: "Un compañero llama al tripulante y toca su hombro. La radio representa el aviso de emergencia."
      },
      {
        title: "Comprueba la respiración",
        text: "Mira si el pecho sube y baja y escucha si respira normalmente. Haz la comprobación rápida, en un máximo de 10 segundos.",
        tip: "Los jadeos aislados cuentan como respiración anormal.",
        caption: "La flecha indica dónde mirar para observar el movimiento del pecho."
      },
      {
        title: "Actúa según la respiración",
        text: "Si no respira normalmente o solo jadea, inicia la reanimación cardiopulmonar (RCP) y usa el DEA cuando esté disponible, según el entrenamiento y protocolo de la misión. Si respira normalmente, acompáñalo y vigila su respiración hasta que llegue ayuda.",
        tip: "Aplica las instrucciones de la misión para la RCP en microgravedad.",
        caption: "La ilustración distingue las dos acciones: RCP y DEA ante respiración anormal, o vigilancia si respira normalmente."
      }
    ]
  },
  herida: {
    name: "Herida con sangrado",
    icon: "bandage",
    tag: "PRIMEROS AUXILIOS · CONTROL DEL SANGRADO",
    source: ["American Red Cross · Sangrado grave", "https://www.redcross.org/take-a-class/resources/learn-first-aid/bleeding-life-threatening-external"],
    steps: [
      {
        title: "Reconoce el sangrado intenso y pide ayuda",
        text: "Si sale mucha sangre, sale a chorros o el sangrado no se detiene, activa de inmediato el protocolo de emergencia a bordo. Si alguien está contigo, pídele que avise mientras tú aplicas presión.",
        tip: "Usa guantes si están a mano y puedes ponértelos sin retrasar la atención.",
        caption: "La radio indica que debes avisar a bordo de inmediato ante un sangrado intenso."
      },
      {
        title: "Aplica presión directa",
        text: "Coloca una gasa o tela limpia sobre la herida y presiona con firmeza y de forma continua.",
        tip: "Si hay un objeto clavado, déjalo en su lugar y presiona a su alrededor.",
        caption: "Una mano enguantada mantiene la presión sobre una gasa que cubre la herida."
      },
      {
        title: "Mantén la presión y acompáñalo",
        text: "Mantén la presión hasta que el sangrado se detenga o el equipo de salud tome el relevo. Si el sangrado continúa o el compañero empeora, informa de inmediato.",
        tip: "Si es una herida leve y el sangrado ya paró, limpia y cubre la herida según el protocolo de la misión.",
        caption: "La mano sigue sobre la gasa y el canal de comunicación queda disponible para informar cambios."
      }
    ]
  },
  desorientacion: {
    name: "Mareo o desorientación",
    icon: "compass",
    tag: "PRIMEROS AUXILIOS · MAREO",
    source: ["MedlinePlus · Mareo y vértigo", "https://medlineplus.gov/spanish/dizzinessandvertigo.html"],
    steps: [
      {
        title: "Detén la tarea y ofrece apoyo",
        text: "Quédate con tu compañero y ayúdalo a mantenerse en un lugar estable. En microgravedad, un asidero cercano puede ayudarle a estabilizarse si está alerta. Si hay gravedad y puede hacerlo con seguridad, ayúdalo a sentarse.",
        tip: "Evita que retome la tarea o se desplace solo mientras se sienta mareado.",
        caption: "Un compañero detiene la tarea y ayuda al tripulante alerta a sujetarse de un asidero."
      },
      {
        title: "Activa el aviso ante señales de alarma",
        text: "Activa el protocolo de emergencia de inmediato si aparece dificultad repentina para hablar o ver, debilidad de un lado, confusión repentina, dolor de cabeza súbito e intenso o un desmayo.",
        tip: "Si deja de responder, comprueba la respiración de inmediato. La guía «No responde» explica el siguiente paso.",
        caption: "El aviso por radio tiene prioridad cuando aparece una señal de alarma."
      },
      {
        title: "Avisa y comunica cuándo empezó",
        text: "Si el mareo es nuevo, avisa al responsable de salud a bordo. Indica en qué módulo están, a qué hora empezó y qué otros cambios observaste. Quédate con tu compañero hasta que llegue ayuda o recibas instrucciones.",
        tip: "Si hay señales de alarma, avisa primero y anota los datos después.",
        caption: "La ficha reúne el módulo, la hora de inicio y lo que se observó."
      }
    ]
  }
};
