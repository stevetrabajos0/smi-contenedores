import Link from 'next/link';

export default function CotizarPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            ¿Qué Servicio Necesitas?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Selecciona la opción que mejor se adapte a tu situación. Si no estás seguro, podemos asesorarte por WhatsApp.
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* CARD 1: ALMACENAMIENTO - Con Badge "Más Popular" */}
            <div className="bg-white border-2 border-slate-200 hover:border-[#D32F2F] rounded-2xl p-8 transition-all duration-200 hover:shadow-lg relative">

              {/* Badge Más Popular */}
              <div className="absolute -top-3 left-8 bg-[#D32F2F] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                ⭐ Más Popular
              </div>

              {/* Icono */}
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-6 mt-2">
                <svg className="w-8 h-8 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Almacenamiento y Mudanza
              </h3>

              {/* Descripción */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                Renta temporal, compra permanente, o servicio de mudanza local.
              </p>

              {/* Bullets */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Renta desde $3,000/mes (sin compromiso largo)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Compra desde $55,000 (inversión permanente)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Mudanza $60/km (servicio puntual)</span>
                </li>
              </ul>

              {/* Info adicional */}
              <div className="mb-6 pb-6 border-t border-slate-200 pt-6 space-y-2">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Disponibilidad:</span> Contenedores 10', 20' y 40'
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Entrega:</span> 24-48 horas en Hermosillo
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/cotizar/almacenamiento"
                className="block w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-center py-4 rounded-lg font-semibold transition-colors"
              >
                Cotizar Almacenamiento
              </Link>
            </div>

            {/* CARD 2: MODELOS ESTÁNDAR */}
            <div className="bg-white border-2 border-slate-200 hover:border-[#D32F2F] rounded-2xl p-8 transition-all duration-200 hover:shadow-lg">

              {/* Icono */}
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Modelos Estándar
              </h3>

              {/* Descripción */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                Oficinas y casas prefabricadas listas en 2-5 semanas.
              </p>

              {/* Bullets */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>3 tamaños: 10' ($130K), 20' ($230K), 40' ($330K)</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Incluye: electricidad, clima, pintura a elegir</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Personaliza con baño ($15-30K) y cocina ($13K)</span>
                </li>
              </ul>

              {/* Info adicional */}
              <div className="mb-6 pb-6 border-t border-slate-200 pt-6 space-y-2">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Listo en:</span> 2-5 semanas desde anticipo
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Para:</span> Oficinas, casas pequeñas, espacios funcionales
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/cotizar/modelo-estandar"
                className="block w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-center py-4 rounded-lg font-semibold transition-colors"
              >
                Cotizar Modelo Estándar
              </Link>
            </div>

            {/* CARD 3: PROYECTOS PERSONALIZADOS */}
            <div className="bg-white border-2 border-slate-200 hover:border-[#D32F2F] rounded-2xl p-8 transition-all duration-200 hover:shadow-lg">

              {/* Icono */}
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Proyectos Personalizados
              </h3>

              {/* Descripción */}
              <p className="text-slate-600 mb-6 leading-relaxed">
                Diseño completamente a medida según tu visión específica.
              </p>

              {/* Bullets */}
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Cualquier tamaño y configuración única</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Casas, locales comerciales, proyectos industriales</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span>Acabados premium y layouts personalizados</span>
                </li>
              </ul>

              {/* Info adicional */}
              <div className="mb-6 pb-6 border-t border-slate-200 pt-6 space-y-2">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Inversión:</span> Desde $100K hasta $1M+ según proyecto
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">Timeline:</span> 8-16 semanas según complejidad
                </p>
              </div>

              {/* CTA */}
              <Link
                href="/cotizar/personalizado"
                className="block w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-center py-4 rounded-lg font-semibold transition-colors"
              >
                Cotizar Mi Proyecto
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Helper Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            ¿No estás seguro cuál opción elegir?
          </h3>
          <p className="text-slate-600 mb-8 text-lg">
            Platicamos contigo para entender tu necesidad y recomendarte la mejor solución.
          </p>
          <a
            href="https://wa.me/6621030059?text=Hola,%20necesito%20asesor%C3%ADa%20para%20elegir%20el%20servicio%20correcto"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Asesoría por WhatsApp
          </a>
        </div>
      </section>

    </main>
  );
}
