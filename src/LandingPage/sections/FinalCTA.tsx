import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../../components/motion/Reveal';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, HelpCircle, MessageCircle, BookOpen, Check, X } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Es gratis empezar?",
      answer: "Sí, ofrecemos un período de prueba gratuito de 14 días sin necesidad de tarjeta de crédito."
    },
    {
      question: "¿Necesito equipo especial?",
      answer: "No, nuestras rutinas se adaptan al equipamiento que tengas disponible, desde gimnasios completos hasta entrenamiento en casa."
    },
    {
      question: "¿Puedo entrenar en casa?",
      answer: "Absolutamente. Diseñamos rutinas específicas para entrenamiento en casa con o sin equipamiento básico."
    },
    {
      question: "¿Hay soporte de entrenadores?",
      answer: "Sí, nuestro equipo de entrenadores certificados está disponible para resolver tus dudas y ajustar tu plan."
    },
    {
      question: "¿Puedo cambiar mi objetivo?",
      answer: "Sí, puedes cambiar tus objetivos en cualquier momento y tu plan se ajustará automáticamente."
    },
    {
      question: "¿Cómo se personalizan las rutinas?",
      answer: "Usamos inteligencia artificial que analiza tu nivel, objetivos, disponibilidad y equipamiento para crear rutinas únicas."
    },
    {
      question: "¿Hay seguimiento de nutrición?",
      answer: "Ofrecemos recomendaciones nutricionales básicas y seguimiento, con planes premium de nutrición disponibles."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient(circle_at_center, rgba(72, 187, 120, 0.05) 0%, transparent 70%)"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Sección de FAQs */}
          <Reveal>
            <div className="relative flex flex-col h-full">
              <div className="inline-flex items-center rounded-full bg-zinc-800/50 px-4 py-2 text-sm text-emerald-400 ring-1 ring-inset ring-zinc-800 mb-6">
                <HelpCircle className="h-4 w-4 mr-2" />
                Preguntas frecuentes
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Todo lo que necesitas saber
              </h3>
              
              <p className="text-zinc-400 mb-8">
                Resolvemos tus dudas para que empieces con confianza.
              </p>

              <div className="space-y-4 flex-1">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`rounded-xl p-5 border transition-all duration-300 cursor-pointer ${
                      activeIndex === index 
                        ? 'bg-zinc-800/50 border-emerald-400/30 shadow-lg' 
                        : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                    }`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white text-sm md:text-base">
                        {faq.question}
                      </h4>
                      <div className={`transform transition-transform duration-300 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}>
                        {activeIndex === index ? (
                          <X className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Check className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                    </div>
                    
                    {activeIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3"
                      >
                        <p className="text-sm text-zinc-400">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Soporte adicional - movido a banda inferior a pantalla completa */}
            </div>
          </Reveal>

          {/* Sección CTA */}
          <Reveal>
            <div className="relative h-full flex items-center">
              <div className="w-full h-full rounded-2xl p-8 md:p-10 text-center border border-white/20 bg-gradient-to-br from-zinc-900/70 to-zinc-800/50 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
              {/* Elemento decorativo superior */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" fill="currentColor" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Transforma tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">entrenamiento</span> hoy
              </h3>
              
              <p className="text-zinc-300 mb-8">
                Planes con IA, métricas avanzadas y seguimiento inteligente. 
                Todo lo que necesitas para alcanzar tus metas.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Link 
                  to="/register" 
                  className="group relative flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  Comenzar gratis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/plans" 
                  className="group relative flex items-center justify-center gap-2 border border-zinc-700 hover:border-emerald-400/50 text-zinc-300 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
                >
                  Ver planes
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>


              {/* Features adicionales para balancear altura */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
                <div className="flex items-center gap-2 justify-center sm:justify-start text-zinc-300">
                  <Check className="h-4 w-4 text-emerald-400" /> Rutinas con IA
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start text-zinc-300">
                  <Check className="h-4 w-4 text-emerald-400" /> App móvil
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start text-zinc-300">
                  <Check className="h-4 w-4 text-emerald-400" /> Comunidad activa
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start text-zinc-300">
                  <Check className="h-4 w-4 text-emerald-400" /> Soporte dedicado
                </div>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-emerald-400/30 animate-pulse"></div>
              <div className="absolute bottom-8 right-6 w-1.5 h-1.5 rounded-full bg-blue-400/30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </Reveal>

          {/* Banda inferior de soporte a ancho completo */}
          <div className="lg:col-span-2">
            <div className="mt-8 p-6 md:p-8 rounded-2xl bg-zinc-800/30 border border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">¿No encontraste tu respuesta?</h4>
                  <p className="text-sm text-zinc-400">Nuestro equipo de soporte está aquí para ayudarte.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/support" 
                  className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contactar soporte
                </Link>
                <Link 
                  to="/help" 
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Centro de ayuda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-radial-gradient {
          background-image: radial-gradient(circle at center, rgba(72, 187, 120, 0.05) 0%, transparent 70%);
        }
      `}</style>
    </section>
  );
};