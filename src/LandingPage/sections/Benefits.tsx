import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Target,
  HeartPulse,
  Clock,
  Smartphone
} from 'lucide-react';

type Benefit = {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  details?: string;
};

const BenefitCard = (
  {
    title,
    desc,
    Icon,
    index,
    isActive,
    onClick,
  }: {
    title: string;
    desc: string;
    Icon: React.ComponentType<{ className?: string }>;
    index: number;
    isActive: boolean;
    onClick: () => void;
  }
) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
          : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600'
      }`}
      onClick={onClick}
    >
      {/* Efecto de brillo en tarjeta activa */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 pointer-events-none" />
      )}
      
      {/* Partículas de fondo (solo en tarjeta activa) */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-emerald-400/20"
              initial={{ 
                x: Math.random() * 100 - 50 + '%', 
                y: Math.random() * 100 - 50 + '%',
                width: Math.random() * 20 + 5 + 'px',
                height: Math.random() * 20 + 5 + 'px'
              }}
              animate={{
                x: [null, Math.random() * 40 - 20 + '%'],
                y: [null, Math.random() * 40 - 20 + '%'],
              }}
              transition={{ 
                duration: Math.random() * 5 + 5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10">
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/20' 
            : 'bg-zinc-800 text-emerald-400 group-hover:bg-zinc-700'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
          isActive ? 'text-white' : 'text-zinc-100'
        }`}>
          {title}
        </h3>
        
        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
          isActive ? 'text-zinc-200' : 'text-zinc-400'
        }`}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

const DetailedView = ({ benefit, onClose }: { benefit: Benefit; onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl mb-4 bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
            <benefit.Icon className="h-6 w-6" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
          <p className="text-zinc-300 mb-4">{benefit.desc}</p>
          
          <div className="bg-zinc-800/50 p-4 rounded-xl">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">¿Cómo funciona?</h4>
            <p className="text-sm text-zinc-400">
              {benefit.details}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Benefits = () => {
  const [activeBenefit, setActiveBenefit] = useState<number | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const benefits: Benefit[] = [
    { 
      title: 'Rutinas personalizadas', 
      desc: 'Plan de entrenamiento adaptado específicamente a tus objetivos y nivel.', 
      Icon: Target,
      details: 'Nuestro algoritmo analiza tus metas, experiencia y disponibilidad para crear el plan perfecto que evoluciona contigo.'
    },
    { 
      title: 'Seguimiento detallado', 
      desc: 'Métricas precisas por grupo muscular para optimizar tu progreso.', 
      Icon: BarChart3,
      details: 'Registramos y analizamos cada aspecto de tu entrenamiento para mostrarte insights detallados sobre tu desarrollo muscular.'
    },
    { 
      title: 'Entrenadores expertos', 
      desc: 'Consejos profesionales y apoyo cuando más lo necesitas.', 
      Icon: Users,
      details: 'Conéctate con nuestros entrenadores certificados para resolver dudas, ajustar tu técnica y recibir motivación personalizada.'
    },
    { 
      title: 'Adaptado a tu equipo', 
      desc: 'Optimizamos tus rutinas según el equipamiento disponible.', 
      Icon: Dumbbell,
      details: 'No importa si entrenas en un gimnasio completo o en casa, creamos rutinas efectivas con lo que tengas a disposición.'
    },
    { 
      title: 'Recuperación inteligente', 
      desc: 'Planificación de descanso basada en tu esfuerzo y progreso.', 
      Icon: HeartPulse,
      details: 'Sistema que monitorea tu fatiga y sugiere periodos de recuperación óptimos para maximizar tus ganancias.'
    },
    { 
      title: 'Ahorra tiempo', 
      desc: 'Entrena eficientemente con rutinas que se ajustan a tu agenda.', 
      Icon: Clock,
      details: 'Ejercicios organizados para maximizar resultados en el tiempo que tengas disponible, sin sesiones interminables.'
    },
    { 
      title: 'App integrada', 
      desc: 'Accede a tu plan desde cualquier dispositivo, online u offline.', 
      Icon: Smartphone,
      details: 'Nuestra aplicación sincroniza tu progreso across dispositivos y funciona incluso sin conexión a internet.'
    },
    { 
      title: 'Técnica perfecta', 
      desc: 'Guías visuales y feedback para ejecutar cada movimiento correctamente.', 
      Icon: ShieldCheck,
      details: 'Videos demostrativos, tips de ejecución y verificación de forma para prevenir lesiones y maximizar resultados.'
    }
  ];

  return (
    <section 
      id="benefits" 
      className="py-20 md:py-28 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        
        {/* Patrón de puntos sutiles */}
        <div className="absolute inset-0 opacity-10 pattern-dots pattern-zinc-800 pattern-size-4 pattern-opacity-100"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-4 py-2 text-sm text-emerald-400 ring-1 ring-inset ring-zinc-800 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Entrena de forma inteligente
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Experimenta una nueva forma <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">de entrenar</span>
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Diseñado para maximizar tus resultados mientras minimizas el esfuerzo innecesario y el riesgo de lesiones.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              index={index}
              title={benefit.title}
              desc={benefit.desc}
              Icon={benefit.Icon}
              isActive={activeBenefit === index}
              onClick={() => {
                setActiveBenefit(activeBenefit === index ? null : index);
                setSelectedBenefit(benefit);
              }}
            />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
            Comenzar ahora
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
      
      {selectedBenefit && (
        <DetailedView 
          benefit={selectedBenefit} 
          onClose={() => {
            setSelectedBenefit(null);
            setActiveBenefit(null);
          }} 
        />
      )}
      
      <style>{`
        /* Patrón de puntos para el fondo */
        .pattern-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: calc(10 * 1px) calc(10 * 1px);
        }
      `}</style>
    </section>
  );
};