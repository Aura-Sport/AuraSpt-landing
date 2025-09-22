import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { motion } from 'framer-motion';

type Routine = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  total_exercises: number;
  created_at: string;
};

type Student = { id: string; name: string | null; email: string | null; avatar: string | null };

export const UserRoutinesPage: React.FC = () => {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
  const [trainerRoutines, setTrainerRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'user' | 'trainer'>('trainer');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const [uRes, rUserRes, rTrainerRes] = await Promise.all([
          supabase.from('users').select('id,name,email,avatar').eq('id', id).single(),
          supabase
            .from('routines')
            .select('id,name,description,duration_minutes,difficulty,total_exercises,created_at')
            .eq('assigned_to', id)
            .order('created_at', { ascending: false }),
          supabase
            .from('routines_trainer')
            .select('id,name,description,duration_minutes,difficulty,total_exercises,created_at')
            .eq('assigned_to', id)
            .order('created_at', { ascending: false }),
        ]);
        if (uRes.error) throw uRes.error;
        setStudent(uRes.data as any);
        if (rUserRes.error) throw rUserRes.error;
        if (rTrainerRes.error) throw rTrainerRes.error;
        setUserRoutines((rUserRes.data || []) as Routine[]);
        setTrainerRoutines((rTrainerRes.data || []) as Routine[]);
      } catch (e: any) {
        setError(e.message || 'No se pudieron cargar las rutinas');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filterFn = (arr: Routine[]) => (!q ? arr : arr.filter((r) => r.name.toLowerCase().includes(q)));
    return { user: filterFn(userRoutines), trainer: filterFn(trainerRoutines) };
  }, [userRoutines, trainerRoutines, query]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Rutinas del alumno</h1>
        {student && <p className="text-zinc-400">{student.name || student.email}</p>}
      </div>

      <div className="relative max-w-md">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar rutina por nombre"
          className="w-full pl-3 pr-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('trainer')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'trainer'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            Entrenador
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'user'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            Usuario
          </button>
        </div>
        {activeTab === 'trainer' && (
          <Link
            to={`/home/routines/assign/${id}`}
            className="px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 text-xs"
          >
            Nueva rutina
          </Link>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
        {loading ? (
          <div className="p-4 text-zinc-400">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-rose-400">{error}</div>
        ) : (activeTab === 'trainer' ? filtered.trainer.length === 0 : filtered.user.length === 0) ? (
          <div className="p-4 text-zinc-400">No hay rutinas {activeTab === 'trainer' ? 'del entrenador' : 'del usuario'}.</div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {(activeTab === 'trainer' ? filtered.trainer : filtered.user).map((r) => (
              <li key={r.id} className="p-4 hover:bg-zinc-800/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-medium">{r.name}</div>
                    <div className="text-xs text-zinc-400">{r.difficulty} · {r.duration_minutes} min · {r.total_exercises} ejercicios</div>
                    {r.description && <div className="text-sm text-zinc-300 mt-1 line-clamp-2">{r.description}</div>}
                    <div className="text-xs text-zinc-500 mt-1">Creada: {new Date(r.created_at).toLocaleString()}</div>
                  </div>
                  {activeTab === 'trainer' && (
                    <div className="shrink-0 flex items-center gap-2">
                      <Link
                        to={`/home/routines/edit/${r.id}?user=${id}`}
                        className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 text-xs"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={async () => {
                          if (!confirm('¿Eliminar esta rutina? Se borrarán sus ejercicios asociados.')) return;
                          try {
                            setActionLoading(r.id);
                            // Obtener routine_exercises para borrar logs primero
                            const { data: reIds, error: reErr } = await supabase
                              .from('routine_exercises')
                              .select('id')
                              .eq('trainer_routine_id', r.id);
                            if (reErr) throw reErr;
                            const ids = (reIds || []).map((x: any) => x.id);
                            if (ids.length > 0) {
                              await supabase.from('exercise_set_logs').delete().in('routine_exercise_id', ids);
                              await supabase.from('routine_exercises').delete().in('id', ids);
                            }
                            const { error: delErr } = await supabase.from('routines_trainer').delete().eq('id', r.id);
                            if (delErr) throw delErr;
                            setTrainerRoutines((prev) => prev.filter((x) => x.id !== r.id));
                          } catch (e) {
                            console.error(e);
                            alert('No se pudo eliminar la rutina');
                          } finally {
                            setActionLoading(null);
                          }
                        }}
                        disabled={actionLoading === r.id}
                        className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs disabled:opacity-60"
                      >
                        {actionLoading === r.id ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default UserRoutinesPage;


