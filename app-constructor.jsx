// Trainer Nico — Constructor de rutinas DB-backed.
// Sobrescribe AdminRutinas (cargado después de app-admin.jsx). Empieza vacío:
// el entrenador crea rutinas con "Nueva rutina" y arma cada día desde el catálogo.

function CB_NewRoutineModal({ open, onClose, onCreated }) {
  const [f, setF] = React.useState({ name: '', level: 'Principiante', goal: 'Hipertrofia', weeks: 8 });
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { if (open) setF({ name: '', level: 'Principiante', goal: 'Hipertrofia', weeks: 8 }); }, [open]);
  const inputStyle = { width: '100%', boxSizing: 'border-box', background: T.surface2, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9, padding: '10px 12px', fontFamily: FONT, fontSize: 13, outline: 'none' };
  const labelStyle = { fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block' };
  const create = async () => {
    if (!f.name.trim()) { toast('Poné un nombre a la rutina', { kind: 'error' }); return; }
    setBusy(true);
    try {
      const id = await tnNewEmptyRoutineDB({ name: f.name.trim(), level: f.level, goal: f.goal, weeks: Number(f.weeks) || 8 });
      toast('Rutina creada ✓', { kind: 'success' });
      onCreated(id); onClose();
    } catch (e) { toast(e.message || 'Error al crear', { kind: 'error' }); }
    setBusy(false);
  };
  return (
    <Modal open={open} onClose={onClose} title="Nueva rutina" width={440}
      actions={<><Btn onClick={onClose}>Cancelar</Btn><Btn primary disabled={busy} onClick={create}>{busy ? 'Creando…' : 'Crear rutina'}</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Nombre de la rutina *</label>
          <input style={inputStyle} autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ej: Hipertrofia Upper/Lower" />
        </div>
        <div>
          <label style={labelStyle}>Nivel</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {LEVELS.map((lv) => (
              <button key={lv} onClick={() => setF({ ...f, level: lv })} style={{
                flex: 1, background: f.level === lv ? T.accentSoft : T.surface2, border: `1px solid ${f.level === lv ? 'transparent' : T.border2}`,
                color: f.level === lv ? T.accentText : T.textDim, fontFamily: FONT, fontSize: 12, fontWeight: 600, padding: '8px', borderRadius: 7, cursor: 'pointer',
              }}>{lv}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 2 }}>
            <label style={labelStyle}>Objetivo</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={f.goal} onChange={(e) => setF({ ...f, goal: e.target.value })}>
              {['Hipertrofia', 'Pérdida de grasa', 'Fuerza', 'Recomposición', 'Salud general'].map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Semanas</label>
            <input style={inputStyle} type="number" value={f.weeks} onChange={(e) => setF({ ...f, weeks: e.target.value })} />
          </div>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>
          Se crea con 7 días vacíos (L a D). Después agregás ejercicios a cada día desde el catálogo.
        </div>
      </div>
    </Modal>
  );
}

function CB_AddRow({ ex, onAdd }) {
  return (
    <div onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, marginBottom: 2, cursor: 'pointer' }}>
      <ExerciseTile ex={ex} compact />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.es}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, marginTop: 2 }}>{ex.equipment} · {ex.level}</div>
      </div>
      <div style={{ width: 26, height: 26, borderRadius: 6, background: T.surface, border: `1px solid ${T.border2}`, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 15, fontWeight: 700, flexShrink: 0 }}>+</div>
    </div>
  );
}

function CB_DayBuilder({ routine, day, isMobile, onOpenAdd, onChanged }) {
  const [confirm, setConfirm] = React.useState(null); // {itemId, es}
  const exs = day.exercises || [];
  if (!exs.length) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 20px', color: T.textDim }}>
        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 6 }}>{day.name}</div>
        <div style={{ fontFamily: FONT, fontSize: 13, marginBottom: 20 }}>Día sin ejercicios. Agregá desde el catálogo.</div>
        <Btn icon={Icon.plus()} onClick={onOpenAdd}>Agregar ejercicio</Btn>
      </div>
    );
  }
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{day.day} · {day.name}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, color: T.textDim }}>{exs.length} ejercicios · {exs.reduce((s, e) => s + e.sets, 0)} series</div>
      </div>
      {exs.map((it, i) => {
        const ex = findExercise(it.id);
        if (!ex) return null;
        const c = groupColor(ex.group);
        return (
          <div key={it.itemId || i} style={{ display: 'flex', alignItems: 'stretch', marginBottom: 8, background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ width: 30, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textMuted, borderRight: `1px solid ${T.border}`, flexShrink: 0, fontFamily: MONO, fontSize: 11, fontWeight: 600 }}>{i + 1}</div>
            <div style={{ width: 52, flexShrink: 0, borderRight: `1px solid ${T.border}` }}><ExImg ex={ex} style={{ width: 52, height: '100%' }} /></div>
            <div style={{ flex: 1, padding: '10px 12px', minWidth: 0 }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.es}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textDim, marginTop: 2 }}>{ex.group} · {ex.equipment}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                <Chip>{it.sets}×{it.reps}</Chip><Chip>{it.rest}s</Chip>{it.weight ? <Chip>{it.weight}kg</Chip> : null}
              </div>
            </div>
            <button onClick={() => setConfirm({ itemId: it.itemId, es: ex.es })} title="Eliminar" style={{ width: 36, background: 'transparent', border: 'none', borderLeft: `1px solid ${T.border}`, color: T.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{Icon.trash()}</button>
          </div>
        );
      })}
      <button onClick={onOpenAdd} style={{ width: '100%', marginTop: 8, padding: '14px', background: 'transparent', border: `1px dashed ${T.border2}`, borderRadius: 12, color: T.textDim, cursor: 'pointer', fontFamily: FONT, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ color: T.accent, fontFamily: MONO, fontSize: 16, lineHeight: 1 }}>+</span> Añadir ejercicio
      </button>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Eliminar ejercicio"
        actions={<><Btn onClick={() => setConfirm(null)}>Cancelar</Btn>
          <Btn primary style={{ background: T.red, color: '#fff', border: 'none' }} onClick={async () => {
            try { await dbRemoveItem(confirm.itemId); await tnReloadRoutines(); toast(`Eliminado: ${confirm.es}`); onChanged && onChanged(); }
            catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
            setConfirm(null);
          }}>Eliminar</Btn></>}>
        <div style={{ fontFamily: FONT, fontSize: 14, color: T.textDim }}>¿Quitar <strong style={{ color: T.text }}>{confirm && confirm.es}</strong> de este día?</div>
      </Modal>
    </div>
  );
}

function AdminRutinas() {
  const { isMobile } = useViewport();
  useDataVersion();
  const [selId, setSelId] = React.useState(ROUTINES[0] ? ROUTINES[0].id : null);
  const [dayIdx, setDayIdx] = React.useState(0);
  const [newOpen, setNewOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [qaGroup, setQaGroup] = React.useState('Todos');
  const [delOpen, setDelOpen] = React.useState(false);

  const routine = ROUTINES.find((r) => r.id === selId) || ROUTINES[0];
  React.useEffect(() => { if (!routine && ROUTINES[0]) setSelId(ROUTINES[0].id); }, [routine]);

  // Empty state — no routines yet.
  if (!ROUTINES.length) {
    return (
      <div>
        <CB_NewRoutineModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={(id) => { setSelId(id); setDayIdx(0); }} />
        <AdminBar title="Constructor de rutinas" subtitle="Creá tu primera rutina"
          actions={<Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => setNewOpen(true)}>Nueva rutina</Btn>} />
        <div style={{ textAlign: 'center', padding: '80px 24px', color: T.textDim }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: T.surface, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>{Icon.cal(T.accent)}</div>
          <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 6 }}>Todavía no tenés rutinas</div>
          <div style={{ fontFamily: FONT, fontSize: 14, marginBottom: 22, maxWidth: 360, marginInline: 'auto', lineHeight: 1.5 }}>Creá una rutina desde cero y armá cada día con ejercicios de tu catálogo ({EXERCISES.length} disponibles).</div>
          <Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => setNewOpen(true)}>Crear primera rutina</Btn>
        </div>
      </div>
    );
  }

  const day = routine.days[dayIdx] || routine.days[0];
  const inCatalog = EXERCISES.filter((e) => qaGroup === 'Todos' || e.group === qaGroup)
    .filter((e) => !(day.exercises || []).some((x) => x.id === e.id));

  const addEx = async (ex) => {
    try { await dbAddItem(day.id, ex.id, (day.exercises || []).length); await tnReloadRoutines(); toast(`Añadido: ${ex.es}`, { kind: 'success' }); }
    catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
  };

  const DayRail = () => (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? 6 : 2, overflowX: 'auto', padding: isMobile ? '0 16px 4px' : '0' }}>
      {routine.days.map((d, i) => {
        const isActive = i === dayIdx;
        return (
          <button key={d.id} onClick={() => setDayIdx(i)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: isMobile ? '8px 14px' : '10px 12px', borderRadius: 8,
            background: isActive ? T.surface : 'transparent', border: 'none', cursor: 'pointer',
            color: isActive ? T.text : T.textDim, textAlign: 'left', fontFamily: FONT, fontSize: 12, fontWeight: isActive ? 600 : 500,
            position: 'relative', whiteSpace: 'nowrap', flexShrink: 0, width: isMobile ? 'auto' : '100%',
          }}>
            {isActive && !isMobile && <div style={{ position: 'absolute', left: -12, top: 10, bottom: 10, width: 2, background: T.accent, borderRadius: 1 }} />}
            <span style={{ fontFamily: MONO, color: isActive ? T.accent : T.textMuted }}>{d.day}</span>
            <span>{(d.exercises || []).length ? d.name : 'Descanso'}</span>
            {(d.exercises || []).length > 0 && <span style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 10, color: T.textMuted }}>{d.exercises.length}</span>}
          </button>
        );
      })}
    </div>
  );

  const AddPanelContent = () => (
    <>
      <div style={{ display: 'flex', gap: 6, padding: 12, overflowX: 'auto', borderBottom: `1px solid ${T.border}`, flexWrap: isMobile ? 'nowrap' : 'wrap' }}>
        {['Todos', ...GROUPS].map((g) => (
          <button key={g} onClick={() => setQaGroup(g)} style={{
            background: qaGroup === g ? T.accentSoft : T.surface2, border: `1px solid ${qaGroup === g ? 'transparent' : T.border2}`,
            color: qaGroup === g ? T.accentText : T.textDim, fontFamily: MONO, fontSize: 10, fontWeight: 500, padding: '5px 9px', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
          }}>{g}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        {inCatalog.map((ex) => <CB_AddRow key={ex.id} ex={ex} onAdd={() => addEx(ex)} />)}
        {!inCatalog.length && <div style={{ textAlign: 'center', padding: 30, fontFamily: FONT, fontSize: 13, color: T.textMuted }}>Sin ejercicios para este filtro.</div>}
      </div>
    </>
  );

  return (
    <div>
      <CB_NewRoutineModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={(id) => { setSelId(id); setDayIdx(0); }} />
      <AdminBar title="Constructor de rutinas" subtitle={`${ROUTINES.length} rutina${ROUTINES.length !== 1 ? 's' : ''}`}
        actions={<>
          {!isMobile && (
            <select value={selId || ''} onChange={(e) => { setSelId(e.target.value); setDayIdx(0); }} style={{
              background: T.surface, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9, padding: '8px 10px', fontFamily: FONT, fontSize: 12, cursor: 'pointer', maxWidth: 220,
            }}>
              {ROUTINES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          )}
          <Btn icon={Icon.plus()} onClick={() => setNewOpen(true)}>{isMobile ? 'Nueva' : 'Nueva rutina'}</Btn>
          {!isMobile && <Btn danger onClick={() => setDelOpen(true)}>Borrar</Btn>}
        </>}
      />

      {isMobile && (
        <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.border}` }}>
          <select value={selId || ''} onChange={(e) => { setSelId(e.target.value); setDayIdx(0); }} style={{
            width: '100%', background: T.surface, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9, padding: '10px', fontFamily: FONT, fontSize: 13, cursor: 'pointer',
          }}>
            {ROUTINES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 10, marginTop: 8, fontFamily: MONO, fontSize: 11, color: T.textDim }}>
            <span>{routine.level}</span><span>·</span><span>{routine.goal}</span>
          </div>
        </div>
      )}

      {isMobile ? (
        <div>
          <div style={{ padding: '12px 0', borderBottom: `1px solid ${T.border}` }}><DayRail /></div>
          <div style={{ padding: 16 }}><CB_DayBuilder routine={routine} day={day} isMobile onOpenAdd={() => setAddOpen(true)} /></div>
          {addOpen && (
            <div onClick={() => setAddOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxHeight: '80vh', background: T.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, border: `1px solid ${T.border2}`, display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 16, borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600 }}>Añadir a {day.name}</div>
                  <button onClick={() => setAddOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim }}>{Icon.x()}</button>
                </div>
                <AddPanelContent />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', height: 'calc(100vh - 130px)', minHeight: 500 }}>
          <div style={{ width: 210, flexShrink: 0, borderRight: `1px solid ${T.border}`, padding: '18px 12px', overflow: 'auto' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '0 12px 10px' }}>{routine.level} · {routine.goal}</div>
            <DayRail />
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 24, minWidth: 0 }}>
            <CB_DayBuilder routine={routine} day={day} onOpenAdd={() => {}} />
          </div>
          <div style={{ width: 290, flexShrink: 0, borderLeft: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 14px 0' }}>
              <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text }}>Catálogo · {EXERCISES.length} ejercicios</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, marginTop: 4 }}>Tocá para añadir a {day.name}</div>
            </div>
            <AddPanelContent />
          </div>
        </div>
      )}

      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="Borrar rutina"
        actions={<><Btn onClick={() => setDelOpen(false)}>Cancelar</Btn>
          <Btn primary style={{ background: T.red, color: '#fff', border: 'none' }} onClick={async () => {
            try { await tnDeleteRoutineDB(routine.id); toast('Rutina borrada'); setSelId(ROUTINES[0] ? ROUTINES[0].id : null); setDayIdx(0); }
            catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
            setDelOpen(false);
          }}>Borrar</Btn></>}>
        <div style={{ fontFamily: FONT, fontSize: 14, color: T.textDim }}>¿Borrar <strong style={{ color: T.text }}>{routine.name}</strong> y todos sus días? No se puede deshacer.</div>
      </Modal>
    </div>
  );
}

Object.assign(window, { AdminRutinas });
