// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + tekstas */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            DI
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">DI Namams</h1>
            <p className="text-xs text-slate-500 -mt-1">DI jūsų kasdienybei</p>
          </div>
        </div>

        {/* Navigacija (desktop) */}
        <nav className="hidden md:flex items-center space-x-6 text-slate-700">
          <a href="#" className="hover:text-slate-900">Apie</a>
          <a href="#" className="hover:text-slate-900">Funkcijos</a>
          <a href="#" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Išbandyk dabar</a>
        </nav>

        {/* Hamburger (mobile) */}
        <button className="md:hidden p-2" aria-label="Meniu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
