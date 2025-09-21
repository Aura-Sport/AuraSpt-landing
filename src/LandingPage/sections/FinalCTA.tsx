import React from 'react';
import { Reveal } from '../../components/motion/Reveal';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="rounded-xl p-8 md:p-12 text-center border border-white/15 bg-white/[0.08] backdrop-blur-lg shadow-subtle">
            <h3 className="text-2xl md:text-3xl font-bold">Entrena mejor hoy</h3>
            <p className="text-dark-mutedForeground mt-2">Planes personalizados y métricas claras. Empieza gratis.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link className="bg-dark-primary text-dark-primaryForeground px-5 py-3 rounded" to="/register">Crear cuenta</Link>
              <Link className="px-5 py-3 rounded border border-dark-border" to="/login">Iniciar sesión</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};


