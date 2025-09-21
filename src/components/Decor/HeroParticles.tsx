import React, { useCallback } from 'react';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';

type HeroParticlesProps = {
  className?: string;
};

export const HeroParticles: React.FC<HeroParticlesProps> = ({ className }) => {
  const init = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const options: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    fpsLimit: 60,
    particles: {
      number: { value: 36, density: { enable: true, area: 800 } },
      color: { value: '#00ff88' },
      opacity: { value: 0.3 },
      size: { value: { min: 1, max: 3 } },
      links: {
        enable: true,
        color: '#00ff88',
        opacity: 0.15,
        distance: 120,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: 'none',
        outModes: { default: 'out' },
        random: true,
        straight: false,
        attract: { enable: true, rotateX: 600, rotateY: 1200 }
      }
    },
    interactivity: {
      detectsOn: 'window',
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: true
      },
      modes: {
        repulse: { distance: 80, duration: 0.4 }
      }
    },
    detectRetina: true
  };

  return (
    <div className={className}>
      <Particles id="hero-particles" init={init} options={options} />
    </div>
  );
};

export default HeroParticles;


