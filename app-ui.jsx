// Trainer Nico — state store, hash router, responsive hook, shared UI.
// Persists to localStorage so the app survives reload.

const STORE_KEY = 'tn-store-v2';

function defaultState() {
  return {
    role: null,        // 'admin' | 'alumno' | null
    studentId: 1,      // when role === 'alumno'

    // Workout: per-day, per-exercise: { setsDone: number, log: [{reps,kg,rpe,done}] }
    workout: {},       // workout[dayId][exerciseId] = { setsDone, log }

    // Nutrition: which meals are checked off today
    meals: { m1: true, m2: true, m3: true, m4: false, m5: false },

    bodyWeight: 62.1,

    // Per-student overrides (admin edits): notes, weight, routineId
    studentOverrides: {},  // { [id]: { note?, weight?, routineId? } }

    // Students created from the panel (persisted, merged into STUDENTS on load)
    customStudents: [],

    // Per-student logged body weight history
    weightLog: {},         // { [id]: [kg, ...] }

    // Custom routine days (admin edits add/remove)
    customDayExs: {},      // { [dayId]: [{id, sets, reps, rest, weight}] | null }

    // Admin
    selectedStudentId: 1,
    adminFilter: 'Todos',

    // Catalog
    catGroup: 'Todos',
    catLevel: 'Todos',
    catEquip: 'Todos',
    catSearch: '',
    catSelected: [],

    // Routine builder
    builderDayIdx: 3,
  };
}

let _state = (() => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch { return defaultState(); }
})();
const _listeners = new Set();

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(_state)); } catch {}
}

function setStore(updater) {
  const patch = typeof updater === 'function' ? updater(_state) : updater;
  _state = { ..._state, ...patch };
  persist();
  _listeners.forEach((l) => l());
}

function getStore() { return _state; }

// Merge panel-created students into the global STUDENTS array on load so all
// existing STUDENTS.map() call sites pick them up (id-deduped).
function hydrateCustomStudents() {
  if (typeof STUDENTS === 'undefined' || !Array.isArray(_state.customStudents)) return;
  _state.customStudents.forEach((cs) => {
    if (!STUDENTS.some((s) => s.id === cs.id)) STUDENTS.push(cs);
  });
}
if (typeof STUDENTS !== 'undefined') hydrateCustomStudents();

// Create a new student from the admin panel.
function addStudent(data) {
  const id = (STUDENTS.reduce((m, s) => Math.max(m, s.id), 0) || 0) + 1;
  const colors = ['#2EE6D5', '#FFB020', '#5BA8FF', '#C46BFF', '#FF5BA8', '#FF8A47'];
  const initials = (data.name || '?').split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
  const student = {
    id, name: data.name, initials,
    age: data.age || 25, goal: data.goal || 'Hipertrofia', level: data.level || 'Principiante',
    adherence: 100, lastCheckIn: 'Recién creado', weight: data.weight || 70, weightDelta: 0,
    color: colors[id % colors.length], note: data.note || '', routineId: data.routineId || 'fullbody-princ-3d',
  };
  STUDENTS.push(student);
  setStore((s) => ({ customStudents: [...(s.customStudents || []), student] }));
  return student;
}

// Log a body-weight entry for a student.
function logWeight(studentId, kg) {
  setStore((s) => ({
    weightLog: { ...s.weightLog, [studentId]: [...((s.weightLog || {})[studentId] || []), kg] },
    bodyWeight: studentId === s.studentId ? kg : s.bodyWeight,
  }));
}

function resetStore() {
  _state = defaultState();
  persist();
  _listeners.forEach((l) => l());
}

function useStore(selector = (s) => s) {
  const sel = React.useRef(selector); sel.current = selector;
  return React.useSyncExternalStore(
    (cb) => { _listeners.add(cb); return () => _listeners.delete(cb); },
    () => sel.current(_state),
    () => sel.current(_state),
  );
}

// Workout helpers
function getDoneSets(dayId, exerciseId) {
  const w = _state.workout[dayId] || {};
  return w[exerciseId]?.setsDone || 0;
}
function incrementSet(dayId, exerciseId, total) {
  setStore((s) => {
    const day = { ...(s.workout[dayId] || {}) };
    const cur = day[exerciseId] || { setsDone: 0, log: [] };
    if (cur.setsDone >= total) return {};
    day[exerciseId] = { ...cur, setsDone: cur.setsDone + 1 };
    return { workout: { ...s.workout, [dayId]: day } };
  });
}
function decrementSet(dayId, exerciseId) {
  setStore((s) => {
    const day = { ...(s.workout[dayId] || {}) };
    const cur = day[exerciseId] || { setsDone: 0, log: [] };
    if (cur.setsDone <= 0) return {};
    day[exerciseId] = { ...cur, setsDone: cur.setsDone - 1 };
    return { workout: { ...s.workout, [dayId]: day } };
  });
}
function resetDay(dayId) {
  setStore((s) => ({ workout: { ...s.workout, [dayId]: {} } }));
}
function toggleMeal(mealId) {
  setStore((s) => ({ meals: { ...s.meals, [mealId]: !s.meals[mealId] } }));
}

// Student field overrides (note, weight)
function getStudentField(id, field) {
  const ov = _state.studentOverrides[id];
  if (ov && ov[field] != null) return ov[field];
  const s = findStudent(id);
  return s ? s[field] : undefined;
}
function setStudentField(id, field, value) {
  setStore((s) => ({
    studentOverrides: {
      ...s.studentOverrides,
      [id]: { ...(s.studentOverrides[id] || {}), [field]: value },
    },
  }));
}

// Day exercises with custom overrides
function getDayExercises(dayId) {
  const override = _state.customDayExs[dayId];
  if (override) return override;
  const day = ROUTINE.days.find((d) => d.id === dayId);
  return day ? day.exercises : [];
}
function setDayExercises(dayId, exs) {
  setStore((s) => ({ customDayExs: { ...s.customDayExs, [dayId]: exs } }));
}
function removeDayExercise(dayId, exId) {
  const cur = getDayExercises(dayId);
  setDayExercises(dayId, cur.filter((e) => e.id !== exId));
}
function addDayExercise(dayId, exId) {
  const cur = getDayExercises(dayId);
  if (cur.some((e) => e.id === exId)) return false; // already there
  setDayExercises(dayId, [...cur, { id: exId, sets: 3, reps: '10', rest: 90, weight: 0 }]);
  return true;
}

// ─────────────────────────────────────────────────────────────
// Hash router
// ─────────────────────────────────────────────────────────────
function useRoute() {
  const [hash, setHash] = React.useState(() => location.hash || '');
  React.useEffect(() => {
    const on = () => setHash(location.hash || '');
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}
function navigate(hash) {
  if (location.hash !== hash) location.hash = hash;
}

// ─────────────────────────────────────────────────────────────
// Responsive hook
// ─────────────────────────────────────────────────────────────
function useViewport() {
  const [w, setW] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return { width: w, isMobile: w < 900, isNarrow: w < 1180 };
}

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const Icon = {
  home: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3l8 6.5V18a1 1 0 01-1 1h-4v-6h-6v6H4a1 1 0 01-1-1V9.5z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  dumbbell: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="2" y="8" width="3" height="6" rx="1" stroke={c} strokeWidth="1.6"/><rect x="17" y="8" width="3" height="6" rx="1" stroke={c} strokeWidth="1.6"/><path d="M5 11h12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  chart: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M3 17l5-6 4 3 7-9" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="5" r="1.5" fill={c}/></svg>,
  apple: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M11 4c4 0 7 3 7 7 0 5-4 9-7 9s-7-4-7-9c0-4 3-7 7-7z" stroke={c} strokeWidth="1.6"/><path d="M11 9v6M8 12h6" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  user: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="3.5" stroke={c} strokeWidth="1.6"/><path d="M4 19c0-3 3-5 7-5s7 2 7 5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  users: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.6"/><path d="M3 19c0-3 3-5 6-5s6 2 6 5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><circle cx="16" cy="6.5" r="2.5" stroke={c} strokeWidth="1.6"/><path d="M14 14c4 0 6 1.5 6 4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  grid: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.6"/><rect x="12" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.6"/><rect x="3" y="12" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.6"/><rect x="12" y="12" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.6"/></svg>,
  cal: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="15" rx="2" stroke={c} strokeWidth="1.6"/><path d="M3 9h16M7 4v3M15 4v3" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  chat: (c = 'currentColor') => <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M3 4h16v10a1 1 0 01-1 1H8l-5 4v-4H4a1 1 0 01-1-1V4z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  bell: (c = 'currentColor') => <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5a4 4 0 00-4 4v3l-2 3h12l-2-3v-3a4 4 0 00-4-4z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 14.5a2 2 0 004 0" stroke={c} strokeWidth="1.5"/></svg>,
  search: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.2" stroke={c} strokeWidth="1.6"/><path d="M9.5 9.5L13 13" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  plus: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
  check: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev: (c = 'currentColor') => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  play: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3.5 2v10l8-5-8-5z" fill={c}/></svg>,
  pause: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="2.5" width="3" height="9" rx="1" fill={c}/><rect x="8" y="2.5" width="3" height="9" rx="1" fill={c}/></svg>,
  more: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="3" cy="7" r="1.1" fill={c}/><circle cx="7" cy="7" r="1.1" fill={c}/><circle cx="11" cy="7" r="1.1" fill={c}/></svg>,
  logout: (c = 'currentColor') => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 4l4 4-4 4M14 8H6" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  dot: (c = 'currentColor') => <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill={c}/></svg>,
  flame: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1c2 2 2 4 0 5-2 1-3 3-2 5 .5 2 3 2 4 0 .5-1 .5-3-1-4 3 1 4 4 2 6-2 2-7 2-8-1-1-3 1-6 3-8 1-1 2-2 2-3z" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  star: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z" fill={c}/></svg>,
  x: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  menu: (c = 'currentColor') => <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 5h12M3 9h12M3 13h12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  trash: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5 3.5V2h4v1.5M3.5 3.5l.5 8a1 1 0 001 1h4a1 1 0 001-1l.5-8" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  filter: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M3 7h8M5 11h4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  tip: (c = 'currentColor') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.5" stroke={c} strokeWidth="1.4"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M3 3l1.5 1.5M9.5 9.5L11 11M3 11l1.5-1.5M9.5 4.5L11 3" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  ext: (c = 'currentColor') => <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M6 1h4v4M10 1L5 6M5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// Shared visual primitives
// ─────────────────────────────────────────────────────────────
function Card({ children, style, padding = 16, className = '' }) {
  return (
    <div className={`tn-card ${className}`} style={{
      background: T.surface, border: `1px solid ${T.border2}`,
      borderRadius: 16, padding, ...style,
    }}>{children}</div>
  );
}

function Btn({ children, primary, ghost, danger, sm, icon, onClick, disabled, full, style = {} }) {
  const padding = sm ? '6px 10px' : '9px 14px';
  const fontSize = sm ? 11 : 13;
  let bg = T.surface, color = T.text, border = T.border2;
  if (primary) { bg = T.accent; color = '#0A0A0A'; border = 'transparent'; }
  else if (ghost) { bg = 'transparent'; color = T.text; border = 'transparent'; }
  else if (danger) { bg = 'transparent'; color = T.red; border = T.red + '55'; }
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, color, border: `1px solid ${border}`, borderRadius: 10,
      padding, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
      fontFamily: FONT, fontSize, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      whiteSpace: 'nowrap', width: full ? '100%' : undefined, justifyContent: full ? 'center' : undefined,
      transition: 'background .12s, transform .08s', ...style,
    }}>{icon}{children}</button>
  );
}

function Chip({ children, accent, color, style }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.6,
      color: accent ? T.accentText : color || T.textDim,
      background: accent ? T.accentSoft : T.surface2,
      border: `1px solid ${accent ? 'transparent' : T.border2}`,
      padding: '4px 8px', borderRadius: 5, display: 'inline-block', lineHeight: 1.2, ...style,
    }}>{children}</span>
  );
}

function Stat({ label, value, unit, delta, color = T.text }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color, letterSpacing: -0.5 }}>{value}</span>
        {unit && <span style={{ fontFamily: MONO, fontSize: 11, color: T.textDim }}>{unit}</span>}
      </div>
      {delta != null && (
        <div style={{ fontFamily: MONO, fontSize: 10, marginTop: 2, color: delta < 0 ? T.accent : delta > 0 ? T.accent : T.textDim }}>
          {delta > 0 ? '+' : ''}{delta}
        </div>
      )}
    </div>
  );
}

function Ring({ size = 100, stroke = 9, value = 50, color = T.accent, track = 'rgba(255,255,255,0.06)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// Sparkline / area chart
function LineChart({ data, color = T.accent, height = 90, fill = true }) {
  const W = 320, H = height;
  if (!data || !data.length) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - ((v - min) / span) * (H - 16) - 8]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD = `${d} L${W},${H} L0,${H} Z`;
  const gid = 'g-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {fill && (<>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${gid})`} />
      </>)}
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.length && (() => {
        const [x, y] = pts[pts.length - 1];
        return (<g><circle cx={x} cy={y} r="6" fill={color} fillOpacity="0.2" /><circle cx={x} cy={y} r="3" fill={color} /></g>);
      })()}
    </svg>
  );
}

function BarChart({ data, color = T.accent, height = 90 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', gap: 5, height, alignItems: 'flex-end' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? color : `${color}55`, borderRadius: 3,
        }} />
      ))}
    </div>
  );
}

// Small image that fades in and falls back to an initials tile on error.
function ExImg({ ex, style, cover = true, alt }) {
  const c = groupColor(ex.group);
  const initials = ex.es.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const [err, setErr] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  if (err || !ex.img) {
    return (
      <div style={{
        ...style, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${c}33, ${T.surface2})`,
        fontFamily: FONT, fontWeight: 900, color: c, letterSpacing: -1,
        fontSize: (style && style.width && parseInt(style.width) < 60) ? 14 : 40,
      }}>{initials}</div>
    );
  }
  return (
    <div style={{ ...style, position: 'relative', overflow: 'hidden', background: T.surface2 }}>
      {!loaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 900, color: c, opacity: 0.4 }}>{initials}</div>}
      <img src={ex.img} alt={alt || ex.es}
        onError={() => setErr(true)} onLoad={() => setLoaded(true)}
        style={{ width: '100%', height: '100%', objectFit: cover ? 'cover' : 'contain',
          objectPosition: 'center top', display: 'block',
          opacity: loaded ? 1 : 0, transition: 'opacity .3s' }} />
    </div>
  );
}

// Exercise tile — REAL Drive infographic with metadata overlay.
function ExerciseTile({ ex, height = 180, big = false, compact = false }) {
  if (!ex) return null;
  const c = groupColor(ex.group);
  if (compact) {
    return <ExImg ex={ex} style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, border: `1px solid ${T.border2}` }} />;
  }
  return (
    <div style={{
      width: '100%', height, position: 'relative', overflow: 'hidden',
      borderRadius: 14, background: T.surface2, border: `1px solid ${T.border2}`,
    }}>
      <ExImg ex={ex} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      {/* legibility gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, transparent 28%, transparent 55%, rgba(10,10,10,0.88) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <Chip color={c} style={{ background: `${c}22`, border: 'none', backdropFilter: 'blur(4px)' }}>{ex.group}</Chip>
        <Chip style={{ background: 'rgba(20,20,20,0.7)', backdropFilter: 'blur(4px)' }}>{ex.equipment}</Chip>
      </div>
      <div style={{
        position: 'absolute', left: 14, right: 14, bottom: 12,
        fontFamily: FONT, fontSize: big ? 22 : 16, fontWeight: 700,
        color: T.text, letterSpacing: -0.3, lineHeight: 1.15,
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
      }}>
        {ex.es}
        {ex.en && <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 400, color: T.textDim, marginTop: 4 }}>{ex.en}</div>}
      </div>
    </div>
  );
}

// Avatar — initials with gradient based on student.color
function Avatar({ student, size = 36 }) {
  if (!student) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: `linear-gradient(135deg, ${student.color}, ${student.color}88)`,
      color: '#0A0A0A', fontFamily: FONT, fontWeight: 700,
      fontSize: size * 0.38, letterSpacing: -0.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>{student.initials}</div>
  );
}

Object.assign(window, {
  setStore, getStore, useStore, resetStore,
  getDoneSets, incrementSet, decrementSet, resetDay, toggleMeal,
  getStudentField, setStudentField,
  getDayExercises, setDayExercises, removeDayExercise, addDayExercise,
  addStudent, logWeight,
  useRoute, navigate, useViewport,
  Icon, Card, Btn, Chip, Stat, Ring, LineChart, BarChart, ExerciseTile, ExImg, Avatar,
  toast, useToasts, ToastHost, Modal,
  startRest, addRest, stopRest, useRest, RestTimerHost,
});

// ─────────────────────────────────────────────────────────────
// Toast / Modal — global feedback
// ─────────────────────────────────────────────────────────────
const _toastListeners = new Set();
let _toasts = [];
let _toastId = 0;
function toast(message, opts = {}) {
  const id = ++_toastId;
  _toasts = [..._toasts, { id, message, kind: opts.kind || 'info' }];
  _toastListeners.forEach((l) => l());
  setTimeout(() => {
    _toasts = _toasts.filter((t) => t.id !== id);
    _toastListeners.forEach((l) => l());
  }, opts.duration || 2400);
}
function useToasts() {
  return React.useSyncExternalStore(
    (cb) => { _toastListeners.add(cb); return () => _toastListeners.delete(cb); },
    () => _toasts,
    () => _toasts,
  );
}
function ToastHost() {
  const list = useToasts();
  return (
    <div style={{
      position: 'fixed', bottom: 'max(80px, env(safe-area-inset-bottom, 20px))',
      left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none',
      maxWidth: 'calc(100vw - 32px)',
    }}>
      {list.map((t) => (
        <div key={t.id} style={{
          background: t.kind === 'error' ? '#3A1414' : t.kind === 'success' ? '#0F2A24' : T.surface,
          border: `1px solid ${t.kind === 'error' ? T.red + '55' : t.kind === 'success' ? T.accent + '55' : T.border2}`,
          color: T.text, padding: '10px 16px', borderRadius: 12,
          fontFamily: FONT, fontSize: 13, fontWeight: 500,
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          animation: 'tn-toast-in .2s ease-out',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ color: t.kind === 'error' ? T.red : t.kind === 'success' ? T.accent : T.accent, fontSize: 16, lineHeight: 1 }}>
            {t.kind === 'error' ? '⚠' : t.kind === 'success' ? '✓' : '•'}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Modal({ open, title, children, onClose, actions, width = 460 }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      animation: 'tn-toast-in .15s ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: width, background: T.bg, color: T.text,
        border: `1px solid ${T.border2}`, borderRadius: 16, fontFamily: FONT,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
      }}>
        <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>{title}</div>
          <button onClick={onClose} aria-label="Cerrar" style={{
            width: 28, height: 28, borderRadius: 7, background: 'transparent', border: 'none', color: T.textDim,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.x()}</button>
        </div>
        <div style={{ padding: 20, overflow: 'auto', flex: 1 }}>{children}</div>
        {actions && <div style={{ padding: '12px 20px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{actions}</div>}
      </div>
    </div>
  );
}

// Inject toast animation keyframes once.
if (typeof document !== 'undefined' && !document.getElementById('tn-anim')) {
  const s = document.createElement('style'); s.id = 'tn-anim';
  s.textContent = '@keyframes tn-toast-in { from { opacity: 0; transform: translate(-50%, 12px); } to { opacity: 1; transform: translate(-50%, 0); } }';
  document.head.appendChild(s);
}

// ─────────────────────────────────────────────────────────────
// Rest timer — global countdown overlay between sets
// ─────────────────────────────────────────────────────────────
const _restListeners = new Set();
let _rest = null; // { total, ends }
let _restTick = null;
function _emitRest() { _restListeners.forEach((l) => l()); }
function startRest(seconds) {
  if (!seconds || seconds < 1) return;
  _rest = { total: seconds, ends: Date.now() + seconds * 1000 };
  _emitRest();
  if (_restTick) clearInterval(_restTick);
  _restTick = setInterval(() => {
    if (!_rest) { clearInterval(_restTick); _restTick = null; return; }
    if (Date.now() >= _rest.ends) { _beep(); stopRest(); }
    else _emitRest();
  }, 250);
}
function addRest(sec) { if (_rest) { _rest = { ..._rest, ends: _rest.ends + sec * 1000, total: _rest.total + sec }; _emitRest(); } }
function stopRest() { _rest = null; if (_restTick) { clearInterval(_restTick); _restTick = null; } _emitRest(); }
function _beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    o.start(); o.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}
function useRest() {
  return React.useSyncExternalStore(
    (cb) => { _restListeners.add(cb); return () => _restListeners.delete(cb); },
    () => _rest, () => _rest,
  );
}
function RestTimerHost() {
  const rest = useRest();
  if (!rest) return null;
  const remaining = Math.max(0, Math.ceil((rest.ends - Date.now()) / 1000));
  const pct = Math.max(0, Math.min(100, ((rest.ends - Date.now()) / (rest.total * 1000)) * 100));
  const mm = Math.floor(remaining / 60), ss = remaining % 60;
  return (
    <div style={{
      position: 'fixed', bottom: 'max(86px, calc(env(safe-area-inset-bottom, 0px) + 86px))',
      left: '50%', transform: 'translateX(-50%)', zIndex: 900, width: 'min(440px, calc(100vw - 32px))',
      background: T.surface, border: `1px solid ${T.accent}55`, borderRadius: 16,
      boxShadow: '0 16px 40px rgba(0,0,0,0.6)', padding: 14,
      display: 'flex', alignItems: 'center', gap: 14, animation: 'tn-toast-in .2s ease-out',
    }}>
      <Ring size={48} stroke={5} value={pct} color={T.accent}>
        <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: T.text }}>{remaining}</div>
      </Ring>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: T.accentText, textTransform: 'uppercase', letterSpacing: 1 }}>Descanso</div>
        <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: -0.5 }}>{mm}:{String(ss).padStart(2, '0')}</div>
      </div>
      <button onClick={() => addRest(15)} style={{
        background: T.surface2, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9,
        padding: '8px 12px', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600,
      }}>+15s</button>
      <button onClick={stopRest} style={{
        background: T.accent, border: 'none', color: '#0A0A0A', borderRadius: 9,
        padding: '8px 14px', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 700,
      }}>Saltar</button>
    </div>
  );
}
