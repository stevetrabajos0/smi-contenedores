import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} SMI Contenedores. Hermosillo, Sonora.
          </p>

          {/* Links básicos */}
          <div className="flex gap-6">
            <Link
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/almacenamiento"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cotizar
            </Link>
            <a
              href="#"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Aviso de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
