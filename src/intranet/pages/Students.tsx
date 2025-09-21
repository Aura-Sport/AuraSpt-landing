import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

type TrainerRequest = {
  id: string;
  trainer_id: string;
  student_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  invited_at: string | null;
  accepted_at: string | null;
  student?: { name: string | null; email: string | null; avatar: string | null };
};

// supabase client ya configurado

export const StudentsPage: React.FC = () => {
  const [requests, setRequests] = useState<TrainerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('trainer_students')
          .select('id, trainer_id, student_id, status, invited_at, accepted_at, users!trainer_students_student_id_fkey(name, email, avatar)')
          .order('invited_at', { ascending: false });
        if (error) throw error;
        const mapped: TrainerRequest[] = (data || []).map((r: any) => ({
          id: r.id,
          trainer_id: r.trainer_id,
          student_id: r.student_id,
          status: r.status,
          invited_at: r.invited_at,
          accepted_at: r.accepted_at,
          student: r.users ? { name: r.users.name, email: r.users.email, avatar: r.users.avatar } : undefined,
        }));
        setRequests(mapped);
      } catch (e: any) {
        setError(e.message || 'Error cargando solicitudes');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      setActionLoading(id + status);
      const updates: any = { status };
      if (status === 'accepted') updates.accepted_at = new Date().toISOString();
      const { error } = await supabase.from('trainer_students').update(updates).eq('id', id);
      if (error) throw error;
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status, accepted_at: status === 'accepted' ? new Date().toISOString() : r.accepted_at } : r)));
    } catch (e: any) {
      setError(e.message || 'No se pudo actualizar la solicitud');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Alumnos</h1>
      <p className="text-dark-mutedForeground mb-6">Solicitudes enviadas por los usuarios</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm p-4"
      >
        {loading ? (
          <div className="text-zinc-400">Cargando…</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-zinc-400">No hay solicitudes.</div>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {requests.map((r) => (
              <li key={r.id} className="py-3 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                  {r.student?.avatar ? (
                    <img src={r.student.avatar} alt={r.student.name || 'avatar'} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-zinc-400">{r.student?.name?.slice(0,1) || '?'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{r.student?.name || 'Usuario'}</div>
                  <div className="text-xs text-zinc-400 truncate">{r.student?.email}</div>
                </div>
                <div className="text-xs">{r.status === 'pending' && <span className="text-amber-400 inline-flex items-center gap-1"><Clock className="w-3 h-3"/> Pendiente</span>}
                {r.status === 'accepted' && <span className="text-emerald-400 inline-flex items-center gap-1"><Check className="w-3 h-3"/> Aceptada</span>}
                {r.status === 'rejected' && <span className="text-rose-400 inline-flex items-center gap-1"><X className="w-3 h-3"/> Rechazada</span>}</div>
                <div className="text-xs text-zinc-500 hidden sm:block mr-2">{r.invited_at ? new Date(r.invited_at).toLocaleString() : ''}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStatus(r.id, 'accepted')}
                    disabled={actionLoading !== null}
                    className="px-3 py-1.5 text-xs rounded-lg border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, 'rejected')}
                    disabled={actionLoading !== null}
                    className="px-3 py-1.5 text-xs rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                  <Link
                    to={`/home/students/${r.student_id}`}
                    className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                  >
                    Ver perfil
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default StudentsPage;



