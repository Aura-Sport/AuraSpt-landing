import React from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { Benefits } from './sections/Benefits';
import { HowItWorks } from './sections/HowItWorks';
import ScreensCarousel from './sections/ScreensCarousel';
import { Testimonials } from './sections/Testimonials';
import { FAQ } from './sections/FAQ';
import { FinalCTA } from './sections/FinalCTA';
import { Footer } from './sections/Footer';
import { BackgroundGlows } from '../components/Decor/BackgroundGlows';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground">
      <BackgroundGlows variant="bold" />
      <Header />
      <main>
        <Hero />
        <Benefits />
        <HowItWorks />
        <ScreensCarousel />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;


