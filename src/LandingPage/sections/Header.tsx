import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Dumbbell, User, LogIn } from 'lucide-react';
import logo from '../../assets/logo/AuraRMVBG.png';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Efecto para detectar scroll y cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { href: '#features', label: 'Características' },
    { href: '#how', label: 'Cómo funciona' },
    { href: '#testimonials', label: 'Testimonios' },
    { href: '#faq', label: 'FAQ' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 shadow-lg' 
          : 'bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="AuraSpt" 
                className="w-8 h-8 rounded transition-transform group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="font-bold text-white text-lg bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              AuraSpt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-zinc-300 hover:text-white transition-colors duration-200 relative group text-sm font-medium"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-4 py-2 text-zinc-300 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Link>
            <Link 
              to="/register" 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 text-sm font-medium"
            >
              <User className="w-4 h-4" />
              Crear cuenta
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-zinc-300" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 px-4 py-4">
            <nav className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="w-full text-left py-3 px-4 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 flex items-center gap-3"
                >
                  <Dumbbell className="w-4 h-4 text-emerald-400" />
                  {item.label}
                </button>
              ))}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3">
              <Link 
                to="/login" 
                className="w-full flex items-center gap-3 py-3 px-4 text-zinc-300 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </Link>
              <Link 
                to="/register" 
                className="w-full flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 justify-center font-medium"
              >
                <User className="w-4 h-4" />
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay para móvil */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Espacio para el header fixed */}
      <div className="h-16"></div>
    </>
  );
};