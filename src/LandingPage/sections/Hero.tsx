import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, Play, Users, Activity, Target, BarChart3, HeartPulse } from 'lucide-react';
import mockA from '../../assets/logo/AuraRMVBG.png';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (heroRef.current) observer.observe(heroRef.current);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Estadísticas destacadas
  const stats = [
    { icon: Users, value: '1k+', label: 'miembros activos' },
    { icon: Target, value: '98%', label: 'satisfacción' },
    { icon: BarChart3, value: '1k+', label: 'entrenamientos/día' },
    { icon: HeartPulse, value: '10%', label: 'crecimiento semanal' }
  ];

  return (
    <section 
      ref={heroRef}
      className="relative pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenido principal */}
          <div className={`transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            {/* Badge destacado */}
            <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" /> 
              <span className="text-sm font-medium">Nuevo • Rutinas inteligentes con IA</span>
            </div>
            
            {/* Título principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Entrena mejor,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                no más difícil
              </span>
            </h1>
            
            {/* Descripción */}
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed max-w-2xl">
              Planes 100% personalizados, seguimiento automático y apoyo de entrenadores expertos. 
              Alcanza tus objetivos sin perder tiempo con rutinas genéricas.
            </p>

            {/* Botones CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/register" 
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl overflow-hidden transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/30"
              >
                <span className="relative z-10">Comenzar gratis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 border border-zinc-700 text-zinc-300 font-medium rounded-xl transition-all duration-300 hover:border-emerald-400/30 hover:text-white hover:bg-zinc-800/50">
                <Play className="w-5 h-5 mr-2 group-hover:text-emerald-400" />
                <span>Ver demostración</span>
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 mx-auto mb-2">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Ratings y info adicional */}
            <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>4.8/5</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Sin tarjeta • Cancela cuando quieras</span>
              </div>
            </div>
          </div>

          {/* Mockup de la app */}
          <div className={`relative transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative">
              {/* Marco del dispositivo (CSS propio) */}
              <div className="relative w-[320px] h-[640px] rounded-[44px] bg-black border-[10px] border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden mx-auto">
                {/* Notch superior */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-800 rounded-b-2xl z-10" />
                {/* Pantalla */}
                <div className="absolute inset-0 m-[10px] rounded-[32px] bg-zinc-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={mockA}
                    alt="AuraSpt App"
                    className="w-50 h-50 object-cover object-center"
                  />
                  {/* Overlay de información */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                    <div className="text-white">
                      <h3 className="text-lg font-bold mb-1">Progreso Semanal</h3>
                      <p className="text-sm text-zinc-300">+12% de rendimiento</p>
                    </div>
                  </div>
                </div>
                {/* Home bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-white/30 rounded-full" />
              </div>

              {/* Elementos decorativos flotantes */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-xl bg-emerald-500/10 rotate-12 animate-float z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-teal-500/10 -rotate-12 animate-float" style={{animationDelay: '2s'}}></div>
              
              {/* Tarjeta de estadísticas flotante */}
              <div className="absolute -bottom-8 -right-8 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 shadow-2xl shadow-black/50 animate-float-slow">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-white">Tendencia alcista</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">2,458</div>
                <div className="text-xs text-zinc-400">entrenamientos activos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Características destacadas (para mobile) */}
        <div className="lg:hidden mt-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm text-zinc-300">Comunidad activa</div>
            </div>
            <div className="text-center p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm text-zinc-300">Resultados garantizados</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-8px) translateX(4px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};