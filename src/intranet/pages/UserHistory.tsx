import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

type Student = { id: string; name: string | null; email: string | null };

type Session = {
  id: string;
  started_at: string;
  completed_at: string | null;
  total_duration_minutes: number | null;
  notes: string | null;
  routine_id: string | null;
};

type SetLog = {
  id: string;
  workout_session_id: string;
  routine_exercise_id: string | null;
  exercise_id: string | null;
  set_index: number;
  reps: number | null;
  weight_kg: number | null;
  completed: boolean | null;
  rest_seconds: number | null;
  rpe: number | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  exercise_name?: string | null;
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // convierte domingo(0) en 6, lunes(1) en 0
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function endOfWeek(date: Date): Date {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  e.setMilliseconds(-1);
  return e;
}

export const UserHistoryPage: React.FC = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [setLogs, setSetLogs] = useState<Record<string, SetLog[]>>({});
  const [routineNameById, setRoutineNameById] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date()));

  const weekEnd = useMemo(() => endOfWeek(weekStart), [weekStart]);

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const [uRes, sRes] = await Promise.all([
        supabase.from('users').select('id,name,email').eq('id', id).single(),
        supabase
          .from('workout_sessions')
          .select('id, started_at, completed_at, total_duration_minutes, notes, routine_id')
          .eq('user_id', id)
          .gte('started_at', weekStart.toISOString())
          .lte('started_at', weekEnd.toISOString())
          .order('started_at', { ascending: false }),
      ]);
      if (uRes.error) throw uRes.error;
      setStudent(uRes.data as any);
      if (sRes.error) throw sRes.error;
      const sessionsList: Session[] = (sRes.data || []) as Session[];
      setSessions(sessionsList);

      // cargar set logs por sesión, uniendo nombre de ejercicio
      if (sessionsList.length > 0) {
        const ids = sessionsList.map((s) => s.id);
        const { data: logs, error: lErr } = await supabase
          .from('exercise_set_logs')
          .select('id, workout_session_id, routine_exercise_id, exercise_id, set_index, reps, weight_kg, completed, rest_seconds, rpe, notes, completed_at, created_at, exercises:exercises(name)')
          .in('workout_session_id', ids);
        if (lErr) throw lErr;
        const bySession: Record<string, SetLog[]> = {};
        (logs || []).forEach((row: any) => {
          const entry: SetLog = {
            id: row.id,
            workout_session_id: row.workout_session_id,
            routine_exercise_id: row.routine_exercise_id,
            exercise_id: row.exercise_id,
            set_index: row.set_index,
            reps: row.reps,
            weight_kg: row.weight_kg,
            completed: row.completed,
            rest_seconds: row.rest_seconds,
            rpe: row.rpe,
            notes: row.notes,
            completed_at: row.completed_at,
            created_at: row.created_at,
            exercise_name: row.exercises?.name ?? null,
          };
          if (!bySession[entry.workout_session_id]) bySession[entry.workout_session_id] = [];
          bySession[entry.workout_session_id].push(entry);
        });
        // ordenar sets por set_index
        Object.values(bySession).forEach((arr) => arr.sort((a, b) => a.set_index - b.set_index));
        setSetLogs(bySession);
      } else {
        setSetLogs({});
      }

      // cargar nombres de rutinas
      const routineIds = Array.from(new Set(sessionsList.map((s) => s.routine_id).filter((x): x is string => Boolean(x))));
      if (routineIds.length > 0) {
        const { data: rNames, error: rErr } = await supabase
          .from('routines')
          .select('id,name')
          .in('id', routineIds);
        if (rErr) throw rErr;
        const map: Record<string, string> = {};
        (rNames || []).forEach((r) => {
          map[(r as any).id] = (r as any).name as string;
        });
        setRoutineNameById(map);
      } else {
        setRoutineNameById({});
      }
    } catch (e: any) {
      setError(e.message || 'No se pudo cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, weekStart.getTime()]);

  const changeWeek = (delta: number) => {
    const next = new Date(weekStart);
    next.setDate(next.getDate() + delta * 7);
    setWeekStart(startOfWeek(next));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Historial del alumno</h1>
          {student && <p className="text-zinc-400">{student.name || student.email}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => changeWeek(-1)} className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-sm">Semana anterior</button>
          <div className="text-sm text-zinc-400">
            {weekStart.toLocaleDateString()} – {weekEnd.toLocaleDateString()}
          </div>
          <button onClick={() => changeWeek(1)} className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-sm">Siguiente semana</button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
        {loading ? (
          <div className="p-4 text-zinc-400">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-rose-400">{error}</div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-zinc-400">No hay sesiones en esta semana.</div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {sessions.map((s) => (
              <li key={s.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-medium">{new Date(s.started_at).toLocaleString()}</div>
                    <div className="text-xs text-zinc-400">
                      Rutina: <span className="text-zinc-300">{(s.routine_id && routineNameById[s.routine_id]) || 'Sin rutina'}</span> · {s.total_duration_minutes ?? '-'} min {s.completed_at ? '· Completada' : '· En curso'}
                    </div>
                    {s.notes && <div className="text-sm text-zinc-300 mt-1">{s.notes}</div>}
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => setExpanded((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                      className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-xs"
                    >
                      {expanded[s.id] ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>
                    <div className="mt-2 text-right">
                      <a
                        href={`/home/routines/history/${id}/session/${s.id}`}
                        className="inline-block px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs"
                      >
                        Ver sesión
                      </a>
                    </div>
                  </div>
                </div>

                {expanded[s.id] && (
                  <div className="mt-3 space-y-3">
                    {Object.entries(
                      (setLogs[s.id] || []).reduce((acc: Record<string, SetLog[]>, log) => {
                        const key = log.exercise_name || 'Ejercicio';
                        if (!acc[key]) acc[key] = [];
                        acc[key].push(log);
                        return acc;
                      }, {})
                    ).map(([exercise, logs]) => (
                      <div key={exercise} className="rounded-xl border border-zinc-800 overflow-hidden">
                        <div className="px-3 py-2 bg-zinc-900 text-zinc-200 text-sm font-medium">{exercise}</div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-zinc-400">
                              <th className="px-3 py-2 w-16">Set</th>
                              <th className="px-3 py-2 w-20">Reps</th>
                              <th className="px-3 py-2 w-24 hidden sm:table-cell">Peso (kg)</th>
                              <th className="px-3 py-2 w-24 hidden md:table-cell">Descanso (s)</th>
                              <th className="px-3 py-2 w-16 hidden lg:table-cell">RPE</th>
                              <th className="px-3 py-2">Notas</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800">
                            {logs.sort((a, b) => a.set_index - b.set_index).map((log) => (
                              <tr key={log.id}>
                                <td className="px-3 py-2">{log.set_index + 1}</td>
                                <td className="px-3 py-2">{log.reps ?? '-'}</td>
                                <td className="px-3 py-2 hidden sm:table-cell">{log.weight_kg ?? '-'}</td>
                                <td className="px-3 py-2 hidden md:table-cell">{log.rest_seconds ?? '-'}</td>
                                <td className="px-3 py-2 hidden lg:table-cell">{log.rpe ?? '-'}</td>
                                <td className="px-3 py-2 text-zinc-300">{log.notes ?? ''}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                    {((setLogs[s.id] || []).length === 0) && (
                      <div className="text-sm text-zinc-400">Sin sets registrados.</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default UserHistoryPage;


