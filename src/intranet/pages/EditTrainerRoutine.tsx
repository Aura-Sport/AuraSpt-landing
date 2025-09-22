import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

type Routine = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
};

type RoutineExerciseRow = {
  id: string;
  exercise_name: string | null;
  sets: number;
  reps: string;
  rest_seconds: number | null;
  weight_kg: number | null;
  notes: string | null;
  order_in_routine: number;
};

export const EditTrainerRoutinePage: React.FC = () => {
  const { routineId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const userId = params.get('user');

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [rows, setRows] = useState<RoutineExerciseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!routineId) return;
      try {
        setLoading(true);
        setError(null);
        const [rRes, reRes] = await Promise.all([
          supabase.from('routines_trainer').select('id,name,description,duration_minutes,difficulty').eq('id', routineId).single(),
          supabase
            .from('routine_exercises')
            .select('id, sets, reps, rest_seconds, weight_kg, notes, order_in_routine, exercises:exercises(name)')
            .eq('trainer_routine_id', routineId)
            .order('order_in_routine', { ascending: true }),
        ]);
        if (rRes.error) throw rRes.error;
        setRoutine(rRes.data as any);
        if (reRes.error) throw reRes.error;
        setRows((reRes.data || []).map((r: any) => ({
          id: r.id,
          exercise_name: r.exercises?.name ?? null,
          sets: r.sets,
          reps: r.reps,
          rest_seconds: r.rest_seconds,
          weight_kg: r.weight_kg,
          notes: r.notes,
          order_in_routine: r.order_in_routine,
        })));
      } catch (e: any) {
        setError(e.message || 'No se pudo cargar la rutina');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [routineId]);

  const updateRow = (id: string, patch: Partial<RoutineExerciseRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const canSave = useMemo(() => !!routine && rows.length > 0, [routine, rows]);

  const onSave = async () => {
    if (!routineId || !canSave || saving) return;
    try {
      setSaving(true);
      setError(null);
      const { error: reErr } = await supabase.from('routine_exercises').upsert(
        rows.map((r) => ({
          id: r.id,
          sets: r.sets,
          reps: r.reps,
          rest_seconds: r.rest_seconds,
          weight_kg: r.weight_kg,
          notes: r.notes,
          order_in_routine: r.order_in_routine,
        })),
      );
      if (reErr) throw reErr;
      navigate(`/home/routines/user/${userId ?? ''}`);
    } catch (e: any) {
      setError(e.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Editar rutina</h1>
          {routine && (
            <p className="text-zinc-400">{routine.name} · {routine.duration_minutes} min · {routine.difficulty}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-sm">Cancelar</button>
          <button onClick={onSave} disabled={!canSave || saving} className="px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-sm disabled:opacity-50">{saving ? 'Guardando…' : 'Guardar'}</button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
        {loading ? (
          <div className="p-4 text-zinc-400">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-rose-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400 border-y border-zinc-800">
                  <th className="px-4 py-2">Ejercicio</th>
                  <th className="px-4 py-2 w-24">Series</th>
                  <th className="px-4 py-2 w-28">Reps</th>
                  <th className="px-4 py-2 w-32">Descanso (s)</th>
                  <th className="px-4 py-2 w-28">Peso (kg)</th>
                  <th className="px-4 py-2">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 text-zinc-300">{r.exercise_name || '-'}</td>
                    <td className="px-4 py-2"><input type="number" min={1} value={r.sets} onChange={(e) => updateRow(r.id, { sets: parseInt(e.target.value || '0') })} className="w-20 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" /></td>
                    <td className="px-4 py-2"><input value={r.reps} onChange={(e) => updateRow(r.id, { reps: e.target.value })} className="w-24 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" /></td>
                    <td className="px-4 py-2"><input type="number" min={0} value={r.rest_seconds ?? 0} onChange={(e) => updateRow(r.id, { rest_seconds: parseInt(e.target.value || '0') })} className="w-28 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" /></td>
                    <td className="px-4 py-2"><input type="number" min={0} step="0.5" value={r.weight_kg ?? 0} onChange={(e) => updateRow(r.id, { weight_kg: parseFloat(e.target.value || '0') })} className="w-28 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" /></td>
                    <td className="px-4 py-2"><input value={r.notes ?? ''} onChange={(e) => updateRow(r.id, { notes: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EditTrainerRoutinePage;


