'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getWhatsAppLink, WHATSAPP_MESSAGES, SMI_WHATSAPP_URL, SMI_WHATSAPP_DISPLAY } from '@/lib/constants';
import GallerySection from '@/components/home/GallerySection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import FAQSection from '@/components/home/FAQSection';
import LocationSection from '@/components/sections/LocationSection';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION - MOBILE-FIRST CLARITY */}
      <section className="relative bg-white py-12 sm:py-16 lg:py-20 min-h-[85vh] sm:min-h-[60vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-slate-600 font-medium">
              Casas y Negocios en Hermosillo
            </span>
          </div>

          {/* Main headline - SHORT & CLEAR */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 text-center mb-4 tracking-tight">
            Contenedores para Almacenar, Trabajar y Vivir
          </h1>

          {/* Subheadline - CONCISE */}
          <p className="text-base sm:text-lg text-slate-600 text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            Renta desde $3K/mes o compra desde $55K. Oficinas y casas desde $130K, o diseña algo único. Mudanzas también. Te lo llevamos gratis en Hermosillo, a todo México con envío.
          </p>

          {/* Service Selection Header */}
          <div className="text-center mb-8 sm:mb-10 mt-8 sm:mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Elige tu Servicio
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Selecciona la opción que mejor se adapte a tu necesidad
            </p>
          </div>

          {/* 3 SERVICE CARDS - INTEGRATED IN HERO */}
          <div id="servicios" className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-8">

            {/* Card 1: Oficinas y Casas Listas */}
            <Link
              href="/modelo-estandar"
              className="group bg-white border-2 border-slate-200 hover:border-[#D32F2F]
                         rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                         cursor-pointer"
            >
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Casas y Oficinas Listas
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Espacios equipados en 4-8 semanas
              </p>
              <p className="text-2xl font-bold text-[#D32F2F] mb-1">
                Desde $130K
              </p>
              <p className="text-xs text-slate-500 mb-4">
                10, 20 o 40 pies
              </p>
              <div className="text-sm text-[#D32F2F] font-medium flex items-center justify-between">
                <span>Conocer más</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Card 2: Almacenamiento */}
            <Link
              href="/almacenamiento"
              className="group bg-white border-2 border-slate-200 hover:border-[#D32F2F]
                         rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                         cursor-pointer"
            >
              <div className="text-4xl mb-3">📦</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Almacenamiento
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Renta o compra, entrega 24-48h
              </p>
              <p className="text-2xl font-bold text-[#D32F2F] mb-1">
                Desde $3K/mes
              </p>
              <p className="text-xs text-slate-500 mb-4">
                O desde $55K compra
              </p>
              <div className="text-sm text-[#D32F2F] font-medium flex items-center justify-between">
                <span>Cotizar storage</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Card 3: Proyectos Personalizados */}
            <Link
              href="/personalizado"
              className="group bg-white border-2 border-slate-200 hover:border-[#D32F2F]
                         rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                         cursor-pointer"
            >
              <div className="text-4xl mb-3">🏗️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                A Tu Medida
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Diseñado específicamente para ti
              </p>
              <p className="text-2xl font-bold text-[#D32F2F] mb-1">
                A cotizar
              </p>
              <p className="text-xs text-slate-500 mb-4">
                100% personalizado
              </p>
              <div className="text-sm text-[#D32F2F] font-medium flex items-center justify-between">
                <span>Conocer más</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

          </div>

          {/* Secondary CTAs - SMALLER */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">

            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppLink(WHATSAPP_MESSAGES.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700
                         text-white px-5 py-2.5 rounded-lg text-sm font-semibold
                         transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Asesoría Rápida
            </a>

          </div>

        </div>
      </section>


      {/* GALERÍA DE PROYECTOS */}
      <GallerySection />

      {/* CÓMO FUNCIONA */}
      <HowItWorksSection />

      {/* PREGUNTAS FRECUENTES */}
      <FAQSection />

      {/* SECCIÓN DE UBICACIÓN + CONTACTO */}
      <LocationSection />

    </div>
  );
}
