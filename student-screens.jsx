// Student-facing mobile screens for Trainer Nico.
// All screens are rendered inside an IOSDevice (390×844, dark).
// Each is its own component with local state so artboards feel "alive".

const TN_S = TN_COLORS; // shorthand

// ─────────────────────────────────────────────────────────────
// Building blocks
// ─────────────────────────────────────────────────────────────

// A stylized exercise media tile — colored gradient + glyph + label.
// Used in place of real photos for catalog consistency.
function ExerciseTile({ ex, height = 180, big = false }) {
  if (!ex) return null;
  const c = tnGroupColor(ex.group);
  const initials = ex.es.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div style={{
      width: '100%', height, position: 'relative', overflow: 'hidden',
      borderRadius: 14, background: TN_S.surface2,
      backgroundImage: `radial-gradient(circle at 80% 20%, ${c}22 0%, transparent 55%), linear-gradient(135deg, ${TN_S.surface2}, ${TN_S.bg})`,
      border: `1px solid ${TN_S.border2}`,
    }}>
      {/* corner glyph */}
      <div style={{
        position: 'absolute', right: -10, bottom: -22,
        fontFamily: TN_FONT, fontWeight: 900, fontSize: big ? 200 : 140,
        letterSpacing: -8, color: c, opacity: 0.18, lineHeight: 1,
      }}>{initials}</div>
      {/* faint stripes */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <defs>
          <pattern id={`stripes-${ex.id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#stripes-${ex.id})`} />
      </svg>
      {/* top meta */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 12,
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8,
      }}>
        <div style={{
          fontFamily: TN_MONO, fontSize: 10, letterSpacing: 0.5,
          textTransform: 'uppercase', color: c,
          background: `${c}22`, padding: '4px 8px', borderRadius: 4,
        }}>{ex.group}</div>
        <div style={{
          fontFamily: TN_MONO, fontSize: 10, letterSpacing: 0.5,
          textTransform: 'uppercase', color: TN_S.textDim,
          background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: 4,
        }}>{ex.equipment}</div>
      </div>
      {/* bottom title */}
      <div style={{
        position: 'absolute', left: 14, right: 14, bottom: 12,
        fontFamily: TN_FONT, fontSize: big ? 22 : 17, fontWeight: 700,
        color: TN_S.text, letterSpacing: -0.3, lineHeight: 1.15,
      }}>
        {ex.es}
        <div style={{ fontFamily: TN_MONO, fontSize: 11, fontWeight: 400, color: TN_S.textDim, marginTop: 4, letterSpacing: 0 }}>
          {ex.en}
        </div>
      </div>
    </div>
  );
}

// Bottom tab bar — appears across all student screens.
function TNTabBar({ active = 'hoy', onChange }) {
  const tabs = [
    { id: 'hoy', label: 'Hoy',
      icon: (c) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 9.5L11 3l8 6.5V18a1 1 0 01-1 1h-4v-6h-6v6H4a1 1 0 01-1-1V9.5z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg> },
    { id: 'rutina', label: 'Rutina',
      icon: (c) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="14" rx="2" stroke={c} strokeWidth="1.7"/><path d="M3 9h16M8 4v3M14 4v3" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg> },
    { id: 'progreso', label: 'Progreso',
      icon: (c) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 17l5-6 4 3 7-9" stroke={c} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="5" r="1.5" fill={c}/></svg> },
    { id: 'nutricion', label: 'Nutrición',
      icon: (c) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3c4 0 7 3 7 7 0 5-4 9-7 9s-7-4-7-9c0-4 3-7 7-7z" stroke={c} strokeWidth="1.7"/><path d="M11 8v6M8 11h6" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${TN_S.border}`,
      padding: '10px 8px 28px',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 30,
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        const c = isActive ? TN_S.lime : TN_S.textMuted;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)}
            style={{
              flex: 1, background: 'transparent', border: 'none', padding: '6px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              cursor: 'pointer', color: c,
              fontFamily: TN_FONT, fontSize: 10, fontWeight: 500, letterSpacing: 0.2,
            }}>
            {t.icon(c)}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Screen header — used inside the device, replaces IOSNavBar.
function TNHeader({ greeting, name, avatar, backLabel, onBack, right }) {
  return (
    <div style={{
      paddingTop: 56, padding: '56px 20px 12px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          background: TN_S.surface, border: `1px solid ${TN_S.border2}`, color: TN_S.text,
          borderRadius: 10, width: 36, height: 36, padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      ) : avatar ? (
        <div style={{
          width: 40, height: 40, borderRadius: 20,
          background: `linear-gradient(135deg, ${TN_S.lime}, #6FAA00)`,
          color: '#000', fontFamily: TN_FONT, fontWeight: 700, fontSize: 15,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{avatar}</div>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {greeting && (
          <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{greeting}</div>
        )}
        {backLabel ? (
          <div style={{ fontFamily: TN_MONO, fontSize: 11, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{backLabel}</div>
        ) : null}
        {name && (
          <div style={{ fontFamily: TN_FONT, fontSize: 18, fontWeight: 600, color: TN_S.text, letterSpacing: -0.2 }}>{name}</div>
        )}
      </div>
      {right}
    </div>
  );
}

// Progress ring SVG.
function TNRing({ size = 120, stroke = 10, value = 50, color = TN_S.lime, trackColor = 'rgba(255,255,255,0.06)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>{children}</div>
    </div>
  );
}

// Card primitive
function TNCard({ children, style, padding = 16 }) {
  return (
    <div style={{
      background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
      borderRadius: 16, padding, ...style,
    }}>{children}</div>
  );
}

// Mono stat block
function TNStat({ label, value, unit, delta }) {
  return (
    <div>
      <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: TN_MONO, fontSize: 22, fontWeight: 600, color: TN_S.text, letterSpacing: -0.5 }}>{value}</span>
        {unit && <span style={{ fontFamily: TN_MONO, fontSize: 11, color: TN_S.textDim }}>{unit}</span>}
      </div>
      {delta != null && (
        <div style={{
          fontFamily: TN_MONO, fontSize: 10, marginTop: 2,
          color: delta < 0 ? TN_S.lime : delta > 0 ? TN_S.warn : TN_S.textDim,
        }}>{delta > 0 ? '+' : ''}{delta}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Device wrapper: dark iPhone frame with our content
// ─────────────────────────────────────────────────────────────
function TNDevice({ children }) {
  return (
    <IOSDevice width={390} height={844} dark>
      <div style={{
        position: 'absolute', inset: 0, background: TN_S.bg,
        fontFamily: TN_FONT, color: TN_S.text,
        display: 'flex', flexDirection: 'column',
      }}>{children}</div>
    </IOSDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Hoy (Home)
// ─────────────────────────────────────────────────────────────
function ScreenHoy() {
  const today = TN_ROUTINE.days.find((d) => d.today);
  const adherence = 86;
  return (
    <TNDevice>
      <TNHeader greeting="Jueves · 17 Mayo" name="Hola, Lucía" avatar="L"
        right={<div style={{
          width: 36, height: 36, borderRadius: 18, background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5a4 4 0 00-4 4v3l-2 3h12l-2-3v-3a4 4 0 00-4-4z" stroke={TN_S.text} strokeWidth="1.4" strokeLinejoin="round"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke={TN_S.text} strokeWidth="1.4"/></svg>
          <div style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4, background: TN_S.lime, border: `2px solid ${TN_S.surface}` }} />
        </div>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 100px' }}>
        {/* Today's workout — hero card */}
        <div style={{
          position: 'relative', borderRadius: 20, overflow: 'hidden',
          background: TN_S.lime, color: '#0A0A0A', padding: 20, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6, marginBottom: 6 }}>Entrenamiento de hoy</div>
              <div style={{ fontFamily: TN_FONT, fontSize: 28, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1.05 }}>{today.name}</div>
              <div style={{ fontFamily: TN_FONT, fontSize: 13, opacity: 0.7, marginTop: 4 }}>{today.focus}</div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 22, background: '#0A0A0A',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5v11l9-5.5-9-5.5z" fill={TN_S.lime}/></svg>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <div>
              <div style={{ fontFamily: TN_MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>Ejercicios</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{today.exercises}</div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.15)' }} />
            <div>
              <div style={{ fontFamily: TN_MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>Duración est.</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>52 min</div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(0,0,0,0.15)' }} />
            <div>
              <div style={{ fontFamily: TN_MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.6 }}>Volumen</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>2.1t</div>
            </div>
          </div>
        </div>

        {/* Adherence ring + week strip */}
        <TNCard style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <TNRing size={86} stroke={8} value={adherence}>
              <div style={{ fontFamily: TN_MONO, fontSize: 20, fontWeight: 700, color: TN_S.text }}>{adherence}<span style={{ fontSize: 11, color: TN_S.textDim }}>%</span></div>
              <div style={{ fontFamily: TN_MONO, fontSize: 8, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Adherencia</div>
            </TNRing>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TN_FONT, fontSize: 14, fontWeight: 600, color: TN_S.text, marginBottom: 2 }}>{TN_ROUTINE.name}</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textDim, marginBottom: 10 }}>Semana {TN_ROUTINE.week} de {TN_ROUTINE.totalWeeks}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {TN_ROUTINE.days.map((d, i) => (
                  <div key={i} style={{
                    flex: 1, height: 28, borderRadius: 6,
                    background: d.today ? TN_S.lime : d.done ? 'rgba(170,255,0,0.25)' : TN_S.surface2,
                    border: d.today ? 'none' : `1px solid ${TN_S.border2}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: TN_MONO, fontSize: 10, fontWeight: 600,
                    color: d.today ? '#0A0A0A' : d.done ? TN_S.limeText : TN_S.textMuted,
                  }}>{d.day}</div>
                ))}
              </div>
            </div>
          </div>
        </TNCard>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <TNCard><TNStat label="Peso corporal" value="62.1" unit="kg" delta={-1.4} /></TNCard>
          <TNCard><TNStat label="Volumen S6" value="16.4" unit="t" delta={4.0} /></TNCard>
        </div>

        {/* Trainer note */}
        <div style={{
          background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
          borderRadius: 16, padding: 16,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 16, flexShrink: 0,
            background: '#0A0A0A', border: `1px solid ${TN_S.lime}`,
            color: TN_S.lime, fontFamily: TN_FONT, fontWeight: 700, fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>N</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Nota de Nico · 07:02</div>
            <div style={{ fontFamily: TN_FONT, fontSize: 13, color: TN_S.text, lineHeight: 1.45 }}>
              Hoy enfocate en la activación de dorsal antes del primer ejercicio. Si las dominadas se sienten pesadas, bajamos a banda asistida.
            </div>
          </div>
        </div>
      </div>

      <TNTabBar active="hoy" />
    </TNDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Rutina (workout in progress)
// ─────────────────────────────────────────────────────────────
function ScreenRutina() {
  // simulate progress: first two ex complete, third in progress
  const items = TN_ROUTINE.today.map((it, i) => ({
    ...it, exObj: tnEx(it.ex),
    doneSets: i < 2 ? it.sets : i === 2 ? 2 : 0,
    active: i === 2,
  }));
  const totalSets = items.reduce((s, x) => s + x.sets, 0);
  const doneSets = items.reduce((s, x) => s + x.doneSets, 0);
  const pct = Math.round((doneSets / totalSets) * 100);

  return (
    <TNDevice>
      <div style={{ paddingTop: 56, padding: '56px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.lime, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>● En curso · 24:18</div>
            <div style={{ fontFamily: TN_FONT, fontSize: 22, fontWeight: 700, color: TN_S.text, letterSpacing: -0.4 }}>Upper Pull</div>
          </div>
          <button style={{
            background: TN_S.surface, border: `1px solid ${TN_S.border2}`, color: TN_S.text,
            borderRadius: 10, padding: '8px 14px', cursor: 'pointer',
            fontFamily: TN_FONT, fontSize: 12, fontWeight: 600,
          }}>Pausar</button>
        </div>

        {/* progress bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textDim }}>{doneSets} / {totalSets} series</div>
            <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.lime }}>{pct}%</div>
          </div>
          <div style={{ height: 4, background: TN_S.surface2, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: TN_S.lime, transition: 'width .4s' }} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 20px 100px' }}>
        {items.map((it, i) => {
          const done = it.doneSets === it.sets;
          const c = tnGroupColor(it.exObj.group);
          return (
            <div key={i} style={{
              background: it.active ? TN_S.surface : TN_S.surface,
              border: `1px solid ${it.active ? TN_S.lime : TN_S.border2}`,
              boxShadow: it.active ? `0 0 0 3px rgba(170,255,0,0.08)` : 'none',
              borderRadius: 16, padding: 14, marginBottom: 10, opacity: done ? 0.55 : 1,
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, flexShrink: 0,
                  background: `linear-gradient(135deg, ${c}33, ${TN_S.surface2})`,
                  border: `1px solid ${TN_S.border2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: TN_FONT, fontWeight: 900, fontSize: 18, color: c,
                  letterSpacing: -1,
                }}>{it.exObj.es.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TN_FONT, fontSize: 15, fontWeight: 600, color: TN_S.text, marginBottom: 2 }}>{it.exObj.es}</div>
                  <div style={{ fontFamily: TN_MONO, fontSize: 11, color: TN_S.textDim }}>
                    {it.sets}×{it.reps} · {it.rest}s descanso{it.weight ? ` · ${it.weight}kg` : ''}
                  </div>
                </div>
                {done && (
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: TN_S.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>
              {/* set chips */}
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                {Array.from({ length: it.sets }).map((_, si) => {
                  const setDone = si < it.doneSets;
                  return (
                    <div key={si} style={{
                      flex: 1, height: 34, borderRadius: 8,
                      background: setDone ? TN_S.lime : TN_S.surface2,
                      border: setDone ? 'none' : `1px solid ${TN_S.border2}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: TN_MONO, fontSize: 11, fontWeight: 600,
                      color: setDone ? '#0A0A0A' : TN_S.textDim,
                    }}>
                      {setDone ? '✓' : si + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <TNTabBar active="rutina" />
    </TNDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Ejercicio (single exercise detail)
// ─────────────────────────────────────────────────────────────
function ScreenEjercicio() {
  const ex = tnEx('remo-barra');
  const sets = [
    { reps: 10, kg: 50, rpe: 7, done: true },
    { reps: 10, kg: 50, rpe: 7.5, done: true },
    { reps: 9,  kg: 52.5, rpe: 8.5, done: true },
    { reps: '—', kg: 52.5, rpe: '—', done: false, active: true },
  ];
  return (
    <TNDevice>
      <TNHeader backLabel="Ejercicio 2 · de 6" name="Remo con barra" onBack={() => {}}
        right={<button style={{
          background: TN_S.surface, border: `1px solid ${TN_S.border2}`, color: TN_S.text,
          borderRadius: 10, padding: '6px 10px', cursor: 'pointer', fontFamily: TN_MONO, fontSize: 11,
        }}>↗ Video</button>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 100px' }}>
        {/* hero media */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <ExerciseTile ex={ex} height={210} big />
          {/* play button overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28, background: 'rgba(10,10,10,0.7)',
              border: `1px solid rgba(255,255,255,0.2)`, backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 2v14l11-7-11-7z" fill={TN_S.lime}/></svg>
            </div>
          </div>
        </div>

        {/* meta chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {[ex.equipment, ex.level, '4 series', '8-10 reps', '120s descanso'].map((t, i) => (
            <div key={i} style={{
              fontFamily: TN_MONO, fontSize: 10, color: TN_S.textDim,
              background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
              padding: '6px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5,
            }}>{t}</div>
          ))}
        </div>

        {/* muscles diagram (simplified) */}
        <TNCard style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Músculos trabajados</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ex.primary.map((m) => (
              <div key={m} style={{
                fontFamily: TN_FONT, fontSize: 12, fontWeight: 600, color: '#0A0A0A',
                background: TN_S.lime, padding: '6px 12px', borderRadius: 999,
              }}>{m}</div>
            ))}
            {ex.secondary.map((m) => (
              <div key={m} style={{
                fontFamily: TN_FONT, fontSize: 12, color: TN_S.textDim,
                background: TN_S.surface2, border: `1px solid ${TN_S.border2}`,
                padding: '6px 12px', borderRadius: 999,
              }}>{m}</div>
            ))}
          </div>
        </TNCard>

        {/* set log table */}
        <TNCard style={{ marginBottom: 16, padding: 0 }} padding={0}>
          <div style={{ padding: '14px 16px 8px', borderBottom: `1px solid ${TN_S.border}` }}>
            <div style={{ fontFamily: TN_FONT, fontSize: 14, fontWeight: 600, color: TN_S.text }}>Registro de series</div>
          </div>
          <div style={{ padding: '8px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 28px', gap: 8, padding: '6px 0', fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
              <div>Set</div><div>Reps</div><div>Kg</div><div>RPE</div><div></div>
            </div>
            {sets.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 28px', gap: 8,
                padding: '10px 0', borderTop: `1px solid ${TN_S.border}`,
                alignItems: 'center',
                background: s.active ? `linear-gradient(90deg, ${TN_S.limeMuted}, transparent)` : 'transparent',
              }}>
                <div style={{ fontFamily: TN_MONO, fontSize: 13, color: s.active ? TN_S.lime : TN_S.textDim, fontWeight: 600 }}>{i + 1}</div>
                <div style={{ fontFamily: TN_MONO, fontSize: 14, fontWeight: 600, color: TN_S.text }}>{s.reps}</div>
                <div style={{ fontFamily: TN_MONO, fontSize: 14, fontWeight: 600, color: TN_S.text }}>{s.kg}</div>
                <div style={{ fontFamily: TN_MONO, fontSize: 14, color: TN_S.textDim }}>{s.rpe}</div>
                <div>{s.done ? (
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: TN_S.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8l5-5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: 11, border: `1.5px dashed ${TN_S.border2}` }} />
                )}</div>
              </div>
            ))}
          </div>
        </TNCard>

        {/* Trainer tip */}
        <div style={{
          background: 'rgba(170,255,0,0.04)', border: `1px solid rgba(170,255,0,0.2)`,
          borderRadius: 16, padding: 14,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.5 2.5l1.5 1.5M10 10l1.5 1.5M2.5 11.5L4 10M10 4l1.5-1.5" stroke={TN_S.lime} strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="7" r="3" stroke={TN_S.lime} strokeWidth="1.4"/></svg>
            <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.limeText, textTransform: 'uppercase', letterSpacing: 1 }}>Tip de Nico</div>
          </div>
          <div style={{ fontFamily: TN_FONT, fontSize: 13, color: TN_S.text, lineHeight: 1.45 }}>{ex.tip}</div>
        </div>
      </div>

      {/* completion CTA */}
      <div style={{
        position: 'absolute', bottom: 90, left: 20, right: 20, zIndex: 25,
      }}>
        <button style={{
          width: '100%', background: TN_S.lime, color: '#0A0A0A',
          border: 'none', borderRadius: 14, padding: '16px',
          fontFamily: TN_FONT, fontWeight: 700, fontSize: 15, cursor: 'pointer',
          boxShadow: '0 12px 24px rgba(170,255,0,0.25)',
        }}>Completar serie 4 →</button>
      </div>

      <TNTabBar active="rutina" />
    </TNDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Progreso
// ─────────────────────────────────────────────────────────────
function ChartLine({ data, color = TN_S.lime, height = 100, fill = true }) {
  const W = 320, H = height;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - ((v - min) / span) * (H - 16) - 8]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD = `${d} L${W},${H} L0,${H} Z`;
  const gid = 'g-' + Math.random().toString(36).slice(2, 8);
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillD} fill={`url(#${gid})`} />
        </>
      )}
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => i === pts.length - 1 && (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill={color} fillOpacity="0.18" />
          <circle cx={x} cy={y} r="3" fill={color} />
        </g>
      ))}
    </svg>
  );
}
function ChartBars({ data, color = TN_S.lime, height = 90 }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', gap: 6, height, alignItems: 'flex-end' }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, height: `${(v / max) * 100}%`,
          background: i === data.length - 1 ? color : `${color}55`,
          borderRadius: 3,
        }} />
      ))}
    </div>
  );
}

function ScreenProgreso() {
  const [tab, setTab] = React.useState('peso');
  const series = tab === 'peso' ? TN_PROGRESS.weight : tab === 'volumen' ? TN_PROGRESS.volume : TN_PROGRESS.adherence;
  const current = series[series.length - 1];
  const delta = current - series[0];
  const tabs = [
    { id: 'peso', label: 'Peso' },
    { id: 'volumen', label: 'Volumen' },
    { id: 'adherencia', label: 'Adherencia' },
  ];
  const unit = tab === 'peso' ? 'kg' : tab === 'volumen' ? 'kg' : '%';
  const fmt = tab === 'volumen' ? (v) => (v / 1000).toFixed(1) + 't' : (v) => v.toFixed(tab === 'peso' ? 1 : 0);

  return (
    <TNDevice>
      <TNHeader greeting="Tu progreso" name="Últimas 8 semanas" avatar="L"
        right={<button style={{
          background: TN_S.surface, border: `1px solid ${TN_S.border2}`, color: TN_S.text,
          borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontFamily: TN_FONT, fontSize: 12, fontWeight: 500,
        }}>8S ▾</button>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 100px' }}>
        {/* tab switcher */}
        <div style={{
          display: 'flex', background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
          borderRadius: 12, padding: 4, marginBottom: 16,
        }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 8px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? TN_S.lime : 'transparent',
              color: tab === t.id ? '#0A0A0A' : TN_S.textDim,
              borderRadius: 8, fontFamily: TN_FONT, fontSize: 12, fontWeight: 600,
            }}>{t.label}</button>
          ))}
        </div>

        {/* big chart card */}
        <TNCard style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Actual</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: TN_MONO, fontSize: 32, fontWeight: 700, color: TN_S.text, letterSpacing: -1 }}>{fmt(current)}</span>
                <span style={{ fontFamily: TN_MONO, fontSize: 13, color: TN_S.textDim }}>{unit}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>vs S1</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 14, fontWeight: 600, color: delta < 0 && tab === 'peso' ? TN_S.lime : delta > 0 ? TN_S.lime : TN_S.warn }}>
                {delta > 0 ? '+' : ''}{tab === 'volumen' ? (delta / 1000).toFixed(1) + 't' : delta.toFixed(tab === 'peso' ? 1 : 0)}
              </div>
            </div>
          </div>
          {tab === 'adherencia' ? <ChartBars data={series} /> : <ChartLine data={series} />}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            {series.map((_, i) => (
              <div key={i} style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted }}>S{i + 1}</div>
            ))}
          </div>
        </TNCard>

        {/* PRs */}
        <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingLeft: 4 }}>Récords personales</div>
        <TNCard padding={0}>
          {TN_PROGRESS.prs.map((pr, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '14px 16px',
              borderTop: i ? `1px solid ${TN_S.border}` : 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 14,
                background: 'rgba(170,255,0,0.12)', color: TN_S.lime,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12,
                fontFamily: TN_MONO, fontSize: 11, fontWeight: 700,
              }}>★</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TN_FONT, fontSize: 14, fontWeight: 600, color: TN_S.text }}>{pr.ex}</div>
                <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, marginTop: 2 }}>{pr.when}</div>
              </div>
              <div style={{ fontFamily: TN_MONO, fontSize: 14, fontWeight: 700, color: TN_S.text }}>{pr.value}</div>
            </div>
          ))}
        </TNCard>
      </div>

      <TNTabBar active="progreso" />
    </TNDevice>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 5 — Nutrición
// ─────────────────────────────────────────────────────────────
function MacroBar({ label, eaten, target, color }) {
  const pct = Math.min(100, (eaten / target) * 100);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 6 }}>
        <span style={{ fontFamily: TN_MONO, fontSize: 16, fontWeight: 700, color: TN_S.text }}>{eaten}</span>
        <span style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted }}>/ {target}g</span>
      </div>
      <div style={{ height: 4, background: TN_S.surface2, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
}

function ScreenNutricion() {
  const n = TN_NUTRITION;
  const remaining = n.calories - n.caloriesEaten;
  const pct = Math.round((n.caloriesEaten / n.calories) * 100);
  return (
    <TNDevice>
      <TNHeader greeting="Jueves · 17 Mayo" name="Nutrición" avatar="L"
        right={<button style={{
          background: TN_S.lime, color: '#0A0A0A',
          border: 'none', borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
          fontFamily: TN_FONT, fontSize: 12, fontWeight: 600,
        }}>+ Comida</button>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '4px 20px 100px' }}>
        {/* calories ring */}
        <TNCard style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <TNRing size={110} stroke={10} value={pct}>
              <div style={{ fontFamily: TN_MONO, fontSize: 22, fontWeight: 700, color: TN_S.text, letterSpacing: -0.5 }}>{remaining}</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>kcal restan</div>
            </TNRing>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Objetivo</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 24, fontWeight: 700, color: TN_S.text, letterSpacing: -0.5, marginBottom: 8 }}>{n.calories} <span style={{ fontSize: 12, color: TN_S.textDim }}>kcal</span></div>
              <div style={{ fontFamily: TN_FONT, fontSize: 12, color: TN_S.textDim, lineHeight: 1.4 }}>Plan: <span style={{ color: TN_S.lime }}>Recomp · Lucía</span><br/>Asignado por Nico · S6</div>
            </div>
          </div>

          {/* macros */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${TN_S.border}` }}>
            <MacroBar label="Proteína" eaten={n.protein.eaten} target={n.protein.target} color={TN_S.lime} />
            <MacroBar label="Carbos" eaten={n.carbs.eaten} target={n.carbs.target} color="#FFB020" />
            <MacroBar label="Grasas" eaten={n.fat.eaten} target={n.fat.target} color="#FF5BA8" />
          </div>
        </TNCard>

        {/* meals */}
        <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingLeft: 4 }}>Comidas del día</div>
        {n.meals.map((m, i) => (
          <div key={i} style={{
            background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
            borderRadius: 14, padding: 14, marginBottom: 8,
            opacity: m.done ? 0.6 : 1,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: m.done ? TN_S.limeMuted : TN_S.surface2,
                border: `1px solid ${TN_S.border2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: TN_MONO, fontSize: 11, fontWeight: 600, color: m.done ? TN_S.lime : TN_S.textDim,
                flexShrink: 0,
              }}>{m.time}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontFamily: TN_FONT, fontSize: 14, fontWeight: 600, color: TN_S.text }}>{m.name}</div>
                  <div style={{ fontFamily: TN_MONO, fontSize: 12, fontWeight: 600, color: TN_S.text }}>{m.kcal} <span style={{ color: TN_S.textMuted, fontWeight: 400 }}>kcal</span></div>
                </div>
                <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textDim, marginTop: 2 }}>
                  P {m.p}g · C {m.c}g · G {m.f}g
                </div>
              </div>
            </div>
            <div style={{ fontFamily: TN_FONT, fontSize: 12, color: TN_S.textDim, marginTop: 10, lineHeight: 1.5 }}>
              {m.items.join(' · ')}
            </div>
          </div>
        ))}
      </div>

      <TNTabBar active="nutricion" />
    </TNDevice>
  );
}

Object.assign(window, {
  ScreenHoy, ScreenRutina, ScreenEjercicio, ScreenProgreso, ScreenNutricion,
  ExerciseTile, TNCard, TNStat, TNRing, ChartLine, ChartBars,
});
