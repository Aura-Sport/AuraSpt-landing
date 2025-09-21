import React, { useState, useEffect, useRef } from 'react';
import { Reveal } from '../../components/motion/Reveal';
import { Target, Calendar, BarChart3, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';

const steps = [
  {
    title: 'Cuéntanos tu objetivo y limitaciones.',
    desc: 'Responde una breve encuesta inicial sobre tus metas, experiencia, equipo disponible y preferencias.',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
    duration: '2 min'
  },
  {
    title: 'Recibe tu plan semanal personalizado.',
    desc: 'Nuestra IA crea rutinas adaptadas específicamente a tu contexto, equipamiento y disponibilidad de tiempo.',
    icon: Calendar,
    color: 'from-purple-500 to-pink-500',
    duration: 'Instantáneo'
  },
  {
    title: 'Registra tus sets y mejora continuamente.',
    desc: 'Visualiza métricas detalladas, progreso por grupo muscular y recibe ajustes automáticos basados en tu rendimiento.',
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-500',
    duration: 'Seguimiento diario'
  },
];

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play para recorrer los pasos
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
      }, 4000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const goToStep = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="how" className="py-16 md:py-24 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Proceso simple y efectivo
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Así funciona <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">AuraSpt</span>
            </h2>
            
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Tres simples pasos para transformar tu forma de entrenar y alcanzar tus objetivos fitness
            </p>
          </div>
        </Reveal>

        {/* Timeline visual */}
        <div className="relative mb-12">
          {/* Línea de tiempo */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-zinc-800/50 transform -translate-y-1/2 -z-10"></div>
          
          {/* Puntos de progreso */}
          <div className="flex justify-between relative">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index <= activeStep 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 scale-125' 
                    : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
                aria-label={`Paso ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Reveal key={index} delayMs={index * 150}>
                <div 
                  className={`relative rounded-2xl p-8 border transition-all duration-500 ${
                    index === activeStep
                      ? 'border-emerald-500/30 bg-gradient-to-b from-zinc-900 to-zinc-900/80 shadow-2xl shadow-emerald-500/10 scale-105'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900/70 opacity-80'
                  }`}
                  onClick={() => goToStep(index)}
                >
                  {/* Número del paso */}
                  <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === activeStep 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20' 
                      : 'bg-zinc-800'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Icono */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Contenido */}
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 mb-4 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Duración */}
                  <div className="inline-flex items-center gap-2 text-xs text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full">
                    <span>⏱️</span>
                    <span>{step.duration}</span>
                  </div>

                  {/* Indicador activo */}
                  {index === activeStep && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20"></div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Controles de navegación */}
        <div className="flex justify-center items-center gap-6">
          <button
            onClick={() => goToStep(activeStep === 0 ? steps.length - 1 : activeStep - 1)}
            className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
            aria-label="Paso anterior"
          >
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/20"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          <button
            onClick={() => goToStep(activeStep === steps.length - 1 ? 0 : activeStep + 1)}
            className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors"
            aria-label="Siguiente paso"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicador de progreso */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeStep 
                    ? 'w-6 bg-gradient-to-r from-emerald-400 to-teal-500' 
                    : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};