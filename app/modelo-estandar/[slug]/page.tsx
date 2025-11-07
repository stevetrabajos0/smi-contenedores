'use client';
import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getModeloBySlug } from '@/lib/data/modelos';
import ModeloGallery from '@/components/modelos/ModeloGallery';
import { getWhatsAppLink, WHATSAPP_MESSAGES } from '@/lib/constants';

export default function ModeloPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const modelo = getModeloBySlug(resolvedParams.slug);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!modelo) {
    notFound();
  }

  const handleCotizar = () => {
    // Redirect to cotización form with modelo pre-selected
    window.location.href = `/cotizar/modelo-estandar?modelo=${modelo.slug}`;
  };

  const handleContactarAsesor = () => {
    // WhatsApp con mensaje específico del modelo
    const mensaje = `Hola, tengo dudas sobre el ${modelo.nombre}. ¿Pueden ayudarme?`;
    window.open(getWhatsAppLink(mensaje), '_blank');
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
              Inicio
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/modelo-estandar" className="text-slate-600 hover:text-slate-900 transition-colors">
              Modelos Estándar
            </Link>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 font-medium">
              {modelo.nombre}
            </span>
          </nav>
        </div>
      </div>

      {/* Contenido Principal */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Layout 50/50 */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* IZQUIERDA: Galería */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <ModeloGallery
                imagenes={modelo.imagenes}
                nombre={modelo.nombre}
              />
            </div>

            {/* DERECHA: Info */}
            <div>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block bg-[#D32F2F] text-white
                                   px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {modelo.badge}
                  </span>
                  <span className="text-slate-500 text-sm">
                    Contenedor de {modelo.contenedor}
                  </span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                  {modelo.nombre}
                </h1>

                <p className="text-lg text-slate-600">
                  {modelo.metros} útiles • {modelo.dimensiones}
                </p>
              </div>

              {/* Precio */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-8">
                <p className="text-sm text-slate-600 mb-1">Desde</p>
                <p className="text-4xl font-bold text-slate-900 mb-1">
                  ${modelo.precio_desde.toLocaleString('es-MX')}
                  <span className="text-xl text-slate-600 font-normal"> MXN + IVA</span>
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  Base estructural sin baño ni cocina
                </p>

                <div>
                  <p className="text-sm font-semibold text-slate-900 mb-3">Incluye:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Pintura del color que elijas</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Minisplit 1.5 ton instalado</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>2 ventanas + puerta con cerradura</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Instalación eléctrica completa</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* CTAs Principales - Scroll 3-4 */}
              <div className="my-12 bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8">

                {/* Headline */}
                <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">
                  ¿Listo para tu proyecto?
                </h3>

                {/* Context Text */}
                <p className="text-center text-slate-600 mb-6">
                  ¿Dudas sobre personalización, extras o entrega?
                </p>

                {/* CTA Buttons */}
                <div className="space-y-3 max-w-md mx-auto">

                  {/* Primary CTA */}
                  <button
                    onClick={handleCotizar}
                    className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                               px-8 py-4 rounded-lg font-semibold text-lg
                               transition-colors duration-200
                               inline-flex items-center justify-center gap-2
                               shadow-lg hover:shadow-xl"
                  >
                    Cotizar {modelo.nombre}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Secondary CTA - WhatsApp */}
                  <button
                    onClick={handleContactarAsesor}
                    className="w-full border-2 border-green-600 hover:border-green-700
                               hover:bg-green-50 text-slate-900
                               px-8 py-4 rounded-lg font-semibold text-lg
                               transition-colors duration-200
                               inline-flex items-center justify-center gap-2"
                  >
                    {/* WhatsApp Icon */}
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Hablar con Asesor en WhatsApp
                  </button>

                </div>

                {/* Trust Signals */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Entrega en {modelo.tiempo_entrega}
                  </span>
                  {modelo.badge && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {modelo.badge}
                    </span>
                  )}
                </div>

              </div>

              {/* Extras Disponibles */}
              <div className="mb-12 bg-slate-50 border-2 border-slate-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Extras Disponibles
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Puedes agregar estas opciones durante fabricación. Se definen en la cotización:
                  </p>

                  <div className="space-y-4">
                    {/* Extra: Baño Simple */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#D32F2F] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">
                            Baño Simple
                          </h4>
                          <p className="text-sm text-slate-600">
                            WC + lavabo (sin regadera)
                          </p>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-2xl font-bold text-slate-900">+$15,000</p>
                          <p className="text-xs text-slate-500">MXN</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Ideal para oficinas y espacios comerciales
                      </p>
                    </div>

                    {/* Extra: Baño Completo */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#D32F2F] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">
                            Baño Completo
                          </h4>
                          <p className="text-sm text-slate-600">
                            WC + lavabo + regadera
                          </p>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-2xl font-bold text-slate-900">+$30,000</p>
                          <p className="text-xs text-slate-500">MXN</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Ideal para viviendas y proyectos residenciales
                      </p>
                    </div>

                    {/* Extra: Cocina Completa */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#D32F2F] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2">
                            Cocina Completa
                          </h4>
                          <p className="text-sm text-slate-600">
                            Tarja, instalación para estufa, alacenas básicas
                          </p>
                        </div>
                        <div className="text-right ml-6">
                          <p className="text-2xl font-bold text-slate-900">+$13,000</p>
                          <p className="text-xs text-slate-500">MXN</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Estufa y electrodomésticos NO incluidos (cliente los compra aparte)
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Otros extras disponibles:</strong> ventanas adicionales, divisiones interiores, acabados especiales.
                      Consulta todas las opciones al cotizar.
                    </p>
                  </div>
                </div>

              {/* Qué NO Incluye */}
              <div className="mb-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Qué NO Está Incluido
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Para que no haya sorpresas, estos elementos NO están incluidos en el precio base:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <svg className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Muebles y decoración</p>
                        <p className="text-sm text-slate-600">Cama, sala, mesa, decoración (cliente compra aparte)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <svg className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Electrodomésticos</p>
                        <p className="text-sm text-slate-600">Estufa, refrigerador, microondas (cliente compra aparte)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <svg className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Instalación en sitio</p>
                        <p className="text-sm text-slate-600">Cliente contrata grúa externa (~$2,500)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <svg className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Preparación de terreno</p>
                        <p className="text-sm text-slate-600">Nivelación, base de concreto (cliente contrata aparte)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <svg className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Permisos de construcción</p>
                        <p className="text-sm text-slate-600">Cliente tramita con su municipio (podemos asesorar)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <svg className="w-6 h-6 text-slate-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Conexión a servicios</p>
                        <p className="text-sm text-slate-600">Agua, luz, drenaje a red municipal (electricista/plomero certificado)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      ⚠️ <strong>Importante:</strong> Nosotros entregamos el contenedor transformado y listo.
                      La instalación, muebles y conexiones son responsabilidad del cliente o sus contratistas.
                    </p>
                  </div>
                </div>

              {/* Ideal Para - Minimalist Tags (Universal) */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Ideal para:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {modelo.ideal_para.map((uso, index) => (
                    <span key={index}
                          className="inline-block bg-slate-100 text-slate-700
                                     px-4 py-2 rounded-lg text-sm font-medium">
                      {uso}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specs Técnicas */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Especificaciones técnicas:
                </h2>
                <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
                  {Object.entries(modelo.specs_tecnicas).map(([key, value], index, array) => (
                    <div key={key}
                         className={`grid grid-cols-2 gap-4 px-6 py-4
                                    ${index !== array.length - 1 ? 'border-b border-slate-200' : ''}`}>
                      <span className="text-slate-600 font-medium">{key}</span>
                      <span className="text-slate-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entrega e Instalación - ENHANCED FOR 10, 20 & 40 PIES / SIMPLE FOR OTHERS */}
              {(modelo.slug === '20-pies' || modelo.slug === '10-pies' || modelo.slug === '40-pies') ? (
                <div className="mb-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    Entrega e Instalación
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                        Entrega
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-green-500 font-bold">✓</span>
                          <span><strong>Hermosillo:</strong> Entrega GRATIS incluida</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Fuera de Hermosillo:</strong> $60/km desde nuestro taller</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-slate-400 font-bold">•</span>
                          <span><strong>Timeline:</strong> 3-4 semanas desde anticipo (50%)</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Instalación (NO incluida)
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-amber-500 font-bold">!</span>
                          <span>Nosotros <strong>entregamos</strong> el contenedor en tu ubicación</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-amber-500 font-bold">!</span>
                          <span>Cliente contrata <strong>grúa externa</strong> (~$2,500) para bajar/instalar</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="text-amber-500 font-bold">!</span>
                          <span>Terreno debe tener <strong>acceso para camión</strong> y estar nivelado</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-blue-300 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Tip:</strong> Podemos recomendarte proveedores de grúa y nivelación de terreno en Hermosillo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-8">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">
                        Tiempo de entrega
                      </p>
                      <p className="text-blue-700">
                        {modelo.tiempo_entrega} desde confirmación de diseño
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs del Modelo - Model Specific */}
              {modelo.slug === '20-pies' ? (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                    Preguntas Frecuentes - Modelo 20'
                  </h3>

                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* FAQ 1 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Puedo agregar la cocina después de recibir el modelo?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        No recomendado. Es mucho más fácil y económico agregar la cocina durante fabricación ($13K).
                        Agregarla después requiere modificar instalaciones y puede costar el doble.
                        Decide antes de ordenar si necesitas cocina.
                      </p>
                    </div>

                    {/* FAQ 2 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿El precio incluye muebles y electrodomésticos?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        No. El precio base ($230K) incluye solo la estructura transformada: paredes, piso, techo,
                        instalación eléctrica, minisplit, baño completo y pintura. Muebles (cama, sala, mesa) y
                        electrodomésticos (estufa, refri) los compras tú aparte según tu gusto y presupuesto.
                      </p>
                    </div>

                    {/* FAQ 3 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Quién hace la instalación en mi terreno?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Nosotros entregamos el contenedor en tu ubicación, pero NO lo instalamos.
                        Tú contratas una grúa externa (~$2,500) para bajarlo del camión e instalarlo.
                        Podemos recomendarte proveedores confiables en Hermosillo.
                      </p>
                    </div>

                    {/* FAQ 4 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Puedo conectarlo a luz y agua municipal yo mismo?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        No. Por seguridad y requisitos municipales, la conexión final a la red eléctrica debe hacerla
                        un electricista certificado. Para agua y drenaje, necesitas un plomero certificado.
                        El contenedor viene preparado (salidas/entradas listas), pero las conexiones finales son responsabilidad del cliente.
                      </p>
                    </div>

                    {/* FAQ 5 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Cuánto espacio necesito en mi terreno para el modelo 20'?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Mínimo 7m × 3m (largo × ancho) para el contenedor, más espacio alrededor para instalación y mantenimiento.
                        El camión necesita poder acceder (calles de mínimo 3.5m de ancho). Si tu terreno tiene acceso complicado,
                        consúltanos antes de ordenar.
                      </p>
                    </div>
                  </div>
                </div>
              ) : modelo.slug === '10-pies' ? (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                    Preguntas Frecuentes - Modelo 10'
                  </h3>

                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* FAQ 1 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Es suficiente espacio para trabajar cómodamente?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Sí, con 7m² (2.99m × 2.44m) tienes espacio para: 1 escritorio + silla ergonómica,
                        1 librero o archivero, y mini área de reunión (2 sillas visitantes).
                        Ideal para profesional independiente, oficina satélite de 2-3 personas,
                        o caseta de vigilancia con área de descanso.
                      </p>
                    </div>

                    {/* FAQ 2 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Puedo agregar un baño después de recibir el modelo?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        No recomendado. Agregar baño después es más costoso (~$25-30K vs $15-20K durante fabricación)
                        porque requiere modificar instalaciones ya terminadas. Si planeas usarlo como oficina o vivienda,
                        ordénalo con baño incluido.
                      </p>
                    </div>

                    {/* FAQ 3 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Cómo se entrega e instala?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Nosotros entregamos el contenedor en tu ubicación: Hermosillo GRATIS, fuera de Hermosillo $60/km.
                        Tú contratas grúa externa (~$2,500) para bajarlo e instalarlo. Por su tamaño compacto (10 pies),
                        la instalación es más sencilla que modelos más grandes.
                      </p>
                    </div>

                    {/* FAQ 4 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Puedo usarlo como vivienda permanente?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Estructuralmente sí, está diseñado para uso habitacional. Pero considera: 7m² es compacto (ideal para 1 persona),
                        necesitas agregar baño completo (+$15-20K), opcional cocina básica (+$8-13K), y verificar permisos en tu municipio.
                        Muchos clientes lo usan como studio, casita de huéspedes, o vivienda temporal mientras construyen.
                      </p>
                    </div>
                  </div>
                </div>
              ) : modelo.slug === '40-pies' ? (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                    Preguntas Frecuentes - Modelo 40'
                  </h3>

                  <div className="space-y-4 max-w-4xl mx-auto">
                    {/* FAQ 1 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Cómo puedo distribuir los 30m² para una familia?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Los 30m² (12.19m × 2.44m) permiten múltiples configuraciones: 2 recámaras + sala + baño + cocina,
                        o 1 recámara grande + sala-comedor + baño completo + cocina integral. Muchas familias agregan
                        divisiones interiores (+$15-25K) para crear privacidad. También puedes considerar un mezzanine
                        (+$80-120K) para duplicar el área útil y tener espacios separados verticalmente.
                      </p>
                    </div>

                    {/* FAQ 2 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿Es suficiente para usarlo como oficina completa?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Sí, 30m² funcionan bien para oficinas de 8-12 personas con distribución abierta (coworking),
                        o 5-6 personas con 2-3 oficinas privadas cerradas. Incluye 2 minisplits de 1.5 ton para climatización
                        adecuada. Agrega baño completo (+$25-30K) y área de cocina/café (+$13K) para mayor comodidad.
                        Ideal para startups, consultorios médicos, o sucursales empresariales.
                      </p>
                    </div>

                    {/* FAQ 3 */}
                    <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-slate-900 mb-3">
                        ¿La entrega e instalación es más complicada por el tamaño?
                      </h4>
                      <p className="text-slate-600 text-sm">
                        Sí requiere más logística. El modelo 40' pesa 3,800 kg (vs 2,300 kg del 20'), entonces necesitas:
                        grúa de mayor capacidad (~$3,500-4,500), camión más grande para transporte, y terreno con
                        acceso amplio (vialidad mayor a 4m de ancho). Entrega GRATIS en Hermosillo, $60/km fuera.
                        Recomendamos visita previa al sitio para verificar acceso.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Nota Adicional */}
              <p className="text-xs text-slate-500 text-center mt-6">
                Los precios son estimados base. Cotización final según personalización y ubicación.
              </p>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
