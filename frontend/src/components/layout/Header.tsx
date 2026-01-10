'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  auth?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Inicio', icon: '🏠', auth: true },
  { href: '/feed', label: 'Feed', icon: '📰', auth: true },
  { href: '/network', label: 'Red', icon: '🤝', auth: true },
  { href: '/jobs', label: 'Empleos', icon: '💼', auth: false },
  { href: '/events', label: 'Eventos', icon: '📅', auth: false },
  { href: '/messages', label: 'Mensajes', icon: '✉️', auth: true },
  { href: '/notifications', label: 'Alertas', icon: '🔔', auth: true },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const displayName = user?.firstName || user?.companyName || 'Usuario';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div 
            onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-purple-600 hidden sm:block">VetConnect</span>
          </div>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div 
              onClick={() => router.push('/search')}
              className="w-full flex items-center bg-gray-100 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-400 mr-2">🔍</span>
              <span className="text-gray-500 text-sm">Buscar...</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems
              .filter(item => !item.auth || isAuthenticated)
              .map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}

            {/* Profile Menu */}
            {isAuthenticated ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                    pathname.startsWith('/profile')
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs">Yo ▾</span>
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{displayName}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { router.push('/profile'); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        👤 Ver perfil
                      </button>
                      <button
                        onClick={() => { router.push('/profile/edit'); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        ✏️ Editar perfil
                      </button>
                      <button
                        onClick={() => { router.push('/jobs/my-applications'); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        📋 Mis aplicaciones
                      </button>
                      <button
                        onClick={() => { router.push('/events/my-events'); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        🎫 Mis eventos
                      </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-medium"
                >
                  Entrar
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
                >
                  Registrarse
                </button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => router.push('/search')}
              className="p-2 text-gray-600 hover:text-purple-600"
            >
              🔍
            </button>
            <button
              onClick={() => setShowMobileNav(!showMobileNav)}
              className="p-2 text-gray-600 hover:text-purple-600"
            >
              {showMobileNav ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileNav && (
          <div className="md:hidden border-t border-gray-100 py-2">
            <nav className="flex flex-col">
              {navItems
                .filter(item => !item.auth || isAuthenticated)
                .map((item) => (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); setShowMobileNav(false); }}
                    className={`flex items-center px-4 py-3 ${
                      isActive(item.href)
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}

              {isAuthenticated ? (
                <>
                  <hr className="my-2" />
                  <button
                    onClick={() => { router.push('/profile'); setShowMobileNav(false); }}
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
                  >
                    <span className="text-xl mr-3">👤</span>
                    <span>Mi perfil</span>
                  </button>
                  <button
                    onClick={() => { router.push('/jobs/my-applications'); setShowMobileNav(false); }}
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
                  >
                    <span className="text-xl mr-3">📋</span>
                    <span>Mis aplicaciones</span>
                  </button>
                  <button
                    onClick={() => { router.push('/events/my-events'); setShowMobileNav(false); }}
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50"
                  >
                    <span className="text-xl mr-3">🎫</span>
                    <span>Mis eventos</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <span className="text-xl mr-3">🚪</span>
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <button
                    onClick={() => { router.push('/login'); setShowMobileNav(false); }}
                    className="flex items-center px-4 py-3 text-purple-600 hover:bg-purple-50"
                  >
                    <span className="text-xl mr-3">🔑</span>
                    <span>Entrar</span>
                  </button>
                  <button
                    onClick={() => { router.push('/register'); setShowMobileNav(false); }}
                    className="flex items-center px-4 py-3 text-purple-600 hover:bg-purple-50"
                  >
                    <span className="text-xl mr-3">✨</span>
                    <span>Registrarse</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
