import React, { useState } from 'react';
import { Reveal } from '../../components/motion/Reveal';
import { ChevronDown, HelpCircle, MessageCircle, Mail, Sparkles } from 'lucide-react';

const faqs = [
  { 
    q: '¿Es gratis empezar?', 
    a: 'Sí, ofrecemos un plan gratuito con funciones básicas para que comiences tu journey fitness. Puedes escalar a planes premium cuando necesites más features.' 
  },
  { 
    q: '¿Necesito equipo especial?', 
    a: 'No, nos adaptamos al equipo que tengas disponible. Ya sea en un gimnasio completo o entrenando en casa con equipamiento mínimo, creamos rutinas efectivas.' 
  },
  { 
    q: '¿Puedo entrenar en casa?', 
    a: '¡Absolutamente! Tenemos planes específicos para entrenamiento en casa, gimnasio o mixtos. Las rutinas se adaptan a tu contexto.' 
  },
  { 
    q: '¿Hay soporte de entrenadores?', 
    a: 'Sí, nuestros planes premium incluyen acceso a entrenadores certificados para consultas, ajustes de técnica y planificación personalizada.' 
  },
  { 
    q: '¿Puedo cambiar mi objetivo?', 
    a: 'Por supuesto. Puedes ajustar tus objetivos en cualquier momento y las rutinas se recalcularán automáticamente para alinearse con tus nuevas metas.' 
  },
  { 
    q: '¿Cómo se personalizan las rutinas?', 
    a: 'Usamos algoritmos de IA que consideran tu nivel, objetivos, equipamiento disponible, historial de entrenamiento y feedback para crear planes únicos.' 
  },
  { 
    q: '¿Hay seguimiento de nutrición?', 
    a: 'Actualmente nos enfocamos en el entrenamiento, pero tenemos planes de integrar tracking nutricional en futuras actualizaciones.' 
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              Preguntas frecuentes
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Tienes <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">dudas</span>?
            </h2>
            
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Resolvemos las preguntas más comunes sobre AuraSpt para que puedas comenzar con confianza.
            </p>
          </div>
        </Reveal>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Reveal key={faq.q} delayMs={index * 80}>
              <div 
                className={`bg-zinc-900/60 backdrop-blur-lg border rounded-xl overflow-hidden transition-all duration-500 ease-out ${
                  openIndex === index 
                    ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-emerald-400/30 rounded-xl group"
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 transition-colors ${
                      openIndex === index 
                        ? 'bg-emerald-500/20' 
                        : 'bg-zinc-800 group-hover:bg-zinc-700'
                    }`}>
                      <HelpCircle className={`w-4 h-4 transition-colors ${
                        openIndex === index 
                          ? 'text-emerald-400' 
                          : 'text-zinc-500 group-hover:text-zinc-400'
                      }`} />
                    </div>
                    <span className="font-medium text-white text-lg group-hover:text-emerald-50 transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                      openIndex === index 
                        ? 'transform rotate-180 text-emerald-400' 
                        : 'text-zinc-500 group-hover:text-zinc-400'
                    }`} 
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                  style={{
                    transitionProperty: 'max-height, opacity',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div className="px-6 pb-6 ml-10 relative">                    
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4">
                      <p className="text-zinc-300 leading-relaxed text-sm md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Sección de contacto adicional */}
        <Reveal delayMs={600}>
          <div className="mt-16 p-8 bg-gradient-to-br from-zinc-900 to-zinc-800/50 border border-zinc-800 rounded-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
              <MessageCircle className="w-8 h-8 text-emerald-400" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">¿No encontraste tu respuesta?</h3>
            <p className="text-zinc-400 mb-6">Nuestro equipo de soporte está aquí para ayudarte</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:soporte@auraspt.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                Contactar soporte
              </a>
              
              <a
                href="/help-center"
                className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 hover:border-emerald-400/30 text-white rounded-xl transition-colors duration-300"
              >
                <HelpCircle className="w-5 h-5" />
                Centro de ayuda
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .transition-smooth {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};