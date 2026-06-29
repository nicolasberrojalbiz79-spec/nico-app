// Shared data for Trainer Nico prototype.
// Exercise catalog, students, routines, nutrition.
// All names in Spanish (primary) and English (secondary).

const TN_COLORS = {
  bg: '#0A0A0A',
  surface: '#141414',
  surface2: '#1A1A1A',
  border: '#1F1F1F',
  border2: '#262626',
  lime: '#AAFF00',
  limeMuted: 'rgba(170,255,0,0.12)',
  limeText: '#C9FF4A',
  text: '#FAFAFA',
  textDim: '#A1A1A1',
  textMuted: '#6B6B6B',
  red: '#FF5247',
  warn: '#FFB020',
};

const TN_FONT = '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const TN_MONO = '"JetBrains Mono", "SF Mono", Menlo, monospace';

// ─────────────────────────────────────────────────────────────
// Exercise catalog — 62 exercises, organized by muscle group.
// Each: {id, es, en, group, equipment, level, primary[], secondary[], tip, errors[]}
// ─────────────────────────────────────────────────────────────
const TN_EXERCISES = [
  // PECHO (8)
  { id: 'press-banca', es: 'Press de banca', en: 'Bench Press', group: 'Pecho', equipment: 'Barra', level: 'Intermedio', primary: ['Pectoral mayor'], secondary: ['Tríceps', 'Deltoides anterior'], tip: 'Retrae escápulas y mantén los pies firmes. Baja controlado.', errors: ['Codos demasiado abiertos (90°)', 'Rebotar la barra en el pecho'] },
  { id: 'press-inclinado', es: 'Press inclinado', en: 'Incline Press', group: 'Pecho', equipment: 'Mancuernas', level: 'Intermedio', primary: ['Pectoral superior'], secondary: ['Deltoides anterior'], tip: 'Inclinación de 30°. Mancuernas no chocan arriba.', errors: ['Banco demasiado inclinado (>45°)'] },
  { id: 'aperturas', es: 'Aperturas', en: 'Dumbbell Flyes', group: 'Pecho', equipment: 'Mancuernas', level: 'Principiante', primary: ['Pectoral mayor'], secondary: [], tip: 'Codos ligeramente flexionados durante todo el rango.', errors: ['Bajar demasiado y forzar el hombro'] },
  { id: 'fondos', es: 'Fondos en paralelas', en: 'Dips', group: 'Pecho', equipment: 'Peso corporal', level: 'Avanzado', primary: ['Pectoral inferior', 'Tríceps'], secondary: [], tip: 'Inclínate ligeramente al frente para énfasis en pecho.', errors: ['Hombros adelantados', 'Rango incompleto'] },
  { id: 'press-cerrado', es: 'Press cerrado', en: 'Close-Grip Bench', group: 'Pecho', equipment: 'Barra', level: 'Intermedio', primary: ['Tríceps', 'Pectoral interno'], secondary: [], tip: 'Manos a la anchura de hombros, codos pegados.', errors: ['Agarre demasiado cerrado'] },
  { id: 'flexiones', es: 'Flexiones', en: 'Push-ups', group: 'Pecho', equipment: 'Peso corporal', level: 'Principiante', primary: ['Pectoral mayor'], secondary: ['Tríceps', 'Core'], tip: 'Cuerpo en línea recta de talones a cabeza.', errors: ['Caderas caídas'] },
  { id: 'cruce-poleas', es: 'Cruce de poleas', en: 'Cable Crossover', group: 'Pecho', equipment: 'Polea', level: 'Intermedio', primary: ['Pectoral mayor'], secondary: [], tip: 'Trayectoria de arco. Apretar fuerte al cruzar.', errors: ['Usar demasiado peso y perder forma'] },
  { id: 'press-maquina', es: 'Press en máquina', en: 'Machine Press', group: 'Pecho', equipment: 'Máquina', level: 'Principiante', primary: ['Pectoral mayor'], secondary: ['Tríceps'], tip: 'Ajusta el asiento: agarres a la altura del pecho medio.', errors: [] },

  // ESPALDA (8)
  { id: 'dominadas', es: 'Dominadas', en: 'Pull-ups', group: 'Espalda', equipment: 'Peso corporal', level: 'Avanzado', primary: ['Dorsal ancho'], secondary: ['Bíceps', 'Romboides'], tip: 'Inicia desde colgada total. Lleva pecho a la barra.', errors: ['Balancearse', 'No completar el rango'] },
  { id: 'remo-barra', es: 'Remo con barra', en: 'Barbell Row', group: 'Espalda', equipment: 'Barra', level: 'Intermedio', primary: ['Dorsal ancho', 'Romboides'], secondary: ['Bíceps', 'Lumbares'], tip: 'Torso a 45°. Lleva la barra al ombligo.', errors: ['Espalda redondeada'] },
  { id: 'remo-mancuerna', es: 'Remo con mancuerna', en: 'Dumbbell Row', group: 'Espalda', equipment: 'Mancuernas', level: 'Principiante', primary: ['Dorsal ancho'], secondary: ['Bíceps'], tip: 'Apoya rodilla y mano en banco. Codo pegado al cuerpo.', errors: ['Rotar el torso'] },
  { id: 'jalon-polea', es: 'Jalón al pecho', en: 'Lat Pulldown', group: 'Espalda', equipment: 'Polea', level: 'Principiante', primary: ['Dorsal ancho'], secondary: ['Bíceps'], tip: 'Lleva la barra al pecho, no detrás de la nuca.', errors: ['Usar impulso del torso'] },
  { id: 'remo-polea', es: 'Remo en polea baja', en: 'Seated Cable Row', group: 'Espalda', equipment: 'Polea', level: 'Principiante', primary: ['Dorsal medio', 'Romboides'], secondary: [], tip: 'Pecho fuera, retrae escápulas al final.', errors: [] },
  { id: 'peso-muerto', es: 'Peso muerto', en: 'Deadlift', group: 'Espalda', equipment: 'Barra', level: 'Avanzado', primary: ['Erectores', 'Glúteos'], secondary: ['Trapecio', 'Isquios'], tip: 'Barra pegada al cuerpo. Empuja el suelo con los pies.', errors: ['Espalda curva', 'Hiperextender arriba'] },
  { id: 'pull-over', es: 'Pull-over', en: 'Pullover', group: 'Espalda', equipment: 'Mancuernas', level: 'Intermedio', primary: ['Dorsal ancho'], secondary: ['Serrato', 'Pectoral'], tip: 'Estiramiento profundo en la parte baja.', errors: [] },
  { id: 'remo-trx', es: 'Remo invertido TRX', en: 'TRX Row', group: 'Espalda', equipment: 'TRX', level: 'Principiante', primary: ['Dorsal'], secondary: ['Core'], tip: 'Cuerpo recto. Aprieta escápulas al subir.', errors: [] },

  // HOMBROS (6)
  { id: 'press-militar', es: 'Press militar', en: 'Overhead Press', group: 'Hombros', equipment: 'Barra', level: 'Intermedio', primary: ['Deltoides anterior'], secondary: ['Tríceps', 'Core'], tip: 'Activa glúteos y abs. La barra sube en línea recta.', errors: ['Arquear lumbar'] },
  { id: 'press-arnold', es: 'Press Arnold', en: 'Arnold Press', group: 'Hombros', equipment: 'Mancuernas', level: 'Intermedio', primary: ['Deltoides anterior', 'Deltoides lateral'], secondary: [], tip: 'Rota las palmas mientras subes.', errors: [] },
  { id: 'elevaciones-laterales', es: 'Elevaciones laterales', en: 'Lateral Raises', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', primary: ['Deltoides lateral'], secondary: [], tip: 'Sube hasta la línea de los hombros. Codo ligeramente flex.', errors: ['Usar peso excesivo'] },
  { id: 'pajaros', es: 'Pájaros', en: 'Rear Delt Flyes', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', primary: ['Deltoides posterior'], secondary: ['Romboides'], tip: 'Torso inclinado a 45°. Aprieta omóplatos.', errors: [] },
  { id: 'face-pull', es: 'Face pull', en: 'Face Pull', group: 'Hombros', equipment: 'Polea', level: 'Principiante', primary: ['Deltoides posterior'], secondary: ['Trapecio'], tip: 'Tira hacia la cara, codos altos.', errors: [] },
  { id: 'encogimientos', es: 'Encogimientos', en: 'Shrugs', group: 'Hombros', equipment: 'Mancuernas', level: 'Principiante', primary: ['Trapecio'], secondary: [], tip: 'Sube los hombros hacia las orejas, pausa arriba.', errors: ['Rotar los hombros'] },

  // BÍCEPS (5)
  { id: 'curl-barra', es: 'Curl con barra', en: 'Barbell Curl', group: 'Bíceps', equipment: 'Barra', level: 'Principiante', primary: ['Bíceps'], secondary: ['Braquial'], tip: 'Codos fijos al costado. Sin impulso lumbar.', errors: ['Mecer el cuerpo'] },
  { id: 'curl-martillo', es: 'Curl martillo', en: 'Hammer Curl', group: 'Bíceps', equipment: 'Mancuernas', level: 'Principiante', primary: ['Braquial', 'Braquiorradial'], secondary: ['Bíceps'], tip: 'Palmas mirándose. Sube alternado o simultáneo.', errors: [] },
  { id: 'curl-predicador', es: 'Curl predicador', en: 'Preacher Curl', group: 'Bíceps', equipment: 'Máquina', level: 'Intermedio', primary: ['Bíceps'], secondary: [], tip: 'Pecho apoyado, controla el descenso 3s.', errors: ['Extender por completo y perder tensión'] },
  { id: 'curl-concentrado', es: 'Curl concentrado', en: 'Concentration Curl', group: 'Bíceps', equipment: 'Mancuernas', level: 'Principiante', primary: ['Bíceps'], secondary: [], tip: 'Codo apoyado en muslo. Aprieta el pico arriba.', errors: [] },
  { id: 'curl-polea', es: 'Curl en polea', en: 'Cable Curl', group: 'Bíceps', equipment: 'Polea', level: 'Principiante', primary: ['Bíceps'], secondary: [], tip: 'Tensión constante durante todo el rango.', errors: [] },

  // TRÍCEPS (5)
  { id: 'extension-polea', es: 'Extensión en polea', en: 'Tricep Pushdown', group: 'Tríceps', equipment: 'Polea', level: 'Principiante', primary: ['Tríceps'], secondary: [], tip: 'Codos pegados al cuerpo. Aprieta abajo.', errors: ['Mover el hombro'] },
  { id: 'frances', es: 'Press francés', en: 'Skull Crusher', group: 'Tríceps', equipment: 'Barra', level: 'Intermedio', primary: ['Tríceps'], secondary: [], tip: 'Codos apuntan al techo, baja a la frente.', errors: ['Abrir los codos'] },
  { id: 'patada', es: 'Patada de tríceps', en: 'Tricep Kickback', group: 'Tríceps', equipment: 'Mancuernas', level: 'Principiante', primary: ['Tríceps'], secondary: [], tip: 'Codo fijo arriba, extiende solo el antebrazo.', errors: [] },
  { id: 'extension-sobre-cabeza', es: 'Extensión sobre la cabeza', en: 'Overhead Extension', group: 'Tríceps', equipment: 'Mancuernas', level: 'Intermedio', primary: ['Tríceps (cabeza larga)'], secondary: [], tip: 'Codos cerca de la cabeza, estira bien abajo.', errors: [] },
  { id: 'fondos-banco', es: 'Fondos en banco', en: 'Bench Dips', group: 'Tríceps', equipment: 'Peso corporal', level: 'Principiante', primary: ['Tríceps'], secondary: ['Pectoral'], tip: 'Codos hacia atrás, no hacia los lados.', errors: [] },

  // PIERNAS — Cuádriceps (5)
  { id: 'sentadilla', es: 'Sentadilla', en: 'Squat', group: 'Cuádriceps', equipment: 'Barra', level: 'Intermedio', primary: ['Cuádriceps', 'Glúteos'], secondary: ['Core', 'Isquios'], tip: 'Rodillas alineadas con pies. Pecho arriba.', errors: ['Rodillas hacia adentro', 'No bajar al paralelo'] },
  { id: 'sentadilla-frontal', es: 'Sentadilla frontal', en: 'Front Squat', group: 'Cuádriceps', equipment: 'Barra', level: 'Avanzado', primary: ['Cuádriceps'], secondary: ['Core'], tip: 'Codos altos. Torso vertical.', errors: [] },
  { id: 'prensa', es: 'Prensa de piernas', en: 'Leg Press', group: 'Cuádriceps', equipment: 'Máquina', level: 'Principiante', primary: ['Cuádriceps', 'Glúteos'], secondary: [], tip: 'Pies en mitad de plataforma. No bloquees rodillas.', errors: ['Bajar demasiado y despegar lumbar'] },
  { id: 'extension-cuadriceps', es: 'Extensión de cuádriceps', en: 'Leg Extension', group: 'Cuádriceps', equipment: 'Máquina', level: 'Principiante', primary: ['Cuádriceps'], secondary: [], tip: 'Pausa 1s arriba apretando el cuádriceps.', errors: [] },
  { id: 'zancada', es: 'Zancadas', en: 'Lunges', group: 'Cuádriceps', equipment: 'Mancuernas', level: 'Principiante', primary: ['Cuádriceps', 'Glúteos'], secondary: [], tip: 'Rodilla atrás casi toca el piso. Torso vertical.', errors: ['Rodilla delantera adelantada del pie'] },

  // PIERNAS — Isquios/Glúteos (5)
  { id: 'peso-muerto-rumano', es: 'Peso muerto rumano', en: 'Romanian Deadlift', group: 'Isquios', equipment: 'Barra', level: 'Intermedio', primary: ['Isquios', 'Glúteos'], secondary: ['Lumbares'], tip: 'Cadera atrás, ligera flexión de rodillas.', errors: ['Curvar la espalda'] },
  { id: 'curl-femoral', es: 'Curl femoral', en: 'Leg Curl', group: 'Isquios', equipment: 'Máquina', level: 'Principiante', primary: ['Isquios'], secondary: [], tip: 'Controla el descenso. No despegues la cadera.', errors: [] },
  { id: 'hip-thrust', es: 'Hip thrust', en: 'Hip Thrust', group: 'Glúteos', equipment: 'Barra', level: 'Intermedio', primary: ['Glúteos'], secondary: ['Isquios'], tip: 'Aprieta glúteos arriba. Mentón al pecho.', errors: ['Hiperextender lumbar'] },
  { id: 'patada-glutea', es: 'Patada glútea', en: 'Glute Kickback', group: 'Glúteos', equipment: 'Polea', level: 'Principiante', primary: ['Glúteos'], secondary: [], tip: 'Pierna recta atrás. Aprieta arriba.', errors: [] },
  { id: 'sentadilla-bulgara', es: 'Sentadilla búlgara', en: 'Bulgarian Split Squat', group: 'Glúteos', equipment: 'Mancuernas', level: 'Intermedio', primary: ['Glúteos', 'Cuádriceps'], secondary: [], tip: 'Pie trasero elevado. Carga 80% en pierna delantera.', errors: [] },

  // PIERNAS — Gemelos (2)
  { id: 'elevaciones-gemelos', es: 'Elevaciones de gemelos', en: 'Standing Calf Raise', group: 'Gemelos', equipment: 'Máquina', level: 'Principiante', primary: ['Gemelos'], secondary: [], tip: 'Rango completo: estiramiento abajo, contracción arriba.', errors: [] },
  { id: 'gemelos-sentado', es: 'Gemelos sentado', en: 'Seated Calf Raise', group: 'Gemelos', equipment: 'Máquina', level: 'Principiante', primary: ['Sóleo'], secondary: [], tip: 'Pausa de 1s arriba.', errors: [] },

  // CORE (6)
  { id: 'plancha', es: 'Plancha', en: 'Plank', group: 'Core', equipment: 'Peso corporal', level: 'Principiante', primary: ['Core', 'Transverso'], secondary: [], tip: 'Cuerpo recto. Activa glúteos y abs.', errors: ['Cadera caída o levantada'] },
  { id: 'crunch-polea', es: 'Crunch en polea', en: 'Cable Crunch', group: 'Core', equipment: 'Polea', level: 'Intermedio', primary: ['Recto abdominal'], secondary: [], tip: 'Flexiona la columna, no las caderas.', errors: [] },
  { id: 'elevacion-piernas', es: 'Elevación de piernas', en: 'Hanging Leg Raise', group: 'Core', equipment: 'Peso corporal', level: 'Avanzado', primary: ['Recto abdominal', 'Flexores'], secondary: [], tip: 'No balancees. Sube piernas controladas.', errors: [] },
  { id: 'rueda-abs', es: 'Rueda abdominal', en: 'Ab Wheel', group: 'Core', equipment: 'Peso corporal', level: 'Avanzado', primary: ['Core completo'], secondary: [], tip: 'Mantén espalda neutra. Avanza tan lejos como puedas.', errors: [] },
  { id: 'pallof', es: 'Pallof press', en: 'Pallof Press', group: 'Core', equipment: 'Polea', level: 'Intermedio', primary: ['Oblicuos', 'Anti-rotación'], secondary: [], tip: 'Resiste la rotación con el core.', errors: [] },
  { id: 'oblicuos-russian', es: 'Giros rusos', en: 'Russian Twists', group: 'Core', equipment: 'Peso corporal', level: 'Principiante', primary: ['Oblicuos'], secondary: [], tip: 'Pies elevados. Gira tronco no solo brazos.', errors: [] },

  // FULL BODY (3)
  { id: 'cargada', es: 'Cargada de potencia', en: 'Power Clean', group: 'Full Body', equipment: 'Barra', level: 'Avanzado', primary: ['Cadena posterior'], secondary: ['Hombros', 'Trapecio'], tip: 'Explosividad desde caderas. Codos rápidos arriba.', errors: [] },
  { id: 'burpees', es: 'Burpees', en: 'Burpees', group: 'Full Body', equipment: 'Peso corporal', level: 'Intermedio', primary: ['Full body'], secondary: [], tip: 'Salto explosivo arriba. Flexión completa abajo.', errors: [] },
  { id: 'thrusters', es: 'Thrusters', en: 'Thrusters', group: 'Full Body', equipment: 'Mancuernas', level: 'Intermedio', primary: ['Piernas', 'Hombros'], secondary: ['Core'], tip: 'Sentadilla + press en un movimiento fluido.', errors: [] },
];

const TN_GROUPS = ['Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Cuádriceps', 'Isquios', 'Glúteos', 'Gemelos', 'Core', 'Full Body'];
const TN_EQUIPMENT = ['Barra', 'Mancuernas', 'Máquina', 'Polea', 'Peso corporal', 'TRX'];
const TN_LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

// ─────────────────────────────────────────────────────────────
// Students
// ─────────────────────────────────────────────────────────────
const TN_STUDENTS = [
  { id: 1, name: 'Lucía Romero', initials: 'LR', age: 28, goal: 'Hipertrofia', level: 'Intermedio', adherence: 92, lastCheckIn: 'Hoy · 07:14', weight: 62.1, weightDelta: -1.4, color: '#A8FF00', note: 'Lesión leve hombro izq. — evitar press detrás de la nuca.' },
  { id: 2, name: 'Mateo Álvarez', initials: 'MA', age: 34, goal: 'Pérdida de grasa', level: 'Principiante', adherence: 78, lastCheckIn: 'Ayer · 19:02', weight: 88.4, weightDelta: -3.2, color: '#FFB020', note: 'Trabaja sentado. Énfasis en postura.' },
  { id: 3, name: 'Sofía Castro', initials: 'SC', age: 24, goal: 'Recomposición', level: 'Intermedio', adherence: 96, lastCheckIn: 'Hoy · 06:48', weight: 56.8, weightDelta: 0.6, color: '#5BA8FF', note: 'Maratonista. Volumen alto en piernas.' },
  { id: 4, name: 'Tomás Pereyra', initials: 'TP', age: 31, goal: 'Fuerza', level: 'Avanzado', adherence: 88, lastCheckIn: 'Hoy · 11:30', weight: 81.2, weightDelta: 1.8, color: '#FF5247', note: 'Bloque de fuerza powerlifting. PR sentadilla 170kg.' },
  { id: 5, name: 'Camila Ibáñez', initials: 'CI', age: 26, goal: 'Hipertrofia', level: 'Intermedio', adherence: 84, lastCheckIn: 'Hace 2 días', weight: 64.5, weightDelta: 0.9, color: '#C46BFF', note: '' },
  { id: 6, name: 'Joaquín Méndez', initials: 'JM', age: 39, goal: 'Salud general', level: 'Principiante', adherence: 62, lastCheckIn: 'Hace 4 días', weight: 95.3, weightDelta: -0.4, color: '#6B7280', note: 'Hipertensión leve. No alta intensidad.' },
  { id: 7, name: 'Valentina Ruiz', initials: 'VR', age: 22, goal: 'Hipertrofia', level: 'Principiante', adherence: 90, lastCheckIn: 'Hoy · 09:22', weight: 58.0, weightDelta: 0.3, color: '#A8FF00', note: '' },
  { id: 8, name: 'Diego Sosa', initials: 'DS', age: 45, goal: 'Pérdida de grasa', level: 'Intermedio', adherence: 70, lastCheckIn: 'Hace 1 día', weight: 92.8, weightDelta: -2.1, color: '#FFB020', note: '' },
];

// ─────────────────────────────────────────────────────────────
// Routine for the student dashboard (Lucía)
// ─────────────────────────────────────────────────────────────
const TN_ROUTINE = {
  name: 'Hipertrofia · Upper/Lower · S6',
  week: 6,
  totalWeeks: 12,
  days: [
    { day: 'L', name: 'Upper Push', focus: 'Pecho · Hombros · Tríceps', done: true,  exercises: 6 },
    { day: 'M', name: 'Lower A',    focus: 'Cuádriceps · Glúteos',        done: true,  exercises: 5 },
    { day: 'X', name: 'Descanso',   focus: 'Movilidad opcional',          done: true,  exercises: 0 },
    { day: 'J', name: 'Upper Pull', focus: 'Espalda · Bíceps',            done: false, today: true, exercises: 6 },
    { day: 'V', name: 'Lower B',    focus: 'Isquios · Glúteos',           done: false, exercises: 5 },
    { day: 'S', name: 'Full Body',  focus: 'Conditioning',                done: false, exercises: 4 },
    { day: 'D', name: 'Descanso',   focus: '',                            done: false, exercises: 0 },
  ],
  // Today's workout: Upper Pull
  today: [
    { ex: 'dominadas',     sets: 4, reps: '6-8',   rest: 120, doneSets: 0 },
    { ex: 'remo-barra',    sets: 4, reps: '8-10',  rest: 120, doneSets: 0, weight: 50 },
    { ex: 'jalon-polea',   sets: 3, reps: '10-12', rest: 90,  doneSets: 0, weight: 42 },
    { ex: 'remo-mancuerna',sets: 3, reps: '10',    rest: 90,  doneSets: 0, weight: 18 },
    { ex: 'curl-barra',    sets: 3, reps: '10-12', rest: 60,  doneSets: 0, weight: 22 },
    { ex: 'curl-martillo', sets: 3, reps: '12',    rest: 60,  doneSets: 0, weight: 12 },
  ],
};

// ─────────────────────────────────────────────────────────────
// Nutrition plan for Lucía
// ─────────────────────────────────────────────────────────────
const TN_NUTRITION = {
  calories: 1980,
  caloriesEaten: 1340,
  protein: { target: 140, eaten: 96 },
  carbs:   { target: 210, eaten: 154 },
  fat:     { target: 60,  eaten: 38 },
  meals: [
    { time: '07:30', name: 'Desayuno',  kcal: 480, p: 32, c: 58, f: 12, items: ['Avena 80g', 'Whey 30g', 'Banana', 'Mantequilla maní 15g'], done: true },
    { time: '11:00', name: 'Media mañana', kcal: 220, p: 18, c: 22, f: 6, items: ['Yogur griego 200g', 'Frutos rojos 100g'], done: true },
    { time: '13:30', name: 'Almuerzo',  kcal: 640, p: 46, c: 74, f: 20, items: ['Pollo 180g', 'Arroz integral 100g', 'Brócoli', 'Aceite oliva 1cda'], done: true },
    { time: '17:00', name: 'Merienda',  kcal: 280, p: 22, c: 28, f: 8, items: ['Tostadas integrales 2u', 'Atún 80g', 'Tomate'], done: false },
    { time: '20:30', name: 'Cena',      kcal: 360, p: 22, c: 28, f: 14, items: ['Salmón 150g', 'Quinoa 70g', 'Ensalada verde'], done: false },
  ],
};

// ─────────────────────────────────────────────────────────────
// Progress data (last 8 weeks)
// ─────────────────────────────────────────────────────────────
const TN_PROGRESS = {
  weight: [63.5, 63.2, 62.9, 62.8, 62.4, 62.3, 62.2, 62.1],
  volume: [12400, 13200, 13800, 14100, 14600, 15200, 15800, 16400], // kg total semana
  adherence: [85, 88, 90, 87, 92, 94, 90, 92], // %
  prs: [
    { ex: 'Press de banca', value: '60 kg × 5', when: 'S5' },
    { ex: 'Sentadilla',     value: '85 kg × 6', when: 'S4' },
    { ex: 'Dominadas',      value: '+8 kg × 5', when: 'S6' },
    { ex: 'Peso muerto rumano', value: '70 kg × 8', when: 'S6' },
  ],
};

// Map a muscle group to a swatch (used in card placeholders).
function tnGroupColor(g) {
  const m = {
    'Pecho': '#FF5247', 'Espalda': '#5BA8FF', 'Hombros': '#FFB020',
    'Bíceps': '#C46BFF', 'Tríceps': '#FF8A47',
    'Cuádriceps': '#A8FF00', 'Isquios': '#7BE000', 'Glúteos': '#FF5BA8',
    'Gemelos': '#00E0C4', 'Core': '#FFE047', 'Full Body': '#FAFAFA',
  };
  return m[g] || '#FAFAFA';
}

// Find exercise by id
function tnEx(id) { return TN_EXERCISES.find((e) => e.id === id); }

Object.assign(window, {
  TN_COLORS, TN_FONT, TN_MONO,
  TN_EXERCISES, TN_GROUPS, TN_EQUIPMENT, TN_LEVELS,
  TN_STUDENTS, TN_ROUTINE, TN_NUTRITION, TN_PROGRESS,
  tnGroupColor, tnEx,
});
