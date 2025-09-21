import React, { Suspense, lazy } from 'react';
import { Header } from './sections/Header';
const Hero = lazy(() => import('./sections/Hero').then(m => ({ default: m.Hero })));
const Benefits = lazy(() => import('./sections/Benefits').then(m => ({ default: m.Benefits })));
const HowItWorks = lazy(() => import('./sections/HowItWorks').then(m => ({ default: m.HowItWorks })));
const ScreensCarousel = lazy(() => import('./sections/ScreensCarousel').then(m => ({ default: m.default })));
const FinalCTA = lazy(() => import('./sections/FinalCTA').then(m => ({ default: m.FinalCTA })));
const Footer = lazy(() => import('./sections/Footer').then(m => ({ default: m.Footer })));
import { BackgroundGlows } from '../components/Decor/BackgroundGlows';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground">
      <BackgroundGlows variant="bold" />
      <Header />
      <main>
        <Suspense fallback={<div className="py-20 text-center text-zinc-400">Cargando…</div>}>
          <Hero />
          <Benefits />
          <HowItWorks />
          <ScreensCarousel />
          <FinalCTA />
          <Footer />
        </Suspense>
      </main>
    </div>
  );
};

export default LandingPage;


