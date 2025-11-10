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

      {/* HERO SECTION - FULL SCREEN CON BACKGROUND */}
      <section className="relative min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">

        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-smi-contenedor.webp"
            alt="Contenedores y servicios SMI en Hermosillo, Sonora"
            fill
            priority
            quality={90}
            className="object-cover"
          />
        </div>

        {/* Content sobrepuesto */}
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center">

              {/* Marco oscuro para contenido */}
              <div className="bg-black/75 px-8 sm:px-12 py-12 sm:py-16 rounded-2xl backdrop-blur-sm">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-sm font-medium text-white">
                  Casas y Negocios en Hermosillo
                </span>
              </div>

                {/* H1 */}
                <h1 className="text-[38px] sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
                  Contenedores en Hermosillo: Almacenamiento, Viviendas y Proyectos Únicos
                </h1>

                {/* Subheading */}
                <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
                  Con contenedores de 20 y 40 pies, creamos estructuras únicas, funcionales y modernas. Entregas en todo México desde Hermosillo.
                </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <a
                  href="#servicios"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('servicios')?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                  className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-10 py-5 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl cursor-pointer"
                >
                  Ver Opciones y Precios
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <a
                  href={getWhatsAppLink(WHATSAPP_MESSAGES.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-10 py-5 rounded-lg font-semibold text-lg transition-all inline-flex items-center justify-center"
                >
                  Hablar por WhatsApp
                </a>
              </div>

                {/* Small text */}
                <p className="text-sm text-white/70">
                  Renta desde $3,000/mes | Compra desde $55,000 | Modelos listos desde $130,000
                </p>

              </div>
              {/* Fin marco oscuro */}

            </div>
          </div>
        </div>

      </section>

      {/* SECCIÓN DE SERVICIOS */}
      <section id="servicios" className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              ¿Qué necesitas resolver?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Cada solución tiene su momento ideal - encuentra la tuya
            </p>
          </div>

          {/* Grid de 3 cards */}
          <div className="grid md:grid-cols-3 gap-8">

            {/* CARD 1: MODELOS ESTÁNDAR */}
            <Link
              href="/cotizar/modelo-estandar"
              className="group bg-white border-2 border-slate-200 hover:border-[#D32F2F] rounded-2xl p-8 transition-all hover:shadow-lg"
            >
              <div className="relative h-48 w-full rounded-t-2xl overflow-hidden mb-6">
                <Image
                  src="/images/modelo_basico.webp"
                  alt="Oficina modular lista para usar en Hermosillo"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Oficinas y Casas Listas
              </h3>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Espacios equipados listos para usar en semanas. Modelos pre-diseñados para oficinas, casas o bodegas.
              </p>

              <ul className="space-y-2 mb-8">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Desde $130,000 MXN
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Modelos pre-diseñados
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Entrega en 4-8 semanas
                </li>
              </ul>

              <div className="flex items-center text-[#D32F2F] font-semibold group-hover:gap-2 transition-all">
                Ver Modelos
                <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            {/* CARD 2: ALMACENAMIENTO Y MUDANZA */}
            <Link
              href="/almacenamiento"
              className="group bg-white border-2 border-slate-200 hover:border-[#D32F2F] rounded-2xl p-8 transition-all hover:shadow-lg"
            >
              <div className="relative h-48 w-full rounded-t-2xl overflow-hidden mb-6">
                <Image
                  src="/images/almacenamiento.webp"
                  alt="Contenedores de almacenamiento en Hermosillo"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Almacenamiento y Mudanza
              </h3>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Renta contenedores por el tiempo que necesites. Perfecto para almacenar o mudarte sin complicaciones.
              </p>

              <ul className="space-y-2 mb-8">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Desde $3,000/mes renta
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Contenedores 10, 20, 40 pies
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Entrega en 24-48 horas
                </li>
              </ul>

              <div className="flex items-center text-[#D32F2F] font-semibold group-hover:gap-2 transition-all">
                Cotizar Storage
                <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            {/* CARD 3: PROYECTOS PERSONALIZADOS */}
            <Link
              href="/cotizar/personalizado"
              className="group bg-white border-2 border-slate-200 hover:border-[#D32F2F] rounded-2xl p-8 transition-all hover:shadow-lg"
            >
              <div className="relative h-48 w-full rounded-t-2xl overflow-hidden mb-6">
                <Image
                  src="/images/custom.webp"
                  alt="Proyectos personalizados con contenedores"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Proyectos a tu Medida
              </h3>

              <p className="text-slate-600 mb-6 leading-relaxed">
                Casas únicas, oficinas corporativas y locales comerciales diseñados específicamente para ti.
              </p>

              <ul className="space-y-2 mb-8">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  100% personalizado
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Arquitectos especializados
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Entrega 2-6 meses
                </li>
              </ul>

              <div className="flex items-center text-[#D32F2F] font-semibold group-hover:gap-2 transition-all">
                Cotizar Proyecto
                <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

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
