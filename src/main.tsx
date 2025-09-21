import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './LandingPage/routes/Login';
import { Register } from './LandingPage/routes/Register';
import { RequireTrainer } from './intranet/RequireTrainer';
import { IntranetLayout } from './intranet/Layout';
import { DashboardPage } from './intranet/pages/Dashboard';
import { StudentsPage } from './intranet/pages/Students';
import { RoutinesPage } from './intranet/pages/Routines';
import { ProfilePage } from './intranet/pages/Profile';
import { LandingPage } from './LandingPage';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/landing', element: <LandingPage /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/home',
    element: <RequireTrainer><IntranetLayout /></RequireTrainer>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'students', element: <StudentsPage /> },
      { path: 'routines', element: <RoutinesPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <DashboardPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
