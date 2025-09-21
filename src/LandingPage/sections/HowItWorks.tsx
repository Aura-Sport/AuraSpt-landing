import React, { useState, useEffect, useRef } from 'react';
import { Reveal } from '../../components/motion/Reveal';
import { Target, Calendar, BarChart3, ArrowRight, Play, Pause, Sparkles, Clock } from 'lucide-react';

const steps = [
  {
    title: 'Cuéntanos sobre ti',
    desc: 'Breve encuesta sobre experiencia, equipamiento y metas fitness.',
    icon: Target,
    duration: '2 min'
  },
  {
    title: 'Plan personalizado',
    desc: 'IA crea rutinas adaptadas a tu contexto y objetivos.',
    icon: Calendar,
    duration: 'Instantáneo'
  },
  {
    title: 'Evoluciona continuamente',
    desc: 'Registra progresos y recibe ajustes automáticos.',
    icon: BarChart3,
    duration: 'Continuo'
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play para recorrer los pasos
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Navegación por gestos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStart - touchEnd;

    if (swipeDistance > swipeThreshold) {
      goToNext();
    } else if (swipeDistance < -swipeThreshold) {
      goToPrev();
    }
  };

  const goToStep = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
  };

  const goToNext = () => {
    setActiveStep(prev => (prev === steps.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const goToPrev = () => {
    setActiveStep(prev => (prev === 0 ? steps.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === ' ') togglePlay();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section id="how" className="py-16 md:py-20 lg:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full text-xs mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Proceso inteligente</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-3">
              Así funciona <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">AuraSpt</span>
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Tu journey fitness personalizado en tres pasos simples
            </p>
          </div>
        </Reveal>

        {/* Contenedor principal con gestos táctiles */}
        <div 
          ref={containerRef}
          className="relative mb-8 lg:mb-12"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Timeline minimalista */}
          <div className="flex justify-center mb-8 lg:mb-12">
            <div className="flex items-center gap-4 lg:gap-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    index === activeStep ? 'scale-110' : 'scale-100'
                  }`}
                  aria-label={`Paso ${index + 1}`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeStep 
                      ? 'bg-emerald-400 scale-150' 
                      : 'bg-zinc-700 hover:bg-zinc-600'
                  }`} />
                  <span className={`text-xs mt-2 transition-colors ${
                    index === activeStep ? 'text-white' : 'text-zinc-500'
                  }`}>
                    {index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contenido del paso actual */}
          <Reveal key={activeStep}>
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 lg:p-8 transition-all duration-500">
              <div className="text-center">
                {/* Icono */}
                <div className="w-16 h-16 mx-auto mb-4 lg:mb-6 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                  {React.createElement(steps[activeStep].icon, {
                    className: "w-8 h-8 text-emerald-400"
                  })}
                </div>

                {/* Contenido */}
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-3 lg:mb-4">
                  {steps[activeStep].title}
                </h3>
                
                <p className="text-zinc-400 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed max-w-md mx-auto">
                  {steps[activeStep].desc}
                </p>

                {/* Duración */}
                <div className="inline-flex items-center gap-2 text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>{steps[activeStep].duration}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
};