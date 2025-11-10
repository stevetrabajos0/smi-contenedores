'use client';

import { useState } from 'react';
import Link from 'next/link';
import LocationSection from '@/components/sections/LocationSection';

export default function PersonalizadoLandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // FAQs específicos de Proyectos Personalizados
  const FAQS_PERSONALIZADO = [
    {
      id: 1,
      pregunta: '¿Cuándo debo elegir Proyecto Personalizado en lugar de Modelo Estándar?',
      respuesta: 'Elige Personalizado si: (1) Tu proyecto NO cabe en 10\', 20\' o 40\' estándar. (2) Necesitas más de 2 recámaras o layout completamente único. (3) Es proyecto comercial con requerimientos específicos (cocina industrial, áreas de servicio, instalaciones especiales). (4) Quieres combinar múltiples contenedores en configuración única.\n\nElige Modelo Estándar si: Tu necesidad cabe en los tamaños estándar, quieres algo funcional rápido (2-5 semanas), y el precio fijo te conviene. Los modelos se pueden personalizar con color, baño y cocina, pero la estructura base es fija.\n\nRegla simple: ¿Puedes vivir/trabajar con un modelo estándar personalizado? → Estándar (más rápido, precio fijo). ¿Necesitas algo que no existe en estándar? → Personalizado.'
    },
    {
      id: 2,
      pregunta: '¿Cómo funciona el proceso desde que contacto hasta que recibo mi proyecto?',
      respuesta: 'Proceso en 7 pasos: (1) Consulta inicial gratuita: Describes tu idea, presupuesto aproximado y timeline. Evaluamos viabilidad. (2) Visita técnica (si es necesario): Vamos al terreno para evaluar accesos, servicios disponibles, y restricciones. (3) Diseño preliminar: Creamos renders y planos según lo que platicamos. 1-2 rondas de ajustes incluidas. (4) Cotización detallada: Desglose completo de materiales, mano de obra, timeline y entregables. (5) Anticipo y construcción: Típicamente 40% anticipo, resto en avances de construcción. (6) Actualizaciones: Fotos y avances durante construcción. (7) Entrega e instalación: Coordinamos transporte y entrega según acordado. Timeline total: 8-16 semanas según complejidad.'
    },
    {
      id: 3,
      pregunta: '¿Puedo hacer cambios al diseño durante la construcción?',
      respuesta: 'Cambios menores (colores, acabados, ubicación de accesorios): Sí, sin costo adicional si se solicitan antes de aplicar. Cambios mayores (layout, agregar espacios, instalaciones diferentes): Posible pero genera costo adicional y puede extender timeline 1-3 semanas según magnitud del cambio.\n\nMejor práctica: Asegúrate de que el diseño preliminar (paso 3) refleje exactamente lo que quieres. Es más fácil y económico ajustar en papel que durante construcción. Por eso hacemos 1-2 rondas de ajustes antes de empezar a construir.'
    },
    {
      id: 4,
      pregunta: '¿Por qué el precio no es fijo como en Modelos Estándar?',
      respuesta: 'Cada proyecto personalizado es literalmente único. El precio depende de: Tamaño (1 contenedor vs 3+ contenedores multi-nivel), Complejidad (espacio abierto simple vs múltiples habitaciones con baños), Acabados (básicos vs premium: maderas, vidrios especiales, pisos de lujo), Instalaciones (eléctrico básico vs sistema completo: plomería, gas, datos, seguridad), Ubicación (entrega local vs transporte 500+ km), Timeline (standard vs rush).\n\nEjemplo real: Casa 3 recámaras puede ser $400K (acabados básicos, 1 nivel) o $700K (acabados premium, 2 niveles con terraza). Por eso necesitamos consulta para cotizar exacto.'
    },
    {
      id: 5,
      pregunta: '¿Cómo se manejan los pagos en proyectos grandes?',
      respuesta: 'Esquema típico por avances (negociable según proyecto): 40% anticipo para compra de materiales y inicio de fabricación. 30% al 50% de avance cuando estructura y exteriores están listos. 20% al 80% de avance cuando instalaciones y acabados están avanzados. 10% a la entrega cuando proyecto está 100% terminado y en tu ubicación.\n\nProyectos grandes (+$800K) pueden tener más hitos de pago. Emitimos factura por cada pago. NO aceptamos pago 100% anticipado - los pagos por avances te protegen y nos mantienen responsables de entregar calidad en cada etapa.'
    },
    {
      id: 6,
      pregunta: '¿Hay algo que NO se pueda hacer con contenedores?',
      respuesta: 'SÍ podemos: Cualquier configuración hasta 3 niveles, cortes y modificaciones estructurales, instalaciones completas (agua, luz, gas, clima, datos), acabados de lujo (madera, vidrio, piedra), proyectos multi-contenedor de cualquier tamaño, sistemas especiales (cocinas industriales, baños comerciales, etc).\n\nNO podemos/recomendamos: Estructuras de 4+ niveles sin ingeniería especial, proyectos en zonas sin acceso para camión (caminos muy angostos o empinados), ubicaciones sin factibilidad de servicios básicos (agua, luz), proyectos en terrenos sin permisos de construcción disponibles.\n\nNO hacemos: Tramitar permisos municipales (tú o tu contratista lo hace, podemos asesorar), conexión final de servicios públicos a red municipal (electricista/plomero certificado lo hace), obra civil del terreno (nivelación, cimentación - contratas aparte).'
    },
    {
      id: 7,
      pregunta: '¿Qué pasa con los permisos de construcción?',
      respuesta: 'Responsabilidad del cliente: Tramitar permisos con tu municipio. Nosotros NO somos gestores de permisos.\n\nNosotros SÍ proporcionamos: Planos arquitectónicos y especificaciones técnicas que necesitas para tramitar permisos. Asesoría sobre qué permisos típicamente se requieren según tu proyecto. Contactos de gestores si necesitas contratar a alguien.\n\nRealidad: Permisos varían mucho por municipio y tipo de proyecto. Proyecto residencial en terreno propio es generalmente más simple. Proyecto comercial requiere permisos de uso de suelo, protección civil, etc. Recomendamos verificar requisitos ANTES de ordenar para evitar sorpresas. En algunos casos, clientes construyen sin permiso (bajo su riesgo - no recomendamos).'
    },
    {
      id: 8,
      pregunta: '¿Cuánto tiempo realmente tarda un proyecto personalizado?',
      respuesta: 'Timeline por complejidad: Kiosco/Caseta simple (1 contenedor): 3-6 semanas desde anticipo hasta entrega. Casa 3 recámaras o local mediano: 8-12 semanas. Proyecto multi-contenedor complejo: 10-16 semanas.\n\nIncluye: Diseño final, fabricación, acabados, instalaciones, transporte. NO incluye: tiempo de permisos (puede agregar 2-8 semanas según municipio), preparación de terreno por tu cuenta.\n\nFactores que extienden timeline: Temporada alta (diciembre-febrero), cambios de diseño durante construcción, materiales especiales bajo pedido, ubicaciones remotas con logística compleja, clima extremo que impide trabajo.\n\n¿Puedes acelerar? Posible agregar 1-2 semanas menos con costo adicional por horas extra y priorización. Consúltanos si tienes fecha límite crítica.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">

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
            Proyectos Personalizados
          </h1>

          {/* CENTERED SUBTITLE */}
          <p className="text-lg sm:text-xl text-slate-600 text-center font-medium mb-6">
            a tu Medida
          </p>

          {/* CENTERED TRUST SIGNALS - COMPACT */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm">

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Desde $100K hasta $1M+</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">100% personalizado</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">8-16 semanas</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-700">Diseño profesional</span>
            </div>

          </div>

        </div>
      </section>

      {/* Ejemplos Section */}
      <section id="ejemplos" className="pt-2 pb-8 sm:pt-4 sm:pb-12 lg:pt-6 lg:pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Proyectos que Hacemos Realidad
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Casas familiares, negocios, oficinas y proyectos industriales
            </p>
          </div>

          {/* Grid de ejemplos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1 - Casas Familiares */}
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200
                          hover:border-[#D32F2F] transition-all hover:shadow-lg group">
              <div className="mb-4">
                <svg className="w-12 h-12 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Casas Familiares
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                3-5 recámaras personalizadas
              </p>

              {/* Bullets específicos */}
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Layout según tu familia (3-8 personas)
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Acabados y materiales a elegir
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Incluye instalaciones completas
                </li>
              </ul>

              {/* Pricing box */}
              <div className="bg-white rounded-lg p-3 mb-4 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Rango Típico
                </p>
                <p className="text-lg font-bold text-slate-900">
                  $400K - $700K
                </p>
              </div>
            </div>

            {/* Card 2 - Negocios Pequeños */}
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200
                          hover:border-[#D32F2F] transition-all hover:shadow-lg group">
              <div className="mb-4">
                <svg className="w-12 h-12 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Negocios Pequeños
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Restaurantes, cafés, retail
              </p>

              {/* Bullets específicos */}
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Diseño comercial funcional
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Área de servicio y almacén
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Instalaciones profesionales
                </li>
              </ul>

              {/* Pricing box */}
              <div className="bg-white rounded-lg p-3 mb-4 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Rango Típico
                </p>
                <p className="text-lg font-bold text-slate-900">
                  $200K - $400K
                </p>
              </div>
            </div>

            {/* Card 3 - Oficinas */}
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200
                          hover:border-[#D32F2F] transition-all hover:shadow-lg group">
              <div className="mb-4">
                <svg className="w-12 h-12 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Oficinas
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Espacios de trabajo 5-15 personas
              </p>

              {/* Bullets específicos */}
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Diseño modular y escalable
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Áreas privadas y open space
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Infraestructura tech-ready
                </li>
              </ul>

              {/* Pricing box */}
              <div className="bg-white rounded-lg p-3 mb-4 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Rango Típico
                </p>
                <p className="text-lg font-bold text-slate-900">
                  $300K - $600K
                </p>
              </div>
            </div>

            {/* Card 4 - Proyectos Industriales */}
            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200
                          hover:border-[#D32F2F] transition-all hover:shadow-lg group">
              <div className="mb-4">
                <svg className="w-12 h-12 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Proyectos Industriales
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Talleres, bodegas, almacenes
              </p>

              {/* Bullets específicos */}
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Resistencia para uso industrial
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Espacios amplios y flexibles
                </li>
                <li className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-[#D32F2F] mt-1">•</span>
                  Cumplimiento normativo
                </li>
              </ul>

              {/* Pricing box */}
              <div className="bg-white rounded-lg p-3 mb-4 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                  Rango Típico
                </p>
                <p className="text-lg font-bold text-slate-900">
                  $150K - $500K
                </p>
              </div>
            </div>

          </div>

          {/* CTA único para todas las categorías */}
          <div className="mt-12 text-center">
            <Link
              href="/cotizar/personalizado"
              className="inline-flex items-center gap-3 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-10 py-5 rounded-lg font-bold text-xl transition-colors shadow-xl hover:shadow-2xl"
            >
              Cotizar Mi Proyecto
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

        </div>
      </section>

      {/* Galería de Inspiración */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Tu Proyecto Puede Lucir Así
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Oficinas, restaurantes, casas y más. Diseñamos exactamente lo que tienes en mente.
            </p>
          </div>

          {/* Grid: 1 col mobile, 2 tablet, 3 desktop - 8 imágenes (sin Bodega) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* 1. Home Office */}
            <Link
              href="/cotizar/modelo-estandar"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/home-office.webp"
                alt="Home Office"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Home Office
                </h3>
              </div>
            </Link>

            {/* 2. Puesto de Comida */}
            <Link
              href="/cotizar/personalizado"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/puesto-comida.webp"
                alt="Puesto de Comida"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Puesto de Comida
                </h3>
              </div>
            </Link>

            {/* 3. Tiny Home */}
            <Link
              href="/cotizar/modelo-estandar"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/tiny-home.webp"
                alt="Tiny Home"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Tiny Home
                </h3>
              </div>
            </Link>

            {/* 4. Casa de Playa */}
            <Link
              href="/cotizar/personalizado"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/airbnb.webp"
                alt="Casa de Playa"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Casa de Playa
                </h3>
              </div>
            </Link>

            {/* 5. Restaurante */}
            <Link
              href="/cotizar/personalizado"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/restaurante.webp"
                alt="Restaurante"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Restaurante
                </h3>
              </div>
            </Link>

            {/* 6. Oficinas Corporativas */}
            <Link
              href="/cotizar/personalizado"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/oficinas-corporativas.webp"
                alt="Oficinas Corporativas"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Oficinas Corporativas
                </h3>
              </div>
            </Link>

            {/* 7. Bodega Permanente - ELIMINADO */}

            {/* 8. Plaza Comercial */}
            <Link
              href="/cotizar/personalizado"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/plaza.webp"
                alt="Plaza Comercial"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Plaza Comercial
                </h3>
              </div>
            </Link>

            {/* 9. Casa de Lujo */}
            <Link
              href="/cotizar/personalizado"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              <img
                src="/gallery/casa-lujo.webp"
                alt="Casa de Lujo"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  Casa de Lujo
                </h3>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA EL SERVICIO */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Cómo Funciona el Servicio
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Proceso completo para proyectos personalizados
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">

            {/* Vertical line (desktop only) */}
            <div className="hidden sm:block absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200"></div>

            <div className="space-y-8">

              {/* Step 1: Consulta Inicial */}
              <div className="relative flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                flex items-center justify-center text-white font-bold text-lg
                                shadow-lg z-10">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Consulta Inicial
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                    Conversamos por llamada o en persona sobre tu proyecto. Exploramos juntos las
                    posibilidades según tu espacio disponible, presupuesto y visión del resultado final.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    ⏱️ 30-60 minutos
                  </p>
                </div>
              </div>

              {/* Step 2: Diseño y Cotización */}
              <div className="relative flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                flex items-center justify-center text-white font-bold text-lg
                                shadow-lg z-10">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Diseño y Cotización
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                    Creamos renders 3D, planos arquitectónicos y presupuesto detallado según
                    tu proyecto específico. Todo diseñado a tu medida.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    ⏱️ 1-2 semanas
                  </p>
                </div>
              </div>

              {/* Step 3: Ajustes y Aprobación */}
              <div className="relative flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                flex items-center justify-center text-white font-bold text-lg
                                shadow-lg z-10">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Ajustes y Aprobación
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                    1-2 rondas de cambios incluidas. Finalizamos diseño, materiales,
                    acabados y presupuesto definitivo.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    ⏱️ 3-5 días
                  </p>
                </div>
              </div>

              {/* Step 4: Anticipo e Inicio */}
              <div className="relative flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                flex items-center justify-center text-white font-bold text-lg
                                shadow-lg z-10">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Anticipo e Inicio
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                    40-50% de anticipo para comprar materiales y reservar producción.
                    Resto se paga en avances de construcción según cronograma.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    ⏱️ Mismo día
                  </p>
                </div>
              </div>

              {/* Step 5: Construcción por Etapas */}
              <div className="relative flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                flex items-center justify-center text-white font-bold text-lg
                                shadow-lg z-10">
                  5
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Construcción por Etapas
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                    Fabricación en nuestro taller. Te enviamos fotos del progreso cada semana.
                    Pagos según avances pactados en cronograma.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    ⏱️ 8-16 semanas según proyecto
                  </p>
                </div>
              </div>

              {/* Step 6: Entrega e Instalación */}
              <div className="relative flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                flex items-center justify-center text-white font-bold text-lg
                                shadow-lg z-10">
                  6
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Entrega e Instalación Final
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                    Transporte e instalación completa en tu ubicación. Pago final al recibir.
                    Listo para usar desde día uno.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    ⏱️ 1-2 días
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Nota importante */}
          <div className="mt-10 bg-white border-l-4 border-slate-400 p-4 sm:p-6 rounded-r-lg">
            <div className="flex gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="text-sm sm:text-base text-slate-700 font-medium mb-1">
                  Importante
                </p>
                <p className="text-xs sm:text-sm text-slate-600">
                  Cliente debe contar con terreno disponible, permisos municipales tramitados
                  y servicios básicos (luz, agua, drenaje) accesibles.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <a
              href="/cotizar/personalizado"
              className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                         px-8 py-3 sm:px-10 sm:py-4 rounded-lg font-semibold text-base sm:text-lg
                         transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Cotizar Mi Proyecto →
            </a>
          </div>

        </div>
      </section>

      {/* SECCIÓN FAQ - Preguntas Frecuentes */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Preguntas Frecuentes sobre Proyectos Personalizados
            </h2>
            <p className="text-lg text-slate-600">
              Resuelve tus dudas sobre proyectos a medida
            </p>
          </div>

          {/* Accordion de FAQs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg divide-y divide-slate-200 overflow-hidden">
            {FAQS_PERSONALIZADO.map((faq, index) => (
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
              href="https://wa.me/5216621030059?text=Hola,%20tengo%20preguntas%20sobre%20proyectos%20personalizados"
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

      {/* CTA Final */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            ¿Tienes una idea diferente?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Cuéntanos tu proyecto y lo hacemos realidad
          </p>
          <Link
            href="/cotizar/personalizado"
            className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                     px-8 py-4 rounded-lg font-semibold text-lg
                     transition-colors shadow-xl hover:shadow-2xl
                     inline-flex items-center justify-center"
          >
            Cotizar Ahora
          </Link>
        </div>
      </section>

    </div>
  );
}
