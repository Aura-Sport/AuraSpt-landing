import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ArrowLeft, Eye, EyeOff, UserPlus, Dumbbell, Sparkles, Mail, Lock, User, Award, Briefcase, BookOpen, Instagram, Twitter, Link2, Globe, FileText } from 'lucide-react';

export const Register: React.FC = () => {
  const { registerTrainer, loading } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gymName, setGymName] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [specialties, setSpecialties] = useState('');
  const [biography, setBiography] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [website, setWebsite] = useState('');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [containerHeight, setContainerHeight] = useState('auto');
  const formRef = useRef<HTMLDivElement>(null);

  // Ajustar la altura del contenedor cuando cambia la sección
  useEffect(() => {
    const adjustContainerHeight = () => {
      if (formRef.current) {
        const sections = formRef.current.querySelectorAll('.form-section');
        let maxHeight = 0;
        
        sections.forEach(section => {
          if (section.scrollHeight > maxHeight) {
            maxHeight = section.scrollHeight;
          }
        });
        
        // Agregar un poco de padding extra
        setContainerHeight(`${maxHeight + 20}px`);
      }
    };

    // Ajustar después de que el componente se monte y cuando cambie la sección
    adjustContainerHeight();
    window.addEventListener('resize', adjustContainerHeight);
    
    return () => window.removeEventListener('resize', adjustContainerHeight);
  }, [activeSection]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const social = {
        instagram: instagram || undefined,
        twitter: twitter || undefined,
        tiktok: tiktok || undefined,
        website: website || undefined,
      } as Record<string, unknown>;

      const res = await registerTrainer({
        email,
        password,
        firstName,
        lastName,
        gymName,
        experienceYears,
        specialties: specialties ? specialties.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        biography,
        socialLinks: social,
      });
      
      if (res.needsVerification) {
        setMessage('Revisa tu correo para confirmar tu cuenta. Podrás subir tu certificado en tu perfil al iniciar sesión.');
      } else {
        if (certificateFile && res.userId) {
          const isPdf = certificateFile.type === 'application/pdf' || certificateFile.name.toLowerCase().endsWith('.pdf');
          if (!isPdf) {
            setMessage('El certificado debe ser un PDF');
            return;
          }
          const maxBytes = 10 * 1024 * 1024;
          if (certificateFile.size > maxBytes) {
            setMessage('El PDF supera 10MB');
            return;
          }
          setUploading(true);
          try {
            const sanitizedName = certificateFile.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const bucket = 'exercise-images';
            const path = `certificates/${res.userId}/${Date.now()}-${sanitizedName}`;
            const { error: upErr } = await supabase.storage
              .from(bucket)
              .upload(path, certificateFile, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
            if (upErr) throw upErr;
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
            const certUrl = urlData.publicUrl;
            await supabase.from('trainers').update({ certificate_url: certUrl }).eq('user_id', res.userId);
          } catch (e: any) {
            setMessage(e?.message ?? 'Error al subir el PDF');
            setUploading(false);
            return;
          }
          setUploading(false);
        }
        navigate('/home');
      }
    } catch (err: any) {
      setMessage(err?.message ?? 'Error al crear cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="w-full max-w-4xl relative">
        {/* Botón volver */}
        <Link 
          to="/" 
          className="absolute -top-16 left-0 inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Volver al inicio</span>
        </Link>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="text-center mb-8">
          
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Únete como Entrenador
              </h1>
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            
            <p className="text-zinc-400 text-sm">Comienza tu journey como entrenador certificado en nuestra plataforma</p>
          </div>

          {/* Navegación por secciones */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
            {['basic', 'profile', 'social', 'certificate'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
              >
                {section === 'basic' && 'Información Básica'}
                {section === 'profile' && 'Perfil Profesional'}
                {section === 'social' && 'Redes Sociales'}
                {section === 'certificate' && 'Certificación'}
              </button>
            ))}
          </div>

          {/* Contenedor del formulario con altura fija */}
          <div 
            ref={formRef}
            className="transition-all duration-300 ease-in-out overflow-hidden"
            style={{ height: containerHeight }}
          >
            <form onSubmit={submit}>
              {/* Sección: Información Básica */}
              <div className={`form-section ${activeSection !== 'basic' ? 'hidden' : 'block'}`}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Nombre</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Apellido</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="Tu apellido"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Contraseña</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Perfil Profesional */}
              <div className={`form-section ${activeSection !== 'profile' ? 'hidden' : 'block'}`}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Gimnasio (opcional)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Dumbbell className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={gymName}
                          onChange={(e) => setGymName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="Nombre del gimnasio"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Años de experiencia</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          type="number"
                          min={0}
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Especialidades (separadas por coma)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Award className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        value={specialties}
                        onChange={(e) => setSpecialties(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                        placeholder="hipertrofia, pérdida de peso, fuerza, funcional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Biografía</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3">
                        <BookOpen className="h-5 w-5 text-zinc-500" />
                      </div>
                      <textarea
                        rows={5}
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all resize-none"
                        placeholder="Cuenta tu experiencia, certificaciones, metodología de entrenamiento y enfoque profesional..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Redes Sociales */}
              <div className={`form-section ${activeSection !== 'social' ? 'hidden' : 'block'}`}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Instagram (URL)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Instagram className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={instagram}
                          onChange={(e) => setInstagram(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="https://instagram.com/tuuser"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Twitter (URL)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Twitter className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="https://twitter.com/tuuser"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">TikTok (URL)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link2 className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={tiktok}
                          onChange={(e) => setTiktok(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="https://tiktok.com/@tuuser"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-zinc-300">Web (URL)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all"
                          placeholder="https://tuweb.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Certificación */}
              <div className={`form-section ${activeSection !== 'certificate' ? 'hidden' : 'block'}`}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300">Certificado (PDF - máximo 10MB)</label>
                    <div className="relative border-2 border-dashed border-zinc-700 rounded-2xl p-6 text-center hover:border-emerald-500/50 transition-colors">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setCertificateFile(e.target.files?.[0] ?? null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FileText className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
                      <p className="text-zinc-400 text-sm mb-2">
                        {certificateFile ? certificateFile.name : 'Haz clic o arrastra tu certificado PDF'}
                      </p>
                      <p className="text-zinc-500 text-xs">Formatos aceptados: PDF (máx. 10MB)</p>
                      {uploading && (
                        <div className="mt-3">
                          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-xs text-zinc-400 mt-2">Subiendo archivo...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {message && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <p className="text-sm text-red-400 text-center">{message}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navegación entre secciones - FUERA del contenedor de altura fija */}
            </form>
          </div>

          {/* Navegación entre secciones (fuera del contenedor de scroll) */}
          <div className="flex justify-between pt-6 mt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                const sections = ['basic', 'profile', 'social', 'certificate'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex > 0) setActiveSection(sections[currentIndex - 1]);
              }}
              className="px-4 py-2 text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              disabled={activeSection === 'basic'}
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            {activeSection !== 'certificate' ? (
              <button
                type="button"
                onClick={() => {
                  const sections = ['basic', 'profile', 'social', 'certificate'];
                  const currentIndex = sections.indexOf(activeSection);
                  if (currentIndex < sections.length - 1) setActiveSection(sections[currentIndex + 1]);
                }}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || uploading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="px-8 py-3 relative overflow-hidden group bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  {loading || uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Crear cuenta</span>
                    </>
                  )}
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}></div>
              </button>
            )}
          </div>

          {/* Enlace a login */}
          <div className="text-center mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;