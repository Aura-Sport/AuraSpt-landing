import React from 'react';
import { Reveal } from '../../components/motion/Reveal';

const testimonials = [
  { name: 'Ana', text: 'En 8 semanas mejoré mis marcas y me siento guiada.' },
  { name: 'Luis', text: 'Rutinas claras y métricas que motivan a seguir.' },
  { name: 'Carla', text: 'Perfecto para entrenar en casa con poco equipo.' },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Testimonios</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delayMs={i * 120}>
              <div className="rounded-xl p-6 border border-white/15 bg-white/[0.08] backdrop-blur-lg shadow-subtle transition-transform hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-dark-input mb-3" />
                <p className="text-sm">“{t.text}”</p>
                <p className="text-xs text-dark-mutedForeground mt-2">{t.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};


