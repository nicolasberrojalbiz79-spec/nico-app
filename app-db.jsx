// Trainer Nico — capa de datos Supabase.
// Cliente + auth + CRUD. Reemplaza el store de demo localStorage como
// fuente de verdad. Las pantallas siguen leyendo de los globales
// (STUDENTS, ROUTINES, EXERCISES) que poblamos desde la base al iniciar.

const SUPABASE_URL = 'https://hufqehcbkygwqfkiszsa.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YqLp0bM4G8haqiTabg4H6A_84jG0dty';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const driveImgUrl = (id, w = 1200) => id ? `https://lh3.googleusercontent.com/d/${id}=w${w}` : null;

// ── Auth ──────────────────────────────────────────────────────
async function tnSignUp({ email, password, fullName, role }) {
  const { data, error } = await sb.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, role: role || 'trainer' } },
  });
  if (error) throw error;
  return data;
}
async function tnSignIn({ email, password }) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
async function tnSignOut() { await sb.auth.signOut(); }
async function tnGetSession() { const { data } = await sb.auth.getSession(); return data.session; }
async function tnGetProfile(uid) {
  const { data } = await sb.from('tn_profiles').select('*').eq('id', uid).maybeSingle();
  return data;
}

// ── Catálogo de ejercicios (compartido) ───────────────────────
function exRowToObj(r) {
  return {
    id: r.id, es: r.es, en: r.en, group: r.muscle_group, equipment: r.equipment,
    level: r.level, d: r.drive_id, img: r.image_url || driveImgUrl(r.drive_id),
    primary: r.primary_muscles || [], secondary: r.secondary_muscles || [],
    tip: r.tip || '', errors: r.errors || [],
  };
}
async function dbLoadExercises() {
  const { data, error } = await sb.from('tn_exercises').select('*').order('muscle_group');
  if (error) throw error;
  return (data || []).map(exRowToObj);
}

// ── Alumnos ───────────────────────────────────────────────────
function studentRowToObj(r) {
  return {
    id: r.id, name: r.name, initials: r.initials || (r.name || '?').split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase(),
    age: r.age, goal: r.goal, level: r.level, weight: r.weight, weightDelta: 0,
    color: r.color || '#2EE6D5', note: r.note || '',
    routineId: r.current_routine_id, planId: r.current_plan_id,
    userId: r.user_id, email: r.email || '', lastCheckIn: '—', adherence: 100,
  };
}
async function dbLoadStudents(trainerId) {
  const { data, error } = await sb.from('tn_students').select('*').eq('trainer_id', trainerId).order('created_at');
  if (error) throw error;
  return (data || []).map(studentRowToObj);
}
async function dbAddStudent(trainerId, s) {
  const initials = (s.name || '?').split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
  const { data, error } = await sb.from('tn_students').insert({
    trainer_id: trainerId, name: s.name, initials, age: s.age, goal: s.goal,
    level: s.level, weight: s.weight, color: s.color, note: s.note || '',
    email: s.email || null, current_routine_id: s.routineId || null,
  }).select().single();
  if (error) throw error;
  return studentRowToObj(data);
}
async function dbUpdateStudent(id, patch) {
  const { error } = await sb.from('tn_students').update(patch).eq('id', id);
  if (error) throw error;
}
async function dbAssignRoutine(studentId, routineId) {
  return dbUpdateStudent(studentId, { current_routine_id: routineId });
}

// ── Rutinas (con días e items) ────────────────────────────────
async function dbLoadRoutines(trainerId) {
  const { data: routines, error } = await sb.from('tn_routines').select('*').eq('trainer_id', trainerId).order('created_at');
  if (error) throw error;
  if (!routines || !routines.length) return [];
  const ids = routines.map(r => r.id);
  const { data: days } = await sb.from('tn_routine_days').select('*').in('routine_id', ids).order('idx');
  const dayIds = (days || []).map(d => d.id);
  let items = [];
  if (dayIds.length) {
    const { data: it } = await sb.from('tn_routine_items').select('*').in('day_id', dayIds).order('idx');
    items = it || [];
  }
  return routines.map(r => {
    const rdays = (days || []).filter(d => d.routine_id === r.id).map(d => ({
      id: d.id, day: d.day_label, name: d.name, focus: d.focus, idx: d.idx,
      exercises: items.filter(i => i.day_id === d.id).map(i => ({
        itemId: i.id, id: i.exercise_id, sets: i.sets, reps: i.reps, rest: i.rest, weight: i.weight, technique: i.technique || '',
      })),
    }));
    const trainDays = rdays.filter(d => d.exercises.length);
    return {
      id: r.id, name: r.name, level: r.level, goal: r.goal, weeks: r.weeks,
      totalWeeks: r.weeks, week: 1, desc: r.description || '', days: rdays,
      freq: trainDays.length, totalExercises: trainDays.reduce((a,d)=>a+d.exercises.length,0),
      totalSets: trainDays.reduce((a,d)=>a+d.exercises.reduce((b,e)=>b+e.sets,0),0),
    };
  });
}

// Create a routine from a structured object {name, level, goal, weeks, desc, days:[{day,name,focus,exercises:[{id,sets,reps,rest,weight}]}]}
async function dbCreateRoutine(trainerId, r) {
  const { data: routine, error } = await sb.from('tn_routines').insert({
    trainer_id: trainerId, name: r.name, level: r.level, goal: r.goal,
    weeks: r.weeks || 8, description: r.desc || '',
  }).select().single();
  if (error) throw error;
  const days = r.days || [];
  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    const { data: day, error: de } = await sb.from('tn_routine_days').insert({
      routine_id: routine.id, idx: i, day_label: d.day || '·', name: d.name || 'Día', focus: d.focus || '',
    }).select().single();
    if (de) throw de;
    const exs = d.exercises || [];
    if (exs.length) {
      const rows = exs.map((e, j) => ({
        day_id: day.id, exercise_id: e.id, idx: j,
        sets: e.sets || 3, reps: String(e.reps || '10'), rest: e.rest || 90, weight: e.weight || 0, technique: e.technique || '',
      }));
      const { error: ie } = await sb.from('tn_routine_items').insert(rows);
      if (ie) throw ie;
    }
  }
  return routine.id;
}
async function dbDeleteRoutine(id) {
  const { error } = await sb.from('tn_routines').delete().eq('id', id);
  if (error) throw error;
}

// Create an empty routine with 7 days (L-D) for the builder.
async function dbCreateEmptyRoutine(trainerId, { name, level, goal, weeks }) {
  const { data: routine, error } = await sb.from('tn_routines').insert({
    trainer_id: trainerId, name, level: level || 'Principiante', goal: goal || 'Hipertrofia', weeks: weeks || 8, description: '',
  }).select().single();
  if (error) throw error;
  const labels = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const rows = labels.map((lab, i) => ({ routine_id: routine.id, idx: i, day_label: lab, name: 'Día ' + lab, focus: '' }));
  const { error: de } = await sb.from('tn_routine_days').insert(rows);
  if (de) throw de;
  return routine.id;
}
async function dbAddItem(dayId, exerciseId, idx) {
  const { error } = await sb.from('tn_routine_items').insert({ day_id: dayId, exercise_id: exerciseId, idx: idx || 0, sets: 3, reps: '10', rest: 90, weight: 0 });
  if (error) throw error;
}
async function dbRemoveItem(itemId) {
  const { error } = await sb.from('tn_routine_items').delete().eq('id', itemId);
  if (error) throw error;
}
async function dbUpdateItem(itemId, patch) {
  const { error } = await sb.from('tn_routine_items').update(patch).eq('id', itemId);
  if (error) throw error;
}
async function dbUpdateDay(dayId, patch) {
  const { error } = await sb.from('tn_routine_days').update(patch).eq('id', dayId);
  if (error) throw error;
}

// ── Progreso ──────────────────────────────────────────────────
async function dbLogWeight(studentId, kg) {
  const { error } = await sb.from('tn_weight_logs').insert({ student_id: studentId, kg });
  if (error) throw error;
  await dbUpdateStudent(studentId, { weight: kg });
}
async function dbLoadWeights(studentId) {
  const { data } = await sb.from('tn_weight_logs').select('kg, logged_at').eq('student_id', studentId).order('logged_at');
  return (data || []).map(r => r.kg);
}
async function dbSaveSets(studentId, dayId, exerciseId, setsDone) {
  const { error } = await sb.from('tn_workout_logs').upsert({
    student_id: studentId, day_id: dayId, exercise_id: exerciseId, sets_done: setsDone, log_date: new Date().toISOString().slice(0,10),
  }, { onConflict: 'student_id,day_id,exercise_id,log_date' });
  if (error) throw error;
}

async function dbLoadNutrition(trainerId) {
  const { data: plans } = await sb.from('tn_nutrition_plans').select('*').eq('trainer_id', trainerId).order('created_at');
  if (!plans || !plans.length) return [];
  const ids = plans.map(p => p.id);
  const { data: meals } = await sb.from('tn_meals').select('*').in('plan_id', ids).order('idx');
  return plans.map(p => ({
    id: p.id, name: p.name, calories: p.calories, protein: p.protein, carbs: p.carbs, fat: p.fat,
    meals: (meals || []).filter(m => m.plan_id === p.id).map(m => ({
      id: m.id, time: m.time, name: m.name, kcal: m.kcal, p: m.p, c: m.c, f: m.f, items: m.items || [],
    })),
  }));
}

// ── Alumno reclama su ficha + acciones de ejercicios / nutrición ──
async function dbClaimStudent(email) {
  const { data, error } = await sb.rpc('tn_claim_student', { p_email: email });
  if (error) throw error;
  return data; // student id or null
}
async function dbAddExercise(ex) {
  const { data, error } = await sb.from('tn_exercises').insert({
    id: ex.id, es: ex.es, en: ex.en || '', muscle_group: ex.group, equipment: ex.equipment,
    level: ex.level, drive_id: ex.drive_id || null,
    primary_muscles: ex.primary || [], secondary_muscles: ex.secondary || [], tip: ex.tip || '', errors: ex.errors || [],
  }).select().single();
  if (error) throw error;
  return exRowToObj(data);
}
async function dbDeleteExercise(id) {
  const { error } = await sb.from('tn_exercises').delete().eq('id', id);
  if (error) throw error;
}
async function dbCreatePlan(trainerId, p) {
  const { data: plan, error } = await sb.from('tn_nutrition_plans').insert({
    trainer_id: trainerId, name: p.name, calories: p.calories || 2000, protein: p.protein || 150, carbs: p.carbs || 200, fat: p.fat || 60,
  }).select().single();
  if (error) throw error;
  const meals = p.meals || [];
  if (meals.length) {
    const rows = meals.map((m, i) => ({ plan_id: plan.id, idx: i, time: m.time || '', name: m.name || 'Comida', kcal: m.kcal || 0, p: m.p || 0, c: m.c || 0, f: m.f || 0, items: m.items || [] }));
    await sb.from('tn_meals').insert(rows);
  }
  return plan.id;
}
async function dbAssignPlan(studentId, planId) {
  return dbUpdateStudent(studentId, { current_plan_id: planId });
}

Object.assign(window, {
  sb, SUPABASE_URL, SUPABASE_KEY, tnSignUp, tnSignIn, tnSignOut, tnGetSession, tnGetProfile,
  dbLoadExercises, dbLoadStudents, dbAddStudent, dbUpdateStudent, dbAssignRoutine,
  dbLoadRoutines, dbCreateRoutine, dbDeleteRoutine, dbCreateEmptyRoutine,
  dbAddItem, dbRemoveItem, dbUpdateItem, dbUpdateDay,
  dbLogWeight, dbLoadWeights, dbSaveSets, dbLoadNutrition,
  dbClaimStudent, dbAddExercise, dbDeleteExercise, dbCreatePlan, dbAssignPlan,
  driveImgUrl,
});
