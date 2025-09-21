import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import BenefitParticles from '../../components/Decor/BenefitParticles';
import { 
  Dumbbell, 
  BarChart3, 
  Users, 
  Target,
  HeartPulse,
  Clock,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

type Benefit = {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  details: string;
  color: string;
  size: 'sm' | 'md' | 'lg';
};

const BenefitCard = ({
  title,
  desc,
  Icon,
  index,
  isActive,
  onClick,
  color,
  size
}: {
  title: string;
  desc: string;
  Icon: React.ComponentType<{ className?: string }>;
  index: number;
  isActive: boolean;
  onClick: () => void;
  color: string;
  size: 'sm' | 'md' | 'lg';
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const sizeClasses = {
    // En móviles: 1 columna → todas ocupan 1x1; en sm: 2 cols; en lg: 4 cols
    sm: 'col-span-1 sm:col-span-1 lg:col-span-1 row-span-1',
    md: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-1',
    lg: 'col-span-1 sm:col-span-2 lg:col-span-2 row-span-2'
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group cursor-pointer ${sizeClasses[size]}`}
      onClick={onClick}
    >
      <div className={`
        relative h-full rounded-2xl p-4 md:p-6 border-2 transition-all duration-300 overflow-hidden
        ${isActive 
          ? `${color} border-transparent shadow-2xl scale-105` 
          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70'
        }
      `}>
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Partículas temáticas en hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {title === 'Rutinas personalizadas' && (
            <BenefitParticles variant="algorithms" className="absolute inset-0" />
          )}
          {title === 'Entrenadores expertos' && (
            <BenefitParticles variant="community" className="absolute inset-0" />
          )}
          {title === 'Recuperación inteligente' && (
            <BenefitParticles variant="breathing" className="absolute inset-0" />
          )}
          {title === 'Ahorra tiempo' && (
            <BenefitParticles variant="efficient" className="absolute inset-0" />
          )}
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className={`inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl mb-3 md:mb-4 transition-all duration-300 ${
            isActive 
              ? 'bg-white/20 text-white' 
              : 'bg-zinc-800 text-emerald-400 group-hover:bg-zinc-700'
          }`}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          
          <h3 className={`text-base md:text-lg font-semibold mb-1 md:mb-2 transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-zinc-100 group-hover:text-white'
          }`}>
            {title}
          </h3>
          
          <p className={`text-xs md:text-sm leading-relaxed transition-colors duration-300 flex-grow ${
            isActive ? 'text-zinc-200' : 'text-zinc-400 group-hover:text-zinc-300'
          }`}>
            {desc}
          </p>

          {/* Indicator arrow */}
          <div className={`mt-2 md:mt-4 inline-flex items-center text-xs font-medium transition-all duration-300 ${
            isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'
          }`}>
            <span>Ver detalles</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DetailedView = ({ benefit, onClose }: { benefit: Benefit; onClose: () => void }) => {
  return (
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
          <X className="w-5 h-5" />
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
  );
};

export const Benefits = () => {
  const [activeBenefit, setActiveBenefit] = useState<number | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const benefits: Benefit[] = [
    { 
      title: 'Rutinas personalizadas', 
      desc: 'Plan adaptado a tus objetivos y nivel con IA.', 
      Icon: Target,
      details: 'Nuestro algoritmo analiza tus metas, experiencia y disponibilidad para crear el plan perfecto que evoluciona contigo.',
      color: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20',
      size: 'md'
    },
    { 
      title: 'Seguimiento detallado', 
      desc: 'Métricas por grupo muscular para optimizar progreso.', 
      Icon: BarChart3,
      details: 'Registramos y analizamos cada aspecto de tu entrenamiento para mostrarte insights detallados sobre tu desarrollo muscular.',
      color: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      size: 'sm'
    },
    { 
      title: 'Entrenadores expertos', 
      desc: 'Consejos profesionales cuando más lo necesitas.', 
      Icon: Users,
      details: 'Conéctate con nuestros entrenadores certificados para resolver dudas, ajustar tu técnica y recibir motivación personalizada.',
      color: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      size: 'sm'
    },
    { 
      title: 'Recuperación inteligente', 
      desc: 'Planificación de descanso basada en tu esfuerzo.', 
      Icon: HeartPulse,
      details: 'Sistema que monitorea tu fatiga y sugiere periodos de recuperación óptimos para maximizar tus ganancias.',
      color: 'bg-gradient-to-br from-rose-500/20 to-red-500/20',
      size: 'lg'
    },
    { 
      title: 'Adaptado a tu equipo', 
      desc: 'Rutinas optimizadas según equipamiento disponible.', 
      Icon: Dumbbell,
      details: 'No importa si entrenas en un gimnasio completo o en casa, creamos rutinas efectivas con lo que tengas a disposición.',
      color: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
      size: 'md'
    },
    { 
      title: 'Ahorra tiempo', 
      desc: 'Entrena eficientemente con rutinas que se ajustan a tu agenda.', 
      Icon: Clock,
      details: 'Ejercicios organizados para maximizar resultados en el tiempo que tengas disponible, sin sesiones interminables.',
      color: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20',
      size: 'md'
    },
  ];

  return (
    <section 
      id="benefits" 
      className="py-16 md:py-24 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-4 py-2 text-sm text-emerald-400 ring-1 ring-inset ring-zinc-800 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Entrena de forma inteligente
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Beneficios <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">exclusivos</span>
          </h2>
          
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Diseñado para maximizar tus resultados mientras minimizas el esfuerzo innecesario
          </p>
        </motion.div>
        
        {/* Bento Grid optimizado y denso, sin huecos visibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 grid-flow-dense gap-3 md:gap-4 auto-rows-[160px] sm:auto-rows-[180px] lg:auto-rows-[220px]">
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
              color={benefit.color}
              size={benefit.size}
            />
          ))}
        </div>
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
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};