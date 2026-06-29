// Trainer Nico — shared data + design tokens.
// EXERCISES now come from the REAL Drive library (library.jsx → window.LIBRARY).

const T = {
  bg: '#0A0A0A',
  surface: '#141414',
  surface2: '#1A1A1A',
  surface3: '#222222',
  border: '#1F1F1F',
  border2: '#2A2A2A',

  // Accent — turquesa celeste
  accent: '#2EE6D5',
  accentDim: '#7FF1E5',
  accentSoft: 'rgba(46,230,213,0.12)',
  accentSoft2: 'rgba(46,230,213,0.22)',
  accentText: '#6FF0E1',

  text: '#FAFAFA',
  textDim: '#A8A8A8',
  textMuted: '#6B6B6B',

  red: '#FF5247',
  warn: '#FFB020',
  blue: '#5BA8FF',
  purple: '#C46BFF',
  pink: '#FF5BA8',
};

const FONT = '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
const MONO = '"JetBrains Mono", "SF Mono", Menlo, monospace';

// ── Real exercise catalog from Nico's Drive (≈95 exercises w/ infographics) ──
// Filled from Supabase at boot (in-place mutation keeps all references live).
const EXERCISES = [];
function tnSetExercises(arr) { EXERCISES.length = 0; arr.forEach((e) => EXERCISES.push(e)); }

const GROUPS = ['Pecho', 'Espalda', 'Hombros', 'Bíceps', 'Tríceps', 'Cuádriceps', 'Isquios', 'Glúteos', 'Gemelos'];
const EQUIPMENT = ['Barra', 'Mancuernas', 'Máquina', 'Polea', 'Peso corporal'];
const LEVELS = ['Principiante', 'Intermedio', 'Avanzado'];

const groupColor = (g) => ({
  'Pecho': '#FF5247', 'Espalda': '#5BA8FF', 'Hombros': '#FFB020',
  'Bíceps': '#C46BFF', 'Tríceps': '#FF8A47',
  'Cuádriceps': '#2EE6D5', 'Isquios': '#7BE0D0', 'Glúteos': '#FF5BA8',
  'Gemelos': '#00E0C4',
}[g] || '#FAFAFA');

// Students — filled from Supabase per logged-in trainer (empezar de cero).
const STUDENTS = [];
function tnSetStudents(arr) { STUDENTS.length = 0; arr.forEach((s) => STUDENTS.push(s)); }

// The active demo routine (Lucía) is resolved from the routine library at
// load time — see app-routines.jsx. ROUTINE is set there. Fallback empty here.
let ROUTINE = { name: '', week: 6, totalWeeks: 12, days: [] };
function setActiveRoutine(r) { ROUTINE = r; window.ROUTINE = r; }

const NUTRITION = {
  calories: 1980,
  protein: 140, carbs: 210, fat: 60,
  meals: [
    { id: 'm1', time: '07:30', name: 'Desayuno',     kcal: 480, p: 32, c: 58, f: 12, items: ['Avena 80g','Whey 30g','Banana','Mantequilla maní 15g'] },
    { id: 'm2', time: '11:00', name: 'Media mañana', kcal: 220, p: 18, c: 22, f: 6,  items: ['Yogur griego 200g','Frutos rojos 100g'] },
    { id: 'm3', time: '13:30', name: 'Almuerzo',     kcal: 640, p: 46, c: 74, f: 20, items: ['Pollo 180g','Arroz integral 100g','Brócoli','Aceite oliva 1cda'] },
    { id: 'm4', time: '17:00', name: 'Merienda',     kcal: 280, p: 22, c: 28, f: 8,  items: ['Tostadas integrales 2u','Atún 80g','Tomate'] },
    { id: 'm5', time: '20:30', name: 'Cena',         kcal: 360, p: 22, c: 28, f: 14, items: ['Salmón 150g','Quinoa 70g','Ensalada verde'] },
  ],
};

const PROGRESS = {
  weight:    [63.5,63.2,62.9,62.8,62.4,62.3,62.2,62.1],
  volume:    [12400,13200,13800,14100,14600,15200,15800,16400],
  adherence: [85,88,90,87,92,94,90,92],
  prs: [
    { ex: 'Press de banca plano', value: '60 kg × 5', when: 'S5' },
    { ex: 'Sentadilla libre',     value: '85 kg × 6', when: 'S4' },
    { ex: 'Dominadas',            value: '+8 kg × 5', when: 'S6' },
    { ex: 'Peso muerto rumano',   value: '70 kg × 8', when: 'S6' },
  ],
};

function findExercise(id) { return EXERCISES.find((e) => e.id === id); }
function findStudent(id) { return STUDENTS.find((s) => String(s.id) === String(id)); }
function todayIdx() { return 3; } // Thursday, fixed for the demo

Object.assign(window, {
  T, FONT, MONO,
  EXERCISES, GROUPS, EQUIPMENT, LEVELS,
  STUDENTS, NUTRITION, PROGRESS,
  groupColor, findExercise, findStudent, todayIdx,
  setActiveRoutine, tnSetExercises, tnSetStudents,
  driveImg: (typeof driveImg !== 'undefined' ? driveImg : (id, w = 1200) => `https://lh3.googleusercontent.com/d/${id}=w${w}`),
});
