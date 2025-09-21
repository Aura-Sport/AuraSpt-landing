import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { LandingPage } from './LandingPage';
import { Navigate } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { user, trainer, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-dark-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-dark-primaryForeground font-bold text-xl">A</span>
          </div>
          <p className="text-dark-mutedForeground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !trainer) {
    return <LandingPage />;
  }

  return <Navigate to="/home" replace />;
};

function App() {
  return (
    <div className="dark">
      <AppContent />
    </div>
  );
}

export default App;