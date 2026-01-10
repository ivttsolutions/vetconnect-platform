'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Header } from '@/components/layout';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              La red profesional del <span className="text-purple-600">sector veterinario</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Conecta con veterinarios, clínicas, empresas y profesionales del mundo animal. 
              Encuentra empleo, eventos y oportunidades de crecimiento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-lg"
              >
                Crear cuenta gratis
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors text-lg"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="text-9xl">🐾</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Todo lo que necesitas en un solo lugar
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Networking</h3>
              <p className="text-gray-600">
                Conecta con profesionales, clínicas y empresas del sector veterinario de todo el mundo.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bolsa de empleo</h3>
              <p className="text-gray-600">
                Encuentra ofertas de trabajo o publica vacantes para tu clínica o empresa.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eventos</h3>
              <p className="text-gray-600">
                Descubre congresos, cursos, webinars y eventos del sector veterinario.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Para todos los profesionales
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '👨‍⚕️', title: 'Veterinarios', desc: 'Clínicos, especialistas, investigadores' },
              { icon: '🏥', title: 'Clínicas', desc: 'Hospitales y centros veterinarios' },
              { icon: '🎓', title: 'Estudiantes', desc: 'Futuros profesionales del sector' },
              { icon: '🏢', title: 'Empresas', desc: 'Laboratorios, distribuidores, seguros' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">7+</div>
              <div className="text-purple-200">Tipos de profesionales</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-purple-200">Tipos de empresas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-purple-200">Conexiones posibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-200">Disponibilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para conectar con el sector veterinario?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Únete a VetConnect y forma parte de la comunidad profesional más grande del sector.
          </p>
          <button
            onClick={() => router.push('/register')}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-lg"
          >
            Comenzar ahora — Es gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🐾</span>
                <span className="text-xl font-bold text-white">VetConnect</span>
              </div>
              <p className="text-sm">
                La red profesional del sector veterinario.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/jobs" className="hover:text-white">Empleos</a></li>
                <li><a href="/events" className="hover:text-white">Eventos</a></li>
                <li><a href="/search" className="hover:text-white">Buscar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Cuenta</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/register" className="hover:text-white">Registrarse</a></li>
                <li><a href="/login" className="hover:text-white">Iniciar sesión</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Términos de uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2026 VetConnect. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
