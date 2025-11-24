'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  // Estado para controlar dropdown de Proyectos
  const [isProyectosOpen, setIsProyectosOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProyectosOpen(false);
      }
    };

    if (isProyectosOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProyectosOpen]);

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="SMI Contenedores"
              width={120}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/almacenamiento"
              className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Almacenamiento
            </Link>

            {/* Dropdown de Proyectos */}
            <div className="relative" ref={dropdownRef}>
              {/* Botón del dropdown */}
              <button
                onClick={() => setIsProyectosOpen(!isProyectosOpen)}
                className="inline-flex items-center gap-1
                           text-slate-600 hover:text-slate-900
                           font-medium transition-colors duration-200"
              >
                Proyectos
                {/* Chevron icon */}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isProyectosOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menu dropdown */}
              {isProyectosOpen && (
                <div className="absolute top-full left-0 mt-2 w-48
                                bg-white rounded-lg shadow-xl border border-slate-200
                                py-2 z-[100]
                                animate-in fade-in slide-in-from-top-1 duration-200">

                  {/* Item: Estándar */}
                  <Link
                    href="/modelo-estandar"
                    onClick={() => setIsProyectosOpen(false)}
                    className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#D32F2F]
                               transition-colors font-medium"
                  >
                    Modelos Estándar
                  </Link>

                  {/* Divider */}
                  <div className="h-px bg-slate-200 my-1" />

                  {/* Item: Personalizados */}
                  <Link
                    href="/personalizado"
                    onClick={() => setIsProyectosOpen(false)}
                    className="block px-4 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-[#D32F2F]
                               transition-colors font-medium"
                  >
                    Proyectos Personalizados
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/cotizar"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-5 py-2 rounded-lg font-semibold transition-colors"
            >
              Cotizar
            </Link>
          </div>

          {/* Mobile Menu Button & CTA */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900 hover:text-[#D32F2F] transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <Link
              href="/cotizar"
              className="hidden md:inline-flex bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Cotizar
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/almacenamiento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Almacenamiento
            </Link>
            <Link
              href="/modelo-estandar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Modelos Estándar
            </Link>
            <Link
              href="/personalizado"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Proyectos Personalizados
            </Link>
            <Link
              href="/cotizar"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg transition-colors text-center font-semibold"
            >
              Cotizar
            </Link>
          </nav>
        </div>
      )}
    </nav>
  );
}
