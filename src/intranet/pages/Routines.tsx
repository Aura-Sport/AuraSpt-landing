import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';

type AcceptedStudent = {
  student_id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  invited_at?: string | null;
  accepted_at?: string | null;
};

export const RoutinesPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<AcceptedStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const fetchAccepted = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('trainer_students')
          .select('student_id, invited_at, accepted_at, users:users!trainer_students_student_id_fkey(id, name, email, avatar)')
          .eq('trainer_id', user.id)
          .eq('status', 'accepted')
          .order('accepted_at', { ascending: false });
        if (error) throw error;
        const mapped: AcceptedStudent[] = (data || []).map((r: any) => ({
          student_id: r.student_id,
          name: r.users?.name ?? null,
          email: r.users?.email ?? null,
          avatar: r.users?.avatar ?? null,
          invited_at: r.invited_at,
          accepted_at: r.accepted_at,
        }));
        setStudents(mapped);
      } catch (e: any) {
        setError(e.message || 'Error cargando alumnos');
      } finally {
        setLoading(false);
      }
    };
    fetchAccepted();
  }, [user?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestionar rutinas</h1>
        <p className="text-zinc-400">Selecciona un alumno para asignarle una rutina.</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o email"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm"
      >
        {loading ? (
          <div className="p-4 text-zinc-400">Cargando…</div>
        ) : error ? (
          <div className="p-4 text-rose-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-zinc-400">No hay alumnos aceptados aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-zinc-800">
                  <th className="px-4 py-3 font-medium">Alumno</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-medium w-0">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((s) => (
                  <tr key={s.student_id} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                          {s.avatar ? (
                            <img src={s.avatar} alt={s.name || 'avatar'} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs text-zinc-400">{(s.name || '?').slice(0, 1)}</span>
                          )}
                        </div>
                        <div>
                          <div className="text-white">{s.name || 'Usuario'}</div>
                          <div className="text-xs text-zinc-500 sm:hidden">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-zinc-300">{s.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/home/routines/assign/${s.student_id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Asignar
                        </Link>
                        <Link
                          to={`/home/routines/user/${s.student_id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                        >
                          Ver rutinas
                        </Link>
                        <Link
                          to={`/home/routines/history/${s.student_id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-colors"
                        >
                          Historial
                        </Link>
                      </div>
                    </td>
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

export default RoutinesPage;



