// Admin desktop screens for Trainer Nico.
// Rendered inside ChromeWindow (1280×820). Dark themed.

// ─────────────────────────────────────────────────────────────
// Building blocks
// ─────────────────────────────────────────────────────────────
function AdminShell({ active = 'dashboard', children, onNav }) {
  const items = [
    { id: 'dashboard', label: 'Dashboard',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="13" width="6" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="2" width="6" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="10" y="7" width="6" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { id: 'alumnos', label: 'Alumnos', count: 8,
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 16c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: 'rutinas', label: 'Rutinas',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14M6 3v3M12 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: 'catalogo', label: 'Ejercicios', count: 62,
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="6.5" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="13.5" y="6.5" width="3" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M5 9h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: 'nutricion', label: 'Nutrición',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2c3.5 0 6 2.5 6 6 0 4-3.5 8-6 8s-6-4-6-8c0-3.5 2.5-6 6-6z" stroke="currentColor" strokeWidth="1.5"/><path d="M9 7v4M7 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { id: 'mensajes', label: 'Mensajes', count: 3,
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4h14v8a1 1 0 01-1 1H7l-4 3v-3H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
  ];

  return (
    <div style={{
      display: 'flex', width: '100%', height: '100%',
      background: TN_S.bg, fontFamily: TN_FONT, color: TN_S.text,
    }}>
      {/* sidebar */}
      <div style={{
        width: 230, flexShrink: 0, background: TN_S.bg,
        borderRight: `1px solid ${TN_S.border}`,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '22px 22px 30px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: TN_S.lime,
            color: '#0A0A0A', fontFamily: TN_FONT, fontWeight: 900, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -1,
          }}>TN</div>
          <div>
            <div style={{ fontFamily: TN_FONT, fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>Trainer Nico</div>
            <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Admin · v0.4</div>
          </div>
        </div>

        <div style={{ padding: '0 10px', flex: 1 }}>
          <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '8px 12px' }}>Workspace</div>
          {items.map((it) => {
            const isActive = it.id === active;
            return (
              <button key={it.id} onClick={() => onNav && onNav(it.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '9px 12px', marginBottom: 2, borderRadius: 8,
                background: isActive ? TN_S.surface : 'transparent',
                border: 'none', cursor: 'pointer',
                color: isActive ? TN_S.text : TN_S.textDim,
                fontFamily: TN_FONT, fontSize: 13, fontWeight: isActive ? 600 : 500,
                textAlign: 'left', position: 'relative',
              }}>
                {isActive && <div style={{ position: 'absolute', left: -10, top: 8, bottom: 8, width: 2, background: TN_S.lime, borderRadius: 1 }} />}
                {it.icon}
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.count != null && (
                  <span style={{
                    fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted,
                    background: TN_S.surface2, padding: '2px 7px', borderRadius: 4,
                  }}>{it.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* trainer card */}
        <div style={{ padding: 12 }}>
          <div style={{
            background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
            borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 16,
              background: `linear-gradient(135deg, ${TN_S.lime}, #6FAA00)`,
              color: '#0A0A0A', fontFamily: TN_FONT, fontWeight: 700, fontSize: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>N</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TN_FONT, fontSize: 12, fontWeight: 600 }}>Nico Trainer</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.lime, textTransform: 'uppercase', letterSpacing: 1 }}>● Online</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke={TN_S.textDim} strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}

function AdminTopBar({ title, subtitle, actions, search = true }) {
  return (
    <div style={{
      borderBottom: `1px solid ${TN_S.border}`, padding: '16px 28px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: TN_FONT, fontSize: 19, fontWeight: 700, color: TN_S.text, letterSpacing: -0.3 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {search && (
        <div style={{
          width: 260, height: 34, background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke={TN_S.textMuted} strokeWidth="1.5"/><path d="M9 9l3 3" stroke={TN_S.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input placeholder="Buscar alumnos, ejercicios…" style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: TN_S.text, fontFamily: TN_FONT, fontSize: 12,
          }} />
          <span style={{
            fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted,
            background: TN_S.surface2, padding: '2px 6px', borderRadius: 3,
          }}>⌘K</span>
        </div>
      )}
      {actions}
    </div>
  );
}

function AdminButton({ children, primary, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      background: primary ? TN_S.lime : TN_S.surface,
      color: primary ? '#0A0A0A' : TN_S.text,
      border: primary ? 'none' : `1px solid ${TN_S.border2}`,
      borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
      fontFamily: TN_FONT, fontSize: 12, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 6,
    }}>{icon}{children}</button>
  );
}

// Avatar with initials and student color
function AdminAvatar({ student, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: `linear-gradient(135deg, ${student.color}, ${student.color}88)`,
      color: '#0A0A0A', fontFamily: TN_FONT, fontWeight: 700,
      fontSize: size * 0.38, letterSpacing: -0.5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>{student.initials}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 1 — Admin Dashboard
// ─────────────────────────────────────────────────────────────
function AdminDashboard() {
  const checkIns = TN_STUDENTS.slice(0, 5).map((s, i) => ({
    student: s,
    action: ['Completó Upper Pull', 'Registró peso 88.4kg', 'PR en Sentadilla', 'Completó Lower A', 'Saltó descanso'][i],
    time: ['hace 4 min', 'hace 18 min', 'hace 32 min', 'hace 1h', 'hace 2h'][i],
    icon: ['✓', '⚖', '★', '✓', '!'][i],
    color: [TN_S.lime, TN_S.text, TN_S.lime, TN_S.lime, TN_S.warn][i],
  }));

  return (
    <AdminShell active="dashboard">
      <AdminTopBar title="Dashboard" subtitle="Jueves 17 Mayo · S6 del bloque"
        actions={<>
          <AdminButton icon={<span style={{ fontFamily: TN_MONO, fontSize: 13, lineHeight: 1 }}>+</span>}>Nuevo alumno</AdminButton>
          <AdminButton primary icon={<span style={{ fontFamily: TN_MONO, fontSize: 13, lineHeight: 1 }}>+</span>}>Nueva rutina</AdminButton>
        </>}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {/* metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
          {[
            { label: 'Alumnos activos', value: '8', delta: '+2 este mes', positive: true,
              spark: [4,5,5,6,6,7,8,8] },
            { label: 'Check-ins hoy', value: '12', delta: '+3 vs ayer', positive: true,
              spark: [6,8,7,9,10,9,11,12] },
            { label: 'Adherencia media', value: '83%', delta: '+2.4%', positive: true,
              spark: [78,80,79,82,81,83,82,83] },
            { label: 'PRs esta semana', value: '5', delta: '+1 vs S5', positive: true,
              spark: [2,3,3,4,4,5,4,5] },
          ].map((m, i) => (
            <div key={i} style={{
              background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
              borderRadius: 14, padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="2" cy="7" r="1" fill={TN_S.textMuted}/><circle cx="7" cy="7" r="1" fill={TN_S.textMuted}/><circle cx="12" cy="7" r="1" fill={TN_S.textMuted}/></svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <div style={{ fontFamily: TN_MONO, fontSize: 30, fontWeight: 700, color: TN_S.text, letterSpacing: -1 }}>{m.value}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
                <div style={{
                  fontFamily: TN_MONO, fontSize: 10,
                  color: m.positive ? TN_S.lime : TN_S.red,
                }}>↑ {m.delta}</div>
                <div style={{ width: 60, height: 22 }}>
                  <ChartLine data={m.spark} height={22} fill={false} color={TN_S.lime} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* main columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
          {/* recent check-ins / activity */}
          <div style={{
            background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
            borderRadius: 14, padding: 0, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${TN_S.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: TN_FONT, fontSize: 14, fontWeight: 600, color: TN_S.text }}>Actividad reciente</div>
                <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, marginTop: 2 }}>Tiempo real</div>
              </div>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.lime }}>● Live</div>
            </div>
            <div>
              {checkIns.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                  borderBottom: i < checkIns.length - 1 ? `1px solid ${TN_S.border}` : 'none',
                }}>
                  <AdminAvatar student={c.student} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TN_FONT, fontSize: 13, color: TN_S.text }}>
                      <strong style={{ fontWeight: 600 }}>{c.student.name}</strong>
                      <span style={{ color: TN_S.textDim, marginLeft: 6 }}>{c.action}</span>
                    </div>
                    <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, marginTop: 2 }}>{c.time}</div>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: c.color === TN_S.lime ? TN_S.limeMuted : c.color === TN_S.warn ? 'rgba(255,176,32,0.12)' : TN_S.surface2,
                    color: c.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: TN_MONO, fontSize: 12, fontWeight: 700,
                  }}>{c.icon}</div>
                </div>
              ))}
            </div>
          </div>

          {/* heads-up panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: TN_S.lime, color: '#0A0A0A',
              borderRadius: 14, padding: 18,
            }}>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.65 }}>Avances destacados</div>
              <div style={{ fontFamily: TN_FONT, fontSize: 16, fontWeight: 700, marginTop: 6, lineHeight: 1.3 }}>Tomás batió su PR de sentadilla esta mañana.</div>
              <div style={{ fontFamily: TN_MONO, fontSize: 11, marginTop: 6, opacity: 0.7 }}>170kg × 3 · S6 · semana de descarga</div>
              <button style={{
                background: '#0A0A0A', color: TN_S.lime, border: 'none', borderRadius: 8,
                padding: '8px 14px', marginTop: 14, cursor: 'pointer',
                fontFamily: TN_FONT, fontWeight: 600, fontSize: 12,
              }}>Ver gráfico →</button>
            </div>

            <div style={{
              background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
              borderRadius: 14, padding: 16,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontFamily: TN_FONT, fontSize: 13, fontWeight: 600 }}>Necesitan atención</div>
                <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.warn }}>2 alumnos</div>
              </div>
              {TN_STUDENTS.filter((s) => s.adherence < 75).map((s, i) => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                  borderTop: i ? `1px solid ${TN_S.border}` : 'none',
                }}>
                  <AdminAvatar student={s} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TN_FONT, fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.warn }}>Adherencia {s.adherence}%</div>
                  </div>
                  <button style={{
                    background: 'transparent', border: `1px solid ${TN_S.border2}`,
                    color: TN_S.text, borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
                    fontFamily: TN_FONT, fontSize: 11,
                  }}>Mensaje</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 2 — Admin Alumnos (table)
// ─────────────────────────────────────────────────────────────
function AdminAlumnos() {
  const [filter, setFilter] = React.useState('Todos');
  const tabs = ['Todos', 'Hipertrofia', 'Pérdida grasa', 'Fuerza', 'Inactivos'];

  return (
    <AdminShell active="alumnos">
      <AdminTopBar title="Alumnos" subtitle={`${TN_STUDENTS.length} activos · 0 archivados`}
        actions={<>
          <AdminButton icon={<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 4h11M3 7h7M5 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}>Filtros</AdminButton>
          <AdminButton primary icon={<span style={{ fontFamily: TN_MONO, fontSize: 13, lineHeight: 1 }}>+</span>}>Nuevo alumno</AdminButton>
        </>}
      />

      <div style={{ padding: '14px 28px 0', display: 'flex', gap: 4, borderBottom: `1px solid ${TN_S.border}` }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: 'transparent', border: 'none', padding: '8px 14px',
            cursor: 'pointer', position: 'relative',
            fontFamily: TN_FONT, fontSize: 12, fontWeight: 500,
            color: filter === t ? TN_S.text : TN_S.textDim,
          }}>
            {t}
            {filter === t && <div style={{ position: 'absolute', left: 14, right: 14, bottom: -1, height: 2, background: TN_S.lime, borderRadius: 1 }} />}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 28px 28px' }}>
        <div style={{
          background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
          borderRadius: 12, overflow: 'hidden',
        }}>
          {/* header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '32px 2.4fr 1fr 1fr 1.4fr 1.2fr 60px',
            padding: '10px 18px', gap: 16,
            background: TN_S.surface2, borderBottom: `1px solid ${TN_S.border}`,
            fontFamily: TN_MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: TN_S.textMuted,
          }}>
            <div><div style={{ width: 14, height: 14, border: `1.5px solid ${TN_S.border2}`, borderRadius: 3 }} /></div>
            <div>Alumno</div>
            <div>Objetivo</div>
            <div>Nivel</div>
            <div>Adherencia</div>
            <div>Último check-in</div>
            <div></div>
          </div>
          {TN_STUDENTS.map((s, i) => (
            <div key={s.id} style={{
              display: 'grid', gridTemplateColumns: '32px 2.4fr 1fr 1fr 1.4fr 1.2fr 60px',
              padding: '14px 18px', gap: 16, alignItems: 'center',
              borderBottom: i < TN_STUDENTS.length - 1 ? `1px solid ${TN_S.border}` : 'none',
            }}>
              <div><div style={{ width: 14, height: 14, border: `1.5px solid ${TN_S.border2}`, borderRadius: 3 }} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AdminAvatar student={s} size={36} />
                <div>
                  <div style={{ fontFamily: TN_FONT, fontSize: 13, fontWeight: 600, color: TN_S.text }}>{s.name}</div>
                  <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, marginTop: 2 }}>{s.age} años · {s.weight}kg</div>
                </div>
              </div>
              <div style={{ fontFamily: TN_FONT, fontSize: 12, color: TN_S.text }}>{s.goal}</div>
              <div>
                <div style={{
                  display: 'inline-block', fontFamily: TN_MONO, fontSize: 10,
                  color: TN_S.textDim, textTransform: 'uppercase', letterSpacing: 0.5,
                  background: TN_S.surface2, border: `1px solid ${TN_S.border2}`,
                  padding: '3px 8px', borderRadius: 4,
                }}>{s.level}</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: TN_S.surface2, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${s.adherence}%`, height: '100%',
                      background: s.adherence >= 85 ? TN_S.lime : s.adherence >= 70 ? '#FFB020' : TN_S.red,
                    }} />
                  </div>
                  <div style={{ fontFamily: TN_MONO, fontSize: 11, fontWeight: 600, color: TN_S.text, minWidth: 28 }}>{s.adherence}%</div>
                </div>
              </div>
              <div style={{ fontFamily: TN_MONO, fontSize: 11, color: TN_S.textDim }}>{s.lastCheckIn}</div>
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <button style={{ width: 28, height: 28, background: TN_S.surface2, border: 'none', borderRadius: 6, color: TN_S.textDim, cursor: 'pointer' }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ display: 'block', margin: 'auto' }}><circle cx="2.5" cy="6.5" r="1" fill="currentColor"/><circle cx="6.5" cy="6.5" r="1" fill="currentColor"/><circle cx="10.5" cy="6.5" r="1" fill="currentColor"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 3 — Constructor de rutinas
// ─────────────────────────────────────────────────────────────
function AdminRutinas() {
  // Compose a working routine view: assigned to Lucía, day 4 Upper Pull
  const dayEx = TN_ROUTINE.today.map((it) => ({ ...it, exObj: tnEx(it.ex) }));
  const days = ['L · Upper Push', 'M · Lower A', 'X · Descanso', 'J · Upper Pull', 'V · Lower B', 'S · Full Body', 'D · Descanso'];

  return (
    <AdminShell active="rutinas">
      <AdminTopBar title="Constructor de rutinas" subtitle="Editando: Lucía Romero · Hipertrofia U/L · S6"
        actions={<>
          <AdminButton>Vista previa móvil</AdminButton>
          <AdminButton>Guardar plantilla</AdminButton>
          <AdminButton primary>Asignar a alumno</AdminButton>
        </>}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* day rail */}
        <div style={{
          width: 200, flexShrink: 0, borderRight: `1px solid ${TN_S.border}`,
          padding: '18px 12px', overflow: 'auto',
        }}>
          <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '0 8px 10px' }}>Semana · S6</div>
          {days.map((d, i) => {
            const isActive = i === 3;
            return (
              <button key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                background: isActive ? TN_S.surface : 'transparent', border: 'none', cursor: 'pointer',
                color: isActive ? TN_S.text : TN_S.textDim, textAlign: 'left',
                fontFamily: TN_FONT, fontSize: 12, fontWeight: isActive ? 600 : 500,
                position: 'relative',
              }}>
                {isActive && <div style={{ position: 'absolute', left: -12, top: 10, bottom: 10, width: 2, background: TN_S.lime, borderRadius: 1 }} />}
                {d}
              </button>
            );
          })}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '10px 12px', borderRadius: 8, marginTop: 6,
            background: 'transparent', border: `1px dashed ${TN_S.border2}`, cursor: 'pointer',
            color: TN_S.textDim, fontFamily: TN_FONT, fontSize: 12,
          }}>+ Día</button>
        </div>

        {/* main builder */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Día 4 · Jueves</div>
              <div style={{ fontFamily: TN_FONT, fontSize: 22, fontWeight: 700, color: TN_S.text, letterSpacing: -0.4 }}>Upper Pull</div>
              <div style={{ fontFamily: TN_FONT, fontSize: 12, color: TN_S.textDim, marginTop: 4 }}>6 ejercicios · ~52 min · 18 series totales</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <AdminButton>Duplicar día</AdminButton>
              <AdminButton>Limpiar</AdminButton>
            </div>
          </div>

          {/* exercise stack */}
          <div>
            {dayEx.map((it, i) => {
              const c = tnGroupColor(it.exObj.group);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'stretch', marginBottom: 8,
                  background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
                  borderRadius: 12, overflow: 'hidden',
                }}>
                  <div style={{
                    width: 36, background: TN_S.surface2,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    borderRight: `1px solid ${TN_S.border}`, color: TN_S.textMuted,
                  }}>
                    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor"><circle cx="3" cy="2" r="1"/><circle cx="7" cy="2" r="1"/><circle cx="3" cy="7" r="1"/><circle cx="7" cy="7" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="7" cy="12" r="1"/></svg>
                    <div style={{ fontFamily: TN_MONO, fontSize: 10, marginTop: 6, fontWeight: 600 }}>{i + 1}</div>
                  </div>
                  <div style={{
                    width: 80, flexShrink: 0,
                    background: `linear-gradient(135deg, ${c}33, ${TN_S.surface2})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: TN_FONT, fontWeight: 900, fontSize: 22, color: c,
                    letterSpacing: -1, borderRight: `1px solid ${TN_S.border}`,
                  }}>{it.exObj.es.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</div>
                  <div style={{ flex: 1, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: TN_FONT, fontSize: 14, fontWeight: 600, color: TN_S.text }}>{it.exObj.es}</div>
                      <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textDim, marginTop: 2 }}>{it.exObj.group} · {it.exObj.equipment}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { label: 'Series', value: it.sets },
                        { label: 'Reps', value: it.reps },
                        { label: 'Descanso', value: `${it.rest}s` },
                        { label: 'Carga', value: it.weight ? `${it.weight}kg` : 'BW' },
                      ].map((f, fi) => (
                        <div key={fi} style={{
                          background: TN_S.surface2, border: `1px solid ${TN_S.border2}`,
                          borderRadius: 8, padding: '6px 10px', minWidth: 60,
                        }}>
                          <div style={{ fontFamily: TN_MONO, fontSize: 8, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{f.label}</div>
                          <div style={{ fontFamily: TN_MONO, fontSize: 13, fontWeight: 600, color: TN_S.text, marginTop: 2 }}>{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button style={{
                    width: 36, background: 'transparent', border: 'none', borderLeft: `1px solid ${TN_S.border}`,
                    color: TN_S.textMuted, cursor: 'pointer',
                  }}>×</button>
                </div>
              );
            })}
          </div>

          {/* add row */}
          <button style={{
            width: '100%', marginTop: 8, padding: '16px',
            background: 'transparent', border: `1px dashed ${TN_S.border2}`, borderRadius: 12,
            color: TN_S.textDim, cursor: 'pointer',
            fontFamily: TN_FONT, fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontFamily: TN_MONO, fontSize: 16, color: TN_S.lime }}>+</span>
            Añadir ejercicio del catálogo
          </button>
        </div>

        {/* right panel: quick-add catalog */}
        <div style={{
          width: 280, flexShrink: 0, borderLeft: `1px solid ${TN_S.border}`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '18px 16px 12px', borderBottom: `1px solid ${TN_S.border}` }}>
            <div style={{ fontFamily: TN_FONT, fontSize: 13, fontWeight: 600, color: TN_S.text }}>Añadir desde catálogo</div>
            <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, marginTop: 4 }}>Filtrado: Espalda · Bíceps</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
              {['Espalda', 'Bíceps', '+'].map((c, i) => (
                <div key={i} style={{
                  fontFamily: TN_MONO, fontSize: 10,
                  background: i < 2 ? TN_S.limeMuted : TN_S.surface2,
                  color: i < 2 ? TN_S.limeText : TN_S.textDim,
                  border: `1px solid ${i < 2 ? 'transparent' : TN_S.border2}`,
                  padding: '4px 8px', borderRadius: 4,
                }}>{c}</div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
            {TN_EXERCISES.filter((e) => ['Espalda', 'Bíceps'].includes(e.group)).slice(0, 8).map((ex) => {
              const c = tnGroupColor(ex.group);
              return (
                <div key={ex.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px',
                  borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                  background: 'transparent',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 7,
                    background: `linear-gradient(135deg, ${c}33, ${TN_S.surface2})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: TN_FONT, fontWeight: 900, fontSize: 12, color: c,
                    letterSpacing: -0.5, flexShrink: 0,
                  }}>{ex.es.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TN_FONT, fontSize: 12, fontWeight: 500, color: TN_S.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.es}</div>
                    <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, marginTop: 2 }}>{ex.equipment} · {ex.level}</div>
                  </div>
                  <button style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
                    color: TN_S.lime, cursor: 'pointer',
                    fontFamily: TN_MONO, fontSize: 14, lineHeight: 1, fontWeight: 700,
                    flexShrink: 0,
                  }}>+</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 4 — Catálogo de ejercicios
// ─────────────────────────────────────────────────────────────
function AdminCatalogo() {
  const [group, setGroup] = React.useState('Todos');
  const [level, setLevel] = React.useState('Todos');
  const [equip, setEquip] = React.useState('Todos');
  const filtered = TN_EXERCISES.filter((e) =>
    (group === 'Todos' || e.group === group) &&
    (level === 'Todos' || e.level === level) &&
    (equip === 'Todos' || e.equipment === equip)
  );

  return (
    <AdminShell active="catalogo">
      <AdminTopBar title="Catálogo de ejercicios" subtitle={`${filtered.length} de ${TN_EXERCISES.length} ejercicios`}
        actions={<>
          <AdminButton>Importar CSV</AdminButton>
          <AdminButton primary icon={<span style={{ fontFamily: TN_MONO, fontSize: 13, lineHeight: 1 }}>+</span>}>Nuevo ejercicio</AdminButton>
        </>}
      />

      {/* filter rail */}
      <div style={{
        padding: '14px 28px', borderBottom: `1px solid ${TN_S.border}`,
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ fontFamily: TN_MONO, fontSize: 10, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginRight: 4 }}>Filtros</div>
        <FilterSelect label="Grupo" value={group} options={['Todos', ...TN_GROUPS]} onChange={setGroup} />
        <FilterSelect label="Nivel" value={level} options={['Todos', ...TN_LEVELS]} onChange={setLevel} />
        <FilterSelect label="Equipamiento" value={equip} options={['Todos', ...TN_EQUIPMENT]} onChange={setEquip} />
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: TN_MONO, fontSize: 11, color: TN_S.textDim }}>
          <span style={{ color: TN_S.lime }}>3</span> seleccionados
        </div>
        <AdminButton>Añadir a rutina</AdminButton>
      </div>

      {/* grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 28px 28px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
        }}>
          {filtered.slice(0, 12).map((ex, i) => (
            <CatalogCard key={ex.id} ex={ex} selected={[0, 2, 5].includes(i)} />
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: value === 'Todos' ? TN_S.surface : TN_S.limeMuted,
        border: `1px solid ${value === 'Todos' ? TN_S.border2 : 'transparent'}`,
        color: value === 'Todos' ? TN_S.text : TN_S.limeText,
        borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
        fontFamily: TN_FONT, fontSize: 11, fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: TN_S.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}:</span>
        {value}
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 3l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 10,
          background: TN_S.surface, border: `1px solid ${TN_S.border2}`,
          borderRadius: 8, padding: 4, minWidth: 160,
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        }}>
          {options.map((o) => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '7px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
              background: o === value ? TN_S.surface2 : 'transparent',
              color: o === value ? TN_S.lime : TN_S.text,
              fontFamily: TN_FONT, fontSize: 12,
            }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogCard({ ex, selected }) {
  const c = tnGroupColor(ex.group);
  return (
    <div style={{
      background: TN_S.surface,
      border: `1px solid ${selected ? TN_S.lime : TN_S.border2}`,
      boxShadow: selected ? `0 0 0 3px rgba(170,255,0,0.08)` : 'none',
      borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
      position: 'relative',
    }}>
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          width: 22, height: 22, borderRadius: 11, background: TN_S.lime,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 5.5L4.5 8l5-5" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      <ExerciseTile ex={ex} height={132} />
      <div style={{ padding: 12 }}>
        <div style={{ fontFamily: TN_FONT, fontSize: 13, fontWeight: 600, color: TN_S.text, marginBottom: 2, lineHeight: 1.2 }}>{ex.es}</div>
        <div style={{ fontFamily: TN_MONO, fontSize: 9, color: TN_S.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{ex.en}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: TN_MONO, fontSize: 9, color: TN_S.textDim,
            background: TN_S.surface2, padding: '3px 6px', borderRadius: 3,
          }}>{ex.equipment}</div>
          <div style={{
            fontFamily: TN_MONO, fontSize: 9,
            color: ex.level === 'Principiante' ? TN_S.lime : ex.level === 'Intermedio' ? '#FFB020' : TN_S.red,
            background: TN_S.surface2, padding: '3px 6px', borderRadius: 3,
          }}>{ex.level}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AdminShell, AdminTopBar, AdminButton, AdminAvatar,
  AdminDashboard, AdminAlumnos, AdminRutinas, AdminCatalogo,
});
