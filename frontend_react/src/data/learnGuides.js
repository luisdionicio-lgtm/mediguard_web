export const LEARN_GUIDES = {
  rcp: {
    slug: 'rcp',
    emoji: '🫀',
    color: '#22c55e',
    gradientFrom: '#e0f5ed',
    gradientTo: '#c5edd8',
    badge: 'Gratis',
    tag: 'Primeros auxilios',
    title: 'RCP: guía paso a paso para adultos y niños',
    duration: '5 min de lectura',
    videoEmbed: null,
    intro:
      'La Reanimación Cardiopulmonar puede triplicar las posibilidades de sobrevivir a un paro cardíaco. Actuar en los primeros 4 minutos es crítico.',
    steps: [
      {
        title: 'Verifica la seguridad del entorno',
        desc: 'Antes de acercarte, asegúrate de que ni tú ni la víctima estén en peligro (tráfico, cables, agua, etc.).',
      },
      {
        title: 'Comprueba si la persona responde',
        desc: 'Agita suavemente los hombros y pregunta en voz alta: "¿Estás bien?" Si no hay respuesta ni respiración normal, actúa de inmediato.',
      },
      {
        title: 'Llama al 105 o 911',
        desc: 'Pide a alguien que llame ahora. Si estás solo, activa el altavoz y llama mientras inicias la RCP.',
      },
      {
        title: 'Posición correcta',
        desc: 'Coloca a la persona boca arriba sobre una superficie firme. Arrodíllate a su lado a la altura del pecho.',
      },
      {
        title: '30 compresiones torácicas',
        desc: 'Entrelaza las manos en el centro del pecho (sobre el esternón). Con brazos estirados comprime 5–6 cm de profundidad a ritmo de 100–120 por minuto (canta mentalmente "Stayin\' Alive").',
      },
      {
        title: '2 respiraciones de rescate',
        desc: 'Inclina la cabeza hacia atrás, levanta el mentón, cierra la nariz con dos dedos y da 2 soplos de 1 segundo. El pecho debe elevarse visiblemente.',
      },
      {
        title: 'Repite el ciclo 30:2',
        desc: 'Alterna 30 compresiones y 2 respiraciones hasta que llegue la ambulancia, la persona reaccione o aparezca un DEA disponible.',
      },
    ],
    extraNote: {
      title: 'En niños (1–8 años) y bebés',
      items: [
        'Bebés: usa solo 2 dedos (índice y medio) sobre el esternón.',
        'Niños pequeños: usa una sola mano.',
        'Comprime 1/3 del diámetro del pecho.',
        'Comienza con 5 respiraciones antes de las compresiones.',
        'Las respiraciones deben ser suaves, no forzadas.',
      ],
    },
    warnings: [
      { type: 'danger', text: 'No detengas la RCP hasta que llegue ayuda o la persona muestre señales claras de vida.' },
      { type: 'tip',    text: 'Si hay un DEA disponible, úsalo cuanto antes. Los pasos de audio te guían.' },
      { type: 'tip',    text: 'Una RCP imperfecta es mucho mejor que ninguna. No temas hacerla.' },
    ],
  },

  ansiedad: {
    slug: 'ansiedad',
    emoji: '🧠',
    color: '#60a5fa',
    gradientFrom: '#e3f0fc',
    gradientTo: '#c0daf7',
    badge: 'Nuevo',
    tag: 'Salud mental',
    title: 'Cómo manejar una crisis de ansiedad en público',
    duration: '4 min de lectura',
    videoEmbed: null,
    intro:
      'Una crisis de ansiedad puede sentirse abrumadora, pero siempre tiene fin. Con estas técnicas puedes reducir la intensidad en cuestión de minutos.',
    steps: [
      {
        title: 'Reconoce lo que está pasando',
        desc: 'Recuerda: es una crisis de ansiedad, no un infarto. Tu cuerpo activó la alarma de peligro por error. Estás a salvo.',
      },
      {
        title: 'Técnica 5-4-3-2-1',
        desc: 'Nombra en voz baja: 5 cosas que ves · 4 que puedes tocar · 3 que oyes · 2 que hueles · 1 que saboreas. Ancla tu mente al presente.',
      },
      {
        title: 'Respiración 4-7-8',
        desc: 'Inhala por la nariz contando 4 → retén el aire contando 7 → exhala lentamente por la boca contando 8. Repite 3 veces. Activa el sistema nervioso parasimpático.',
      },
      {
        title: 'Relaja tu cuerpo',
        desc: 'Siéntate o apóyate en una pared. Desaprieta la mandíbula, los hombros y los puños. Presiona los pies suavemente contra el suelo.',
      },
      {
        title: 'Cuestiona el pensamiento',
        desc: 'Pregúntate: "¿Estoy en peligro real ahora mismo?" y "¿Qué evidencia concreta tengo de que algo malo va a ocurrir?". Responder activa el pensamiento lógico.',
      },
      {
        title: 'Pide apoyo si lo necesitas',
        desc: 'No hay vergüenza en decirle a alguien: "Estoy teniendo una crisis de ansiedad, necesito un momento". Las personas suelen ayudar.',
      },
    ],
    extraNote: {
      title: 'Si estás ayudando a alguien',
      items: [
        'Habla en voz tranquila y baja.',
        'No digas "cálmate" — pregunta "¿qué necesitas ahora?".',
        'Ofrece acompañarla a un lugar tranquilo.',
        'No la dejes sola hasta que haya pasado la crisis.',
        'Evita decir "no es para tanto" o minimizar lo que siente.',
      ],
    },
    warnings: [
      { type: 'tip',    text: 'La mayoría de las crisis duran entre 5 y 20 minutos. No duran para siempre, aunque se sientan así.' },
      { type: 'danger', text: 'Si las crisis son frecuentes o afectan tu vida diaria, consulta a un profesional de salud mental.' },
      { type: 'tip',    text: 'Cafeína en exceso, alcohol y falta de sueño son los principales desencadenantes.' },
    ],
  },

  quemaduras: {
    slug: 'quemaduras',
    emoji: '🔥',
    color: '#f59e0b',
    gradientFrom: '#fef6e4',
    gradientTo: '#fde5a0',
    badge: 'Gratis',
    tag: 'Emergencias comunes',
    title: 'Quemaduras: qué hacer (y qué nunca hacer)',
    duration: '3 min de lectura',
    videoEmbed: null,
    intro:
      'Las quemaduras son una de las emergencias más frecuentes en el hogar. Actuar correctamente en los primeros minutos reduce el daño tisular significativamente.',
    steps: [
      {
        title: 'Aleja a la persona del peligro',
        desc: 'Retira a la víctima del calor, fuego o sustancia química. Si la ropa arde, hazla rodar por el suelo o cúbrela con una manta (sin sintéticos).',
      },
      {
        title: 'Enfría con agua fría corriente',
        desc: 'Coloca la zona quemada bajo agua fría (no helada, no con hielo) durante 10 a 20 minutos. Esto reduce el daño y el dolor inmediatamente.',
      },
      {
        title: 'Retira accesorios cercanos',
        desc: 'Quita relojes, pulseras, anillos o ropa cerca de la quemadura antes de que la zona infle. No arranques nada que esté pegado a la piel.',
      },
      {
        title: 'Cubre la zona quemada',
        desc: 'Usa una gasa estéril, venda no adherente o un paño limpio. Cubre sin apretar. No uses algodón directamente sobre la herida.',
      },
      {
        title: 'Evalúa el grado de la quemadura',
        desc: '1er grado: enrojecimiento sin ampollas (sunburn). 2do grado: ampollas, dolor intenso. 3er grado: piel blanca, marrón o negra, sin dolor (nervios dañados) → emergencia.',
      },
      {
        title: 'Busca atención médica',
        desc: 'Ve a urgencias si: hay ampollas grandes, la quemadura es en cara/manos/pies/genitales/articulaciones, la víctima es niño o anciano, o el área supera el tamaño de la palma de la mano.',
      },
    ],
    extraNote: {
      title: 'Quemaduras químicas',
      items: [
        'Enjuaga con abundante agua por al menos 20 minutos.',
        'Retira la ropa contaminada usando guantes si tienes.',
        'No intentes neutralizar el químico con otro producto.',
        'Llama al 105 o 911 inmediatamente.',
        'Lleva el envase del producto al hospital si es posible.',
      ],
    },
    warnings: [
      { type: 'danger', text: 'NUNCA uses mantequilla, pasta dental, aceite, yogur ni hielo sobre una quemadura.' },
      { type: 'danger', text: 'No revientes las ampollas — son barrera protectora contra infecciones.' },
      { type: 'tip',    text: 'El gel de aloe vera puro puede aliviar quemaduras de 1er grado una vez enfriadas.' },
    ],
  },
};

export const GUIDES_LIST = Object.values(LEARN_GUIDES);
