import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

type ExerciseOption = { id: string; name: string };

type Student = {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
};

type RoutineExerciseForm = {
  exercise_name: string; // texto libre
  sets: number;
  reps_num: number; // número fijo
  rest_minutes?: number | null; // en minutos
  weight_kg?: number | null;
  notes?: string | null;
  imageFile?: File | null; // imagen para storage
};

export const AssignRoutinePage: React.FC = () => {
  const { id } = useParams(); // student id
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTrainer = user?.role === 'trainer';
  const [student, setStudent] = useState<Student | null>(null);
  const [exercises, setExercises] = useState<ExerciseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState<string>('Rutina personalizada');
  const [description, setDescription] = useState<string>('');
  const [duration, setDuration] = useState<number>(45);
  const [difficulty, setDifficulty] = useState<'Principiante' | 'Intermedio' | 'Avanzado'>('Intermedio');
  const [exerciseRows, setExerciseRows] = useState<RoutineExerciseForm[]>([
    { exercise_name: '', sets: 3, reps_num: 10, rest_minutes: 1, imageFile: null },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [uRes, eRes] = await Promise.all([
          supabase.from('users').select('id,name,email,avatar').eq('id', id).single(),
          supabase.from('exercises').select('id,name').order('name', { ascending: true }),
        ]);
        if (uRes.error) throw uRes.error;
        setStudent(uRes.data as unknown as Student);
        if (eRes.error) throw eRes.error;
        const opts: ExerciseOption[] = (eRes.data || []).map((e: any) => ({ id: e.id, name: e.name }));
        setExercises(opts);
      } catch (e: any) {
        setError(e.message || 'No se pudo cargar');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const canSave = useMemo(() => {
    if (!name.trim() || !id || !user?.id || !isTrainer) return false;
    if (exerciseRows.length === 0) return false;
    return exerciseRows.every((row) => (row.exercise_name || '').trim() && row.sets > 0 && row.reps_num > 0);
  }, [name, id, user?.id, isTrainer, exerciseRows]);

  const addRow = () => setExerciseRows((rows) => [...rows, { exercise_name: '', sets: 3, reps_num: 10, rest_minutes: 1, imageFile: null }]);
  const removeRow = (index: number) => setExerciseRows((rows) => rows.filter((_, i) => i !== index));
  const updateRow = (index: number, patch: Partial<RoutineExerciseForm>) =>
    setExerciseRows((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const onSave = async () => {
    if (!id || !canSave || saving) return;
    try {
      setSaving(true);
      setError(null);
      const totalExercises = exerciseRows.length;
      const routineData = { name, description, duration_minutes: duration, difficulty, exercises: exerciseRows };
      const { data: routine, error: rErr } = await supabase
        .from('routines_trainer')
        .insert({
          user_id: id,
          assigned_to: id,
          created_by: user.id,
          name,
          description,
          duration_minutes: duration,
          difficulty,
          total_exercises: totalExercises,
          ai_generated: false,
          routine_data: routineData,
        })
        .select('id')
        .single();
      if (rErr) throw rErr;
      const routineId = routine.id as string;
      // Resolver exercise_id por cada fila (crear si no existe), y subir imagen si corresponde
      const rowsToInsert = [] as any[];
      for (let index = 0; index < exerciseRows.length; index++) {
        const row = exerciseRows[index];
        const nameToUse = (row.exercise_name || '').trim();
        if (!nameToUse) throw new Error(`Falta nombre de ejercicio en la fila ${index + 1}`);

        // 1) subir imagen si hay
        if (row.imageFile) {
          const ext = row.imageFile.name.split('.').pop() || 'jpg';
          const slug = nameToUse
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          const path = `ex/${Date.now()}_${slug}.${ext}`;
          const { error: upErr } = await supabase.storage.from('exercise-images').upload(path, row.imageFile, {
            cacheControl: '3600',
            upsert: false,
          });
          if (upErr && upErr.message && !upErr.message.includes('The resource already exists')) throw upErr;
        }

        // 2) buscar o crear exercise
        let exerciseId: string | null = null;
        const found = await supabase
          .from('exercises')
          .select('id')
          .ilike('name', nameToUse)
          .maybeSingle();
        if (!found.error && found.data) {
          exerciseId = (found.data as any).id as string;
        } else {
          const created = await supabase
            .from('exercises')
            .insert({
              name: nameToUse,
              description: null,
              instructions: null,
              muscle_groups: [],
              equipment_required: [],
              difficulty_level: difficulty,
              exercise_type: 'Fuerza',
              owner_user_id: user.id,
            })
            .select('id')
            .single();
          if (created.error) throw created.error;
          exerciseId = (created.data as any).id as string;
        }

        rowsToInsert.push({
          trainer_routine_id: routineId,
          exercise_id: exerciseId,
          order_in_routine: index + 1,
          sets: row.sets,
          reps: String(row.reps_num),
          rest_seconds: row.rest_minutes != null ? Math.round(row.rest_minutes * 60) : null,
          weight_kg: row.weight_kg ?? null,
          notes: row.notes ?? null,
        });
      }

      const { error: reErr } = await supabase.from('routine_exercises').insert(rowsToInsert);
      if (reErr) throw reErr;
      navigate('/home/routines');
    } catch (e: any) {
      setError(e.message || 'No se pudo guardar la rutina');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Asignar rutina</h1>
        {student && (
          <p className="text-zinc-400">Alumno: <span className="text-white">{student.name || student.email}</span></p>
        )}
      </div>

      {!isTrainer && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 px-4 py-3 text-sm">
          Solo los entrenadores pueden asignar rutinas.
        </div>
      )}

      {loading ? (
        <div className="text-zinc-400">Cargando…</div>
      ) : error ? (
        <div className="text-rose-400">{error}</div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Nombre de la rutina</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Duración (min)</label>
                <input type="number" min={10} max={180} value={duration} onChange={(e) => setDuration(parseInt(e.target.value || '0'))} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Dificultad</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm">
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Descripción (opcional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-white font-semibold">Ejercicios</h2>
              <button onClick={addRow} className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-sm">Añadir ejercicio</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-400 border-y border-zinc-800">
                    <th className="px-4 py-2">Ejercicio</th>
                    <th className="px-4 py-2 w-24">Series</th>
                    <th className="px-4 py-2 w-28">Reps</th>
                    <th className="px-4 py-2 w-32">Descanso (min)</th>
                    <th className="px-4 py-2 w-28 hidden md:table-cell">Peso (kg)</th>
                    <th className="px-4 py-2 hidden lg:table-cell">Notas</th>
                    <th className="px-4 py-2 w-44 hidden md:table-cell">Imagen</th>
                    <th className="px-4 py-2 w-0"> </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {exerciseRows.map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <input
                          value={row.exercise_name}
                          onChange={(e) => updateRow(index, { exercise_name: e.target.value })}
                          placeholder="Ej. Sentadilla hack"
                          list={`exercise-suggestions`}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min={1} max={10} value={row.sets} onChange={(e) => updateRow(index, { sets: parseInt(e.target.value || '0') })} className="w-20 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min={1} max={100} value={row.reps_num} onChange={(e) => updateRow(index, { reps_num: parseInt(e.target.value || '0') })} className="w-24 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" />
                      </td>
                      <td className="px-4 py-2">
                        <input type="number" min={0} max={60} value={row.rest_minutes ?? 0} onChange={(e) => updateRow(index, { rest_minutes: parseInt(e.target.value || '0') })} className="w-28 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" />
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        <input type="number" min={0} step="0.5" value={row.weight_kg ?? 0} onChange={(e) => updateRow(index, { weight_kg: parseFloat(e.target.value || '0') })} className="w-28 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" />
                      </td>
                      <td className="px-4 py-2 hidden lg:table-cell">
                        <input value={row.notes ?? ''} onChange={(e) => updateRow(index, { notes: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800" />
                      </td>
                      <td className="px-4 py-2 hidden md:table-cell">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => updateRow(index, { imageFile: e.target.files?.[0] || null })}
                          className="block w-44 text-xs text-zinc-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border file:border-zinc-700 file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => removeRow(index)} className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10">Quitar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* datalist para sugerencias, no es un select obligatorio */}
            <datalist id="exercise-suggestions">
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.name} />
              ))}
            </datalist>
          </motion.div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60">Cancelar</button>
            <button onClick={onSave} disabled={!canSave || saving} className="px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10 disabled:opacity-50">
              {saving ? 'Guardando…' : 'Guardar rutina'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignRoutinePage;


