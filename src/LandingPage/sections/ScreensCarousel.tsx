import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Smartphone } from 'lucide-react';

const appScreenshots = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Seguimiento de Progreso",
    description: "Métricas detalladas de tu evolución física"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Rutinas Personalizadas",
    description: "Planes adaptados a tus objetivos específicos"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1549060279-7e168fce7090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Técnica Perfecta",
    description: "Guías visuales para ejecución correcta"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    title: "Comunidad Activa",
    description: "Conecta y comparte tus logros"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    title: "Entrenadores Expertos",
    description: "Asesoramiento profesional continuo"
  }
];

const MobileAppCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rsX = useSpring(rotateX, { stiffness: 120, damping: 20 });
  const rsY = useSpring(rotateY, { stiffness: 120, damping: 20 });
  const [motionActive, setMotionActive] = useState(false);
  const [needsPermission, setNeedsPermission] = useState(false);

  // Detectar soporte y permiso requerido (iOS)
  useEffect(() => {
    const hasDO = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
    if (!hasDO) return;
    const anyDO: any = (window as any).DeviceOrientationEvent;
    if (typeof anyDO?.requestPermission === 'function') {
      setNeedsPermission(true);
    } else {
      // En Android/otros navegadores suele no requerir permiso explícito
      setMotionActive(true);
    }
  }, []);

  const enableMotion = async () => {
    try {
      const anyDO: any = (window as any).DeviceOrientationEvent;
      if (typeof anyDO?.requestPermission === 'function') {
        const res = await anyDO.requestPermission();
        if (res === 'granted') {
          setMotionActive(true);
          setNeedsPermission(false);
        }
      } else {
        setMotionActive(true);
      }
    } catch {
      // ignorar
    }
  };

  // Aplicar tilt por orientación del dispositivo en móviles
  useEffect(() => {
    if (!motionActive) return;
    const onOrient = (e: DeviceOrientationEvent) => {
      // limitar a móviles/pequeños
      if (window.matchMedia('(pointer: coarse)').matches === false) return;
      const beta = e.beta ?? 0; // X (frente/atrás)
      const gamma = e.gamma ?? 0; // Y (izq/der)
      const max = 10;
      const map = (v: number, range: number) => Math.max(-max, Math.min(max, (v / range) * max));
      rotateX.set(map(beta, 45));
      rotateY.set(map(gamma, 45));
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [motionActive, rotateX, rotateY]);

  // Auto-play configuration
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        goToNext();
      }, 4000);
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === ' ') setIsPlaying(!isPlaying);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev === appScreenshots.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? appScreenshots.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (distance > swipeThreshold) {
      goToNext();
    } else if (distance < -swipeThreshold) {
      goToPrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full text-xs mb-4">
            <Smartphone className="w-3 h-3" />
            <span>Experiencia móvil</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Descubre la app <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">AuraSpt</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            Tu journey fitness, ahora en el bolsillo
          </p>
        </div>

        {/* Mobile Device Container */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="relative [perspective:1200px]"
            onMouseMove={(e) => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width;
              const py = (e.clientY - rect.top) / rect.height;
              rotateY.set((px - 0.5) * 10);
              rotateX.set((0.5 - py) * 10);
            }}
            onMouseLeave={() => {
              rotateX.set(0);
              rotateY.set(0);
            }}
          >
            {/* iPhone Mockup (CSS Pure) */}
            <motion.div
              style={{ rotateX: rsX, rotateY: rsY, transformStyle: 'preserve-3d' as any }}
              className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] rounded-[40px] bg-zinc-800 border-[12px] border-zinc-700 shadow-2xl shadow-black/50 overflow-hidden"
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-zinc-700 rounded-b-lg z-20" />
              
              {/* Screen Content */}
              <div
                ref={carouselRef}
                className="absolute inset-0 m-2 rounded-[32px] bg-zinc-900 overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {appScreenshots.map((screen, index) => (
                  <motion.div
                    key={screen.id}
                    animate={{ opacity: index === currentIndex ? 1 : 0, z: index === currentIndex ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0 will-change-transform"
                  >
                    <motion.img
                      src={screen.src}
                      alt={screen.title}
                      className="w-full h-full object-cover"
                      style={{ transform: 'translateZ(40px)' as any }}
                      loading="lazy"
                    />
                    
                    {/* Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 sm:p-5" style={{ transform: 'translateZ(60px)' as any }}>
                      <div className="text-white text-center w-full">
                        <h3 className="text-sm sm:text-base font-semibold mb-1">{screen.title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-300 opacity-90">{screen.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Navigation Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                  {appScreenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentIndex 
                          ? 'bg-emerald-400 scale-150' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/30 rounded-full" />
            </motion.div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-4 -right-4 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-xl p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white font-medium">+12% esta semana</span>
              </div>
              <div className="text-lg font-bold text-white">2,458</div>
              <div className="text-xs text-zinc-400">entrenamientos</div>
            </div>
            {/* Permiso para sensores en iOS */}
            {needsPermission && (
              <div className="mt-4 text-center">
                <button onClick={enableMotion} className="px-4 py-2 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors">
                  Activar efecto 3D en móvil
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppCarousel;