import React, { useState, ChangeEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BadgeCheck, FileText, MapPin, Dumbbell, ExternalLink, Globe, Link as LinkIcon, Pencil } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

export const ProfilePage: React.FC = () => {
  const { user, trainer } = useAuth();
  const fullName = user?.name || user?.email || 'Entrenador';
  const specialties: string[] = Array.isArray(trainer?.specialties) ? trainer?.specialties as string[] : [];
  const social = (trainer?.social_links as any) || {};
  const avatarUrl = user?.avatar || undefined;
  const [uploading, setUploading] = useState(false);

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (!isImage) return;
    setUploading(true);
    try {
      const sanitized = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const path = `avatars/${user.id}/${Date.now()}-${sanitized}`;
      const bucket = 'exercise-images';
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = data.publicUrl;
      await supabase.from('users').update({ avatar: publicUrl }).eq('id', user.id);
      window.location.reload();
    } catch (err) {
      // noop visual for ahora
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-subtle">
        <div className="h-48 md:h-56 bg-gradient-to-r from-emerald-500/25 to-blue-500/25" />
        <div className="px-6 -mt-14 pb-6">
          <div className="flex items-end gap-4">
            <div className="relative w-24 h-24 rounded-xl bg-dark-input border border-dark-border overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold">A</div>
              )}
              <label className="absolute bottom-1 right-1 inline-flex items-center justify-center w-7 h-7 rounded bg-dark-card border border-dark-border cursor-pointer hover:bg-dark-input">
                <Pencil className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} disabled={uploading} />
              </label>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {fullName}
                <BadgeCheck className="w-5 h-5 text-emerald-400" />
              </h1>
              <p className="text-dark-mutedForeground flex items-center gap-2 text-sm">
                <Dumbbell className="w-4 h-4" /> Entrenador personal
                {trainer?.gym_name && <><span>•</span><MapPin className="w-4 h-4" /> {trainer.gym_name}</>}
              </p>
            </div>
            {trainer?.certificate_url && (
              <a href={trainer.certificate_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-dark-border rounded hover:bg-dark-input">
                <FileText className="w-4 h-4" /> Ver certificado
              </a>
            )}
          </div>

          {trainer?.biography && (
            <p className="mt-6 text-sm leading-6 text-dark-foreground/90">
              {trainer.biography}
            </p>
          )}

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-4">
              <p className="text-xs text-dark-mutedForeground">Experiencia</p>
              <p className="text-xl font-semibold">{trainer?.experience_years ?? 0} años</p>
            </div>
            <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-4">
              <p className="text-xs text-dark-mutedForeground">Clientes activos</p>
              <p className="text-xl font-semibold">—</p>
            </div>
            <div className="bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-4">
              <p className="text-xs text-dark-mutedForeground">Rutinas creadas</p>
              <p className="text-xl font-semibold">—</p>
            </div>
          </div>

          {specialties.length > 0 && (
            <div className="mt-6 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-4">
              <p className="text-sm font-semibold mb-2">Especialidades</p>
              <div className="flex flex-wrap gap-2">
                {specialties.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs border border-white/10 bg-white/[0.05] backdrop-blur-sm">{s}</span>
                ))}
              </div>
            </div>
          )}

          {(social.instagram || social.twitter || social.tiktok || social.website) && (
            <div className="mt-6 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-xl p-4">
              <p className="text-sm font-semibold mb-2">Enlaces</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {social.website && (
                  <a className="inline-flex items-center gap-1 underline" href={social.website} target="_blank" rel="noreferrer"><Globe className="w-4 h-4" /> Sitio web</a>
                )}
                {social.instagram && (
                  <a className="inline-flex items-center gap-1 underline" href={social.instagram} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /> Instagram</a>
                )}
                {social.twitter && (
                  <a className="inline-flex items-center gap-1 underline" href={social.twitter} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4" /> Twitter</a>
                )}
                {social.tiktok && (
                  <a className="inline-flex items-center gap-1 underline" href={social.tiktok} target="_blank" rel="noreferrer"><LinkIcon className="w-4 h-4" /> TikTok</a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


