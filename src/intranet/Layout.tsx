import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { BackgroundGlows } from '../components/Decor/BackgroundGlows';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Dumbbell, Settings, User } from 'lucide-react';

export const IntranetLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const linkClass = ({ isActive }: { isActive: boolean }) => `flex items-center gap-2 px-3 py-2 rounded hover:bg-dark-input ${isActive ? 'bg-dark-input' : ''}`;
  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground">
      <BackgroundGlows />
      <div className="flex">
        <aside className="hidden md:flex md:w-64 min-h-screen border-r border-dark-border p-4 sticky top-0">
          <nav className="w-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-dark-primary rounded-full flex items-center justify-center">
                <span className="text-dark-primaryForeground font-bold">A</span>
              </div>
              <span className="font-semibold">AuraSpt Pro</span>
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <NavLink to="." end className={linkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="profile" className={linkClass}>
                  <User className="w-4 h-4" />
                  Perfil
                </NavLink>
              </li>
              <li>
                <NavLink to="students" className={linkClass}>
                  <Users className="w-4 h-4" />
                  Alumnos
                </NavLink>
              </li>
              <li>
                <NavLink to="routines" className={linkClass}>
                  <Dumbbell className="w-4 h-4" />
                  Rutinas
                </NavLink>
              </li>
              <li>
                <NavLink to="settings" className={linkClass}>
                  <Settings className="w-4 h-4" />
                  Ajustes
                </NavLink>
              </li>
            </ul>
            <div className="mt-auto pt-6 text-xs text-dark-mutedForeground">
              <div className="flex items-center justify-between">
                <span>{user?.email}</span>
                <button className="underline" onClick={logout}>Salir</button>
              </div>
            </div>
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <header className="md:hidden border-b border-dark-border h-14 flex items-center justify-between px-4">
            <span className="font-semibold">AuraSpt Pro</span>
            <div className="text-sm flex items-center gap-3">
              {user?.email}
              <button className="underline" onClick={logout}>Salir</button>
            </div>
          </header>
          <main className="px-4 py-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default IntranetLayout;


