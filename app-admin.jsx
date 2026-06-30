// Trainer Nico — Admin screens.
// Responsive: behaves on desktop AND mobile.

// Editable note card (admin-only edit on AlumnoDetail)
function NoteEditor({ studentId, fallback }) {
  const ov = useStore((s) => s.studentOverrides[studentId]);
  const stored = ov && ov.note != null ? ov.note : null;
  const value = stored != null ? stored : (fallback || '');
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  React.useEffect(() => { setDraft(value); }, [value, editing]);
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Notas privadas</div>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ background: 'transparent', border: 'none', color: T.accent, cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 600 }}>Editar</button>
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setEditing(false)} style={{ background: 'transparent', border: 'none', color: T.textDim, cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 500 }}>Cancelar</button>
            <button onClick={async () => { try { await tnSaveNoteDB(studentId, draft); setEditing(false); toast('Nota guardada', { kind: 'success' }); } catch(e){ toast(e.message||'Error',{kind:'error'}); } }} style={{ background: 'transparent', border: 'none', color: T.accent, cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 700 }}>Guardar</button>
          </div>
        )}
      </div>
      {editing ? (
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} autoFocus rows={4} placeholder="Lesión, observación técnica, recordatorio…" style={{
          width: '100%', boxSizing: 'border-box',
          background: T.surface2, border: `1px solid ${T.border2}`, color: T.text,
          borderRadius: 8, padding: 10, fontFamily: FONT, fontSize: 13, lineHeight: 1.5,
          resize: 'vertical', outline: 'none', minHeight: 80,
        }} />
      ) : (
        <div onClick={() => setEditing(true)} style={{ fontFamily: FONT, fontSize: 13, color: T.text, lineHeight: 1.5, minHeight: 60, cursor: 'text' }}>
          {value ? value : <span style={{ color: T.textMuted, fontStyle: 'italic' }}>Sin notas todavía. Tocá para agregar.</span>}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
function AdminBar({ title, subtitle, actions, search, onBack }) {
  const { isMobile } = useViewport();
  return (
    <div style={{
      borderBottom: `1px solid ${T.border}`,
      padding: isMobile ? '14px 16px' : '16px 28px',
      display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      position: 'sticky', top: 0, zIndex: 10, background: T.bg,
    }}>
      {onBack && (
        <button onClick={onBack} aria-label="Atrás" style={{
          width: 36, height: 36, borderRadius: 10, background: T.surface, border: `1px solid ${T.border2}`,
          color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{Icon.back()}</button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: isMobile ? 17 : 20, fontWeight: 700, color: T.text, letterSpacing: -0.3 }}>{title}</div>
        {subtitle && <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {!isMobile && search !== false && (
        <div style={{
          width: 250, height: 34, background: T.surface, border: `1px solid ${T.border2}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', flexShrink: 0,
        }}>
          {Icon.search(T.textMuted)}
          <input placeholder="Buscar…" style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontFamily: FONT, fontSize: 12, minWidth: 0,
          }} />
          <span style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, background: T.surface2, padding: '2px 6px', borderRadius: 3 }}>⌘K</span>
        </div>
      )}
      {actions && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}

// New-student creation modal (no backend — persists via addStudent).
function NewStudentModal({ open, onClose }) {
  const [f, setF] = React.useState({ name: '', email: '', age: '', goal: 'Hipertrofia', level: 'Principiante', weight: '', routineId: '', note: '' });
  React.useEffect(() => { if (open) setF({ name: '', email: '', age: '', goal: 'Hipertrofia', level: 'Principiante', weight: '', routineId: '', note: '' }); }, [open]);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const inputStyle = { width: '100%', boxSizing: 'border-box', background: T.surface2, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9, padding: '10px 12px', fontFamily: FONT, fontSize: 13, outline: 'none' };
  const labelStyle = { fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block' };
  const save = async () => {
    if (!f.name.trim()) { toast('El nombre es obligatorio', { kind: 'error' }); return; }
    let st;
    try { st = await tnAddStudentDB({ ...f, age: parseInt(f.age) || 25, weight: parseFloat(f.weight) || 70 }); }
    catch (e) { toast(e.message || 'Error al crear', { kind: 'error' }); return; }
    toast(`${st.name} agregado`, { kind: 'success' });
    onClose();
    navigate(`#/admin/alumnos/${st.id}`);
  };
  const recommended = (typeof ROUTINES !== 'undefined' ? ROUTINES : []).filter((r) => r.level === f.level);
  return (
    <Modal open={open} onClose={onClose} title="Nuevo alumno" width={480}
      actions={<>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn primary onClick={save}>Crear alumno</Btn>
      </>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Nombre completo *</label>
          <input style={inputStyle} value={f.name} autoFocus onChange={(e) => set('name', e.target.value)} placeholder="Ej: Martín Gómez" />
        </div>
        <div>
          <label style={labelStyle}>Email del alumno</label>
          <input style={inputStyle} type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="alumno@email.com" />
          <div style={{ fontFamily: FONT, fontSize: 11, color: T.textMuted, marginTop: 5, lineHeight: 1.4 }}>Con este email el alumno se registra (rol “Soy alumno”) y ve su rutina en el celular.</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Edad</label>
            <input style={inputStyle} type="number" value={f.age} onChange={(e) => set('age', e.target.value)} placeholder="30" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Peso (kg)</label>
            <input style={inputStyle} type="number" value={f.weight} onChange={(e) => set('weight', e.target.value)} placeholder="75" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Objetivo</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['Hipertrofia', 'Pérdida de grasa', 'Fuerza', 'Recomposición', 'Salud general'].map((g) => (
              <button key={g} onClick={() => set('goal', g)} style={{
                background: f.goal === g ? T.accentSoft : T.surface2, border: `1px solid ${f.goal === g ? 'transparent' : T.border2}`,
                color: f.goal === g ? T.accentText : T.textDim, fontFamily: FONT, fontSize: 12, fontWeight: 500,
                padding: '7px 11px', borderRadius: 7, cursor: 'pointer',
              }}>{g}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Nivel</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {LEVELS.map((lv) => (
              <button key={lv} onClick={() => set('level', lv)} style={{
                flex: 1, background: f.level === lv ? T.accentSoft : T.surface2, border: `1px solid ${f.level === lv ? 'transparent' : T.border2}`,
                color: f.level === lv ? T.accentText : T.textDim, fontFamily: FONT, fontSize: 12, fontWeight: 600,
                padding: '8px', borderRadius: 7, cursor: 'pointer',
              }}>{lv}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Rutina inicial</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={f.routineId} onChange={(e) => set('routineId', e.target.value)}>
            <option value="">Sin rutina (asignar luego)</option>
            {(typeof ROUTINES !== 'undefined' ? ROUTINES : []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Nota privada (opcional)</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={f.note} onChange={(e) => set('note', e.target.value)} placeholder="Lesiones, observaciones…" />
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function DestacadoRotativo() {
  useDataVersion();
  // Mezcla de avances reales (alumnos con buena adherencia / inventados de ejemplo).
  const items = React.useMemo(() => {
    const reales = (STUDENTS || []).filter((s) => s.adherence >= 80).slice(0, 4).map((s) => ({
      title: `${s.name} viene cumpliendo al ${s.adherence}%`,
      sub: `${s.goal} · ${s.level}`, sid: s.id,
    }));
    const inventados = [
      { title: 'Tomás batió su PR de sentadilla esta mañana', sub: '170 kg × 3 · nueva marca personal' },
      { title: 'Lucía bajó 1.4 kg manteniendo fuerza', sub: 'Recomposición en marcha 💪' },
      { title: 'Mateo completó 4 semanas seguidas sin faltar', sub: 'Adherencia 100% este mes' },
      { title: 'Sofía sumó 5 kg al peso muerto', sub: 'Progresión constante en tracción' },
      { title: 'Camila logró su primera dominada estricta', sub: 'Objetivo cumplido 🎯' },
      { title: 'Diego sostiene déficit hace 6 semanas', sub: '-2.1 kg y subiendo en press banca' },
    ];
    return [...reales, ...inventados];
  }, []);
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 40000);
    return () => clearInterval(t);
  }, [items.length]);
  const cur = items[i % items.length] || { title: 'Sumá tu primer alumno para ver avances', sub: '' };
  return (
    <div style={{ background: T.accent, color: '#0A0A0A', borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.65 }}>Avance destacado</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {items.slice(0, 8).map((_, k) => (
            <div key={k} style={{ width: 5, height: 5, borderRadius: 3, background: '#0A0A0A', opacity: k === (i % items.length) ? 0.85 : 0.25 }} />
          ))}
        </div>
      </div>
      <div key={i} style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, marginTop: 8, lineHeight: 1.3, animation: 'tn-fade-in .4s ease' }}>{cur.title}</div>
      {cur.sub ? <div style={{ fontFamily: MONO, fontSize: 11, marginTop: 6, opacity: 0.7 }}>{cur.sub}</div> : null}
      {cur.sid ? (
        <button onClick={() => navigate(`#/admin/alumnos/${cur.sid}`)} style={{
          background: '#0A0A0A', color: T.accent, border: 'none', borderRadius: 8,
          padding: '8px 14px', marginTop: 14, cursor: 'pointer', fontFamily: FONT, fontWeight: 600, fontSize: 12,
        }}>Ver alumno →</button>
      ) : null}
    </div>
  );
}

function AdminDashboard() {
  const { isMobile, isNarrow } = useViewport();
  const [newOpen, setNewOpen] = React.useState(false);
  const checkIns = STUDENTS.slice(0, 5).map((s, i) => ({
    student: s,
    action: ['Completó Upper Pull','Registró peso 88.4kg','PR en Sentadilla','Completó Lower A','Saltó descanso'][i],
    time: ['hace 4 min','hace 18 min','hace 32 min','hace 1h','hace 2h'][i],
    icon: ['✓','⚖','★','✓','!'][i],
    color: [T.accent, T.text, T.accent, T.accent, T.warn][i],
  }));
  const metrics = [
    { label: 'Alumnos activos',  value: STUDENTS.length,                                     delta: '+2 este mes', spark: [4,5,5,6,6,7,8,8] },
    { label: 'Check-ins hoy',    value: 12,                                                  delta: '+3 vs ayer',  spark: [6,8,7,9,10,9,11,12] },
    { label: 'Adherencia media', value: Math.round(STUDENTS.reduce((a,s)=>a+s.adherence,0)/STUDENTS.length) + '%', delta: '+2.4%',      spark: [78,80,79,82,81,83,82,83] },
    { label: 'PRs esta semana',  value: 5,                                                   delta: '+1 vs S5',    spark: [2,3,3,4,4,5,4,5] },
  ];

  return (
    <div>
      <NewStudentModal open={newOpen} onClose={() => setNewOpen(false)} />
      <AdminBar title="Dashboard" subtitle="Jueves 17 Mayo · S6 del bloque"
        actions={<>
          {!isMobile && <Btn icon={Icon.plus()} onClick={() => setNewOpen(true)}>Nuevo alumno</Btn>}
          <Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => navigate('#/admin/rutinas')}>Nueva rutina</Btn>
        </>}
      />
      <div style={{ padding: isMobile ? 16 : 24 }}>
        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
          {metrics.map((m, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{m.label}</div>
                {Icon.more(T.textMuted)}
              </div>
              <div style={{ fontFamily: MONO, fontSize: isMobile ? 26 : 30, fontWeight: 700, color: T.text, letterSpacing: -1, marginBottom: 6 }}>{m.value}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 6 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.accent }}>↑ {m.delta}</div>
                <div style={{ width: 60, height: 22 }}><LineChart data={m.spark} height={22} fill={false} /></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1.4fr 1fr', gap: 14 }}>
          {/* Activity */}
          <Card padding={0}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>Actividad reciente</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 2 }}>Tiempo real</div>
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.accent }}>● Live</div>
            </div>
            {checkIns.map((c, i) => (
              <div key={i} onClick={() => navigate(`#/admin/alumnos/${c.student.id}`)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                borderBottom: i < checkIns.length - 1 ? `1px solid ${T.border}` : 'none', cursor: 'pointer',
              }}>
                <Avatar student={c.student} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13, color: T.text }}>
                    <strong style={{ fontWeight: 600 }}>{c.student.name}</strong>
                    <span style={{ color: T.textDim, marginLeft: 6 }}>{c.action}</span>
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 2 }}>{c.time}</div>
                </div>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: c.color === T.accent ? T.accentSoft : c.color === T.warn ? 'rgba(255,176,32,0.12)' : T.surface2,
                  color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{c.icon}</div>
              </div>
            ))}
          </Card>

          {/* Side panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <DestacadoRotativo />

            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>Necesitan atención</div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.warn }}>{STUDENTS.filter(s=>s.adherence<75).length} alumnos</div>
              </div>
              {STUDENTS.filter((s) => s.adherence < 75).map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${T.border}` : 'none' }}>
                  <Avatar student={s} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.warn }}>Adherencia {s.adherence}%</div>
                  </div>
                  <Btn sm onClick={() => navigate(`#/admin/alumnos/${s.id}`)}>Ver</Btn>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ALUMNOS (list)
// ─────────────────────────────────────────────────────────────
function AdminAlumnos() {
  const { isMobile } = useViewport();
  const filter = useStore((s) => s.adminFilter);
  const tabs = ['Todos', 'Hipertrofia', 'Pérdida grasa', 'Fuerza', 'Inactivos'];
  const filtered = STUDENTS.filter((s) => {
    if (filter === 'Todos') return true;
    if (filter === 'Hipertrofia') return s.goal === 'Hipertrofia';
    if (filter === 'Pérdida grasa') return s.goal === 'Pérdida de grasa';
    if (filter === 'Fuerza') return s.goal === 'Fuerza';
    if (filter === 'Inactivos') return s.adherence < 75;
    return true;
  });
  const [newOpen, setNewOpen] = React.useState(false);

  return (
    <div>
      <NewStudentModal open={newOpen} onClose={() => setNewOpen(false)} />
      <AdminBar title="Alumnos" subtitle={`${filtered.length} alumnos`}
        actions={<>
          {!isMobile && <Btn icon={Icon.filter()} onClick={() => toast('Próximamente: filtros avanzados')}>Filtros</Btn>}
          <Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => setNewOpen(true)}>{isMobile ? 'Nuevo' : 'Nuevo alumno'}</Btn>
        </>}
      />

      <div style={{ padding: '12px 16px 0', display: 'flex', gap: 4, borderBottom: `1px solid ${T.border}`, overflowX: 'auto' }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setStore({ adminFilter: t })} style={{
            background: 'transparent', border: 'none', padding: '10px 14px',
            cursor: 'pointer', position: 'relative', whiteSpace: 'nowrap',
            fontFamily: FONT, fontSize: 12, fontWeight: 500,
            color: filter === t ? T.text : T.textDim,
          }}>
            {t}
            {filter === t && <div style={{ position: 'absolute', left: 14, right: 14, bottom: -1, height: 2, background: T.accent, borderRadius: 1 }} />}
          </button>
        ))}
      </div>

      <div style={{ padding: isMobile ? 12 : '14px 28px 28px' }}>
        {isMobile ? (
          // Mobile: card list
          filtered.map((s) => (
            <button key={s.id} onClick={() => navigate(`#/admin/alumnos/${s.id}`)} style={{
              display: 'flex', width: '100%', textAlign: 'left', alignItems: 'center', gap: 12,
              background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 12,
              padding: 12, marginBottom: 8, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Avatar student={s} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                  <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>{s.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: s.adherence >= 85 ? T.accent : s.adherence >= 70 ? T.warn : T.red }}>{s.adherence}%</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim }}>
                  {s.goal} · {s.level} · {s.weight}kg
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 4 }}>{s.lastCheckIn}</div>
              </div>
              {Icon.chev(T.textMuted)}
            </button>
          ))
        ) : (
          // Desktop: table
          <Card padding={0}>
            <div style={{
              display: 'grid', gridTemplateColumns: '32px 2.4fr 1fr 1fr 1.4fr 1.2fr 60px',
              padding: '10px 18px', gap: 16,
              background: T.surface2, borderBottom: `1px solid ${T.border}`,
              fontFamily: MONO, fontSize: 9, textTransform: 'uppercase', letterSpacing: 1, color: T.textMuted,
            }}>
              <div><div style={{ width: 14, height: 14, border: `1.5px solid ${T.border2}`, borderRadius: 3 }} /></div>
              <div>Alumno</div><div>Objetivo</div><div>Nivel</div><div>Adherencia</div><div>Último check-in</div><div></div>
            </div>
            {filtered.map((s, i) => (
              <div key={s.id} onClick={() => navigate(`#/admin/alumnos/${s.id}`)} style={{
                display: 'grid', gridTemplateColumns: '32px 2.4fr 1fr 1fr 1.4fr 1.2fr 60px',
                padding: '14px 18px', gap: 16, alignItems: 'center', cursor: 'pointer',
                borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
              }}>
                <div onClick={(e) => e.stopPropagation()}><div style={{ width: 14, height: 14, border: `1.5px solid ${T.border2}`, borderRadius: 3 }} /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar student={s} />
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text }}>{s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 2 }}>{s.age} años · {s.weight}kg</div>
                  </div>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: T.text }}>{s.goal}</div>
                <div><Chip>{s.level}</Chip></div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: T.surface2, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        width: `${s.adherence}%`, height: '100%',
                        background: s.adherence >= 85 ? T.accent : s.adherence >= 70 ? T.warn : T.red,
                      }} />
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: T.text, minWidth: 30 }}>{s.adherence}%</div>
                  </div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim }}>{s.lastCheckIn}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={(e) => { e.stopPropagation(); }} style={{ width: 28, height: 28, background: T.surface2, border: 'none', borderRadius: 6, color: T.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {Icon.more()}
                  </button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ALUMNO (detail)
// ─────────────────────────────────────────────────────────────
function AdminAlumnoDetail({ id }) {
  const { isMobile, isNarrow } = useViewport();
  const s = findStudent(id);
  // Live body weight when this is the demo alumno (id=1).
  const liveBodyWeight = useStore((st) => st.bodyWeight);
  const weight = s && s.id === 1 ? liveBodyWeight : s?.weight;
  // Resolve the student's actual assigned routine (honoring admin overrides).
  const ov = useStore((st) => st.studentOverrides[s ? s.id : 0]);
  const stuRoutine = s ? resolveRoutine((ov && ov.routineId) || s.routineId) : null;
  const [shareOpen, setShareOpen] = React.useState(false);
  if (!s) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ color: T.textDim, marginBottom: 16 }}>Alumno no encontrado.</div>
        <Btn onClick={() => navigate('#/admin/alumnos')} icon={Icon.back()}>Volver a Alumnos</Btn>
      </div>
    );
  }
  return (
    <div>
      <AdminBar title={s.name} subtitle={`${s.goal} · ${s.level} · ${s.age} años`}
        onBack={() => navigate('#/admin/alumnos')}
        actions={<>
          {!isMobile && <Btn icon={Icon.chat()} onClick={() => setShareOpen(true)}>Compartir acceso</Btn>}
          {isMobile && <Btn sm onClick={() => setShareOpen(true)}>Acceso</Btn>}
          <Btn primary onClick={() => navigate('#/admin/rutinas')}>Editar rutina</Btn>
        </>}
      />
      <ShareAccessModal open={shareOpen} onClose={() => setShareOpen(false)} student={s} />
      <div style={{ padding: isMobile ? 16 : 24 }}>
        {/* hero */}
        <div style={{
          display: 'flex', gap: 16, alignItems: 'center',
          background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 16,
          padding: isMobile ? 16 : 22, marginBottom: 14, flexWrap: 'wrap',
        }}>
          <Avatar student={s} size={isMobile ? 60 : 80} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: FONT, fontSize: isMobile ? 20 : 26, fontWeight: 700, letterSpacing: -0.4 }}>{s.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim, marginTop: 4 }}>Activo desde Marzo · {s.lastCheckIn}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              <Chip accent>{s.goal}</Chip>
              <Chip>{s.level}</Chip>
              <Chip>Plan: {stuRoutine ? stuRoutine.name : '—'}</Chip>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <Stat label="Peso" value={weight} unit="kg" delta={s.weightDelta} />
            <Stat label="Adherencia" value={`${s.adherence}%`} color={s.adherence >= 85 ? T.accent : s.adherence >= 70 ? T.warn : T.red} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1.6fr 1fr', gap: 14 }}>
          {/* Routine */}
          <Card padding={0}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600 }}>Rutina actual</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim }}>{stuRoutine.name}</div>
            </div>
            <div style={{ padding: 14 }}>
              {stuRoutine.days.filter((d) => d.exercises.length > 0).map((d) => (
                <div key={d.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{d.day}</div>
                      <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: T.text }}>{d.name}</div>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim }}>{d.exercises.length} ejercicios</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {d.exercises.map((it) => {
                      const ex = findExercise(it.id);
                      return (
                        <div key={it.id} style={{
                          fontFamily: FONT, fontSize: 11, color: T.textDim,
                          background: T.surface2, border: `1px solid ${T.border2}`,
                          padding: '5px 9px', borderRadius: 6,
                        }}>{ex.es} <span style={{ color: T.textMuted, fontFamily: MONO }}>· {it.sets}×{it.reps}</span></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Notes */}
            <NoteEditor studentId={s.id} fallback={s.note} />

            {/* Progress mini */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>Peso · 8 semanas</div>
                <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: s.weightDelta < 0 ? T.accent : T.warn }}>{s.weightDelta > 0 ? '+' : ''}{s.weightDelta}kg</div>
              </div>
              <LineChart data={PROGRESS.weight} height={70} />
            </Card>

            <Card>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Quick actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Btn full ghost style={{ justifyContent: 'flex-start', background: T.surface2 }} icon={Icon.cal()}
                  onClick={() => navigate('#/admin/rutinas')}>Editar rutina</Btn>
                <Btn full ghost style={{ justifyContent: 'flex-start', background: T.surface2 }} icon={Icon.apple()}
                  onClick={() => navigate('#/admin/nutricion')}>Asignar plan nutricional</Btn>
                <Btn full ghost style={{ justifyContent: 'flex-start', background: T.surface2 }} icon={Icon.chart()}
                  onClick={() => toast('Próximamente: vista de progreso completa')}>Ver progreso completo</Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RUTINAS (builder)
// ─────────────────────────────────────────────────────────────
function AdminRutinas() {
  const { isMobile, isNarrow } = useViewport();
  const dayIdx = useStore((s) => s.builderDayIdx);
  const [quickAddOpen, setQuickAddOpen] = React.useState(false);
  const [qaGroup, setQaGroup] = React.useState('Todos');
  const day = ROUTINE.days[dayIdx];
  // Subscribe to live edits of this day's exercises.
  useStore((s) => s.customDayExs[day.id]);
  const liveExs = getDayExercises(day.id);

  const filteredQA = EXERCISES.filter((e) => qaGroup === 'Todos' || e.group === qaGroup)
    .filter((e) => !liveExs.some((x) => x.id === e.id));

  const DayRail = () => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 6 : 2, overflowX: 'auto', padding: isMobile ? '0 16px 4px' : '0' }}>
      {ROUTINE.days.map((d, i) => {
        const isActive = i === dayIdx;
        return (
          <button key={d.id} onClick={() => setStore({ builderDayIdx: i })} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: isMobile ? '8px 14px' : '10px 12px', borderRadius: 8,
            background: isActive ? T.surface : 'transparent', border: 'none', cursor: 'pointer',
            color: isActive ? T.text : T.textDim, textAlign: 'left',
            fontFamily: FONT, fontSize: 12, fontWeight: isActive ? 600 : 500,
            position: 'relative', whiteSpace: 'nowrap', flexShrink: 0,
            width: isMobile ? 'auto' : '100%',
          }}>
            {isActive && !isMobile && <div style={{ position: 'absolute', left: -12, top: 10, bottom: 10, width: 2, background: T.accent, borderRadius: 1 }} />}
            <span style={{ fontFamily: MONO, color: isActive ? T.accent : T.textMuted }}>{d.day}</span>
            <span>{d.name}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div>
      <AdminBar title="Constructor de rutinas" subtitle="Editando: Lucía Romero · Upper/Lower · S6"
        actions={<>
          {!isMobile && <Btn onClick={() => toast('Plantilla guardada', { kind: 'success' })}>Guardar plantilla</Btn>}
          <Btn primary onClick={() => toast('Rutina asignada a Lucía', { kind: 'success' })}>Asignar</Btn>
        </>}
      />

      {isMobile ? (
        // mobile: stacked
        <div>
          <div style={{ padding: '12px 0', borderBottom: `1px solid ${T.border}` }}><DayRail /></div>
          <div style={{ padding: 16 }}>
            <DayBuilder dayId={day.id} dayMeta={day} onOpenAdd={() => setQuickAddOpen(true)} />
          </div>
          {quickAddOpen && (
            <div onClick={() => setQuickAddOpen(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
              zIndex: 100, display: 'flex', alignItems: 'flex-end',
            }}>
              <div onClick={(e) => e.stopPropagation()} style={{
                width: '100%', maxHeight: '80vh', background: T.bg,
                borderTopLeftRadius: 20, borderTopRightRadius: 20,
                border: `1px solid ${T.border2}`, display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ padding: 16, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600 }}>Añadir del catálogo</div>
                  <button onClick={() => setQuickAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim }}>{Icon.x()}</button>
                </div>
                <div style={{ display: 'flex', gap: 6, padding: 12, overflowX: 'auto', borderBottom: `1px solid ${T.border}` }}>
                  {['Todos', ...GROUPS].map((g) => (
                    <button key={g} onClick={() => setQaGroup(g)} style={{
                      background: qaGroup === g ? T.accentSoft : T.surface,
                      border: `1px solid ${qaGroup === g ? 'transparent' : T.border2}`,
                      color: qaGroup === g ? T.accentText : T.textDim,
                      fontFamily: MONO, fontSize: 10, fontWeight: 500,
                      padding: '6px 10px', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                    }}>{g}</button>
                  ))}
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
                  {filteredQA.slice(0, 20).map((ex) => (
                    <QuickAddRow key={ex.id} ex={ex} onAdd={() => {
                      if (addDayExercise(day.id, ex.id)) {
                        toast(`Añadido: ${ex.es}`, { kind: 'success' });
                      } else {
                        toast('Ya está en el día', { kind: 'error' });
                      }
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // desktop: 3-pane
        <div style={{ display: 'flex', height: 'calc(100vh - 130px)', minHeight: 500 }}>
          <div style={{ width: 200, flexShrink: 0, borderRight: `1px solid ${T.border}`, padding: '18px 12px', overflow: 'auto' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px 10px' }}>Semana · S6</div>
            <DayRail />
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 24, minWidth: 0 }}>
            <DayBuilder dayId={day.id} dayMeta={day} onOpenAdd={() => {}} />
          </div>
          <div style={{ width: 280, flexShrink: 0, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 16px 12px', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text }}>Añadir del catálogo</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 4 }}>{filteredQA.length} ejercicios</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
                {['Todos','Espalda','Bíceps','Pecho','Hombros'].map((g) => (
                  <button key={g} onClick={() => setQaGroup(g)} style={{
                    background: qaGroup === g ? T.accentSoft : T.surface2,
                    border: `1px solid ${qaGroup === g ? 'transparent' : T.border2}`,
                    color: qaGroup === g ? T.accentText : T.textDim,
                    fontFamily: MONO, fontSize: 9, fontWeight: 500,
                    padding: '4px 8px', borderRadius: 5, cursor: 'pointer',
                  }}>{g}</button>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '10px 12px' }}>
              {filteredQA.slice(0, 14).map((ex) => (
                <QuickAddRow key={ex.id} ex={ex} onAdd={() => {
                  if (addDayExercise(day.id, ex.id)) toast(`Añadido: ${ex.es}`, { kind: 'success' });
                  else toast('Ya está en el día', { kind: 'error' });
                }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayBuilder({ dayId, dayMeta, onOpenAdd }) {
  const { isMobile } = useViewport();
  // Subscribe to live edits.
  useStore((s) => s.customDayExs[dayId]);
  const exs = getDayExercises(dayId);
  const [confirmRemove, setConfirmRemove] = React.useState(null); // exId
  const day = dayMeta;
  if (exs.length === 0 && day.exercises.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: T.textDim }}>
        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 6 }}>{day.name}</div>
        <div style={{ fontFamily: FONT, fontSize: 13, marginBottom: 20 }}>Día de descanso. {day.focus && `Sugerencia: ${day.focus.toLowerCase()}.`}</div>
        <Btn icon={Icon.plus()} onClick={onOpenAdd}>Agregar ejercicio</Btn>
      </div>
    );
  }
  if (exs.length === 0) {
    // User removed all exercises
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: T.textDim }}>
        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 6 }}>{day.name} — vacío</div>
        <div style={{ fontFamily: FONT, fontSize: 13, marginBottom: 20 }}>Agregá ejercicios desde el catálogo.</div>
        <Btn icon={Icon.plus()} onClick={onOpenAdd}>Agregar ejercicio</Btn>
        <div style={{ marginTop: 10 }}>
          <button onClick={() => { setDayExercises(dayId, day.exercises); toast('Restaurado al original', { kind: 'success' }); }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: T.textMuted, fontFamily: FONT, fontSize: 12, padding: 6 }}>
            Restaurar original
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{day.day} · {day.name}</div>
          <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: -0.4 }}>{day.focus}</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: T.textDim, marginTop: 4 }}>
            {exs.length} ejercicios · {exs.reduce((s,e)=>s+e.sets,0)} series totales
          </div>
        </div>
      </div>
      {exs.map((it, i) => {
        const ex = findExercise(it.id);
        if (!ex) return null;
        const c = groupColor(ex.group);
        return (
          <div key={it.id} style={{
            display: 'flex', alignItems: 'stretch', marginBottom: 8,
            background: T.surface, border: `1px solid ${T.border2}`,
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{ width: 30, background: T.surface2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: T.textMuted, borderRight: `1px solid ${T.border}`, flexShrink: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>{i + 1}</div>
            </div>
            <div style={{
              width: isMobile ? 56 : 70, flexShrink: 0,
              background: `linear-gradient(135deg, ${c}33, ${T.surface2})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT, fontWeight: 900, fontSize: isMobile ? 16 : 20, color: c, letterSpacing: -1,
              borderRight: `1px solid ${T.border}`,
            }}>{ex.es.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}</div>
            <div style={{ flex: 1, padding: '10px 12px', minWidth: 0 }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.es}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim, marginTop: 2 }}>{ex.group} · {ex.equipment}</div>
              {isMobile && (
                <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                  <Chip>{it.sets}×{it.reps}</Chip><Chip>{it.rest}s</Chip>{it.weight ? <Chip>{it.weight}kg</Chip> : null}
                </div>
              )}
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '10px 12px' }}>
                {[{ l: 'Series', v: it.sets }, { l: 'Reps', v: it.reps }, { l: 'Desc.', v: `${it.rest}s` }, { l: 'Kg', v: it.weight || 'BW' }].map((f, fi) => (
                  <div key={fi} style={{ background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 7, padding: '4px 8px', minWidth: 48, textAlign: 'center' }}>
                    <div style={{ fontFamily: MONO, fontSize: 8, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{f.l}</div>
                    <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: T.text }}>{f.v}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setConfirmRemove(it.id)} title="Eliminar ejercicio" style={{ width: 36, background: 'transparent', border: 'none', borderLeft: `1px solid ${T.border}`, color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Icon.trash()}</button>
          </div>
        );
      })}
      <button onClick={onOpenAdd} style={{
        width: '100%', marginTop: 8, padding: '16px',
        background: 'transparent', border: `1px dashed ${T.border2}`, borderRadius: 12,
        color: T.textDim, cursor: 'pointer',
        fontFamily: FONT, fontSize: 13, fontWeight: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <span style={{ color: T.accent, fontFamily: MONO, fontSize: 16, lineHeight: 1 }}>+</span>
        Añadir ejercicio del catálogo
      </button>

      <Modal open={!!confirmRemove} onClose={() => setConfirmRemove(null)}
        title="Eliminar ejercicio"
        actions={<>
          <Btn onClick={() => setConfirmRemove(null)}>Cancelar</Btn>
          <Btn primary danger style={{ background: T.red, color: '#fff', border: 'none' }}
            onClick={() => { const ex = findExercise(confirmRemove); removeDayExercise(dayId, confirmRemove); setConfirmRemove(null); toast(`Eliminado: ${ex.es}`); }}>
            Eliminar
          </Btn>
        </>}
      >
        <div style={{ fontFamily: FONT, fontSize: 14, color: T.textDim, lineHeight: 1.5 }}>
          ¿Quitás <strong style={{ color: T.text }}>{confirmRemove && findExercise(confirmRemove)?.es}</strong> de este día? Esta acción se puede revertir restaurando el original.
        </div>
      </Modal>
    </div>
  );
}

function QuickAddRow({ ex, onAdd }) {
  const c = groupColor(ex.group);
  return (
    <div onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, marginBottom: 2, cursor: 'pointer' }}>
      <ExerciseTile ex={ex} compact />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.es}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, marginTop: 2 }}>{ex.equipment} · {ex.level}</div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onAdd && onAdd(); }} style={{
        width: 26, height: 26, borderRadius: 6,
        background: T.surface, border: `1px solid ${T.border2}`, color: T.accent,
        cursor: 'pointer', fontFamily: MONO, fontSize: 15, lineHeight: 1, fontWeight: 700,
        flexShrink: 0,
      }}>+</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: value === 'Todos' ? T.surface : T.accentSoft,
        border: `1px solid ${value === 'Todos' ? T.border2 : 'transparent'}`,
        color: value === 'Todos' ? T.text : T.accentText,
        borderRadius: 8, padding: '7px 11px', cursor: 'pointer',
        fontFamily: FONT, fontSize: 12, fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: T.textMuted, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}:</span>
        {value}
        {Icon.chev(T.textDim)}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
          background: T.surface, border: `1px solid ${T.border2}`,
          borderRadius: 8, padding: 4, minWidth: 160, maxHeight: 260, overflow: 'auto',
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
        }}>
          {options.map((o) => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              padding: '8px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
              background: o === value ? T.surface2 : 'transparent',
              color: o === value ? T.accent : T.text,
              fontFamily: FONT, fontSize: 12,
            }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// Crear ejercicio nuevo en el catálogo (persistido en Supabase)
function NewExerciseModal({ open, onClose }) {
  const [f, setF] = React.useState({ es: '', en: '', group: 'Pecho', equipment: 'Barra', level: 'Principiante', drive_id: '' });
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { if (open) setF({ es: '', en: '', group: 'Pecho', equipment: 'Barra', level: 'Principiante', drive_id: '' }); }, [open]);
  const inputStyle = { width: '100%', boxSizing: 'border-box', background: T.surface2, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9, padding: '10px 12px', fontFamily: FONT, fontSize: 13, outline: 'none' };
  const labelStyle = { fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block' };
  const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40);
  const drveId = (v) => { const m = String(v).match(/[-\w]{25,}/); return m ? m[0] : v.trim(); };
  const create = async () => {
    if (!f.es.trim()) { toast('Poné el nombre del ejercicio', { kind: 'error' }); return; }
    let id = slug(f.es); if (findExercise(id)) id = id + '-' + Math.random().toString(36).slice(2, 5);
    setBusy(true);
    try {
      const ex = await dbAddExercise({ id, es: f.es.trim(), en: f.en.trim(), group: f.group, equipment: f.equipment, level: f.level, drive_id: f.drive_id ? drveId(f.drive_id) : null });
      EXERCISES.push(ex); bumpData();
      toast('Ejercicio agregado ✓', { kind: 'success' });
      onClose();
    } catch (e) { toast(e.message || 'Error al crear', { kind: 'error' }); }
    setBusy(false);
  };
  return (
    <Modal open={open} onClose={onClose} title="Nuevo ejercicio" width={460}
      actions={<><Btn onClick={onClose}>Cancelar</Btn><Btn primary disabled={busy} onClick={create}>{busy ? 'Creando…' : 'Crear ejercicio'}</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label style={labelStyle}>Nombre (español) *</label>
          <input style={inputStyle} autoFocus value={f.es} onChange={(e) => setF({ ...f, es: e.target.value })} placeholder="Ej: Press inclinado en multipower" /></div>
        <div><label style={labelStyle}>Nombre (inglés)</label>
          <input style={inputStyle} value={f.en} onChange={(e) => setF({ ...f, en: e.target.value })} placeholder="Smith Incline Press" /></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Grupo</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={f.group} onChange={(e) => setF({ ...f, group: e.target.value })}>{GROUPS.map((g) => <option key={g}>{g}</option>)}</select></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Equipo</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={f.equipment} onChange={(e) => setF({ ...f, equipment: e.target.value })}>{EQUIPMENT.map((g) => <option key={g}>{g}</option>)}</select></div>
        </div>
        <div><label style={labelStyle}>Nivel</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {LEVELS.map((lv) => (<button key={lv} onClick={() => setF({ ...f, level: lv })} style={{ flex: 1, background: f.level === lv ? T.accentSoft : T.surface2, border: `1px solid ${f.level === lv ? 'transparent' : T.border2}`, color: f.level === lv ? T.accentText : T.textDim, fontFamily: FONT, fontSize: 12, fontWeight: 600, padding: '8px', borderRadius: 7, cursor: 'pointer' }}>{lv}</button>))}
          </div></div>
        <div><label style={labelStyle}>Imagen — ID o link de Google Drive (opcional)</label>
          <input style={inputStyle} value={f.drive_id} onChange={(e) => setF({ ...f, drive_id: e.target.value })} placeholder="Pegá el link de la imagen en Drive" />
          <div style={{ fontFamily: FONT, fontSize: 11, color: T.textMuted, marginTop: 5, lineHeight: 1.4 }}>La imagen debe ser pública (cualquiera con el link). Si lo dejás vacío, se muestra una ficha con iniciales.</div></div>
      </div>
    </Modal>
  );
}

function AdminCatalogo() {
  const { isMobile } = useViewport();
  const { catGroup, catLevel, catEquip, catSearch, catSelected } = useStore((s) => s);
  const filtered = EXERCISES.filter((e) =>
    (catGroup === 'Todos' || e.group === catGroup) &&
    (catLevel === 'Todos' || e.level === catLevel) &&
    (catEquip === 'Todos' || e.equipment === catEquip) &&
    (!catSearch || (e.es + ' ' + e.en).toLowerCase().includes(catSearch.toLowerCase()))
  );
  const toggle = (id) => setStore((s) => ({
    catSelected: s.catSelected.includes(id) ? s.catSelected.filter((x) => x !== id) : [...s.catSelected, id],
  }));
  const [newOpen, setNewOpen] = React.useState(false);
  useDataVersion();

  return (
    <div>
      <NewExerciseModal open={newOpen} onClose={() => setNewOpen(false)} />
      <AdminBar title="Catálogo de ejercicios" subtitle={`${filtered.length} de ${EXERCISES.length} ejercicios`}
        actions={<>
          {!isMobile && <Btn onClick={() => toast('Próximamente: importar CSV')}>Importar CSV</Btn>}
          <Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => setNewOpen(true)}>{isMobile ? 'Nuevo' : 'Nuevo ejercicio'}</Btn>
        </>}
      />

      <div style={{
        padding: isMobile ? '12px 16px' : '14px 28px',
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{
          flex: isMobile ? '1 1 100%' : '0 1 240px',
          height: 34, background: T.surface, border: `1px solid ${T.border2}`,
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
        }}>
          {Icon.search(T.textMuted)}
          <input value={catSearch} onChange={(e) => setStore({ catSearch: e.target.value })} placeholder="Buscar ejercicio…" style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: T.text, fontFamily: FONT, fontSize: 12, minWidth: 0,
          }} />
          {catSearch && <button onClick={() => setStore({ catSearch: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: 0 }}>{Icon.x()}</button>}
        </div>
        <FilterDropdown label="Grupo" value={catGroup} options={['Todos', ...GROUPS]} onChange={(v) => setStore({ catGroup: v })} />
        <FilterDropdown label="Nivel" value={catLevel} options={['Todos', ...LEVELS]} onChange={(v) => setStore({ catLevel: v })} />
        <FilterDropdown label="Equipo" value={catEquip} options={['Todos', ...EQUIPMENT]} onChange={(v) => setStore({ catEquip: v })} />
        {(catGroup !== 'Todos' || catLevel !== 'Todos' || catEquip !== 'Todos' || catSearch) && (
          <Btn sm ghost style={{ color: T.accent }} onClick={() => setStore({ catGroup: 'Todos', catLevel: 'Todos', catEquip: 'Todos', catSearch: '' })}>Limpiar</Btn>
        )}
        <div style={{ flex: 1 }} />
        {catSelected.length > 0 && (
          <>
            <div style={{ fontFamily: MONO, fontSize: 11, color: T.accent }}>{catSelected.length} seleccionados</div>
            <Btn sm onClick={() => setStore({ catSelected: [] })}>Limpiar</Btn>
            <Btn primary sm onClick={() => { toast(`${catSelected.length} ejercicio${catSelected.length>1?'s':''} añadido${catSelected.length>1?'s':''} a la rutina`, { kind: 'success' }); setStore({ catSelected: [] }); navigate('#/admin/rutinas'); }}>Añadir a rutina</Btn>
          </>
        )}
      </div>

      <div style={{ padding: isMobile ? 16 : '20px 28px 28px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: T.textDim }}>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>Sin resultados</div>
            <div style={{ fontFamily: FONT, fontSize: 13 }}>Probá ajustar los filtros o la búsqueda.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12,
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))',
          }}>
            {filtered.map((ex) => (
              <CatalogCard key={ex.id} ex={ex} selected={catSelected.includes(ex.id)} onToggle={() => toggle(ex.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CatalogCard({ ex, selected, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      background: T.surface,
      border: `1px solid ${selected ? T.accent : T.border2}`,
      boxShadow: selected ? `0 0 0 3px ${T.accentSoft}` : 'none',
      borderRadius: 12, overflow: 'hidden', cursor: 'pointer', position: 'relative',
      transition: 'all .15s',
    }}>
      {selected && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          width: 22, height: 22, borderRadius: 11, background: T.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.check('#0A0A0A')}</div>
      )}
      <ExerciseTile ex={ex} height={120} />
      <div style={{ padding: 12 }}>
        <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2, lineHeight: 1.2 }}>{ex.es}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{ex.en}</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <Chip>{ex.equipment}</Chip>
          <Chip color={ex.level === 'Principiante' ? T.accent : ex.level === 'Intermedio' ? T.warn : T.red}
            style={{ background: T.surface2 }}>{ex.level}</Chip>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BIBLIOTECA DE RUTINAS (40+ precargadas)
// ─────────────────────────────────────────────────────────────
// Modal: crea/regenera el acceso del alumno y muestra link + credenciales.
function ShareAccessModal({ open, onClose, student }) {
  const [busy, setBusy] = React.useState(false);
  const [cred, setCred] = React.useState(null); // { email, password }
  React.useEffect(() => { if (open) { setCred(null); setBusy(false); } }, [open]);
  const appUrl = window.location.origin + window.location.pathname;
  const generate = async () => {
    if (!student.email) { toast('Este alumno no tiene email. Editá su ficha y agregalo.', { kind: 'error' }); return; }
    setBusy(true);
    try { const r = await tnCreateAccessDB(student.id); setCred(r); toast('Acceso creado ✓', { kind: 'success' }); }
    catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
    setBusy(false);
  };
  const msg = cred ? `¡Hola ${student.name}! 💪 Ya tenés tu acceso a Trainer Nico.\n\n🔗 App: ${appUrl}\n\nIngresá con:\n📧 Email: ${cred.email}\n🔑 Contraseña: ${cred.password}\n\nElegí "Soy alumno" para entrar. ¡Nos vemos en el entrenamiento!` : '';
  const copy = () => { navigator.clipboard?.writeText(msg).then(() => toast('Copiado al portapapeles', { kind: 'success' })).catch(() => toast('No se pudo copiar', { kind: 'error' })); };
  const wa = () => {
    const url = 'https://wa.me/?text=' + encodeURIComponent(msg);
    // window.open suele estar bloqueado dentro de iframes/apps embebidas.
    // Un click sobre un <a target="_blank"> es mucho más permisivo.
    try {
      const a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {
      const win = window.open(url, '_blank');
      if (!win) { copy(); toast('Abrí WhatsApp y pegá el mensaje (ya lo copiamos)', {}); }
    }
  };
  const row = (label, value) => (
    <div style={{ background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 9, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
        <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: T.text, wordBreak: 'break-all' }}>{value}</div>
      </div>
      <button onClick={() => { navigator.clipboard?.writeText(value); toast('Copiado', { kind: 'success' }); }} style={{ background: T.surface, border: `1px solid ${T.border2}`, color: T.accent, borderRadius: 7, padding: '6px 10px', cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>Copiar</button>
    </div>
  );
  return (
    <Modal open={open} onClose={onClose} title={`Acceso de ${student ? student.name : ''}`} width={460}
      actions={cred ? <>
        <Btn onClick={copy} icon={Icon.copy ? Icon.copy() : null}>Copiar mensaje</Btn>
        <Btn primary onClick={wa}>Enviar por WhatsApp</Btn>
      </> : <>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn primary disabled={busy} onClick={generate}>{busy ? 'Creando…' : 'Crear acceso'}</Btn>
      </>}>
      {!cred ? (
        <div style={{ fontFamily: FONT, fontSize: 14, color: T.textDim, lineHeight: 1.6 }}>
          Se va a crear (o regenerar) la cuenta de <strong style={{ color: T.text }}>{student && student.name}</strong> con una contraseña nueva.
          {student && student.email
            ? <> El email registrado es <strong style={{ color: T.accentText }}>{student.email}</strong>.</>
            : <div style={{ color: T.warn, marginTop: 10 }}>⚠ Este alumno no tiene email cargado. Editá su ficha y agregá uno antes de generar el acceso.</div>}
          <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 12, color: T.textMuted }}>Después vas a poder enviarle el link + datos por WhatsApp.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontFamily: FONT, fontSize: 13, color: T.accentText, marginBottom: 2 }}>✓ Acceso listo. Enviale estos datos:</div>
          {row('Link de la app', appUrl)}
          {row('Email', cred.email)}
          {row('Contraseña', cred.password)}
          <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, lineHeight: 1.5, marginTop: 4 }}>Tiene que entrar eligiendo <strong>“Soy alumno”</strong>. Guardá la contraseña: por seguridad no se vuelve a mostrar (podés regenerarla cuando quieras).</div>
        </div>
      )}
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────
// BIBLIOTECA DE RUTINAS (50+ precargadas)
// ─────────────────────────────────────────────────────────────
function levelColor(lv) { return lv === 'Principiante' ? T.accent : lv === 'Intermedio' ? T.warn : T.red; }

function AdminBiblioteca() {
  const { isMobile } = useViewport();
  useDataVersion();
  const [level, setLevel] = React.useState('Todos');
  const [goal, setGoal] = React.useState('Todos');
  const [detail, setDetail] = React.useState(null); // routine obj
  const [assign, setAssign] = React.useState(null);  // routine obj being assigned
  const [busy, setBusy] = React.useState(false);

  // Plantillas precargadas (≥50) + las rutinas propias guardadas en la base.
  const TPL = (typeof ROUTINE_TEMPLATES !== 'undefined' ? ROUTINE_TEMPLATES : []).map((r) => ({ ...r, _tpl: true }));
  const LIB = [...ROUTINES, ...TPL];
  const goals = ['Todos', ...Array.from(new Set(LIB.map((r) => r.goal)))];
  const filtered = LIB.filter((r) =>
    (level === 'Todos' || r.level === level) &&
    (goal === 'Todos' || r.goal === goal));

  // Asignar: si es plantilla, primero la clonamos a la base del entrenador.
  const doAssign = async (routine, student) => {
    setBusy(true);
    try {
      let rid = routine.id;
      if (routine._tpl) rid = await tnCloneTemplateDB(routine);
      await tnAssignRoutineDB(student.id, rid);
      toast(`"${routine.name}" asignada a ${student.name}`, { kind: 'success' });
      setAssign(null);
    } catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
    setBusy(false);
  };

  return (
    <div>
      <AdminBar title="Biblioteca de rutinas" subtitle={`${filtered.length} rutinas · ${TPL.length} plantillas + ${ROUTINES.length} propias`}
        actions={<Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => navigate('#/admin/rutinas')}>Crear rutina</Btn>} />

      {/* Filters */}
      <div style={{ padding: isMobile ? '12px 16px' : '14px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Nivel</span>
        {['Todos', ...LEVELS].map((lv) => (
          <button key={lv} onClick={() => setLevel(lv)} style={{
            background: level === lv ? T.accentSoft : T.surface, border: `1px solid ${level === lv ? 'transparent' : T.border2}`,
            color: level === lv ? T.accentText : T.textDim, fontFamily: FONT, fontSize: 12, fontWeight: 500,
            padding: '6px 12px', borderRadius: 7, cursor: 'pointer',
          }}>{lv}</button>
        ))}
        <div style={{ width: 1, height: 20, background: T.border2, margin: '0 4px' }} />
        <span style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Objetivo</span>
        {goals.map((g) => (
          <button key={g} onClick={() => setGoal(g)} style={{
            background: goal === g ? T.accentSoft : T.surface, border: `1px solid ${goal === g ? 'transparent' : T.border2}`,
            color: goal === g ? T.accentText : T.textDim, fontFamily: FONT, fontSize: 12, fontWeight: 500,
            padding: '6px 12px', borderRadius: 7, cursor: 'pointer',
          }}>{g}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: isMobile ? 16 : 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {filtered.map((r) => (
            <div key={r.id} style={{
              background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 14, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ padding: 16, borderBottom: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -0.2, lineHeight: 1.2 }}>{r.name}</div>
                  <span style={{ fontFamily: MONO, fontSize: 9, color: levelColor(r.level), background: T.surface2, border: `1px solid ${levelColor(r.level)}44`, padding: '3px 7px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0, whiteSpace: 'nowrap' }}>{r.level}</span>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: T.textDim, lineHeight: 1.45, minHeight: 34 }}>{r.desc}</div>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', gap: 14, flex: 1 }}>
                {[['Frecuencia', `${r.freq}d/sem`], ['Ejercicios', r.totalExercises], ['Objetivo', r.goal]].map(([l, v], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: MONO, fontSize: 8, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
                    <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: T.text, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, padding: '0 16px 16px' }}>
                <Btn full sm onClick={() => setDetail(r)}>Ver detalle</Btn>
                <Btn full sm primary onClick={() => setAssign(r)}>Asignar</Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} width={560}
        title={detail ? detail.name : ''}
        actions={detail && <>
          <Btn onClick={() => setDetail(null)}>Cerrar</Btn>
          <Btn primary onClick={() => { setAssign(detail); setDetail(null); }}>Asignar a alumno</Btn>
        </>}>
        {detail && (
          <div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              <Chip color={levelColor(detail.level)} style={{ background: T.surface2 }}>{detail.level}</Chip>
              <Chip>{detail.goal}</Chip><Chip>{detail.freq} días/sem</Chip>
              <Chip>{detail.totalWeeks} semanas</Chip><Chip>{detail.totalExercises} ejercicios</Chip>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: T.textDim, lineHeight: 1.5, marginBottom: 16 }}>{detail.desc}</div>
            {detail.days.filter((d) => d.exercises.length).map((d) => (
              <div key={d.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: T.accent }}>{d.name}</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted }}>· {d.focus}</span>
                </div>
                <div style={{ background: T.surface, borderRadius: 10, border: `1px solid ${T.border}`, overflow: 'hidden' }}>
                  {d.exercises.map((e, i) => {
                    const ex = findExercise(e.id);
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: i ? `1px solid ${T.border}` : 'none' }}>
                        {ex && <ExerciseTile ex={ex} compact />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: FONT, fontSize: 13, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex ? ex.es : e.id}</div>
                          {e.technique ? <div style={{ fontFamily: MONO, fontSize: 9, color: T.accentText, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>⚡ {e.technique}</div> : null}
                        </div>
                        <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim, flexShrink: 0 }}>{e.sets}×{e.reps}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Assign modal */}
      <Modal open={!!assign} onClose={() => setAssign(null)} width={460}
        title={assign ? `Asignar "${assign.name}"` : ''}>
        {assign && (
          <div>
            <div style={{ fontFamily: FONT, fontSize: 13, color: T.textDim, marginBottom: 14 }}>Elegí a qué alumno asignarle esta rutina:</div>
            {STUDENTS.length === 0 && <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted }}>Toldavía no tenés alumnos. Creá uno primero en “Alumnos”.</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STUDENTS.map((s) => (
                <button key={s.id} disabled={busy} onClick={() => doAssign(assign, s)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 10, width: '100%', textAlign: 'left',
                  background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 10, cursor: 'pointer',
                }}>
                  <Avatar student={s} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text }}>{s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted }}>{s.goal} · {s.level}</div>
                  </div>
                  {Icon.chev(T.textMuted)}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

Object.assign(window, {
  AdminDashboard, AdminAlumnos, AdminAlumnoDetail, AdminRutinas, AdminCatalogo, AdminBiblioteca,
});
