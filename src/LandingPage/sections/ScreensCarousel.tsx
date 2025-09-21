import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Smartphone } from 'lucide-react';

// Imágenes de ejemplo (reemplaza con capturas reales de tu app)
const appScreenshots = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Seguimiento de Progreso",
    description: "Monitoriza cada aspecto de tu evolución física con métricas detalladas"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Rutinas Personalizadas",
    description: "Planes de entrenamiento adaptados a tus objetivos específicos"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1549060279-7e168fce7090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Técnica Perfecta",
    description: "Guías visuales para ejecutar cada ejercicio con la forma correcta"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Comunidad Activa",
    description: "Conecta con otros usuarios y comparte tus logros"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "Entrenadores Expertos",
    description: "Asesoramiento profesional para maximizar tus resultados"
  }
];

const MobileAppCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Configurar el intervalo para el auto-play
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        goToNext();
      }, 4000);
    } else if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentIndex]);

  // Navegación
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === appScreenshots.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? appScreenshots.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Manejo de gestos táctiles
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 30;
    const isRightSwipe = distance < -30;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:16px_16px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full text-sm mb-4">
            <Smartphone className="w-4 h-4" />
            Experiencia móvil
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Descubre la app <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">AuraSpt</span>
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">
            Una experiencia fitness completa en tu bolsillo
          </p>
        </div>

        {/* Mockup de iPhone (CSS puro, sin dependencias) */}
        <div className="flex justify-center">
          <div className="relative mx-auto">
            {/* Marco del dispositivo */}
            <div className="relative w-[320px] h-[640px] rounded-[44px] bg-black border-[10px] border-zinc-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Notch superior */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-800 rounded-b-2xl" />
              {/* Pantalla */}
              <div
                className="absolute inset-0 m-[10px] rounded-[32px] bg-zinc-900 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {appScreenshots.map((screen, index) => (
                  <div
                    key={screen.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                      index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={screen.src}
                      alt={screen.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay de información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                      <div className="text-white">
                        <h3 className="text-lg font-bold mb-1">{screen.title}</h3>
                        <p className="text-sm text-zinc-300">{screen.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Indicadores de posición (puntos) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                  {appScreenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex 
                          ? 'bg-emerald-400 scale-125' 
                          : 'bg-white/40'
                      }`}
                      aria-label={`Ir a pantalla ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Botones de navegación táctiles (áreas más grandes para móvil) */}
                <div className="absolute inset-0 flex justify-between items-center z-10">
                  <div 
                    className="h-full w-1/4 cursor-pointer"
                    onClick={goToPrev}
                    aria-label="Pantalla anterior"
                  />
                  <div 
                    className="h-full w-1/4 cursor-pointer"
                    onClick={goToNext}
                    aria-label="Siguiente pantalla"
                  />
                </div>
              </div>
              {/* Indicador de inicio (home bar) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-white/30 rounded-full" />
            </div>
            
            {/* Soporte para el dispositivo (estético) */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-zinc-800/50 rounded-full blur-sm"></div>
          </div>
        </div>
        
        {/* Controles externos */}
        <div className="flex justify-center items-center mt-8 gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-emerald-500/20 transition-all"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <div className="text-zinc-400 text-sm">
            <span>{currentIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{appScreenshots.length}</span>
          </div>
          
          <button
            onClick={goToPrev}
            className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-emerald-500/20 transition-all"
            aria-label="Pantalla anterior"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-emerald-500/20 transition-all"
            aria-label="Siguiente pantalla"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* App Stores badges (oficiales) */}
        <div className="flex justify-center gap-4 mt-10">
          <a href="#" aria-label="Descargar en App Store" className="transition-opacity hover:opacity-90">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Descargar en el App Store"
              className="h-12 w-auto"
              loading="lazy"
            />
          </a>
          <a href="#" aria-label="Obtenerlo en Google Play" className="transition-opacity hover:opacity-90">
            <img
              src="https://play.google.com/intl/es-419/badges/static/images/badges/es-419_badge_web_generic.png"
              alt="Disponible en Google Play"
              className="h-12 w-auto"
              loading="lazy"
            />
          </a>
        </div>

      </div>
    </section>
  );
};

export default MobileAppCarousel;