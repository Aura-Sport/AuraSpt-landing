import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

type Session = {
  id: string;
  user_id: string | null;
  routine_id: string | null;
  started_at: string;
  completed_at: string | null;
  total_duration_minutes: number | null;
  notes: string | null;
};

type RoutineExercise = {
  id: string;
  order_in_routine: number;
  sets: number;
  reps: string;
  rest_seconds: number | null;
  weight_kg: number | null;
  notes: string | null;
  exercise_name: string | null;
  exercise_id: string | null;
  preset_source_id: string | null;
  image_url?: string | null;
  routine_id: string | null;
  trainer_routine_id: string | null;
};

type SetLog = {
  id: string;
  routine_exercise_id: string | null;
  exercise_id: string | null;
  set_index: number;
  reps: number | null;
  weight_kg: number | null;
  rest_seconds: number | null;
  rpe: number | null;
  notes: string | null;
  exercise_name?: string | null;
};

export const UserSessionDetailPage: React.FC = () => {
  const { id, sessionId } = useParams();
  const [session, setSession] = useState<Session | null>(null);
  const [routineName, setRoutineName] = useState<string | null>(null);
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [logsByRoutineExerciseId, setLogsByRoutineExerciseId] = useState<Record<string, SetLog[]>>({});
  const [unassignedLogs, setUnassignedLogs] = useState<SetLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!sessionId) return;
      try {
        setLoading(true);
        setError(null);

        // 1) Sesión
        const { data: s, error: sErr } = await supabase
          .from('workout_sessions')
          .select('id, user_id, routine_id, started_at, completed_at, total_duration_minutes, notes')
          .eq('id', sessionId)
          .single();
        if (sErr) throw sErr;
        setSession(s as any);

        // 2) Logs de sets (para conocer routine_exercise_id usados)
        let { data: rawLogs, error: lErr } = await supabase
          .from('exercise_set_logs')
          .select('id, routine_exercise_id, exercise_id, set_index, reps, weight_kg, rest_seconds, rpe, notes, exercises:exercises(name)')
          .eq('workout_session_id', sessionId)
          .order('set_index', { ascending: true });
        if (lErr) throw lErr;
        const routineExerciseIds = Array.from(
          new Set((rawLogs || []).map((l: any) => l.routine_exercise_id).filter((x: any): x is string => Boolean(x)))
        );

        // 3) Cargar rutina base: ejercicios planificados en routine_exercises
        let planned: RoutineExercise[] = [];
        if (routineExerciseIds.length > 0) {
          const { data: reRows, error: reErr } = await supabase
            .from('routine_exercises')
            .select('id, order_in_routine, sets, reps, rest_seconds, weight_kg, notes, routine_id, trainer_routine_id, exercises:exercises(id, name, source_preset_id)')
            .in('id', routineExerciseIds);
          if (reErr) throw reErr;
          planned = (reRows || []).map((r: any) => ({
            id: r.id,
            order_in_routine: r.order_in_routine,
            sets: r.sets,
            reps: r.reps,
            rest_seconds: r.rest_seconds,
            weight_kg: r.weight_kg,
            notes: r.notes,
            exercise_name: r.exercises?.name ?? null,
            exercise_id: r.exercises?.id ?? null,
            preset_source_id: r.exercises?.source_preset_id ?? null,
            routine_id: r.routine_id ?? null,
            trainer_routine_id: r.trainer_routine_id ?? null,
          }));
        }
        // fallback: si no hay routine_exercise_id en logs, intentamos por session.routine_id
        if (planned.length === 0 && s?.routine_id) {
          const { data: reRows2, error: reErr2 } = await supabase
            .from('routine_exercises')
            .select('id, order_in_routine, sets, reps, rest_seconds, weight_kg, notes, routine_id, trainer_routine_id, exercises:exercises(id, name, source_preset_id)')
            .eq('routine_id', s.routine_id)
            .order('order_in_routine', { ascending: true });
          if (reErr2) throw reErr2;
          planned = (reRows2 || []).map((r: any) => ({
            id: r.id,
            order_in_routine: r.order_in_routine,
            sets: r.sets,
            reps: r.reps,
            rest_seconds: r.rest_seconds,
            weight_kg: r.weight_kg,
            notes: r.notes,
            exercise_name: r.exercises?.name ?? null,
            exercise_id: r.exercises?.id ?? null,
            preset_source_id: r.exercises?.source_preset_id ?? null,
            routine_id: r.routine_id ?? null,
            trainer_routine_id: r.trainer_routine_id ?? null,
          }));
        }
        // Enriquecer con media_url desde preset_exercises
        const sourceIds = Array.from(new Set(planned.map((p) => p.preset_source_id).filter((x): x is string => Boolean(x))));
        let mediaByPreset: Record<string, string> = {};
        if (sourceIds.length > 0) {
          const { data: presetRows } = await supabase
            .from('preset_exercises')
            .select('id, media_url')
            .in('id', sourceIds);
          (presetRows || []).forEach((pr: any) => {
            const raw: string | null = pr.media_url ?? null;
            if (!raw) return;
            if (typeof raw === 'string' && /^https?:\/\//i.test(raw)) {
              mediaByPreset[pr.id] = raw;
            } else {
              // Asumimos que es una ruta relativa dentro del bucket 'exercise-images'
              const { data } = supabase.storage.from('exercise-images').getPublicUrl(raw);
              if (data?.publicUrl) mediaByPreset[pr.id] = data.publicUrl;
            }
          });
        }
        let enriched = planned
          .sort((a, b) => a.order_in_routine - b.order_in_routine)
          .map((p) => ({ ...p, image_url: p.preset_source_id ? mediaByPreset[p.preset_source_id] ?? null : null }));

        // Fallback por nombre en Storage (ex/ y covers/)
        const needsLookup = enriched.some((p) => !p.image_url && (p.exercise_name || '').trim());
        if (needsLookup) {
          const normalize = (s: string) => s
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

          const tryMatch = (files: { name: string }[], exerciseName: string): string | null => {
            const key = normalize(exerciseName);
            const found = files.find((f) => normalize(f.name).includes(key));
            return found ? found.name : null;
          };

          const [exList, coversList] = await Promise.all([
            supabase.storage.from('exercise-images').list('ex', { limit: 1000 }),
            supabase.storage.from('exercise-images').list('covers', { limit: 1000 }),
          ]);
          const exFiles = (exList.data || []) as { name: string }[];
          const coverFiles = (coversList.data || []) as { name: string }[];

          enriched = await Promise.all(enriched.map(async (p) => {
            if (p.image_url || !p.exercise_name) return p;
            const exName = tryMatch(exFiles, p.exercise_name);
            const coverName = tryMatch(coverFiles, p.exercise_name);
            let publicUrl: string | null = null;
            if (exName) {
              const { data } = supabase.storage.from('exercise-images').getPublicUrl(`ex/${exName}`);
              publicUrl = data?.publicUrl ?? null;
            } else if (coverName) {
              const { data } = supabase.storage.from('exercise-images').getPublicUrl(`covers/${coverName}`);
              publicUrl = data?.publicUrl ?? null;
            }
            return { ...p, image_url: publicUrl };
          }));
        }

        setRoutineExercises(enriched);

        // Fallback: si no vinieron logs por sessionId (posible workout_session_id null),
        // intentamos cargarlos por ventana de tiempo y los routine_exercise_ids planificados
        if ((rawLogs || []).length === 0 && planned.length > 0 && s?.started_at) {
          const plannedIds = planned.map((p) => p.id);
          const started = new Date(s.started_at);
          const fromTs = new Date(started.getTime() - 12 * 60 * 60 * 1000).toISOString();
          const toTs = s.completed_at
            ? new Date(new Date(s.completed_at).getTime() + 12 * 60 * 60 * 1000).toISOString()
            : new Date(started.getTime() + 12 * 60 * 60 * 1000).toISOString();
          const fb = await supabase
            .from('exercise_set_logs')
            .select('id, routine_exercise_id, exercise_id, set_index, reps, weight_kg, rest_seconds, rpe, notes, exercises:exercises(name), created_at')
            .in('routine_exercise_id', plannedIds)
            .is('workout_session_id', null)
            .gte('created_at', fromTs)
            .lte('created_at', toTs)
            .order('set_index', { ascending: true });
          if (!fb.error && fb.data) {
            rawLogs = fb.data as any[];
          }
        }

        // Fallback 2: si aún vacío, traer por routine_exercise_id sin filtro temporal (últimos 200)
        if ((rawLogs || []).length === 0 && planned.length > 0) {
          const plannedIds = planned.map((p) => p.id);
          const fb2 = await supabase
            .from('exercise_set_logs')
            .select('id, routine_exercise_id, exercise_id, set_index, reps, weight_kg, rest_seconds, rpe, notes, exercises:exercises(name), created_at')
            .in('routine_exercise_id', plannedIds)
            .order('created_at', { ascending: true })
            .limit(200);
          if (!fb2.error && fb2.data) {
            rawLogs = fb2.data as any[];
          }
        }

        // 4) Agrupar logs por routine_exercise_id
        const byRe: Record<string, SetLog[]> = {};

        // Mapa para asociar logs sin routine_exercise_id por exercise_id
        const reByExerciseId: Record<string, string> = {};
        planned.forEach((p) => {
          if (p.exercise_id && !reByExerciseId[p.exercise_id]) {
            reByExerciseId[p.exercise_id] = p.id;
          }
        });

        const unassigned: SetLog[] = [];
        (rawLogs || []).forEach((l: any) => {
          const entry: SetLog = {
            id: l.id,
            routine_exercise_id: l.routine_exercise_id,
            exercise_id: l.exercise_id,
            set_index: l.set_index,
            reps: l.reps,
            weight_kg: l.weight_kg,
            rest_seconds: l.rest_seconds,
            rpe: l.rpe,
            notes: l.notes,
            exercise_name: l.exercises?.name ?? null,
          };
          if (entry.routine_exercise_id) {
            if (!byRe[entry.routine_exercise_id]) byRe[entry.routine_exercise_id] = [];
            byRe[entry.routine_exercise_id].push(entry);
          } else if (entry.exercise_id && reByExerciseId[entry.exercise_id]) {
            const key = reByExerciseId[entry.exercise_id];
            if (!byRe[key]) byRe[key] = [];
            byRe[key].push(entry);
          } else {
            unassigned.push(entry);
          }
        });
        Object.values(byRe).forEach((arr) => arr.sort((a, b) => a.set_index - b.set_index));
        setLogsByRoutineExerciseId(byRe);
        setUnassignedLogs(unassigned);

        // 5) Nombre de rutina (routines o routines_trainer)
        let routineTitle: string | null = null;
        if (s?.routine_id) {
          const { data: r, error: rErr } = await supabase
            .from('routines')
            .select('name')
            .eq('id', s.routine_id)
            .maybeSingle();
          if (rErr) throw rErr;
          routineTitle = (r as any)?.name ?? null;
        } else if (planned.length > 0) {
          const trainerRoutineId = planned.find((p) => p.trainer_routine_id)?.trainer_routine_id;
          if (trainerRoutineId) {
            const { data: rt, error: rtErr } = await supabase
              .from('routines_trainer')
              .select('name')
              .eq('id', trainerRoutineId)
              .maybeSingle();
            if (rtErr) throw rtErr;
            routineTitle = (rt as any)?.name ?? null;
          }
        }
        setRoutineName(routineTitle);
      } catch (e: any) {
        setError(e.message || 'No se pudo cargar el detalle de la sesión');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  const hasUnknownLogs = useMemo(() => unassignedLogs.length > 0, [unassignedLogs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Detalle de sesión</h1>
          {session && (
            <p className="text-zinc-400">
              {new Date(session.started_at).toLocaleString()} · {
                (session.total_duration_minutes !== null && session.total_duration_minutes !== undefined)
                  ? session.total_duration_minutes
                  : (session.completed_at
                      ? Math.max(1, Math.round((new Date(session.completed_at).getTime() - new Date(session.started_at).getTime()) / 60000))
                      : '-')
              } min · {session.completed_at ? 'Completada' : 'En curso'}
            </p>
          )}
          {routineName && <p className="text-zinc-300">Rutina: <span className="text-white">{routineName}</span></p>}
        </div>
        <div>
          <Link to={`/home/routines/history/${id}`} className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-sm">Volver al historial</Link>
        </div>
      </div>

      {loading ? (
        <div className="text-zinc-400">Cargando…</div>
      ) : error ? (
        <div className="text-rose-400">{error}</div>
      ) : (
        <>
          {routineExercises.length === 0 && (
            <div className="text-zinc-400">No se encontraron ejercicios planificados para esta rutina.</div>
          )}

          <div className="space-y-4">
            {routineExercises.map((re) => {
              const logs = logsByRoutineExerciseId[re.id] || [];
              return (
                <motion.div key={re.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                  <div className="flex items-stretch gap-0">
                    {re.image_url ? (
                      <div className="hidden sm:block w-40 shrink-0 bg-zinc-800/40 border-r border-zinc-800">
                        <img src={re.image_url} alt={re.exercise_name || ''} className="h-full w-full object-cover" />
                      </div>
                    ) : null}
                    <div className="flex-1">
                      <div className="p-4 border-b border-zinc-800">
                        <div className="text-white font-medium">{re.order_in_routine}. {re.exercise_name || 'Ejercicio'}</div>
                        <div className="text-xs text-zinc-400">
                          Plan: {re.sets}×{re.reps} {re.weight_kg ? `· ${re.weight_kg} kg` : ''} {re.rest_seconds ? `· Descanso ${re.rest_seconds}s` : ''}
                        </div>
                        {re.notes && <div className="text-sm text-zinc-300 mt-1">Notas: {re.notes}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-zinc-400">
                          <th className="px-4 py-2 w-16">Set</th>
                          <th className="px-4 py-2 w-20">Reps</th>
                          <th className="px-4 py-2 w-24 hidden sm:table-cell">Peso (kg)</th>
                          <th className="px-4 py-2 w-24 hidden md:table-cell">Descanso (s)</th>
                          <th className="px-4 py-2 w-16 hidden lg:table-cell">RPE</th>
                          <th className="px-4 py-2">Notas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {logs.length === 0 ? (
                          <tr>
                            <td className="px-4 py-3 text-zinc-400" colSpan={6}>Sin sets registrados.</td>
                          </tr>
                        ) : (
                          logs.map((log) => (
                            <tr key={log.id}>
                              <td className="px-4 py-2">{log.set_index + 1}</td>
                              <td className="px-4 py-2">{log.reps ?? '-'}</td>
                              <td className="px-4 py-2 hidden sm:table-cell">{log.weight_kg ?? '-'}</td>
                              <td className="px-4 py-2 hidden md:table-cell">{log.rest_seconds ?? '-'}</td>
                              <td className="px-4 py-2 hidden lg:table-cell">{log.rpe ?? '-'}</td>
                              <td className="px-4 py-2 text-zinc-300">{log.notes ?? ''}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {hasUnknownLogs && (
            <div className="space-y-2">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 px-4 py-3 text-sm">
                Hay sets registrados que no están asociados a un ejercicio de la rutina.
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-800 text-zinc-200 text-sm font-medium">Sets no asociados</div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400">
                      <th className="px-4 py-2">Ejercicio</th>
                      <th className="px-4 py-2 w-16">Set</th>
                      <th className="px-4 py-2 w-20">Reps</th>
                      <th className="px-4 py-2 w-24 hidden sm:table-cell">Peso (kg)</th>
                      <th className="px-4 py-2 w-24 hidden md:table-cell">Descanso (s)</th>
                      <th className="px-4 py-2 w-16 hidden lg:table-cell">RPE</th>
                      <th className="px-4 py-2">Notas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {unassignedLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-4 py-2 text-zinc-200">{log.exercise_name || '-'}</td>
                        <td className="px-4 py-2">{log.set_index + 1}</td>
                        <td className="px-4 py-2">{log.reps ?? '-'}</td>
                        <td className="px-4 py-2 hidden sm:table-cell">{log.weight_kg ?? '-'}</td>
                        <td className="px-4 py-2 hidden md:table-cell">{log.rest_seconds ?? '-'}</td>
                        <td className="px-4 py-2 hidden lg:table-cell">{log.rpe ?? '-'}</td>
                        <td className="px-4 py-2 text-zinc-300">{log.notes ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserSessionDetailPage;


