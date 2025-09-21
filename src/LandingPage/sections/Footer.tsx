import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';
import logo from '../../assets/logo/AuraRMVBG.png';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-xl py-12 md:py-16">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 right-1/4 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="AuraSpt" 
                  className="w-10 h-10 rounded transition-transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                AuraSpt
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              Transformando tu journey fitness con tecnología inteligente y entrenamiento personalizado.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Hecho con pasión para entrenadores y atletas</span>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Plataforma</h3>
            <ul className="space-y-3">
              <li><Link to="/login" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Iniciar sesión</Link></li>
              <li><Link to="/register" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Crear cuenta</Link></li>
              <li><a href="#features" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Características</a></li>
              <li><a href="#how" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Cómo funciona</a></li>
              <li><a href="#pricing" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Precios</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Soporte</h3>
            <ul className="space-y-3">
              <li><a href="#faq" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Centro de ayuda</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Contacto</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Soporte técnico</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Estado del sistema</a></li>
            </ul>
          </div>

          {/* Legal y social */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-lg">Legal</h3>
            <ul className="space-y-3 mb-6">
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Términos de servicio</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Política de privacidad</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Cookies</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">Política de devoluciones</a></li>
            </ul>

            {/* Redes sociales */}
            <div>
              <h4 className="font-medium text-white mb-3 text-sm">Síguenos</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 flex items-center justify-center transition-colors group border border-zinc-700">
                  <Instagram className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 flex items-center justify-center transition-colors group border border-zinc-700">
                  <Twitter className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 flex items-center justify-center transition-colors group border border-zinc-700">
                  <Youtube className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 flex items-center justify-center transition-colors group border border-zinc-700">
                  <Mail className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-zinc-800 my-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-zinc-500 text-sm">
              © 2025 AuraSpt. Todos los derechos reservados.
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              Diseñado y desarrollado con 💚 para la comunidad fitness
            </p>
          </div>
          
          {/* Botón de volver arriba */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-emerald-500/10 text-zinc-400 hover:text-emerald-400 transition-colors group border border-zinc-700"
          >
            <span className="text-sm">Volver arriba</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Badge de seguridad */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-zinc-400">Sistema seguro y encriptado</span>
          </div>
        </div>
      </div>
    </footer>
  );
};