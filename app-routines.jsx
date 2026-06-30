// Trainer Nico — Biblioteca de rutinas precargadas (≥40).
// Cada día referencia IDs reales de library.jsx. Se componen desde plantillas
// de días reutilizables para garantizar que cada ejercicio existe.

// exercise entry
function E(id, sets, reps, rest, weight = 0) { return { id, sets, reps, rest, weight }; }
const REST_DAY = { day: '·', name: 'Descanso', focus: 'Recuperación', exercises: [] };
const MOV_DAY = { day: '·', name: 'Movilidad', focus: 'Cardio suave + movilidad', exercises: [] };

// ── Plantillas de días (IDs reales) ──────────────────────────────────────
const DT = {
  // Full body (principiante)
  fbA: { day: 'L', name: 'Full Body A', focus: 'Cuerpo completo', exercises: [
    E('sentadilla-goblet', 3, '12', 90, 16), E('press-plano-mancuernas', 3, '12', 90, 14),
    E('jalon-pecho', 3, '12', 90, 40), E('elevaciones-laterales', 3, '15', 60, 6),
    E('curl-barra-recta', 2, '12', 60, 15), E('extension-unilateral-polea', 2, '12', 60, 12) ] },
  fbB: { day: 'X', name: 'Full Body B', focus: 'Cuerpo completo', exercises: [
    E('prensa-45', 3, '12', 90, 120), E('press-convergente', 3, '12', 90, 30),
    E('remo-maquina', 3, '12', 90, 35), E('press-hombros-maquina', 3, '12', 90, 20),
    E('curl-martillo', 2, '12', 60, 10), E('patada-triceps-polea', 2, '12', 60, 15) ] },
  fbC: { day: 'V', name: 'Full Body C', focus: 'Cuerpo completo', exercises: [
    E('peso-muerto-rumano', 3, '10', 120, 40), E('flexiones', 3, '12', 75, 0),
    E('jalon-cerrado', 3, '12', 90, 38), E('pajaros-mancuernas', 3, '15', 60, 6),
    E('curl-alternado', 2, '12', 60, 9), E('press-triceps-maquina', 2, '12', 60, 25) ] },

  // Máquinas (principiante)
  machA: { day: 'L', name: 'Máquinas A', focus: 'Empuje + piernas', exercises: [
    E('press-convergente', 3, '12', 90, 25), E('press-hombros-maquina', 3, '12', 90, 18),
    E('extension-cuadriceps', 3, '15', 75, 30), E('prensa-45', 3, '12', 90, 100),
    E('press-triceps-maquina', 3, '12', 60, 22) ] },
  machB: { day: 'J', name: 'Máquinas B', focus: 'Tracción + glúteos', exercises: [
    E('jalon-pecho', 3, '12', 90, 35), E('remo-maquina', 3, '12', 90, 30),
    E('curl-femoral-sentado', 3, '12', 75, 28), E('abduccion-maquina', 3, '20', 60, 35),
    E('curl-predicador', 3, '12', 60, 20) ] },

  // Push / Pull / Legs
  pushA: { day: 'L', name: 'Push A', focus: 'Pecho · Hombros · Tríceps', exercises: [
    E('press-banca-plano', 4, '8', 120, 50), E('press-militar-mancuernas', 3, '10', 90, 18),
    E('press-inclinado', 3, '10', 90, 22), E('elevaciones-laterales', 4, '15', 60, 7),
    E('pres-frances-z', 3, '12', 60, 20), E('patada-triceps-polea', 3, '15', 45, 15) ] },
  pullA: { day: 'M', name: 'Pull A', focus: 'Espalda · Bíceps', exercises: [
    E('dominadas', 4, '8', 120, 0), E('remo-barra', 4, '10', 120, 50),
    E('jalon-pecho', 3, '12', 90, 42), E('remo-hammer', 3, '12', 90, 25),
    E('curl-barra-z', 3, '12', 60, 22), E('curl-martillo', 3, '12', 60, 12) ] },
  legsA: { day: 'X', name: 'Legs A', focus: 'Cuádriceps · Glúteos · Gemelos', exercises: [
    E('sentadilla-libre', 4, '8', 150, 70), E('prensa-45', 3, '12', 120, 160),
    E('curl-femoral-acostado', 3, '12', 75, 28), E('zancadas', 3, '12', 75, 14),
    E('hip-thrust', 3, '12', 90, 70), E('elevacion-talones', 4, '20', 45, 60) ] },
  pushB: { day: 'J', name: 'Push B', focus: 'Hombros · Pecho · Tríceps', exercises: [
    E('press-militar-barra', 4, '8', 120, 30), E('press-inclinado', 4, '10', 90, 24),
    E('press-arnold', 3, '12', 75, 14), E('cruces-polea-media', 3, '15', 60, 12),
    E('press-cerrado', 3, '10', 90, 40), E('extension-triceps-mancuernas', 3, '12', 60, 12) ] },
  pullB: { day: 'V', name: 'Pull B', focus: 'Espalda · Bíceps', exercises: [
    E('peso-muerto-convencional', 4, '6', 150, 90), E('jalon-amplio', 4, '10', 90, 45),
    E('remo-t', 3, '12', 90, 30), E('pajaros-peck-deck', 3, '15', 60, 25),
    E('curl-inclinado', 3, '12', 60, 10), E('curl-martillo-cuerda', 3, '12', 60, 18) ] },
  legsB: { day: 'S', name: 'Legs B', focus: 'Isquios · Glúteos', exercises: [
    E('peso-muerto-rumano', 4, '10', 120, 60), E('sentadilla-hack', 3, '12', 120, 80),
    E('hip-thrust', 4, '12', 90, 80), E('sentadilla-bulgara', 3, '10', 75, 14),
    E('curl-femoral-pie', 3, '12', 60, 20), E('elevacion-talones', 4, '20', 45, 60) ] },

  // Upper / Lower
  upperA: { day: 'L', name: 'Upper A', focus: 'Torso completo', exercises: [
    E('press-banca-plano', 4, '8', 120, 50), E('remo-barra', 4, '10', 120, 50),
    E('press-militar-barra', 3, '10', 90, 28), E('jalon-pecho', 3, '12', 90, 40),
    E('curl-barra-z', 3, '12', 60, 22), E('pres-frances-mancuernas', 3, '12', 60, 14) ] },
  lowerA: { day: 'M', name: 'Lower A', focus: 'Piernas completas', exercises: [
    E('sentadilla-libre', 4, '8', 150, 70), E('peso-muerto-rumano', 3, '10', 120, 55),
    E('prensa-45', 3, '12', 120, 150), E('extension-cuadriceps', 3, '15', 60, 32),
    E('curl-femoral-sentado', 3, '12', 60, 28), E('elevacion-talones', 4, '20', 45, 55) ] },
  upperB: { day: 'J', name: 'Upper B', focus: 'Espalda · Bíceps · Pull', exercises: [
    E('dominadas', 4, '8', 120, 0), E('remo-hammer', 4, '10', 90, 25),
    E('press-inclinado', 3, '10', 90, 22), E('jalon-pecho', 3, '12', 90, 42),
    E('remo-banco-inclinado', 3, '12', 75, 16), E('curl-martillo', 3, '12', 60, 12) ] },
  lowerB: { day: 'V', name: 'Lower B', focus: 'Glúteos · Isquios', exercises: [
    E('peso-muerto-convencional', 4, '6', 150, 90), E('hip-thrust', 4, '12', 90, 80),
    E('sentadilla-bulgara', 3, '10', 75, 14), E('curl-femoral-pie', 3, '12', 60, 20),
    E('puente-gluteos', 3, '15', 45, 0), E('elevacion-talones', 4, '20', 45, 55) ] },

  // Bro split
  chest: { day: 'L', name: 'Pecho', focus: 'Pecho completo', exercises: [
    E('press-banca-plano', 4, '8', 120, 55), E('press-inclinado', 4, '10', 90, 24),
    E('press-plano-mancuernas', 3, '10', 90, 26), E('cruces-polea-media', 3, '12', 60, 14),
    E('peck-deck', 3, '15', 60, 40), E('fondos-pecho', 3, '10', 90, 0) ] },
  back: { day: 'M', name: 'Espalda', focus: 'Espalda completa', exercises: [
    E('dominadas', 4, '8', 120, 0), E('remo-barra', 4, '10', 120, 55),
    E('jalon-pecho', 3, '12', 90, 45), E('remo-t', 3, '12', 90, 35),
    E('remo-hammer', 3, '12', 90, 30), E('pull-over', 3, '15', 60, 18) ] },
  shoulders: { day: 'X', name: 'Hombros', focus: 'Deltoides + trapecio', exercises: [
    E('press-militar-barra', 4, '8', 120, 30), E('press-arnold', 3, '12', 75, 14),
    E('elevaciones-laterales', 4, '15', 60, 8), E('elevaciones-frontales', 3, '12', 60, 8),
    E('pajaros-mancuernas', 3, '15', 60, 6), E('encogimientos', 4, '15', 45, 24) ] },
  arms: { day: 'J', name: 'Brazos', focus: 'Bíceps · Tríceps', exercises: [
    E('curl-barra-z', 4, '10', 75, 24), E('curl-martillo', 3, '12', 60, 12),
    E('curl-predicador', 3, '12', 60, 22), E('pres-frances-z', 4, '10', 75, 22),
    E('patada-triceps-polea', 3, '15', 45, 15), E('press-cerrado', 3, '10', 90, 40) ] },
  legsBro: { day: 'V', name: 'Piernas', focus: 'Tren inferior completo', exercises: [
    E('sentadilla-libre', 4, '8', 150, 75), E('prensa-45', 4, '12', 120, 170),
    E('extension-cuadriceps', 3, '15', 60, 35), E('curl-femoral-acostado', 3, '12', 75, 30),
    E('hip-thrust', 3, '12', 90, 80), E('elevacion-talones', 4, '20', 45, 65) ] },

  // Powerlifting
  plSquat: { day: 'L', name: 'Sentadilla (Fuerza)', focus: 'Sentadilla pesada', exercises: [
    E('sentadilla-libre', 5, '5', 210, 120), E('sentadilla-frontal', 3, '6', 180, 80),
    E('prensa-45', 3, '8', 150, 200), E('curl-femoral-acostado', 3, '10', 90, 35),
    E('elevacion-talones', 3, '15', 60, 70) ] },
  plBench: { day: 'M', name: 'Press banca (Fuerza)', focus: 'Press de banca pesado', exercises: [
    E('press-banca-plano', 5, '5', 210, 100), E('press-cerrado', 3, '8', 150, 70),
    E('press-inclinado', 3, '8', 120, 40), E('fondos-paralelas', 3, '10', 90, 0),
    E('pres-frances-z', 3, '12', 75, 25) ] },
  plDead: { day: 'J', name: 'Peso muerto (Fuerza)', focus: 'Peso muerto pesado', exercises: [
    E('peso-muerto-convencional', 5, '5', 240, 150), E('remo-barra', 4, '6', 150, 70),
    E('jalon-pecho', 3, '10', 90, 50), E('buenos-dias', 3, '10', 120, 50),
    E('curl-barra-z', 3, '12', 60, 24) ] },
  plOhp: { day: 'V', name: 'OHP (Fuerza)', focus: 'Press militar pesado', exercises: [
    E('press-militar-barra', 5, '5', 180, 50), E('press-militar-mancuernas', 3, '8', 120, 22),
    E('elevaciones-laterales', 4, '15', 60, 9), E('dominadas', 3, '8', 120, 0),
    E('face-pull-hombros', 3, '15', 45, 18) ] },

  // Glúteo focus
  gluteA: { day: 'L', name: 'Glúteo A', focus: 'Glúteo + isquios', exercises: [
    E('hip-thrust', 4, '12', 120, 80), E('peso-muerto-rumano', 4, '10', 120, 55),
    E('sentadilla-sumo', 3, '12', 90, 20), E('patada-gluteos-polea', 3, '15', 60, 18),
    E('abduccion-maquina', 3, '20', 45, 40), E('frogs-pumps', 3, '20', 45, 0) ] },
  gluteB: { day: 'J', name: 'Glúteo B', focus: 'Glúteo + cuádriceps', exercises: [
    E('peso-muerto-sumo', 4, '8', 150, 70), E('sentadilla-bulgara', 4, '10', 90, 16),
    E('hip-thrust-unilateral', 3, '12', 75, 0), E('puente-gluteos', 3, '15', 60, 0),
    E('abduccion-banda', 3, '25', 45, 0), E('aduccion-maquina', 3, '15', 45, 30) ] },

  // Casa / peso corporal
  homeA: { day: 'L', name: 'Casa A', focus: 'Empuje + core', exercises: [
    E('flexiones', 4, '12', 60, 0), E('flexiones-inclinadas', 3, '12', 60, 0),
    E('fondos-paralelas', 3, '10', 75, 0), E('puente-gluteos', 3, '15', 45, 0) ] },
  homeB: { day: 'X', name: 'Casa B', focus: 'Tracción + piernas', exercises: [
    E('dominadas-asistidas', 4, '10', 90, 0), E('remo-invertido', 3, '12', 75, 0),
    E('sentadilla-goblet', 4, '15', 75, 12), E('zancadas', 3, '12', 60, 0) ] },

  // Recomp / pérdida grasa (circuitos)
  recompA: { day: 'L', name: 'Circuito A', focus: 'Full body metabólico', exercises: [
    E('sentadilla-goblet', 3, '15', 45, 16), E('press-plano-mancuernas', 3, '15', 45, 12),
    E('remo-maquina', 3, '15', 45, 30), E('elevaciones-laterales', 3, '15', 30, 5),
    E('hip-thrust', 3, '15', 45, 50) ] },
  recompB: { day: 'X', name: 'Circuito B', focus: 'Full body metabólico', exercises: [
    E('prensa-45', 3, '15', 45, 100), E('jalon-pecho', 3, '15', 45, 35),
    E('press-hombros-maquina', 3, '15', 45, 16), E('curl-femoral-sentado', 3, '15', 45, 25),
    E('patada-triceps-polea', 3, '15', 30, 12) ] },
  recompC: { day: 'V', name: 'Circuito C', focus: 'Full body metabólico', exercises: [
    E('peso-muerto-rumano', 3, '15', 60, 40), E('flexiones', 3, '15', 45, 0),
    E('remo-hammer', 3, '15', 45, 25), E('sentadilla-sumo', 3, '15', 45, 16),
    E('abduccion-maquina', 3, '20', 30, 35) ] },
};

// ── Definiciones de rutinas (≥40) ────────────────────────────────────────
// freq = días de entreno/semana. days = lista de plantillas + descansos.
const ROUTINE_DEFS = [
  // ── PRINCIPIANTE ──
  { id: 'fullbody-princ-3d', name: 'Full Body Principiante', level: 'Principiante', goal: 'Hipertrofia', weeks: 8,
    desc: 'Cuerpo completo 3 días. Ideal para arrancar y aprender los patrones básicos.',
    days: [DT.fbA, REST_DAY, DT.fbB, REST_DAY, DT.fbC, REST_DAY, REST_DAY] },
  { id: 'maquinas-princ-3d', name: 'Iniciación en Máquinas', level: 'Principiante', goal: 'Salud general', weeks: 8,
    desc: 'Solo máquinas guiadas. Mínimo riesgo, foco en técnica y constancia.',
    days: [DT.machA, REST_DAY, DT.machB, REST_DAY, DT.machA, REST_DAY, REST_DAY] },
  { id: 'fullbody-princ-2d', name: 'Full Body 2 Días', level: 'Principiante', goal: 'Salud general', weeks: 6,
    desc: 'Para agendas ocupadas. Dos sesiones full body por semana.',
    days: [DT.fbA, REST_DAY, REST_DAY, DT.fbB, REST_DAY, REST_DAY, REST_DAY] },
  { id: 'casa-peso-corporal', name: 'En Casa · Peso Corporal', level: 'Principiante', goal: 'Salud general', weeks: 6,
    desc: 'Sin equipamiento. Entrená donde estés con tu propio peso.',
    days: [DT.homeA, REST_DAY, DT.homeB, REST_DAY, DT.homeA, REST_DAY, REST_DAY] },
  { id: 'recomp-princ-3d', name: 'Recomposición Principiante', level: 'Principiante', goal: 'Recomposición', weeks: 8,
    desc: 'Circuitos metabólicos para perder grasa y ganar tono a la vez.',
    days: [DT.recompA, REST_DAY, DT.recompB, REST_DAY, DT.recompC, REST_DAY, REST_DAY] },
  { id: 'tren-inf-princ', name: 'Tren Inferior + Glúteos', level: 'Principiante', goal: 'Hipertrofia', weeks: 8,
    desc: 'Foco en piernas y glúteos para quienes recién empiezan.',
    days: [DT.gluteA, REST_DAY, DT.machA, REST_DAY, DT.gluteB, REST_DAY, REST_DAY] },
  { id: 'perdida-grasa-princ-4d', name: 'Pérdida de Grasa 4 Días', level: 'Principiante', goal: 'Pérdida de grasa', weeks: 8,
    desc: 'Cuatro circuitos semanales de alta densidad para maximizar gasto calórico.',
    days: [DT.recompA, DT.recompB, REST_DAY, DT.recompC, DT.recompA, REST_DAY, REST_DAY] },
  { id: 'upperlower-princ-4d', name: 'Upper/Lower Principiante', level: 'Principiante', goal: 'Hipertrofia', weeks: 8,
    desc: 'Introducción al torso/pierna con cargas moderadas.',
    days: [DT.upperA, DT.lowerA, REST_DAY, DT.upperB, REST_DAY, REST_DAY, REST_DAY] },

  // ── INTERMEDIO ──
  { id: 'hipertrofia-ul-int', name: 'Hipertrofia Upper/Lower', level: 'Intermedio', goal: 'Hipertrofia', weeks: 12,
    desc: 'El clásico torso/pierna 4 días. Volumen equilibrado para crecer.',
    days: [DT.upperA, DT.lowerA, REST_DAY, DT.upperB, DT.lowerB, REST_DAY, REST_DAY] },
  { id: 'upperlower-int-4d', name: 'Upper/Lower Intermedio', level: 'Intermedio', goal: 'Pérdida de grasa', weeks: 10,
    desc: 'Torso/pierna con densidad alta. Buen balance fuerza-estética.',
    days: [DT.upperA, DT.lowerA, REST_DAY, DT.upperB, DT.lowerB, REST_DAY, REST_DAY] },
  { id: 'ppl-int-6d', name: 'Push Pull Legs 6 Días', level: 'Intermedio', goal: 'Hipertrofia', weeks: 12,
    desc: 'PPL doble. Máximo volumen semanal para intermedios avanzados.',
    days: [DT.pushA, DT.pullA, DT.legsA, DT.pushB, DT.pullB, DT.legsB, REST_DAY] },
  { id: 'ppl-int-3d', name: 'Push Pull Legs 3 Días', level: 'Intermedio', goal: 'Hipertrofia', weeks: 10,
    desc: 'PPL una vuelta por semana. Frecuencia 1, intensidad alta.',
    days: [DT.pushA, REST_DAY, DT.pullA, REST_DAY, DT.legsA, REST_DAY, REST_DAY] },
  { id: 'bro-split-int', name: 'Bro Split 5 Días', level: 'Intermedio', goal: 'Hipertrofia', weeks: 10,
    desc: 'Un grupo por día. Pecho, espalda, hombros, brazos y piernas.',
    days: [DT.chest, DT.back, DT.shoulders, DT.arms, DT.legsBro, REST_DAY, REST_DAY] },
  { id: 'gluteos-foco-int', name: 'Glúteos en Foco', level: 'Intermedio', goal: 'Hipertrofia', weeks: 12,
    desc: 'Doble estímulo de glúteo semanal + torso de soporte.',
    days: [DT.gluteA, DT.upperA, REST_DAY, DT.gluteB, DT.upperB, REST_DAY, REST_DAY] },
  { id: 'recomp-int-5d', name: 'Recomposición Intermedio', level: 'Intermedio', goal: 'Recomposición', weeks: 10,
    desc: 'Combina fuerza en compuestos y circuitos metabólicos.',
    days: [DT.upperA, DT.lowerA, DT.recompB, DT.upperB, DT.recompC, REST_DAY, REST_DAY] },
  { id: 'fullbody-int-3d', name: 'Full Body Intermedio', level: 'Intermedio', goal: 'Fuerza', weeks: 10,
    desc: 'Full body 3 días con foco en progresión de compuestos.',
    days: [DT.upperA, REST_DAY, DT.lowerA, REST_DAY, DT.legsBro, REST_DAY, REST_DAY] },
  { id: 'torso-pierna-int', name: 'Torso/Pierna 5 Días', level: 'Intermedio', goal: 'Hipertrofia', weeks: 12,
    desc: 'Cinco días alternando torso y pierna para alto volumen.',
    days: [DT.upperA, DT.lowerA, DT.upperB, DT.lowerB, DT.chest, REST_DAY, REST_DAY] },
  { id: 'perdida-grasa-int', name: 'Definición Intermedio', level: 'Intermedio', goal: 'Pérdida de grasa', weeks: 8,
    desc: 'Pesas + circuitos para mantener músculo en déficit.',
    days: [DT.pushA, DT.pullA, DT.recompC, DT.legsA, DT.recompA, REST_DAY, REST_DAY] },

  // ── AVANZADO ──
  { id: 'powerlifting-av-4d', name: 'Powerlifting 4 Días', level: 'Avanzado', goal: 'Fuerza', weeks: 12,
    desc: 'Bloque de fuerza: sentadilla, banca, peso muerto y OHP pesados.',
    days: [DT.plSquat, DT.plBench, REST_DAY, DT.plDead, DT.plOhp, REST_DAY, REST_DAY] },
  { id: 'ppl-av-6d', name: 'PPL Avanzado 6 Días', level: 'Avanzado', goal: 'Hipertrofia', weeks: 12,
    desc: 'PPL de alto volumen con compuestos pesados al inicio.',
    days: [DT.pushB, DT.pullB, DT.legsB, DT.pushA, DT.pullA, DT.legsA, REST_DAY] },
  { id: 'arnold-split-av', name: 'Arnold Split 6 Días', level: 'Avanzado', goal: 'Hipertrofia', weeks: 10,
    desc: 'Pecho/espalda, hombros/brazos y piernas, dos veces por semana.',
    days: [DT.chest, DT.back, DT.shoulders, DT.arms, DT.legsBro, DT.legsB, REST_DAY] },
  { id: 'fuerza-hipertrofia-av', name: 'Fuerza + Hipertrofia', level: 'Avanzado', goal: 'Fuerza', weeks: 12,
    desc: 'Compuestos pesados los primeros días, accesorios de volumen después.',
    days: [DT.plSquat, DT.plBench, DT.plDead, DT.chest, DT.back, REST_DAY, REST_DAY] },
  { id: 'gluteo-pro-av', name: 'Glúteo Pro Avanzado', level: 'Avanzado', goal: 'Hipertrofia', weeks: 12,
    desc: 'Especialización de glúteo con peso muerto y hip thrust pesados.',
    days: [DT.gluteA, DT.legsB, DT.upperA, DT.gluteB, DT.upperB, REST_DAY, REST_DAY] },
  { id: 'espalda-pecho-av', name: 'Especialización Torso', level: 'Avanzado', goal: 'Hipertrofia', weeks: 10,
    desc: 'Doble pecho y espalda para destrabar un torso estancado.',
    days: [DT.chest, DT.back, DT.legsBro, DT.chest, DT.back, DT.shoulders, REST_DAY] },
  { id: 'atleta-av-5d', name: 'Atleta Completo', level: 'Avanzado', goal: 'Recomposición', weeks: 10,
    desc: 'Fuerza, hipertrofia y trabajo metabólico en una semana.',
    days: [DT.plSquat, DT.pushA, DT.pullA, DT.plDead, DT.recompA, REST_DAY, REST_DAY] },
  { id: 'pierna-pro-av', name: 'Piernas Pro', level: 'Avanzado', goal: 'Hipertrofia', weeks: 12,
    desc: 'Tres días de pierna semanales para máximo desarrollo del tren inferior.',
    days: [DT.legsA, DT.upperA, DT.legsB, DT.upperB, DT.legsBro, REST_DAY, REST_DAY] },
];

// Variaciones extra para llegar a 40+ (mismas plantillas, distinto split/énfasis)
const EXTRA_DEFS = [
  { id: 'fullbody-princ-alt', name: 'Full Body Express', level: 'Principiante', goal: 'Salud general', weeks: 6,
    desc: 'Sesiones cortas de cuerpo completo, 3 días.', days: [DT.fbB, REST_DAY, DT.fbC, REST_DAY, DT.fbA, REST_DAY, REST_DAY] },
  { id: 'maquinas-princ-4d', name: 'Máquinas 4 Días', level: 'Principiante', goal: 'Hipertrofia', weeks: 8,
    desc: 'Cuatro días en máquinas, torso/pierna.', days: [DT.machA, DT.machB, REST_DAY, DT.machA, DT.machB, REST_DAY, REST_DAY] },
  { id: 'home-4d', name: 'En Casa 4 Días', level: 'Principiante', goal: 'Pérdida de grasa', weeks: 6,
    desc: 'Peso corporal cuatro veces por semana.', days: [DT.homeA, DT.homeB, REST_DAY, DT.homeA, DT.homeB, REST_DAY, REST_DAY] },
  { id: 'tren-sup-princ', name: 'Tren Superior Principiante', level: 'Principiante', goal: 'Hipertrofia', weeks: 8,
    desc: 'Foco en torso para empezar a marcar la parte superior.', days: [DT.machA, REST_DAY, DT.fbB, REST_DAY, DT.machB, REST_DAY, REST_DAY] },
  { id: 'ppl-int-alt', name: 'PPL Énfasis Brazos', level: 'Intermedio', goal: 'Hipertrofia', weeks: 10,
    desc: 'PPL con día extra de brazos.', days: [DT.pushA, DT.pullA, DT.legsA, DT.arms, REST_DAY, REST_DAY, REST_DAY] },
  { id: 'ul-int-fuerza', name: 'Upper/Lower Fuerza', level: 'Intermedio', goal: 'Fuerza', weeks: 12,
    desc: 'Torso/pierna con rangos de fuerza 5-8 reps.', days: [DT.upperB, DT.lowerB, REST_DAY, DT.upperA, DT.lowerA, REST_DAY, REST_DAY] },
  { id: 'bro-split-6d-int', name: 'Bro Split + Glúteo', level: 'Intermedio', goal: 'Hipertrofia', weeks: 10,
    desc: 'Split por grupo con día extra de glúteo.', days: [DT.chest, DT.back, DT.shoulders, DT.arms, DT.legsBro, DT.gluteA, REST_DAY] },
  { id: 'recomp-int-alt', name: 'Recomp Híbrido', level: 'Intermedio', goal: 'Recomposición', weeks: 10,
    desc: 'Alterna pesas pesadas y circuitos.', days: [DT.legsBro, DT.recompA, DT.chest, DT.recompB, DT.back, REST_DAY, REST_DAY] },
  { id: 'definicion-int-6d', name: 'Definición Avanzada 6D', level: 'Intermedio', goal: 'Pérdida de grasa', weeks: 8,
    desc: 'Seis días para definición extrema controlada.', days: [DT.pushA, DT.pullA, DT.legsA, DT.recompA, DT.recompB, DT.recompC, REST_DAY] },
  { id: 'powerbuilding-av', name: 'Powerbuilding', level: 'Avanzado', goal: 'Fuerza', weeks: 12,
    desc: 'Fuerza en básicos + hipertrofia accesoria.', days: [DT.plSquat, DT.chest, DT.plDead, DT.back, DT.plBench, REST_DAY, REST_DAY] },
  { id: 'ppl-av-push2x', name: 'PPL Énfasis Empuje', level: 'Avanzado', goal: 'Hipertrofia', weeks: 12,
    desc: 'PPL con doble día de empuje para pecho y hombros.', days: [DT.pushA, DT.pullA, DT.legsA, DT.pushB, DT.shoulders, DT.legsB, REST_DAY] },
  { id: 'fullbody-av-4d', name: 'Full Body Avanzado', level: 'Avanzado', goal: 'Fuerza', weeks: 10,
    desc: 'Cuatro full body de alta intensidad y frecuencia.', days: [DT.upperA, DT.lowerA, REST_DAY, DT.upperB, DT.lowerB, REST_DAY, REST_DAY] },
  { id: 'gluteo-pierna-av-6d', name: 'Tren Inferior Pro 6D', level: 'Avanzado', goal: 'Hipertrofia', weeks: 12,
    desc: 'Especialización extrema de piernas y glúteos.', days: [DT.gluteA, DT.legsA, DT.gluteB, DT.legsB, DT.legsBro, DT.upperA, REST_DAY] },
  { id: 'atleta-hibrido-av', name: 'Híbrido Fuerza-Cardio', level: 'Avanzado', goal: 'Recomposición', weeks: 10,
    desc: 'Combina powerlifting y circuitos metabólicos.', days: [DT.plSquat, DT.recompA, DT.plBench, DT.recompB, DT.plDead, REST_DAY, REST_DAY] },
  { id: 'espalda-pro-av', name: 'Espalda Ancha Pro', level: 'Avanzado', goal: 'Hipertrofia', weeks: 10,
    desc: 'Doble día de espalda para densidad y amplitud.', days: [DT.back, DT.chest, DT.back, DT.shoulders, DT.legsBro, REST_DAY, REST_DAY] },
  { id: 'brazos-pro-av', name: 'Brazos de Acero', level: 'Avanzado', goal: 'Hipertrofia', weeks: 8,
    desc: 'Especialización de brazos con torso de soporte.', days: [DT.arms, DT.legsBro, DT.chest, DT.back, DT.arms, REST_DAY, REST_DAY] },
  { id: 'recomp-av-6d', name: 'Recomposición Avanzada', level: 'Avanzado', goal: 'Recomposición', weeks: 12,
    desc: 'Seis días combinando todos los estímulos.', days: [DT.pushB, DT.pullB, DT.legsBro, DT.gluteA, DT.upperA, DT.recompC, REST_DAY] },
];

// ── Expandir definiciones a rutinas completas con metadata ───────────────
function expandRoutine(def) {
  const days = def.days.map((d, i) => ({ ...d, id: 'd' + (i + 1), exercises: (d.exercises || []).map((e) => ({ ...e })) }));
  const trainDays = days.filter((d) => d.exercises.length > 0);
  const totalEx = trainDays.reduce((s, d) => s + d.exercises.length, 0);
  const totalSets = trainDays.reduce((s, d) => s + d.exercises.reduce((a, e) => a + e.sets, 0), 0);
  return {
    ...def,
    week: 1, totalWeeks: def.weeks,
    days,
    freq: trainDays.length,
    totalExercises: totalEx,
    totalSets,
  };
}

// 12 rutinas más para superar 50, compuestas con los DT existentes.
const MORE_DEFS = [
  { id:'fb-express-3d', name:'Full Body Express 3D', level:'Principiante', goal:'Salud general', weeks:6, desc:'Tres full body cortos para empezar.', days:[DT.fbC, REST_DAY, DT.fbA, REST_DAY, DT.fbB, REST_DAY, REST_DAY] },
  { id:'gluteo-express-p', name:'Glúteo Express Principiante', level:'Principiante', goal:'Hipertrofia', weeks:8, desc:'Foco glúteo 2 días + máquinas.', days:[DT.gluteA, REST_DAY, DT.machB, REST_DAY, DT.gluteB, REST_DAY, REST_DAY] },
  { id:'torso-maquinas-p', name:'Tren Superior en Máquinas', level:'Principiante', goal:'Hipertrofia', weeks:8, desc:'Torso en máquinas guiadas.', days:[DT.machA, REST_DAY, DT.machB, REST_DAY, DT.machA, REST_DAY, REST_DAY] },
  { id:'ppl-clasico-3d', name:'PPL Clásico 3D', level:'Intermedio', goal:'Hipertrofia', weeks:10, desc:'Push Pull Legs frecuencia 1.', days:[DT.pushB, REST_DAY, DT.pullB, REST_DAY, DT.legsB, REST_DAY, REST_DAY] },
  { id:'tp-intensivo', name:'Torso/Pierna Intensivo', level:'Intermedio', goal:'Hipertrofia', weeks:12, desc:'4 días torso/pierna.', days:[DT.upperB, DT.lowerB, REST_DAY, DT.upperA, DT.lowerA, REST_DAY, REST_DAY] },
  { id:'bro-volumen', name:'Bro Split Volumen', level:'Intermedio', goal:'Hipertrofia', weeks:10, desc:'Un grupo por día, alto volumen.', days:[DT.back, DT.chest, DT.legsBro, DT.shoulders, DT.arms, REST_DAY, REST_DAY] },
  { id:'recomp-metab', name:'Recomp Metabólico', level:'Intermedio', goal:'Recomposición', weeks:10, desc:'Pesas + circuitos.', days:[DT.upperA, DT.recompB, DT.lowerA, DT.recompC, DT.recompA, REST_DAY, REST_DAY] },
  { id:'def-5d', name:'Definición 5 Días', level:'Intermedio', goal:'Pérdida de grasa', weeks:8, desc:'Densidad alta para definir.', days:[DT.pushA, DT.pullA, DT.recompA, DT.legsA, DT.recompC, REST_DAY, REST_DAY] },
  { id:'powerbuild-pro', name:'Powerbuilding Pro', level:'Avanzado', goal:'Fuerza', weeks:12, desc:'Básicos pesados + accesorios.', days:[DT.plSquat, DT.back, DT.plBench, DT.shoulders, DT.plDead, REST_DAY, REST_DAY] },
  { id:'arnold-pro', name:'Arnold Split Pro', level:'Avanzado', goal:'Hipertrofia', weeks:12, desc:'6 días estilo Arnold.', days:[DT.chest, DT.back, DT.shoulders, DT.arms, DT.legsBro, DT.legsB, REST_DAY] },
  { id:'ppl-av-6d-2', name:'PPL Avanzado 6D', level:'Avanzado', goal:'Hipertrofia', weeks:12, desc:'PPL doble alta intensidad.', days:[DT.pushA, DT.pullA, DT.legsA, DT.pushB, DT.pullB, DT.legsB, REST_DAY] },
  { id:'hibrido-atleta', name:'Híbrido Atleta', level:'Avanzado', goal:'Recomposición', weeks:10, desc:'Fuerza + metabólico.', days:[DT.plSquat, DT.recompA, DT.plDead, DT.recompB, DT.chest, REST_DAY, REST_DAY] },
];

// Técnicas avanzadas: superseries y drop sets en intermedio/avanzado.
function tnApplyTechniques(r) {
  if (r.level === 'Principiante') return r;
  r.days.forEach((d) => {
    const exs = d.exercises || [];
    if (exs.length < 2) return;
    const a = exs[exs.length - 2], b = exs[exs.length - 1];
    const exB = (typeof findExercise === 'function') ? findExercise(b.id) : null;
    a.technique = 'Superserie ⮕ encadenar con el siguiente sin descanso';
    b.technique = 'Superserie (2º ejercicio). Descansá recién al terminar ambos';
    if (r.level === 'Avanzado' && exs[2]) exs[2].technique = 'Drop set en la última serie: bajá 20% el peso y seguí al fallo';
    else if (r.level === 'Intermedio' && exs[3]) exs[3].technique = 'Última serie al fallo (RPE 10)';
  });
  return r;
}

// Templates seleccionables por el entrenador (≥50). NO se precargan como datos:
// se clonan a la base cuando el entrenador los asigna o los usa de base.
const ROUTINE_TEMPLATES = [...ROUTINE_DEFS, ...EXTRA_DEFS, ...MORE_DEFS].map(expandRoutine).map(tnApplyTechniques);
const ROUTINES = [];
function tnSetRoutines(arr) { ROUTINES.length = 0; arr.forEach((r) => ROUTINES.push(r)); }
function findRoutine(id) { return ROUTINES.find((r) => r.id === id); }

// Build a "live" routine instance for display: week flags + done/today.
function resolveRoutine(rid) {
  const base = findRoutine(rid);
  if (!base) return null;
  const active = JSON.parse(JSON.stringify(base));
  const ti = (typeof todayIdx === 'function') ? todayIdx() : 3;
  active.days.forEach((d, i) => { d.done = i < ti && d.exercises.length > 0; d.today = i === ti; });
  return active;
}

Object.assign(window, { ROUTINES, ROUTINE_TEMPLATES, findRoutine, expandRoutine, resolveRoutine, tnSetRoutines });
