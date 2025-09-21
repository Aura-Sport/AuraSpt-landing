import React, { useCallback } from 'react';
import { Engine, ISourceOptions } from 'tsparticles-engine';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';

type BenefitParticlesProps = {
  variant: 'algorithms' | 'community' | 'breathing' | 'efficient';
  className?: string;
};

export const BenefitParticles: React.FC<BenefitParticlesProps> = ({ variant, className }) => {
  const init = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const base: ISourceOptions = {
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    fpsLimit: 60,
    particles: {
      number: { value: 12 },
      color: { value: '#34d399' },
      opacity: { value: 0.2 },
      size: { value: { min: 1, max: 2 } },
      move: { enable: true, speed: 0.4 },
    },
    interactivity: { events: {} },
  };

  const variants: Record<string, ISourceOptions> = {
    algorithms: {
      ...base,
      particles: {
        ...base.particles!,
        links: { enable: true, opacity: 0.12, distance: 80, color: '#34d399' },
      },
    },
    community: {
      ...base,
      particles: {
        ...base.particles!,
        move: { enable: true, speed: 0.3, random: true },
      },
    },
    breathing: {
      ...base,
      particles: {
        ...base.particles!,
        size: { value: 2, anim: { enable: true, speed: 1, minimumValue: 1, sync: false } as any },
      },
    },
    efficient: {
      ...base,
      particles: {
        ...base.particles!,
        move: { enable: true, speed: 0.8, straight: true },
      },
    },
  };

  const options = variants[variant] || base;

  return (
    <div className={className}>
      <Particles id={`benefit-${variant}`} init={init} options={options} />
    </div>
  );
};

export default BenefitParticles;


