import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { BackgroundGlows } from '../components/Decor/BackgroundGlows';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Settings, 
  User, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  BadgeCheck,
  Award,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';

export const IntranetLayout: React.FC = () => {
  const { user, logout, trainer } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: ".", end: true, label: "Dashboard", icon: LayoutDashboard },
    { path: "profile", label: "Perfil", icon: User },
    { path: "students", label: "Alumnos", icon: Users },
    { path: "routines", label: "Rutinas", icon: Dumbbell },
    { path: "analytics", label: "Estadísticas", icon: BarChart3 },
    { path: "settings", label: "Ajustes", icon: Settings },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive 
        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-white shadow-lg' 
        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
    }`;

  const specialties = Array.isArray(trainer?.specialties) ? trainer.specialties : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <BackgroundGlows />
      
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="font-bold text-white">A</span>
            </div>
            <span className="font-semibold">AuraSpt Pro</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400 hidden xs:block">{user?.email}</span>
          <button 
            onClick={logout}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-red-400"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-80 min-h-screen border-r border-zinc-800 p-6 sticky top-0 bg-zinc-900/30 backdrop-blur-lg">
          <div className="flex flex-col w-full">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-white">A</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">AuraSpt Pro</h1>
                <p className="text-xs text-zinc-400">Panel de entrenador</p>
              </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-zinc-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <span className="font-bold text-white text-lg">{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{user?.name || 'Usuario'}</h3>
                  <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                </div>
              </div>
              
              {trainer && (
                <>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                    <BadgeCheck className="w-3 h-3 text-emerald-400" />
                    <span>Entrenador personal</span>
                    {trainer.experience_years && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span>{trainer.experience_years} años</span>
                      </>
                    )}
                  </div>
                  
                  {specialties.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-zinc-400 mb-1">Especialidades</p>
                      <div className="flex flex-wrap gap-1">
                        {specialties.slice(0, 2).map((specialty, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          >
                            {specialty}
                          </span>
                        ))}
                        {specialties.length > 2 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-zinc-700/50 text-zinc-400">
                            +{specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === `/intranet/${item.path}` || 
                                  (item.end && location.pathname === '/intranet');
                  
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        className={linkClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-6">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-colors group"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`
          lg:hidden fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 h-full flex flex-col">
            {/* User Profile Mobile */}
            <div className="bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-zinc-700/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <span className="font-bold text-white text-lg">{user?.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{user?.name || 'Usuario'}</h3>
                  <p className="text-xs text-zinc-400">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Mobile */}
            <nav className="flex-1">
              <ul className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        end={item.end}
                        className={linkClass}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout Mobile */}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800/50 transition-colors mt-6"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default IntranetLayout;