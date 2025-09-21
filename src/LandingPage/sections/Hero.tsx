import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, ArrowRight, Play, Award, Users, Activity } from 'lucide-react';
import mockA from '../../assets/logo/AuraSportRMVBG.png';

const FloatingElement = ({ children, delay = 0, duration = 15 }) => {
  return (
    <div 
      className="absolute opacity-70 animate-float"
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.('change', onChange);
    
    // Observer para animaciones cuando el elemento es visible
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    
    if (heroRef.current) observer.observe(heroRef.current);
    
    return () => {
      mq.removeEventListener?.('change', onChange);
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);
  
  return (
    <section 
      ref={heroRef}
      className="relative pt-16 md:pt-24 pb-12 md:pb-20 overflow-hidden"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        {/* Patrón de puntos sutiles */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        {/* Elementos flotantes */}
        <FloatingElement delay={0} duration={20}>
          <div className="top-1/4 left-1/4 w-12 h-12 rounded-lg bg-emerald-400/10 rotate-12"></div>
        </FloatingElement>
        
        <FloatingElement delay={5} duration={25}>
          <div className="top-2/3 left-1/5 w-8 h-8 rounded-full bg-teal-400/10"></div>
        </FloatingElement>
        
        <FloatingElement delay={10} duration={18}>
          <div className="top-1/3 right-1/4 w-10 h-10 rounded-lg bg-emerald-400/10 -rotate-12"></div>
        </FloatingElement>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 md:gap-12 items-center">
        <div className="md:col-span-7">
          <div className={`transition-all duration-700 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            <div className="inline-flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" /> 
              <span>Nuevo • Rutinas inteligentes con IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6">
              <span className="text-white">Entrena mejor,</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">no más difícil.</span>
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-[66ch] mb-8 leading-relaxed">
              Planes 100% personalizados, seguimiento automático y apoyo de entrenadores expertos. 
              Alcanza tus objetivos sin perder tiempo con rutinas genéricas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                to="/register" 
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium overflow-hidden transition-all duration-300 hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/30"
              >
                <span className="relative z-10">Comenzar gratis</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              </Link>
              
              <Link 
                to="/about" 
                className="group inline-flex items-center justify-center px-8 py-4 rounded-xl border border-zinc-700 text-zinc-300 font-medium transition-all duration-300 hover:border-emerald-400/30 hover:text-white hover:bg-zinc-800/50"
              >
                <Play className="w-5 h-5 mr-2 group-hover:text-emerald-400" />
                <span>Ver demostración</span>
              </Link>
            </div>
            
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
                <Users className="w-4 h-4" />
                <span>+36k miembros</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Sin tarjeta • Cancela cuando quieras</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-5 mt-12 md:mt-0">
          <div className={`relative transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Marco del dispositivo con efecto neomórfico */}
            <div className="relative -z-10 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 shadow-2xl shadow-black/50 border border-zinc-800">
              <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-3xl blur-xl -z-10"></div>
              
              {/* Notch simulado */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-b-lg z-20"></div>
              
              <div className="rounded-2xl overflow-hidden border border-zinc-700/50 shadow-inner shadow-black/30">
                <img 
                  src={mockA} 
                  alt="Mockup de AuraSpt mostrando la aplicación" 
                  className="w-full h-auto object-contain" 
                />
              </div>
            </div>
            
            {/* Elementos decorativos alrededor del mockup */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-xl bg-emerald-500/10 rotate-12 z-10 animate-pulse-slow"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-teal-500/10 -rotate-12 -z-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            
            {/* Tarjeta flotante de estadísticas */}
            <div className="absolute -bottom-6 -right-6 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 shadow-lg animate-float-slow">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-medium text-white">+12% esta semana</span>
              </div>
              <div className="text-lg font-bold text-white mt-1">2,458</div>
              <div className="text-xs text-zinc-400">entrenamientos activos</div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        .animate-float {
          animation: float ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};