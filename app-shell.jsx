// Trainer Nico — App shell: login, nav, router.

// ─────────────────────────────────────────────────────────────
// LOGIN screen
// ─────────────────────────────────────────────────────────────
function ScreenLogin() {
  const [role, setRole] = React.useState('alumno');
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');

  const presetAdmin = () => { setRole('admin'); setEmail('nico@trainernico.app'); setPwd('demo1234'); };
  const presetAlumno = () => { setRole('alumno'); setEmail('lucia@trainernico.app'); setPwd('demo1234'); };

  const submit = (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !pwd.trim()) {
      toast('Email y contraseña son obligatorios', { kind: 'error' });
      return;
    }
    if (!email.includes('@')) {
      toast('Email inválido', { kind: 'error' });
      return;
    }
    setStore({ role, studentId: 1 });
    toast(`Bienvenido ${role === 'admin' ? 'Nico' : 'Lícia'}`, { kind: 'success' });
    navigate(role === 'admin' ? '#/admin/dashboard' : '#/a/hoy');
  };

  return (
    <div style={{
      minHeight: '100vh', background: T.bg, color: T.text, fontFamily: FONT,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.accentSoft2} 0%, transparent 60%)`,
        pointerEvents: 'none', filter: 'blur(60px)',
      }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, justifyContent: 'center' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11,
            background: T.accent, color: '#0A0A0A',
            fontFamily: FONT, fontWeight: 900, fontSize: 19, letterSpacing: -1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 24px ${T.accentSoft2}`,
          }}>TN</div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 700, letterSpacing: -0.4 }}>Trainer Nico</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Entrenamiento personal</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, letterSpacing: -0.6, marginBottom: 6 }}>Bienvenido</div>
          <div style={{ fontFamily: FONT, fontSize: 14, color: T.textDim }}>Ingresá para ver tu plan o el panel.</div>
        </div>

        {/* Role switch */}
        <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 12, padding: 4, marginBottom: 14 }}>
          {[{ id: 'alumno', label: 'Soy alumno' }, { id: 'admin', label: 'Soy entrenador' }].map((r) => (
            <button key={r.id} onClick={() => setRole(r.id)} style={{
              flex: 1, padding: '10px 12px', border: 'none', cursor: 'pointer',
              background: role === r.id ? T.accent : 'transparent',
              color: role === r.id ? '#0A0A0A' : T.textDim,
              borderRadius: 8, fontFamily: FONT, fontSize: 13, fontWeight: 600,
              transition: 'background .15s',
            }}>{r.label}</button>
          ))}
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6, paddingLeft: 4 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" style={{
              width: '100%', boxSizing: 'border-box',
              background: T.surface, border: `1px solid ${T.border2}`, color: T.text,
              borderRadius: 10, padding: '12px 14px', fontFamily: FONT, fontSize: 14, outline: 'none',
            }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6, paddingLeft: 4 }}>Contraseña</label>
            <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="••••••••" style={{
              width: '100%', boxSizing: 'border-box',
              background: T.surface, border: `1px solid ${T.border2}`, color: T.text,
              borderRadius: 10, padding: '12px 14px', fontFamily: FONT, fontSize: 14, outline: 'none',
            }} />
          </div>
          <button type="submit" style={{
            width: '100%', padding: 14, borderRadius: 12, border: 'none',
            background: T.accent, color: '#0A0A0A', cursor: 'pointer',
            fontFamily: FONT, fontWeight: 700, fontSize: 14,
            boxShadow: `0 12px 24px ${T.accentSoft}`,
          }}>Entrar como {role === 'admin' ? 'entrenador' : 'alumno'} →</button>
        </form>

        <div style={{
          marginTop: 24, padding: 14, background: T.surface, border: `1px solid ${T.border2}`,
          borderRadius: 12,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Probar el demo</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={presetAlumno} style={{
              flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
              background: T.surface2, border: `1px solid ${T.border2}`, color: T.text,
              fontFamily: FONT, fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start',
            }}>
              <Avatar student={STUDENTS[0]} size={26} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Lucía</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted }}>alumno</div>
              </div>
            </button>
            <button onClick={presetAdmin} style={{
              flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
              background: T.surface2, border: `1px solid ${T.border2}`, color: T.text,
              fontFamily: FONT, fontSize: 12, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 13, background: `linear-gradient(135deg, ${T.accent}, #1FCBBC)`,
                color: '#0A0A0A', fontFamily: FONT, fontWeight: 700, fontSize: 11,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>N</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Nico</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted }}>entrenador</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Student Nav: bottom tab bar (mobile) OR sidebar (desktop)
// ─────────────────────────────────────────────────────────────
function StudentTabBar({ active }) {
  const tabs = [
    { id: 'hoy', label: 'Hoy', icon: Icon.home },
    { id: 'rutina', label: 'Rutina', icon: Icon.dumbbell },
    { id: 'progreso', label: 'Progreso', icon: Icon.chart },
    { id: 'nutricion', label: 'Nutrición', icon: Icon.apple },
    { id: 'perfil', label: 'Perfil', icon: Icon.user },
  ];
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${T.border}`,
      padding: '8px 6px max(8px, env(safe-area-inset-bottom)) 6px',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 30,
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        const c = isActive ? T.accent : T.textMuted;
        return (
          <button key={t.id} onClick={() => navigate(`#/a/${t.id}`)} style={{
            flex: 1, background: 'transparent', border: 'none', padding: '6px 4px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            cursor: 'pointer', color: c,
            fontFamily: FONT, fontSize: 10, fontWeight: 500, letterSpacing: 0.2,
          }}>
            {t.icon(c)}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StudentSidebar({ active }) {
  const me = findStudent(getStore().studentId);
  const tabs = [
    { id: 'hoy', label: 'Hoy', icon: Icon.home },
    { id: 'rutina', label: 'Mi rutina', icon: Icon.dumbbell },
    { id: 'progreso', label: 'Progreso', icon: Icon.chart },
    { id: 'nutricion', label: 'Nutrición', icon: Icon.apple },
    { id: 'perfil', label: 'Perfil', icon: Icon.user },
  ];
  return (
    <div style={{
      width: 240, flexShrink: 0, background: T.bg,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column', minHeight: '100vh',
      position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ padding: '22px 22px 30px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7, background: T.accent,
          color: '#0A0A0A', fontFamily: FONT, fontWeight: 900, fontSize: 14, letterSpacing: -1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>TN</div>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>Trainer Nico</div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Mi entrenamiento</div>
        </div>
      </div>

      <div style={{ padding: '0 10px', flex: 1 }}>
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button key={t.id} onClick={() => navigate(`#/a/${t.id}`)} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%',
              padding: '10px 12px', marginBottom: 2, borderRadius: 8,
              background: isActive ? T.surface : 'transparent', border: 'none', cursor: 'pointer',
              color: isActive ? T.text : T.textDim, textAlign: 'left',
              fontFamily: FONT, fontSize: 13, fontWeight: isActive ? 600 : 500,
              position: 'relative',
            }}>
              {isActive && <div style={{ position: 'absolute', left: -10, top: 8, bottom: 8, width: 2, background: T.accent, borderRadius: 1 }} />}
              {t.icon(isActive ? T.accent : T.textDim)}
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 12 }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border2}`,
          borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar student={me} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>{me?.name || 'Alumno'}</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: T.accent, textTransform: 'uppercase', letterSpacing: 1 }}>● Activo</div>
          </div>
          <button onClick={() => { tnSignOut().finally(() => { resetStore(); location.reload(); }); }} title="Cerrar sesión" style={{
            width: 28, height: 28, borderRadius: 7, background: 'transparent',
            border: `1px solid ${T.border2}`, color: T.textDim, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.logout()}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin Nav
// ─────────────────────────────────────────────────────────────
function AdminSidebar({ active, onClose }) {
  const { isMobile } = useViewport();
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Icon.grid },
    { id: 'alumnos', label: 'Alumnos', icon: Icon.users, count: STUDENTS.length },
    { id: 'rutinas', label: 'Constructor', icon: Icon.cal },
    { id: 'biblioteca', label: 'Rutinas', icon: Icon.cal, count: ROUTINES.length },
    { id: 'catalogo', label: 'Ejercicios', icon: Icon.dumbbell, count: EXERCISES.length },
    { id: 'nutricion', label: 'Nutrición', icon: Icon.apple },
    { id: 'mensajes', label: 'Mensajes', icon: Icon.chat, count: 3 },
  ];
  return (
    <div style={{
      width: 230, flexShrink: 0, background: T.bg,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh',
      position: isMobile ? 'fixed' : 'sticky', top: 0, height: '100vh', zIndex: 50,
    }}>
      <div style={{ padding: '22px 22px 30px', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: T.accent,
            color: '#0A0A0A', fontFamily: FONT, fontWeight: 900, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -1,
          }}>TN</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>Trainer Nico</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Admin · v0.4</div>
          </div>
        </div>
        {isMobile && onClose && (
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim, padding: 4 }}>{Icon.x()}</button>
        )}
      </div>

      <div style={{ padding: '0 10px', flex: 1 }}>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '8px 12px' }}>Workspace</div>
        {tabs.map((it) => {
          const isActive = it.id === active;
          return (
            <button key={it.id} onClick={() => { navigate(`#/admin/${it.id}`); onClose && onClose(); }} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '9px 12px', marginBottom: 2, borderRadius: 8,
              background: isActive ? T.surface : 'transparent', border: 'none', cursor: 'pointer',
              color: isActive ? T.text : T.textDim, textAlign: 'left',
              fontFamily: FONT, fontSize: 13, fontWeight: isActive ? 600 : 500, position: 'relative',
            }}>
              {isActive && <div style={{ position: 'absolute', left: -10, top: 8, bottom: 8, width: 2, background: T.accent, borderRadius: 1 }} />}
              {it.icon(isActive ? T.accent : T.textDim)}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.count != null && <span style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, background: T.surface2, padding: '2px 7px', borderRadius: 4 }}>{it.count}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 12 }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border2}`,
          borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 16,
            background: `linear-gradient(135deg, ${T.accent}, #1FCBBC)`,
            color: '#0A0A0A', fontFamily: FONT, fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>N</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600 }}>Nico Trainer</div>
            <div style={{ fontFamily: MONO, fontSize: 9, color: T.accent, textTransform: 'uppercase', letterSpacing: 1 }}>● Online</div>
          </div>
          <button onClick={() => { tnSignOut().finally(() => { resetStore(); location.reload(); }); }} title="Cerrar sesión" style={{
            width: 28, height: 28, borderRadius: 7, background: 'transparent',
            border: `1px solid ${T.border2}`, color: T.textDim, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.logout()}</button>
        </div>
      </div>
    </div>
  );
}

// Mobile top bar for admin (shows hamburger).
function AdminMobileTopBar({ onMenu }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 25, background: T.bg,
      borderBottom: `1px solid ${T.border}`,
      padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <button onClick={onMenu} style={{
        width: 36, height: 36, borderRadius: 9, background: T.surface, border: `1px solid ${T.border2}`,
        color: T.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{Icon.menu()}</button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 5, background: T.accent,
          color: '#0A0A0A', fontFamily: FONT, fontWeight: 900, fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: -1,
        }}>TN</div>
        <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700 }}>Trainer Nico</div>
        <Chip style={{ marginLeft: 4 }}>Admin</Chip>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE (student)
// ─────────────────────────────────────────────────────────────
function ScreenPerfil() {
  const me = findStudent(getStore().studentId);
  const bodyWeight = useStore((s) => s.bodyWeight);
  const [weightOpen, setWeightOpen] = React.useState(false);
  const [weightInput, setWeightInput] = React.useState(String(bodyWeight));
  React.useEffect(() => { setWeightInput(String(bodyWeight)); }, [weightOpen, bodyWeight]);
  const saveWeight = () => {
    const v = parseFloat(weightInput.replace(',', '.'));
    if (isNaN(v) || v < 20 || v > 300) { toast('Peso inválido (20–300 kg)', { kind: 'error' }); return; }
    tnLogWeightDB(getStore().studentId, v).catch((e) => toast(e.message || 'Error', { kind: 'error' }));
    setWeightOpen(false);
    toast(`Peso actualizado: ${v} kg`, { kind: 'success' });
  };
  const ajustes = [
    { label: 'Mi rutina actual', value: ROUTINE.name, msg: 'Tu rutina la gestiona Nico desde el panel admin.' },
    { label: 'Mi plan nutricional', value: 'Recomp · Lucía', msg: 'Plan asignado por Nico. Ver detalle en Nutrición.' },
    { label: 'Notificaciones', value: 'Activadas', msg: 'Próximamente: configurar avisos' },
    { label: 'Tema', value: 'Oscuro', msg: 'Tema claro — próximamente' },
    { label: 'Idioma', value: 'Español', msg: 'Más idiomas — próximamente' },
  ];
  return (
    <div>
      <div style={{ padding: '20px 20px 14px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Mi cuenta</div>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>Perfil</div>
      </div>
      <div style={{ padding: '0 20px 20px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <Avatar student={me} size={64} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700 }}>{me?.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim, marginTop: 2 }}>{me?.age} años · {bodyWeight}kg</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              <Chip accent>{me?.goal}</Chip><Chip>{me?.level}</Chip>
            </div>
          </div>
        </Card>

        {/* Editable weight */}
        <button onClick={() => setWeightOpen(true)} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer',
          background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 16,
          padding: 16, marginBottom: 14, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 11, flexShrink: 0,
            background: T.accentSoft, color: T.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontSize: 18, fontWeight: 700,
          }}>⚖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Mi peso actual</div>
            <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: -0.5, marginTop: 2 }}>{bodyWeight} <span style={{ fontSize: 12, color: T.textDim, fontWeight: 400 }}>kg</span></div>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: T.accent, fontWeight: 600 }}>Actualizar</div>
        </button>

        <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, padding: '8px 4px' }}>Ajustes</div>
        <Card padding={0}>
          {ajustes.map((row, i) => (
            <button key={i} onClick={() => toast(row.msg)} style={{
              display: 'flex', alignItems: 'center', padding: '14px 16px', width: '100%', textAlign: 'left',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderTop: i ? `1px solid ${T.border}` : 'none', fontFamily: 'inherit',
            }}>
              <div style={{ flex: 1, fontFamily: FONT, fontSize: 14, color: T.text }}>{row.label}</div>
              <div style={{ fontFamily: MONO, fontSize: 11, color: T.textDim, marginRight: 10 }}>{row.value}</div>
              {Icon.chev(T.textMuted)}
            </button>
          ))}
        </Card>

        <div style={{ marginTop: 18 }}>
          <Btn full danger onClick={() => { tnSignOut().finally(() => { resetStore(); location.reload(); }); }} icon={Icon.logout(T.red)}>
            Cerrar sesión
          </Btn>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center', fontFamily: MONO, fontSize: 10, color: T.textMuted }}>
          Trainer Nico · v0.4 · demo
        </div>
      </div>

      <Modal open={weightOpen} onClose={() => setWeightOpen(false)} title="Actualizar peso corporal"
        actions={<>
          <Btn onClick={() => setWeightOpen(false)}>Cancelar</Btn>
          <Btn primary onClick={saveWeight}>Guardar</Btn>
        </>}
      >
        <div style={{ fontFamily: FONT, fontSize: 13, color: T.textDim, marginBottom: 14 }}>Registrá tu peso de hoy. Nico lo verá en tu progreso.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="number" step="0.1" autoFocus value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveWeight(); }}
            style={{
              flex: 1, background: T.surface2, border: `1px solid ${T.border2}`, color: T.text,
              borderRadius: 10, padding: '14px 16px',
              fontFamily: MONO, fontSize: 24, fontWeight: 700, outline: 'none',
            }} />
          <div style={{ fontFamily: MONO, fontSize: 14, color: T.textDim }}>kg</div>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stub screens (admin nutricion / mensajes)
// ─────────────────────────────────────────────────────────────
function AdminNutricion() {
  const { isMobile } = useViewport();
  useDataVersion();
  const plans = (window.TN_NUTRITION_PLANS || []);
  const [newOpen, setNewOpen] = React.useState(false);
  const [assign, setAssign] = React.useState(null); // plan
  const goalColor = { Hipertrofia: T.accent };
  return (
    <div>
      <NewPlanModal open={newOpen} onClose={() => setNewOpen(false)} />
      <AdminBar title="Planes nutricionales" subtitle={`${plans.length} plan${plans.length !== 1 ? 'es' : ''}`}
        actions={<Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => setNewOpen(true)}>Nuevo plan</Btn>} />
      <div style={{ padding: isMobile ? 16 : 24 }}>
        {plans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 24px', color: T.textDim }}>
            <div style={{ width: 60, height: 60, borderRadius: 15, background: T.surface, border: `1px solid ${T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{Icon.apple(T.accent)}</div>
            <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 6 }}>Sin planes todavía</div>
            <div style={{ fontFamily: FONT, fontSize: 14, marginBottom: 20 }}>Creá un plan nutricional para asignarlo a tus alumnos.</div>
            <Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => setNewOpen(true)}>Crear primer plan</Btn>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {plans.map((p) => (
              <Card key={p.id}>
                <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, letterSpacing: -0.3, marginBottom: 12 }}>{p.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 28, fontWeight: 700, letterSpacing: -1, marginBottom: 12 }}>
                  {p.calories}<span style={{ fontSize: 12, color: T.textDim, fontWeight: 400, marginLeft: 4 }}>kcal/día</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <MiniMacro label="Prot" value={p.protein} color={T.accent} />
                  <MiniMacro label="Carb" value={p.carbs} color="#FFB020" />
                  <MiniMacro label="Gras" value={p.fat} color="#FF5BA8" />
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                  <Btn full sm primary onClick={() => setAssign(p)}>Asignar a alumno</Btn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Modal open={!!assign} onClose={() => setAssign(null)} title={assign ? `Asignar "${assign.name}"` : ''} width={420}>
        {assign && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {STUDENTS.length === 0 && <div style={{ fontFamily: FONT, fontSize: 13, color: T.textMuted }}>No tenés alumnos todavía.</div>}
            {STUDENTS.map((s) => (
              <button key={s.id} onClick={async () => {
                try { await dbAssignPlan(s.id, assign.id); const st = findStudent(s.id); if (st) st.planId = assign.id; toast(`Plan asignado a ${s.name}`, { kind: 'success' }); }
                catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
                setAssign(null);
              }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, width: '100%', textAlign: 'left', background: T.surface, border: `1px solid ${T.border2}`, borderRadius: 10, cursor: 'pointer' }}>
                <Avatar student={s} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: T.text }}>{s.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted }}>{s.goal}</div>
                </div>
                {Icon.chev(T.textMuted)}
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Crear plan nutricional (persistido)
function NewPlanModal({ open, onClose }) {
  const [f, setF] = React.useState({ name: '', calories: 2000, protein: 150, carbs: 200, fat: 60 });
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { if (open) setF({ name: '', calories: 2000, protein: 150, carbs: 200, fat: 60 }); }, [open]);
  const inputStyle = { width: '100%', boxSizing: 'border-box', background: T.surface2, border: `1px solid ${T.border2}`, color: T.text, borderRadius: 9, padding: '10px 12px', fontFamily: FONT, fontSize: 13, outline: 'none' };
  const labelStyle = { fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5, display: 'block' };
  const num = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const create = async () => {
    if (!f.name.trim()) { toast('Poné un nombre al plan', { kind: 'error' }); return; }
    setBusy(true);
    try {
      await dbCreatePlan(TN_CTX.uid, { name: f.name.trim(), calories: +f.calories || 2000, protein: +f.protein || 0, carbs: +f.carbs || 0, fat: +f.fat || 0 });
      window.TN_NUTRITION_PLANS = await dbLoadNutrition(TN_CTX.uid);
      bumpData(); toast('Plan creado ✓', { kind: 'success' }); onClose();
    } catch (e) { toast(e.message || 'Error', { kind: 'error' }); }
    setBusy(false);
  };
  return (
    <Modal open={open} onClose={onClose} title="Nuevo plan nutricional" width={440}
      actions={<><Btn onClick={onClose}>Cancelar</Btn><Btn primary disabled={busy} onClick={create}>{busy ? 'Creando…' : 'Crear plan'}</Btn></>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><label style={labelStyle}>Nombre del plan *</label>
          <input style={inputStyle} autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ej: Recomp 2000 kcal" /></div>
        <div><label style={labelStyle}>Calorías / día</label>
          <input style={inputStyle} type="number" value={f.calories} onChange={num('calories')} /></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Proteína (g)</label><input style={inputStyle} type="number" value={f.protein} onChange={num('protein')} /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Carbos (g)</label><input style={inputStyle} type="number" value={f.carbs} onChange={num('carbs')} /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Grasas (g)</label><input style={inputStyle} type="number" value={f.fat} onChange={num('fat')} /></div>
        </div>
      </div>
    </Modal>
  );
}

function MiniMacro({ label, value, color }) {
  return (
    <div style={{ flex: 1, background: T.surface2, border: `1px solid ${T.border2}`, borderRadius: 8, padding: '8px 10px' }}>
      <div style={{ fontFamily: MONO, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: T.text, marginTop: 2 }}>{value}<span style={{ fontSize: 10, color: T.textDim, marginLeft: 2 }}>g</span></div>
      <div style={{ height: 3, background: T.bg, borderRadius: 2, marginTop: 6, overflow: 'hidden' }}>
        <div style={{ width: '70%', height: '100%', background: color }} />
      </div>
    </div>
  );
}

function AdminMensajes() {
  const { isMobile } = useViewport();
  const msgs = [
    { sid: 1, last: '¿Sustituyo el remo con barra por jalón?', time: '07:14', unread: 2 },
    { sid: 4, last: 'PR! 170×3 finalmente 🎯',                  time: 'Ayer',  unread: 0 },
    { sid: 2, last: 'Sumé peso al pie, no tira',                time: 'Ayer',  unread: 1 },
    { sid: 3, last: 'Gracias por el plan de la semana',         time: '2d',    unread: 0 },
  ];
  return (
    <div>
      <AdminBar title="Mensajes" subtitle={`${msgs.filter((m) => m.unread).length} sin leer`}
        actions={<Btn primary icon={Icon.plus('#0A0A0A')} onClick={() => toast('Próximamente: nuevo mensaje')}>Nuevo</Btn>}
      />
      <div style={{ padding: isMobile ? 12 : 24 }}>
        <Card padding={0}>
          {msgs.map((m, i) => {
            const s = findStudent(m.sid);
            return (
              <div key={m.sid} onClick={() => navigate(`#/admin/alumnos/${m.sid}`)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
                borderTop: i ? `1px solid ${T.border}` : 'none', cursor: 'pointer',
              }}>
                <Avatar student={s} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.textMuted }}>{m.time}</div>
                  </div>
                  <div style={{ fontFamily: FONT, fontSize: 12, color: T.textDim, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.last}</div>
                </div>
                {m.unread > 0 && (
                  <div style={{
                    background: T.accent, color: '#0A0A0A', borderRadius: 10,
                    minWidth: 20, height: 20, padding: '0 7px',
                    fontFamily: MONO, fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{m.unread}</div>
                )}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Routed root
// ─────────────────────────────────────────────────────────────
function App() {
  return (
    <>
      <AppBody />
      <ToastHost />
      <RestTimerHost />
    </>
  );
}

function AppBody() {
  const role = useStore((s) => s.role);
  const hash = useRoute();
  const { isMobile } = useViewport();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Normalize route. If no role, force login.
  React.useEffect(() => {
    if (!role) {
      if (hash !== '#/login') navigate('#/login');
    } else if (role === 'admin') {
      if (!hash.startsWith('#/admin')) navigate('#/admin/dashboard');
    } else if (role === 'alumno') {
      if (!hash.startsWith('#/a')) navigate('#/a/hoy');
    }
  }, [role, hash]);

  // Close mobile menu on route change
  React.useEffect(() => { setMenuOpen(false); }, [hash]);

  // Login
  if (!role || hash === '#/login') return <ScreenLogin />;

  // Parse route
  const parts = hash.replace(/^#\//, '').split('/');

  if (role === 'admin') {
    const sub = parts[1] || 'dashboard';
    let view;
    if (sub === 'dashboard') view = <AdminDashboard />;
    else if (sub === 'alumnos' && parts[2]) view = <AdminAlumnoDetail id={parts[2]} />;
    else if (sub === 'alumnos') view = <AdminAlumnos />;
    else if (sub === 'rutinas') view = <AdminRutinas />;
    else if (sub === 'biblioteca') view = <AdminBiblioteca />;
    else if (sub === 'catalogo') view = <AdminCatalogo />;
    else if (sub === 'nutricion') view = <AdminNutricion />;
    else if (sub === 'mensajes') view = <AdminMensajes />;
    else view = <AdminDashboard />;

    return (
      <div style={{
        display: 'flex', minHeight: '100vh', background: T.bg, color: T.text, fontFamily: FONT,
      }}>
        {!isMobile && <AdminSidebar active={sub} />}
        {isMobile && menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 49,
            }} />
            <AdminSidebar active={sub} onClose={() => setMenuOpen(false)} />
          </>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isMobile && <AdminMobileTopBar onMenu={() => setMenuOpen(true)} />}
          {view}
        </div>
      </div>
    );
  }

  // Alumno
  const sub = parts[1] || 'hoy';
  let view;
  if (sub === 'hoy') view = <ScreenHoy />;
  else if (sub === 'rutina') view = <ScreenRutina />;
  else if (sub === 'ejercicio' && parts[2]) view = <ScreenEjercicio exId={parts[2]} />;
  else if (sub === 'progreso') view = <ScreenProgreso />;
  else if (sub === 'nutricion') view = <ScreenNutricion />;
  else if (sub === 'perfil') view = <ScreenPerfil />;
  else view = <ScreenHoy />;

  // Translate sub→tab for highlight (ejercicio counts as rutina)
  const navKey = sub === 'ejercicio' ? 'rutina' : sub;

  if (isMobile) {
    return (
      <div style={{
        minHeight: '100vh', background: T.bg, color: T.text, fontFamily: FONT,
        paddingBottom: 80,
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>{view}</div>
        <StudentTabBar active={navKey} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg, color: T.text, fontFamily: FONT }}>
      <StudentSidebar active={navKey} />
      <div style={{ flex: 1, minWidth: 0, maxWidth: 760, margin: '0 auto', width: '100%' }}>{view}</div>
    </div>
  );
}

Object.assign(window, { App, ScreenLogin, ScreenPerfil, AdminNutricion, AdminMensajes });
