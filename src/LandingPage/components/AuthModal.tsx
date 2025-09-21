import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

type Mode = 'signup' | 'login';

export const AuthModal: React.FC<{ open: boolean; onClose: () => void; initialMode?: Mode }> = ({ open, onClose, initialMode = 'signup' }) => {
  const { login, registerTrainer, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gymName, setGymName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (open) {
      setMessage(null);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else {
        const res = await registerTrainer({ email, password, firstName, lastName, gymName });
        if (res.needsVerification) {
          setMessage('Revisa tu correo para confirmar tu cuenta.');
        } else {
          onClose();
          navigate('/home');
        }
      }
    } catch (err: any) {
      setMessage(err?.message ?? 'Error inesperado');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div ref={dialogRef} role="dialog" aria-modal="true" className="relative w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta de entrenador'}</h3>
          <button aria-label="Cerrar" onClick={onClose} className="text-sm text-dark-mutedForeground">✕</button>
        </div>
        <div className="mt-4 flex gap-2 text-sm">
          <button className={`px-3 py-1 rounded ${mode === 'signup' ? 'bg-dark-primary text-dark-primaryForeground' : 'border border-dark-border'}`} onClick={() => setMode('signup')}>Crear cuenta</button>
          <button className={`px-3 py-1 rounded ${mode === 'login' ? 'bg-dark-primary text-dark-primaryForeground' : 'border border-dark-border'}`} onClick={() => setMode('login')}>Iniciar sesión</button>
        </div>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="block text-xs mb-1">Nombre</label>
                <input className="w-full bg-dark-input border border-dark-border rounded px-3 py-2" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="col-span-1">
                <label className="block text-xs mb-1">Apellido</label>
                <input className="w-full bg-dark-input border border-dark-border rounded px-3 py-2" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs mb-1">Gimnasio (opcional)</label>
                <input className="w-full bg-dark-input border border-dark-border rounded px-3 py-2" value={gymName} onChange={(e) => setGymName(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs mb-1">Email</label>
            <input type="email" className="w-full bg-dark-input border border-dark-border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs mb-1">Contraseña</label>
            <input type="password" className="w-full bg-dark-input border border-dark-border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {message && <p className="text-sm text-red-400">{message}</p>}
          <button type="submit" className="w-full bg-dark-primary text-dark-primaryForeground py-2 rounded disabled:opacity-60" disabled={loading}>
            {loading ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
};


