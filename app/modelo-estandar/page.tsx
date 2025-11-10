'use client';
import { useState } from 'react';
import Link from 'next/link';
import { modelos } from '@/lib/data/modelos';
import { getWhatsAppLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import LocationSection from '@/components/sections/LocationSection';

{/*
  Hero actualizado: 28 Oct 2025
  Cambios críticos por discrepancias con documento oficial:
  - Precios corregidos: $85K → $130K (modelo 10 pies real)
  - Tiempos corregidos: 6-8 sem → 2-5 sem (real según tamaño)
  - Eliminado: "Permisos incluidos" (falso - cliente tramita)
  - Eliminado: "Financiamiento" (pendiente confirmar con Abraham)
  - Agregado: Personalización de color (diferenciador clave)
  - Agregado: Precios de extras (transparencia total)
  Fuente: SMI CONTENEDORES - DOCUMENTO OFICIAL v1.2
*/}

export default function ModeloEstandarPage() {
  // Estado para toast de "próximamente"
  const [showToast, setShowToast] = useState(false);

  // Estado para accordion de FAQ
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleVerDetalles = (modelo: any) => {
    // Navegar a página individual del modelo
    window.location.href = `/modelo-estandar/${modelo.slug}`;
  };

  // Helper: 1 bullet (timeline only) - Ultra-minimalista
  const getModeloBullets = (modeloId: string): string[] => {
    const bullets: Record<string, string[]> = {
      'modelo-10': ['Listo en 2-3 semanas'],
      'modelo-20': ['Listo en 3-4 semanas'],
      'modelo-40': ['Listo en 4-5 semanas']
    };
    return bullets[modeloId] || [];
  };

  // FAQs específicos de Modelos Estándar
  const FAQS_MODELO_ESTANDAR = [
    {
      id: 1,
      pregunta: '¿Cuál es la diferencia entre Modelo Estándar y Proyecto Personalizado?',
      respuesta: 'Modelo Estándar: Diseños probados en 3 tamaños fijos (10\', 20\', 40\'), precio definido desde $130K, listo en 2-5 semanas. Puedes personalizar color, distribución básica y agregar baño/cocina, pero la estructura base es estándar. Ideal si necesitas algo funcional rápido.\n\nProyecto Personalizado: Diseño completamente desde cero según tu visión. Cualquier tamaño, layout único, puede ser casa de 3+ recámaras, local comercial, gimnasio, restaurante, etc. Timeline 8-16 semanas, precio desde $400K según complejidad. Ideal si tienes una idea específica o necesidades especiales de negocio.\n\nRegla simple: ¿Tu proyecto cabe en 10, 20 o 40 pies estándar? → Modelo Estándar. ¿Necesitas algo único o más complejo? → Personalizado.'
    },
    {
      id: 2,
      pregunta: '¿Cuál es la diferencia entre los 3 modelos estándar?',
      respuesta: 'El tamaño y cantidad de espacios. Modelo 10\' (7m²): espacio único abierto, ideal para 1 persona u oficina individual. Modelo 20\' (15m²): 1 recámara separada + área común, perfecto para parejas o proyectos de renta. Modelo 40\' (30m²): 2 recámaras + sala común, ideal para familias de 3-5 personas. Todos se pueden personalizar con divisiones, baño y cocina.'
    },
    {
      id: 3,
      pregunta: '¿Puedo modificar el diseño interior del modelo?',
      respuesta: 'Sí, dentro de límites razonables. Puedes cambiar distribución de espacios, agregar o quitar divisiones interiores, elegir colores de pintura (interior y exterior), decidir ubicación de ventanas/puertas, y agregar extras como baño o cocina. Lo que NO puedes cambiar: el tamaño base del contenedor (10\', 20\' o 40\') ni la estructura principal. Si necesitas cambios mayores, considera un Proyecto Personalizado.'
    },
    {
      id: 4,
      pregunta: '¿Qué incluye exactamente el precio base?',
      respuesta: 'Estructura del contenedor certificada con aislamiento térmico completo, instalación eléctrica lista (contactos, apagadores, centro de carga), minisplit instalado (1 o 2 según modelo), ventanas con marco y vidrio, puerta principal con cerradura, y pintura del color que elijas. Todo listo para habitar. NO incluye: baño, cocina, permisos, instalación en sitio, ni conexión de servicios.'
    },
    {
      id: 5,
      pregunta: '¿Cuánto cuesta agregar baño y cocina?',
      respuesta: 'Baño completo (WC, lavabo, regadera, instalaciones completas): $30,000. Baño simple (WC y lavabo sin regadera): $15,000. Cocina (tarja, instalación para estufa, alacenas): $13,000. Estos precios se suman al modelo base. Ejemplo: Modelo 20\' ($230K) + baño completo ($30K) + cocina ($13K) = $273K + IVA.'
    },
    {
      id: 6,
      pregunta: '¿Cuánto tiempo tarda desde que ordeno hasta que lo recibo?',
      respuesta: 'Modelo 10\': 2-3 semanas. Modelo 20\': 3-4 semanas. Modelo 40\': 4-5 semanas. Estos tiempos son desde que pagas el anticipo hasta la entrega. Si agregas baño o cocina, suma 1 semana adicional. La entrega en Hermosillo es gratis e inmediata una vez listo. Fuera de Hermosillo coordinamos fecha según distancia.'
    },
    {
      id: 7,
      pregunta: '¿Ustedes lo instalan en mi terreno?',
      respuesta: 'Nosotros entregamos el contenedor en tu ubicación (gratis en Hermosillo, $60/km fuera). La colocación con grúa es aparte (~$2,500, cliente contrata). NO hacemos instalación permanente como anclaje, nivelación de terreno, o conexión de agua/luz/drenaje - eso lo hace el cliente o su contratista. Podemos recomendar proveedores si necesitas.'
    },
    {
      id: 8,
      pregunta: '¿Sirve para vivir todo el año?',
      respuesta: 'Sí. Todos los modelos tienen aislamiento térmico completo, clima (minisplit) incluido, instalación eléctrica profesional, y acabados de calidad habitacional. Con las conexiones de servicios adecuadas (agua, luz, drenaje que haces por separado), funcionan como cualquier construcción tradicional. Muchos clientes los usan como vivienda permanente en Hermosillo sin problema.'
    }
  ];

  return (
    <main>
      {/* HERO - CENTERED & IMPOSING */}
      <section className="relative bg-gradient-to-b from-slate-50 to-white py-6 sm:py-8 min-h-[22vh] sm:min-h-[20vh]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-600
                       hover:text-[#D32F2F] mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>

          {/* CENTERED HERO TITLE - IMPOSING */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900
                         text-center mb-2 tracking-tight">
            Oficinas y Casas Listas
          </h1>

          {/* CENTERED SUBTITLE */}
          <p className="text-lg sm:text-xl text-slate-600 text-center font-medium mb-6">
            en 2-4 semanas
          </p>

          {/* CENTERED TRUST SIGNALS - COMPACT */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Desde $130K + IVA</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Personalizable</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Entrega gratis Hmo</span>
            </div>

          </div>

        </div>
      </section>

      {/* Sección: Nuestros Modelos */}
      <section id="modelos" className="pt-2 pb-8 sm:pt-4 sm:pb-12 lg:pt-6 lg:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header - Compact */}
          <div className="text-center mb-4 px-4 sm:px-6 mt-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              Nuestros Modelos Estándar
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Base lista para personalizar según tu visión. Precio fijo, distribución flexible.
            </p>
          </div>

          {/* DESKTOP: Grid de Modelos */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {modelos.map((modelo) => (
              <div
                key={modelo.id}
                className="group bg-white border-2 border-slate-200
                           hover:border-[#D32F2F] rounded-2xl overflow-hidden
                           transition-all duration-300 hover:shadow-xl"
              >
                {/* Imagen */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={modelo.imagenes?.[0] || ''}
                    alt={modelo.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback si la imagen no existe
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20" font-family="sans-serif"%3E' + modelo.metros + '%3C/text%3E%3C/svg%3E';
                    }}
                  />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-[#D32F2F] text-white
                                  px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {modelo.badge}
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6">

                  {/* Título */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {modelo.nombre}
                  </h3>

                  {/* Metros */}
                  <p className="text-slate-500 text-sm mb-1">
                    {modelo.metros} útiles
                  </p>

                  {/* Use Case */}
                  {(modelo as any).use_case && (
                    <p className="text-sm text-slate-600 mb-6">
                      {(modelo as any).use_case}
                    </p>
                  )}

                  {/* Timeline Bullet (solo 1) */}
                  <ul className="space-y-3 mb-6">
                    {getModeloBullets(modelo.id).map((bullet, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                             fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="h-px bg-slate-200 mb-4" />

                  {/* Precio */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-1">Desde</p>
                    <p className="text-3xl font-bold text-slate-900">
                      ${modelo.precio_desde.toLocaleString('es-MX')}
                      <span className="text-lg text-slate-600 font-normal"> + IVA</span>
                    </p>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleVerDetalles(modelo)}
                    className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                               py-3 px-6 rounded-lg font-semibold
                               transition-colors"
                  >
                    Ver Detalles y Cotizar
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* MOBILE: Horizontal Scroll */}
          <div className="sm:hidden mb-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 px-4 -mx-4
                            [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {modelos.map((modelo) => (
                <div
                  key={modelo.id}
                  className="flex-shrink-0 w-[280px] snap-center
                             group bg-white border-2 border-slate-200
                             hover:border-[#D32F2F] rounded-2xl overflow-hidden
                             transition-all duration-300 hover:shadow-xl"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={modelo.imagenes?.[0] || ''}
                      alt={modelo.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback si la imagen no existe
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="20" font-family="sans-serif"%3E' + modelo.metros + '%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-[#D32F2F] text-white
                                    px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {modelo.badge}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">

                    {/* Título */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {modelo.nombre}
                    </h3>

                    {/* Metros */}
                    <p className="text-slate-500 text-sm mb-1">
                      {modelo.metros} útiles
                    </p>

                    {/* Use Case */}
                    {(modelo as any).use_case && (
                      <p className="text-sm text-slate-600 mb-6">
                        {(modelo as any).use_case}
                      </p>
                    )}

                    {/* Timeline Bullet (solo 1) */}
                    <ul className="space-y-3 mb-6">
                      {getModeloBullets(modelo.id).map((bullet, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-600">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                               fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                          </svg>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Divider */}
                    <div className="h-px bg-slate-200 mb-4" />

                    {/* Precio */}
                    <div className="mb-6">
                      <p className="text-sm text-slate-600 mb-1">Desde</p>
                      <p className="text-3xl font-bold text-slate-900">
                        ${modelo.precio_desde.toLocaleString('es-MX')}
                        <span className="text-lg text-slate-600 font-normal"> + IVA</span>
                      </p>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => handleVerDetalles(modelo)}
                      className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                                 py-3 px-6 rounded-lg font-semibold
                                 transition-colors"
                    >
                      Ver Detalles y Cotizar
                    </button>

                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator Dots */}
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-[#D32F2F]" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
          </div>

          {/* Nota Explicativa - Texto discreto tipo footnote */}
          <div className="mt-12 mb-16">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-center text-sm text-slate-500 leading-relaxed">
                Todos los modelos incluyen
                <span className="text-slate-700 font-medium"> instalación eléctrica, pintura del color que elijas, minisplit, ventanas y puertas</span>.
                <br />
                Personaliza con baño, cocina y más al ver detalles de cada modelo.
              </p>
            </div>
          </div>

          {/* CTA Final - Prominente */}
          <div className="mt-20 mb-20">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-8 sm:p-12 text-center shadow-lg">

                {/* Header */}
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                  ¿Necesitas más información?
                </h3>

                <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
                  Cada modelo incluye la base estructural lista. Personalizamos distribución, acabados y extras según tu proyecto específico.
                </p>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                  {/* WhatsApp - Primario */}
                  <a
                    href={getWhatsAppLink(WHATSAPP_MESSAGES.estandar)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>

                  {/* Solicitar Cotización - Secundario */}
                  <Link href="/cotizar/modelo-estandar">
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-[#D32F2F] px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                    >
                      Solicitar Cotización
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Link>

                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN FAQ - Preguntas Frecuentes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg text-slate-600">
              Resuelve tus dudas sobre los modelos estándar
            </p>
          </div>

          {/* Accordion de FAQs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg divide-y divide-slate-200 overflow-hidden">
            {FAQS_MODELO_ESTANDAR.map((faq, index) => (
              <div key={faq.id} className="group">
                {/* Button/Header */}
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  {/* Question */}
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    {faq.pregunta}
                  </h3>

                  {/* Icon with circular background */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Answer - Expandable */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === index ? 'max-h-[800px] pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8 whitespace-pre-line">
                    {faq.respuesta}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA WhatsApp */}
          <div className="text-center mt-16 pt-12 border-t border-slate-200">
            <p className="text-lg text-slate-600 mb-8">
              ¿Tienes más preguntas?
            </p>
            <a
              href="https://wa.me/5216621030059?text=Hola,%20tengo%20preguntas%20sobre%20los%20modelos%20estándar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A]
                         text-white px-8 py-4 rounded-xl font-semibold text-lg
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         hover:scale-105"
            >
              {/* WhatsApp Icon */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hablar por WhatsApp
            </a>
          </div>

        </div>
      </section>

      {/* Sección Ubicación */}
      <LocationSection />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl
                          flex items-center gap-3 max-w-sm">
            <svg className="w-6 h-6 text-blue-400 flex-shrink-0"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-sm">Página en desarrollo</p>
              <p className="text-xs text-slate-300">
                Te contactamos por WhatsApp para más info
              </p>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
