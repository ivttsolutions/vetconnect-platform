import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-blue-500">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🐾</span>
            <span className="text-2xl font-bold text-white">VetConnect</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-purple-200 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Professional Network for Veterinarians
          </h1>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            Connect with fellow veterinary professionals, find job opportunities, 
            share knowledge, and grow your career in veterinary medicine.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-colors shadow-lg"
            >
              Join VetConnect
            </Link>
            <Link 
              href="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Advance Your Career
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Network</h3>
              <p className="text-gray-600">
                Connect with veterinarians, clinics, and animal care professionals worldwide.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Job Opportunities</h3>
              <p className="text-gray-600">
                Find your dream job or hire talented professionals for your clinic.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Knowledge Sharing</h3>
              <p className="text-gray-600">
                Share cases, learn from peers, and stay updated with the latest in veterinary medicine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-white">VetConnect</span>
          </div>
          <p className="text-sm">
            © 2026 VetConnect. Professional Network for Veterinarians.
          </p>
        </div>
      </footer>
    </main>
  );
}
