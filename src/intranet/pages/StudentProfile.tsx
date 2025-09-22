import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';
// Vista simplificada: solo mostramos los grupos seleccionados desde objectives

type Survey = {
  user_id: string;
  days_per_week: number | null;
  aesthetic_goal: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  gender: string | null;
  current_physique: string | null;
  equipment_type: string | null;
  routine_type: string | null;
  limitation_types: string[] | null;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  has_completed_survey: boolean | null;
};

export const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [
          { data: u, error: ue },
          { data: s, error: se },
          { data: obj, error: oe },
        ] = await Promise.all([
          supabase.from('users').select('id,name,email,avatar,has_completed_survey').eq('id', id).single(),
          supabase.from('initial_survey').select('*').eq('user_id', id).single(),
          supabase.from('objectives').select('muscle_groups, categories').eq('user_id', id).maybeSingle(),
        ]);
        if (ue) throw ue;
        setUser(u as any);
        if (!se) setSurvey(s as any);
        if (!oe && obj) {
          const raw: string[] = ((obj as any).muscle_groups || []) as string[];
          const mapToId = (m: string) => {
            const key = (m || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
            const dict: Record<string, string> = {
              pecho: 'chest', chest: 'chest', pectoral: 'chest',
              espalda: 'back', dorsales: 'back', back: 'back', 'upper-back': 'back', 'lower-back': 'back', trapezius: 'back', trapecio: 'back', traps: 'back',
              hombros: 'shoulders', deltoides: 'shoulders', shoulders: 'shoulders', deltoids: 'shoulders',
              biceps: 'biceps', bicep: 'biceps',
              triceps: 'triceps', tricep: 'triceps',
              abdomen: 'abs', abdominales: 'abs', core: 'abs', abs: 'abs',
              gluteos: 'glutes', gluteo: 'glutes', glutes: 'glutes', gluteus: 'glutes',
              cuadriceps: 'quads', cuadricep: 'quads', quads: 'quads', quadriceps: 'quads',
              isquiotibiales: 'hamstrings', femorales: 'hamstrings', hamstrings: 'hamstrings',
              pantorrillas: 'calves', gemelos: 'calves', calves: 'calves', calf: 'calves',
            };
            return dict[key] || m;
          };
          const allowed = new Set(['shoulders','chest','biceps','triceps','abs','quads','hamstrings','glutes','calves','back']);
          const normalized = Array.from(new Set(raw.map(mapToId).filter((x) => allowed.has(x))));
          setMuscleGroups(normalized);
          const cats: string[] = ((obj as any).categories || []) as string[];
          setCategories(cats);
        }
      } catch (e: any) {
        setError(e.message || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const equipmentMap: Record<string, string> = {
    commercial_gym: 'Gimnasio comercial',
    small_gym: 'Gimnasio pequeño',
    calisthenics: 'Calistenia',
    no_equipment: 'Sin equipamiento',
    custom: 'Personalizado',
  };

  const routineMap: Record<string, string> = {
    gym_weights: 'Pesas (gimnasio)',
    sports: 'Deportivo',
    mixed: 'Mixta',
    bodyweight: 'Peso corporal',
  };

  const muscleLabel: Record<string, string> = {
    shoulders: 'Hombros',
    chest: 'Pectorales',
    biceps: 'Bíceps',
    triceps: 'Tríceps',
    abs: 'Abdomen',
    quads: 'Cuádriceps',
    hamstrings: 'Isquiotibiales',
    glutes: 'Glúteos',
    calves: 'Pantorrillas',
    back: 'Espalda',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Perfil del alumno</h1>
      {loading ? (
        <div className="text-zinc-400">Cargando…</div>
      ) : error ? (
        <div className="text-rose-400">{error}</div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full overflow-hidden bg-zinc-800">
              {user?.avatar ? <img src={user.avatar} alt={user?.name || ''} className="h-full w-full object-cover"/> : null}
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">{user?.name || 'Usuario'}</div>
              <div className="text-sm text-zinc-400">{user?.email}</div>
            </div>
            {user?.has_completed_survey ? (
              <span className="text-xs text-emerald-400">Encuesta completada</span>
            ) : (
              <span className="text-xs text-zinc-500">Encuesta pendiente</span>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <h2 className="text-white font-semibold mb-3">Encuesta inicial</h2>
            {survey ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div><span className="text-zinc-400">Objetivo estético:</span> <span className="text-white">{survey.aesthetic_goal || '-'}</span></div>
                <div><span className="text-zinc-400">Frecuencia:</span> <span className="text-white">{survey.days_per_week ?? '-'} días/sem</span></div>
                <div><span className="text-zinc-400">Peso:</span> <span className="text-white">{survey.weight_kg ?? '-'} kg</span></div>
                <div><span className="text-zinc-400">Altura:</span> <span className="text-white">{survey.height_cm ?? '-'} cm</span></div>
                <div><span className="text-zinc-400">Género:</span> <span className="text-white">{survey.gender || '-'}</span></div>
                <div><span className="text-zinc-400">Físico actual:</span> <span className="text-white">{survey.current_physique || '-'}</span></div>
                <div><span className="text-zinc-400">Equipamiento:</span> <span className="text-white">{survey.equipment_type ? (equipmentMap[survey.equipment_type] || survey.equipment_type) : '-'}</span></div>
                <div><span className="text-zinc-400">Tipo rutina:</span> <span className="text-white">{survey.routine_type ? (routineMap[survey.routine_type] || survey.routine_type) : '-'}</span></div>
                <div className="sm:col-span-2 md:col-span-3"><span className="text-zinc-400">Limitaciones:</span> <span className="text-white">{(survey.limitation_types || []).join(', ') || '-'}</span></div>
                {(muscleGroups.length > 0 || categories.length > 0) && (
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-zinc-400">Objetivos:</span>
                    <span className="ml-2 inline-flex flex-wrap gap-2 align-middle">
                      {categories.map((c) => (
                        <span key={`cat-${c}`} className="px-2 py-0.5 text-xs rounded-lg border border-blue-500/30 text-blue-300 bg-blue-500/10">{c}</span>
                      ))}
                      {muscleGroups.map((m) => {
                        const label = muscleLabel[m] || m;
                        return (
                          <span key={m} className="px-2 py-0.5 text-xs rounded-lg border border-emerald-500/30 text-emerald-300 bg-emerald-500/10">{label}</span>
                        );
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-zinc-400 text-sm">Sin datos de encuesta.</div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default StudentProfile;


