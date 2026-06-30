// Trainer Nico — arranque: auth real (Supabase) + carga de datos + gate.
// Reemplaza el login de demo. Root decide: AuthScreen o la app según sesión.

// ── Data version bus (re-render tras cargas/cambios) ──────────
const _dataListeners = new Set();
let _dataVersion = 0;
function bumpData() { _dataVersion++; _dataListeners.forEach((l) => l()); }
function useDataVersion() {
  return React.useSyncExternalStore(
    (cb) => { _dataListeners.add(cb); return () => _dataListeners.delete(cb); },
    () => _dataVersion, () => _dataVersion,
  );
}

// ── Bootstrap: cargar datos del usuario logueado ──────────────
let TN_CTX = { uid: null, role: null, profile: null, studentId: null };

async function bootstrapTrainer(uid) {
  const [exs, students, routines, nutrition] = await Promise.all([
    dbLoadExercises(), dbLoadStudents(uid), dbLoadRoutines(uid), dbLoadNutrition(uid),
  ]);
  tnSetExercises(exs);
  tnSetStudents(students);
  tnSetRoutines(routines);
  window.TN_NUTRITION_PLANS = nutrition;
  bumpData();
}

async function bootstrapStudent(uid, email) {
  const exs = await dbLoadExercises();
  tnSetExercises(exs);
  // Vincular la ficha del alumno con esta cuenta (match por email) la 1ª vez.
  try { if (email) await dbClaimStudent(email); } catch (e) { console.warn('claim', e); }
  // Find the student row linked to this user.
  const { data: rows } = await sb.from('tn_students').select('*').eq('user_id', uid).limit(1);
  const row = rows && rows[0];
  if (!row) { tnSetStudents([]); tnSetRoutines([]); bumpData(); return; }
  const stu = studentRowToObj(row);
  tnSetStudents([stu]);
  // Load assigned routine (RLS lets the student read it).
  if (row.current_routine_id) {
    const { data: r } = await sb.from('tn_routines').select('*').eq('id', row.current_routine_id).maybeSingle();
    if (r) {
      const { data: days } = await sb.from('tn_routine_days').select('*').eq('routine_id', r.id).order('idx');
      const dayIds = (days || []).map((d) => d.id);
      let items = [];
      if (dayIds.length) { const { data: it } = await sb.from('tn_routine_items').select('*').in('day_id', dayIds).order('idx'); items = it || []; }
      const rdays = (days || []).map((d) => ({ id: d.id, day: d.day_label, name: d.name, focus: d.focus, idx: d.idx,
        exercises: items.filter((i) => i.day_id === d.id).map((i) => ({ id: i.exercise_id, sets: i.sets, reps: i.reps, rest: i.rest, weight: i.weight, technique: i.technique || '' })) }));
      tnSetRoutines([{ id: r.id, name: r.name, level: r.level, goal: r.goal, weeks: r.weeks, totalWeeks: r.weeks, week: 1, desc: r.description || '', days: rdays }]);
    }
  } else { tnSetRoutines([]); }
  // Weight history → drives the progress chart.
  const w = await dbLoadWeights(stu.id);
  setStore({ studentId: stu.id, bodyWeight: w.length ? w[w.length - 1] : (stu.weight || 70), weightLog: { [stu.id]: w } });
  bumpData();
}

// ── Acciones DB (reemplazan helpers de demo) ──────────────────
async function tnAddStudentDB(data) {
  const st = await dbAddStudent(TN_CTX.uid, data);
  STUDENTS.push(st); bumpData();
  return st;
}
async function tnAssignRoutineDB(studentId, routineId) {
  await dbAssignRoutine(studentId, routineId);
  const s = findStudent(studentId); if (s) s.routineId = routineId;
  bumpData();
}
async function tnSaveNoteDB(studentId, note) {
  await dbUpdateStudent(studentId, { note });
  const s = findStudent(studentId); if (s) s.note = note;
  bumpData();
}
async function tnLogWeightDB(studentId, kg) {
  await dbLogWeight(studentId, kg);
  const s = findStudent(studentId); if (s) s.weight = kg;
  const log = (getStore().weightLog || {})[studentId] || [];
  setStore((st) => ({ bodyWeight: studentId === st.studentId ? kg : st.bodyWeight, weightLog: { ...st.weightLog, [studentId]: [...log, kg] } }));
  bumpData();
}
// Crear acceso (cuenta + contraseña) para un alumno y devolver credenciales.
async function tnCreateAccessDB(studentId) {
  const { data, error } = await sb.functions.invoke('create-student-access', { body: { student_id: studentId } });
  if (error) {
    let msg = error.message || 'Error creando acceso';
    try { const ctx = await error.context?.json(); if (ctx && ctx.error) msg = ctx.error; } catch (e) {}
    throw new Error(msg);
  }
  if (data && data.error) throw new Error(data.error);
  return data; // { email, password, name }
}

// ── Acciones DB (reemplazan helpers de demo) ──────────────────
async function tnCreateRoutineDB(routine) {
  const id = await dbCreateRoutine(TN_CTX.uid, routine);
  const fresh = await dbLoadRoutines(TN_CTX.uid);
  tnSetRoutines(fresh); bumpData();
  return id;
}
async function tnDeleteRoutineDB(id) {
  await dbDeleteRoutine(id);
  tnSetRoutines(ROUTINES.filter((r) => r.id !== id)); bumpData();
}
async function tnReloadRoutines() {
  const fresh = await dbLoadRoutines(TN_CTX.uid);
  tnSetRoutines(fresh); bumpData();
}
async function tnNewEmptyRoutineDB(meta) {
  const id = await dbCreateEmptyRoutine(TN_CTX.uid, meta);
  await tnReloadRoutines();
  return id;
}
// Clonar una plantilla (ROUTINE_TEMPLATES) a la cuenta del entrenador en la base.
async function tnCloneTemplateDB(tpl) {
  const id = await dbCreateRoutine(TN_CTX.uid, {
    name: tpl.name, level: tpl.level, goal: tpl.goal, weeks: tpl.totalWeeks || tpl.weeks || 8, desc: tpl.desc || '',
    days: tpl.days.map((d) => ({ day: d.day, name: d.name, focus: d.focus,
      exercises: (d.exercises || []).map((e) => ({ id: e.id, sets: e.sets, reps: e.reps, rest: e.rest, weight: e.weight || 0, technique: e.technique || '' })) })),
  });
  await tnReloadRoutines();
  return id;
}

Object.assign(window, {
  useDataVersion, bumpData, TN_CTX,
  bootstrapTrainer, bootstrapStudent,
  tnAddStudentDB, tnAssignRoutineDB, tnSaveNoteDB, tnLogWeightDB, tnCreateRoutineDB, tnDeleteRoutineDB,
  tnReloadRoutines, tnNewEmptyRoutineDB, tnCloneTemplateDB, tnCreateAccessDB,
});

// ─────────────────────────────────────────────────────────────
// AuthScreen — registro / inicio de sesión real
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuthed }) {
  const [mode, setMode] = React.useState('login'); // 'login' | 'signup'
  const [role, setRole] = React.useState('trainer');
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [name, setName] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !pwd.trim()) { toast('Email y contraseña son obligatorios', { kind: 'error' }); return; }
    if (mode === 'signup' && !name.trim()) { toast('Ingresá tu nombre', { kind: 'error' }); return; }
    if (pwd.length < 6) { toast('La contraseña debe tener al menos 6 caracteres', { kind: 'error' }); return; }
    setBusy(true);
    try {
      if (mode === 'signup') {
        await tnSignUp({ email: email.trim(), password: pwd, fullName: name.trim(), role });
        toast('Cuenta creada ✓', { kind: 'success' });
      } else {
        await tnSignIn({ email: email.trim(), password: pwd });
      }
      const session = await tnGetSession();
      if (!session) { toast('Revisá tu email para confirmar la cuenta', {}); setBusy(false); return; }
      await onAuthed(session);
    } catch (err) {
      toast(err.message || 'Error de autenticación', { kind: 'error' });
      setBusy(false);
    }
  };

  const inputStyle = { width: '100%', boxSizing: 'border-box', background: T.surface, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 11, padding: '13px 14px', fontFamily: FONT, fontSize: 14, outline: 'none', marginBottom: 10 };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${T.accentSoft2} 0%, transparent 60%)`, pointerEvents: 'none', filter: 'blur(60px)' }} />
      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36, justifyContent: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: T.accent, color: '#0A0A0A', fontFamily: FONT, fontWeight: 900, fontSize: 19, letterSpacing: -1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${T.accentSoft2}` }}>TN</div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, letterSpacing: -0.4 }}>Trainer Nico</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Entrenamiento personal</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 }}>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: T.textDim }}>{mode === 'login' ? 'Ingresá a tu cuenta' : 'Registrate para empezar'}</div>
        </div>

        <form onSubmit={submit}>
          {mode === 'signup' && (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {[['trainer', 'Soy entrenador'], ['student', 'Soy alumno']].map(([r, l]) => (
                  <button key={r} type="button" onClick={() => setRole(r)} style={{
                    flex: 1, padding: '11px', borderRadius: 10, cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600,
                    background: role === r ? T.accent : T.surface, color: role === r ? '#0A0A0A' : T.textDim,
                    border: `1px solid ${role === r ? 'transparent' : T.border2}`,
                  }}>{l}</button>
                ))}
              </div>
              <input style={inputStyle} placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
            </>
          )}
          <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={inputStyle} type="password" placeholder="Contraseña" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <button type="submit" disabled={busy} style={{
            width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: busy ? 'default' : 'pointer',
            background: T.accent, color: '#0A0A0A', fontFamily: FONT, fontWeight: 700, fontSize: 15, marginTop: 4, opacity: busy ? 0.6 : 1,
          }}>{busy ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontFamily: FONT, fontSize: 13, color: T.textDim }}>
          {mode === 'login' ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: T.accent, cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>
            {mode === 'login' ? 'Crear una' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Root — gate de sesión + bootstrap
// ─────────────────────────────────────────────────────────────
function Root() {
  const [phase, setPhase] = React.useState('checking'); // checking | auth | ready
  useDataVersion(); // re-render on data changes

  const enter = React.useCallback(async (session) => {
    const uid = session.user.id;
    let profile = await tnGetProfile(uid);
    // Trigger may lag; fall back to metadata.
    const role = (profile && profile.role) || session.user.user_metadata?.role || 'trainer';
    TN_CTX.uid = uid; TN_CTX.role = role; TN_CTX.profile = profile;
    try {
      if (role === 'student') { await bootstrapStudent(uid, session.user.email); setStore({ role: 'alumno' }); }
      else { await bootstrapTrainer(uid); setStore({ role: 'admin' }); }
      setPhase('ready');
    } catch (err) {
      console.error('[bootstrap]', err);
      toast('Error cargando datos: ' + (err.message || err), { kind: 'error' });
      setPhase('ready');
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      const session = await tnGetSession();
      if (session) await enter(session);
      else setPhase('auth');
    })();
  }, [enter]);

  if (phase === 'checking') {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 12, color: T.accent, letterSpacing: 1 }}>Cargando…</div>
      </div>
    );
  }
  if (phase === 'auth') return <><AuthScreen onAuthed={async (s) => { setPhase('checking'); await enter(s); }} /><ToastHost /></>;
  return <App />;
}

Object.assign(window, { Root, AuthScreen });
