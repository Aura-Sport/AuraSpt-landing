import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RequireTrainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-dark-background text-dark-foreground flex items-center justify-center">Cargando…</div>;
  }
  if (!user || user.role !== 'trainer') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};



