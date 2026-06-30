// Trainer Nico — Student screens (Alumno).
// Mobile-first, fully responsive, fully interactive (state-backed).

// Frozen empty object for selectors that fall back to {} on miss.
// Returning a fresh `{}` from useSyncExternalStore's getSnapshot triggers
// an infinite re-render loop (referential identity changes every tick).
const EMPTY_OBJ = Object.freeze({});

// Get the current student object (Lucía by default for the demo).
function useMe() {
  const id = useStore((s) => s.studentId);
  return findStudent(id) || STUDENTS[0];
}

// The active routine resolves reactively from the logged-in student + any
// admin override (assigning a routine in the panel reflects here on next render).
function useActiveRoutine() {
  const sid = useStore((s) => s.studentId);
  const ov = useStore((s) => s.studentOverrides[sid]);
  const rid = (ov && ov.routineId) || (findStudent(sid) || {}).routineId || 'hipertrofia-ul-int';
  return React.useMemo(() => resolveRoutine(rid), [rid]);
}

// Active workout day (Thursday for the demo) of the student's routine.
function useActiveDay() {
  const routine = useActiveRoutine();
  return routine.days[todayIdx()];
}

// Exercises of a day, honoring admin live-edits (customDayExs override).
function useDayExs(day) {
  const override = useStore((s) => s.customDayExs[day.id]);
  return override || day.exercises;
}

// ─────────────────────────────────────────────────────────────
// Header used on every student screen
// ─────────────────────────────────────────────────────────────
function StuHeader({ greeting, title, onBack, backLabel, right, sticky = true }) {
  const me = useMe();
  return (
    <div style={{
      padding: '20px 20px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      position: sticky ? 'sticky' : 'relative', top: 0, zIndex: 10,
      background: 'linear-gradient(180deg, rgba(10,10,10,1) 70%, rgba(10,10,10,0))',
      backdropFilter: 'blur(12px)',
    }}>
      {onBack ? (
        <button onClick={onBack} aria-label="Atrás" style={{
          width: 38, height: 38, borderRadius: 11,
          background: T.surface, border: `1px solid ${T.border2}`, color: T.text,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{Icon.back()}</button>
      ) : (
        <Avatar student={me} size={40} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {(greeting || backLabel) && (
          <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>
            {greeting || backLabel}
          </div>
        )}
        <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HOY  (Today)
// ─────────────────────────────────────────────────────────────
function ScreenHoy() {
  const me = useMe();
  const routine = useActiveRoutine();
  const day = routine.days[todayIdx()];
  const exs = useDayExs(day);
  const totalSets = exs.reduce((s, e) => s + e.sets, 0);
  const w = useStore((s) => s.workout[day.id] || EMPTY_OBJ);
  const bodyWeight = useStore((s) => s.bodyWeight);
  const doneSets = Object.values(w).reduce((s, x) => s + (x.setsDone || 0), 0);
  const adherence = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const started = doneSets > 0;
  const done = doneSets >= totalSets && totalSets > 0;

  return (
    <div>
      <StuHeader
        greeting={new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        title={`Hola, ${me.name.split(' ')[0]}`}
        right={<button onClick={() => toast('No tenes notificaciones nuevas')} style={{
          width: 38, height: 38, borderRadius: 19, background: T.surface, border: `1px solid ${T.border2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer',
        }}>{Icon.bell()}
          <div style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4, background: T.accent, border: `2px solid ${T.surface}` }} />
        </button>}
      />

      <div style={{ padding: '0 20px 20px' }}>
        {/* HERO — today's workout */}
        <div style={{
          position: 'relative', overflow: 'hidden', borderRadius: 22,
          background: `linear-gradient(135deg, ${T.accent} 0%, #1FCBBC 100%)`,
          color: '#0A0A0A', padding: 22, marginBottom: 14,
        }}>
          {/* texture */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}>
            <defs><pattern id="hero-stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#0A0A0A" strokeWidth="2" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#hero-stripes)" />
          </svg>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 26 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6, marginBottom: 6 }}>
                  {done ? 'Terminado · buen trabajo' : started ? 'En curso' : 'Entrenamiento de hoy'}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.05 }}>{day.name}</div>
                <div style={{ fontFamily: FONT, fontSize: 13, opacity: 0.7, marginTop: 4 }}>{day.focus}</div>
              </div>
              <Ring size={56} stroke={5} value={adherence} color="#0A0A0A" track="rgba(0,0,0,0.18)">
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: '#0A0A0A' }}>{adherence}%</div>
              </Ring>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 18 }}>
              <div><div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>Ejercicios</div>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{exs.length}</div></div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.18)' }} />
              <div><div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>Series</div>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{doneSets}/{totalSets}</div></div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.18)' }} />
              <div><div style={{ fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>Est.</div>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>52min</div></div>
            </div>
            <button onClick={() => navigate('#/a/rutina')} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: '#0A0A0A', color: T.accent, cursor: 'pointer',
              fontFamily: FONT, fontWeight: 700, fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>{Icon.play(T.accent)} {done ? 'Ver resumen' : started ? 'Continuar entrenamiento' : 'Comenzar entrenamiento'}</button>
          </div>
        </div>

        {/* Week strip */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>{routine.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim }}>S {routine.week}/{routine.totalWeeks}</div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {routine.days.map((d, i) => {
              const isToday = i === todayIdx();
              const past = i < todayIdx();
              return (
                <div key={d.id} style={{
                  flex: 1, height: 36, borderRadius: 8,
                  background: isToday ? T.accent : past ? T.accentSoft : T.surface2,
                  border: isToday ? 'none' : `1px solid ${T.border2}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 10, fontWeight: 600,
                  color: isToday ? '#0A0A0A' : past ? T.accentText : T.textMuted,
                }}>
                  <div>{d.day}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <button onClick={() => navigate('#/a/perfil')} style={{ all: 'unset', cursor: 'pointer', display: 'block' }}>
            <Card><Stat label="Peso corporal" value={bodyWeight.toFixed(1)} unit="kg" delta={Number((bodyWeight - 63.5).toFixed(1))} /></Card>
          </button>
          <Card><Stat label="Vol. semana" value="16.4" unit="t" delta={4.0} /></Card>
        </div>

        {/* Trainer note */}
        <Card style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 17, flexShrink: 0,
            background: '#0A0A0A', border: `1.5px solid ${T.accent}`,
            color: T.accent, fontFamily: FONT, fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>N</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Nota de Nico · 07:02</div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: T.text, lineHeight: 1.5 }}>
              Hoy enfocate en la activación de dorsal antes del primer ejercicio. Si las dominadas se sienten pesadas, bajamos a banda asistida.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RUTINA  (Workout in progress)
// ─────────────────────────────────────────────────────────────
function ScreenRutina() {
  const day = useActiveDay();
  const exs = useDayExs(day);
  const w = useStore((s) => s.workout[day.id] || EMPTY_OBJ);
  const totalSets = exs.reduce((s, e) => s + e.sets, 0);
  const doneSets = exs.reduce((s, e) => s + (w[e.id]?.setsDone || 0), 0);
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const activeIdx = exs.findIndex((e) => (w[e.id]?.setsDone || 0) < e.sets);

  return (
    <div>
      <div style={{
        padding: '20px 20px 14px',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
        background: 'linear-gradient(180deg, rgba(10,10,10,1) 70%, rgba(10,10,10,0))',
        backdropFilter: 'blur(12px)',
      }}>
        <button onClick={() => navigate('#/a/hoy')} aria-label="Atrás" style={{
          width: 38, height: 38, borderRadius: 11,
          background: T.surface, border: `1px solid ${T.border2}`, color: T.text,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{Icon.back()}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 2 }}>
            ● En curso · {String(Math.floor(24 + (doneSets * 4.5))).padStart(2,'0')}:18
          </div>
          <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: -0.4 }}>{day.name}</div>
        </div>
        <button onClick={() => { resetDay(day.id); toast('D\u00eda reiniciado'); }} title="Reiniciar día" style={{
          background: T.surface, border: `1px solid ${T.border2}`, color: T.textDim,
          borderRadius: 10, padding: '7px 11px', cursor: 'pointer',
          fontFamily: FONT, fontSize: 12, fontWeight: 600,
        }}>Reset</button>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim }}>{doneSets} / {totalSets} series</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.accent }}>{pct}%</div>
          </div>
          <div style={{ height: 4, background: T.surface2, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: T.accent, transition: 'width .4s' }} />
          </div>
        </div>

        {/* Exercise cards */}
        {exs.map((it, i) => {
          const exObj = findExercise(it.id);
          const setsDone = w[it.id]?.setsDone || 0;
          const done = setsDone >= it.sets;
          const active = i === activeIdx;
          const c = groupColor(exObj.group);
          return (
            <div key={it.id} style={{
              background: T.surface,
              border: `1px solid ${active ? T.accent : T.border2}`,
              boxShadow: active ? `0 0 0 3px ${T.accentSoft}` : 'none',
              borderRadius: 16, padding: 14, marginBottom: 10, opacity: done ? 0.55 : 1,
              transition: 'all .15s',
            }}>
              <div onClick={() => navigate(`#/a/ejercicio/${it.id}`)} style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}>
                <ExerciseTile ex={exObj} compact />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 2 }}>{exObj.es}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim }}>
                    {it.sets}×{it.reps} · {it.rest}s{it.weight ? ` · ${it.weight}kg` : ''}
                  </div>
                  {it.technique ? <div style={{ fontFamily: MONO, fontSize: 10, color: T.accentText, marginTop: 3 }}>⚡ {it.technique}</div> : null}
                </div>
                {done ? (
                  <div style={{ width: 30, height: 30, borderRadius: 15, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {Icon.check('#0A0A0A')}
                  </div>
                ) : (
                  <div style={{ color: T.textMuted }}>{Icon.chev()}</div>
                )}
              </div>

              {/* set chips — tappable */}
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {Array.from({ length: it.sets }).map((_, si) => {
                  const setDone = si < setsDone;
                  return (
                    <button key={si} onClick={(e) => {
                      e.stopPropagation();
                      if (setDone && si === setsDone - 1) decrementSet(day.id, it.id);
                      else if (!setDone && si === setsDone) { incrementSet(day.id, it.id, it.sets); if (si + 1 < it.sets) startRest(it.rest); }
                    }} style={{
                      flex: 1, height: 38, borderRadius: 9,
                      background: setDone ? T.accent : T.surface2,
                      border: setDone ? 'none' : `1px solid ${T.border2}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: MONO, fontSize: 12, fontWeight: 600,
                      color: setDone ? '#0A0A0A' : T.textDim, cursor: 'pointer',
                      transition: 'background .12s, transform .08s',
                    }}>{setDone ? '✓' : si + 1}</button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Real exercise infographic — tap to expand via the global lightbox.
function ExerciseInfographic({ ex }) {
  return (
    <div onClick={() => openLightbox(ex)} style={{
      position: 'relative', marginBottom: 14, borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${T.border2}`, cursor: ex.img ? 'zoom-in' : 'default', background: T.surface2,
    }}>
      <ExImg ex={ex} cover={false} style={{ width: '100%', height: 360 }} />
      {ex.img && (
        <div style={{
          position: 'absolute', bottom: 10, right: 10,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(10,10,10,0.78)', backdropFilter: 'blur(6px)',
          border: `1px solid ${T.border2}`, borderRadius: 999, padding: '7px 12px',
        }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: T.accent, textTransform: 'uppercase', letterSpacing: 1 }}>⤢ Ver cómo se hace</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EJERCICIO (detail)
// ─────────────────────────────────────────────────────────────
function ScreenEjercicio({ exId }) {
  const day = useActiveDay();
  const exs = useDayExs(day);
  const it = exs.find((e) => e.id === exId);
  if (!it) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ color: T.textDim, marginBottom: 16 }}>Ejercicio no encontrado.</div>
        <Btn onClick={() => navigate('#/a/rutina')} icon={Icon.back()}>Volver</Btn>
      </div>
    );
  }
  const ex = findExercise(it.id);
  const setsDone = useStore((s) => s.workout[day.id]?.[it.id]?.setsDone || 0);
  const idx = exs.findIndex((e) => e.id === exId);
  const prev = exs[idx - 1];
  const next = exs[idx + 1];
  const done = setsDone >= it.sets;

  return (
    <div style={{ paddingBottom: 90 }}>
      <StuHeader
        backLabel={`Ejercicio ${idx + 1} de ${exs.length}`}
        title={ex.es}
        onBack={() => navigate('#/a/rutina')}
        right={<Btn sm icon={Icon.ext()} onClick={() => toast('Abriendo video… (demo)')}>Video</Btn>}
      />

      <div style={{ padding: '0 20px' }}>
        {/* Hero — REAL infographic, tap to view fullscreen */}
        <ExerciseInfographic ex={ex} />

        {/* Meta chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          <Chip>{ex.group}</Chip><Chip>{ex.equipment}</Chip><Chip>{ex.level}</Chip>
          <Chip>{it.sets} series</Chip><Chip>{it.reps} reps</Chip>
          <Chip>{it.rest}s descanso</Chip>
          {it.weight ? <Chip>{it.weight}kg sugerido</Chip> : null}
        </div>

        {it.technique ? (
          <div style={{ background: 'rgba(46,230,213,0.10)', border: `1px solid ${T.accent}55`, borderRadius: 12, padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 18, lineHeight: 1 }}>⚡</div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.accentText, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>Técnica de intensidad</div>
              <div style={{ fontFamily: FONT, fontSize: 13, color: T.text, lineHeight: 1.5 }}>{it.technique}</div>
            </div>
          </div>
        ) : null}

        {/* Sets logger */}
        <Card style={{ marginBottom: 14, padding: 0 }} padding={0}>
          <div style={{ padding: '14px 16px 8px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>Registro de series</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim }}>{setsDone}/{it.sets}</div>
          </div>
          <div style={{ padding: '4px 16px 8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 1fr 1fr 1fr 30px', gap: 8, padding: '8px 0', fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              <div>Set</div><div>Reps</div><div>Kg</div><div>RPE</div><div></div>
            </div>
            {Array.from({ length: it.sets }).map((_, si) => {
              const setDone = si < setsDone;
              const isNext = si === setsDone;
              const repsTarget = String(it.reps).split('-')[0];
              return (
                <div key={si} style={{
                  display: 'grid', gridTemplateColumns: '34px 1fr 1fr 1fr 30px', gap: 8,
                  padding: '10px 0', borderTop: `1px solid ${T.border}`, alignItems: 'center',
                  background: isNext ? `linear-gradient(90deg, ${T.accentSoft}, transparent)` : 'transparent',
                }}>
                  <div style={{ fontFamily: MONO, fontSize: 13, color: isNext ? T.accent : T.textDim, fontWeight: 600 }}>{si + 1}</div>
                  <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: setDone ? T.text : T.textMuted }}>{setDone ? repsTarget : '—'}</div>
                  <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: setDone ? T.text : T.textMuted }}>{setDone && it.weight ? it.weight : '—'}</div>
                  <div style={{ fontFamily: MONO, fontSize: 14, color: T.textDim }}>{setDone ? '7.5' : '—'}</div>
                  <div>{setDone ? (
                    <div style={{ width: 22, height: 22, borderRadius: 11, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon.check('#0A0A0A')}</div>
                  ) : (
                    <div style={{ width: 22, height: 22, borderRadius: 11, border: `1.5px dashed ${T.border2}` }} />
                  )}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Muscles (only if provided in data) */}
        {ex.primary && ex.primary.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Músculos trabajados</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ex.primary.map((m) => (
              <div key={m} style={{
                fontFamily: FONT, fontSize: 12, fontWeight: 600, color: '#0A0A0A',
                background: T.accent, padding: '6px 12px', borderRadius: 999,
              }}>{m}</div>
            ))}
            {(ex.secondary || []).map((m) => (
              <div key={m} style={{
                fontFamily: FONT, fontSize: 12, color: T.textDim,
                background: T.surface2, border: `1px solid ${T.border2}`,
                padding: '6px 12px', borderRadius: 999,
              }}>{m}</div>
            ))}
          </div>
        </Card>
        )}

        {/* Tip (only if provided) */}
        {ex.tip && (
        <Card style={{ background: T.accentSoft, border: `1px solid ${T.accent}33`, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            {Icon.tip(T.accent)}
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.accentText, textTransform: 'uppercase', letterSpacing: 1 }}>Tip de Nico</div>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: T.text, lineHeight: 1.5 }}>{ex.tip}</div>
        </Card>
        )}

        {/* Common errors (only if provided) */}
        {ex.errors && ex.errors.length > 0 && (
          <Card style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Errores comunes</div>
            {ex.errors.map((er, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0' }}>
                <div style={{ width: 4, height: 4, borderRadius: 2, background: T.warn, marginTop: 7, flexShrink: 0 }} />
                <div style={{ fontFamily: FONT, fontSize: 13, color: T.textDim }}>{er}</div>
              </div>
            ))}
          </Card>
        )}

        {/* Prev / next */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 80 }}>
          <Btn full disabled={!prev} onClick={() => prev && navigate(`#/a/ejercicio/${prev.id}`)} icon={Icon.back()}>Anterior</Btn>
          <Btn full disabled={!next} onClick={() => next && navigate(`#/a/ejercicio/${next.id}`)}>Siguiente</Btn>
        </div>
      </div>

      {/* Floating CTA */}
      <div style={{
        position: 'sticky', bottom: 12, padding: '0 20px', zIndex: 5,
      }}>
        <button onClick={() => { if (done) return; incrementSet(day.id, it.id, it.sets); if (setsDone + 1 < it.sets) startRest(it.rest); }} disabled={done} style={{
          width: '100%', background: done ? T.surface2 : T.accent, color: done ? T.textDim : '#0A0A0A',
          border: done ? `1px solid ${T.border2}` : 'none', borderRadius: 14, padding: 16, cursor: done ? 'default' : 'pointer',
          fontFamily: FONT, fontWeight: 700, fontSize: 15,
          boxShadow: done ? 'none' : '0 12px 24px rgba(46,230,213,0.25)',
        }}>{done ? 'Ejercicio completado ✓' : `Completar serie ${setsDone + 1} →`}</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESO
// ─────────────────────────────────────────────────────────────
function ScreenProgreso() {
  const [tab, setTab] = React.useState('peso');
  const sid = useStore((s) => s.studentId);
  const wlog = useStore((s) => (s.weightLog || {})[sid]) || [];
  // Real logged weights extend the baseline 8-week series.
  const weightSeries = wlog.length ? [...PROGRESS.weight, ...wlog] : PROGRESS.weight;
  const series = tab === 'peso' ? weightSeries : tab === 'volumen' ? PROGRESS.volume : PROGRESS.adherence;
  const current = series[series.length - 1];
  const delta = current - series[0];
  const tabs = [{ id: 'peso', label: 'Peso' }, { id: 'volumen', label: 'Volumen' }, { id: 'adherencia', label: 'Adherencia' }];
  const unit = tab === 'peso' ? 'kg' : tab === 'volumen' ? 'kg' : '%';
  const fmt = tab === 'volumen' ? (v) => (v / 1000).toFixed(1) + 't' : (v) => v.toFixed(tab === 'peso' ? 1 : 0);

  return (
    <div>
      <StuHeader greeting="Tu progreso" title="Últimas 8 semanas"
        right={<Btn sm onClick={() => toast('Cambiar rango: 4S / 8S / 12S — próximamente')}>8S {Icon.chev(T.textDim)}</Btn>} />

      <div style={{ padding: '0 20px 20px' }}>
        {/* tabs */}
        <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 12, padding: 4, marginBottom: 14 }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '9px 8px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? T.accent : 'transparent',
              color: tab === t.id ? '#0A0A0A' : T.textDim,
              borderRadius: 8, fontFamily: FONT, fontSize: 12, fontWeight: 600,
              transition: 'background .15s',
            }}>{t.label}</button>
          ))}
        </div>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Actual</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: T.text, letterSpacing: -1 }}>{fmt(current)}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: T.textDim }}>{unit}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>vs S1</div>
              <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600,
                color: (tab === 'peso' && delta < 0) || (tab !== 'peso' && delta > 0) ? T.accent : T.warn }}>
                {delta > 0 ? '+' : ''}{tab === 'volumen' ? (delta / 1000).toFixed(1) + 't' : delta.toFixed(tab === 'peso' ? 1 : 0)}
              </div>
            </div>
          </div>
          {tab === 'adherencia' ? <BarChart data={series} /> : <LineChart data={series} />}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {series.map((_, i) => (<div key={i} style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted }}>S{i + 1}</div>))}
          </div>
        </Card>

        <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '10px 4px 8px' }}>Récords personales</div>
        <Card padding={0}>
          {PROGRESS.prs.map((pr, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '14px 16px',
              borderTop: i ? `1px solid ${T.border}` : 'none',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 15, background: T.accentSoft, color: T.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
              }}>{Icon.star(T.accent)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>{pr.ex}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 2 }}>{pr.when}</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: T.text }}>{pr.value}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// NUTRICIÓN
// ─────────────────────────────────────────────────────────────
function MacroBar({ label, eaten, target, color }) {
  const pct = Math.min(100, (eaten / target) * 100);
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
        <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, color: T.text }}>{Math.round(eaten)}</span>
        <span style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted }}>/ {target}g</span>
      </div>
      <div style={{ height: 4, background: T.surface2, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width .3s' }} />
      </div>
    </div>
  );
}

function ScreenNutricion() {
  const meals = useStore((s) => s.meals);
  const eaten = NUTRITION.meals.filter((m) => meals[m.id]).reduce((s, m) => ({
    kcal: s.kcal + m.kcal, p: s.p + m.p, c: s.c + m.c, f: s.f + m.f,
  }), { kcal: 0, p: 0, c: 0, f: 0 });
  const remaining = Math.max(0, NUTRITION.calories - eaten.kcal);
  const pct = Math.min(100, Math.round((eaten.kcal / NUTRITION.calories) * 100));

  return (
    <div>
      <StuHeader greeting={new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} title="Nutrición"
        right={<Btn sm primary icon={Icon.plus('#0A0A0A')} onClick={() => toast('Próximamente: registrar comida extra')}>Comida</Btn>} />

      <div style={{ padding: '0 20px 20px' }}>
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Ring size={110} stroke={9} value={pct}>
              <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: -0.5 }}>{remaining}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>kcal restan</div>
            </Ring>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Objetivo</div>
              <div style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: T.text, letterSpacing: -0.5, marginBottom: 8 }}>
                {NUTRITION.calories} <span style={{ fontSize: 12, color: T.textDim }}>kcal</span>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: T.textDim, lineHeight: 1.4 }}>
                Plan: <span style={{ color: T.accent }}>Recomp · Lucía</span><br/>Asignado por Nico · S6
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            <MacroBar label="Proteína" eaten={eaten.p} target={NUTRITION.protein} color={T.accent} />
            <MacroBar label="Carbos"   eaten={eaten.c} target={NUTRITION.carbs}   color="#FFB020" />
            <MacroBar label="Grasas"   eaten={eaten.f} target={NUTRITION.fat}     color="#FF5BA8" />
          </div>
        </Card>

        <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '8px 4px 8px' }}>Comidas del día · toca para marcar</div>
        {NUTRITION.meals.map((m) => {
          const isDone = !!meals[m.id];
          return (
            <button key={m.id} onClick={() => toggleMeal(m.id)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: T.surface, border: `1px solid ${isDone ? T.accent + '55' : T.border2}`,
              borderRadius: 14, padding: 14, marginBottom: 8, cursor: 'pointer',
              opacity: isDone ? 0.7 : 1, transition: 'all .15s',
              fontFamily: 'inherit',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                  background: isDone ? T.accent : T.surface2,
                  border: isDone ? 'none' : `1px solid ${T.border2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 11, fontWeight: 700,
                  color: isDone ? '#0A0A0A' : T.textDim,
                }}>{isDone ? Icon.check('#0A0A0A') : m.time}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>{m.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: T.text }}>{m.kcal} <span style={{ color: T.textMuted, fontWeight: 400 }}>kcal</span></div>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim, marginTop: 2 }}>
                    P {m.p}g · C {m.c}g · G {m.f}g
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: FONT, fontSize: 12, color: T.textDim, marginTop: 10, lineHeight: 1.5 }}>
                {m.items.join(' · ')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenHoy, ScreenRutina, ScreenEjercicio, ScreenProgreso, ScreenNutricion, useMe,
});
