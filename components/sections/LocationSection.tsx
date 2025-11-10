'use client';

import { getWhatsAppLink, WHATSAPP_MESSAGES, SMI_WHATSAPP_DISPLAY, SMI_WHATSAPP_URL } from '@/lib/constants';

export default function LocationSection() {
  return (
    <section id="ubicacion-contacto" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Encuéntranos en Hermosillo
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Visita nuestro parque de contenedores o déjanos tus datos y
            te contactamos en menos de 2 horas.
          </p>
        </div>

        {/* Grid 50/50 */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* COLUMNA IZQUIERDA - Mapa + Info */}
          <div className="space-y-6">

            {/* Google Maps - Responsive */}
            <div>
              {/* Map container with 16:10 aspect ratio */}
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-lg border-2 border-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3482.9008873712587!2d-111.00396532414285!3d29.197044775361128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ce7f606b75d531%3A0x2b68194c901d3884!2sSMI%20Contenedores%20%7C%20Venta%20y%20Renta%20de%20Contenedores%20y%20Proyectos.!5e0!3m2!1ses!2smx!4v1762761658105!5m2!1ses!2smx"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación SMI Contenedores en Hermosillo, Sonora"
                />
              </div>

              {/* Address and external link */}
              <div className="mt-4 text-center">
                <p className="text-sm sm:text-base text-slate-600 mb-2">
                  📍 Hermosillo, Sonora, México
                </p>
                <a
                  href="https://www.google.com/maps/place/SMI+Contenedores+%7C+Venta+y+Renta+de+Contenedores+y+Proyectos./@29.197044775361128,-111.00396532414285,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#D32F2F] hover:text-[#B71C1C] inline-flex items-center gap-1 transition-colors"
                >
                  Abrir en Google Maps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
              <div className="space-y-4">

                {/* Dirección */}
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-900">Dirección</p>
                    <p className="text-slate-600 text-sm">
                      Parque Industrial XYZ, Calle 123<br/>
                      Hermosillo, Sonora 83000
                    </p>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-900">Horario</p>
                    <p className="text-slate-600 text-sm">
                      Lun-Vie: 8:00 AM - 6:00 PM<br/>
                      Sábado: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5"
                       fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-slate-900">WhatsApp</p>
                    <a href={SMI_WHATSAPP_URL}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-[#D32F2F] hover:underline text-sm font-medium
                                  transition-colors">
                      {SMI_WHATSAPP_DISPLAY}
                    </a>
                    <p className="text-xs text-slate-500 mt-1">
                      Respuesta en menos de 1 hora
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA - WhatsApp CTA */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200 text-center">

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                ¿Tienes Preguntas?
              </h3>
              <p className="text-slate-600 mb-6">
                Chatea con Abraham por WhatsApp y obtén respuestas inmediatas
              </p>

              {/* WhatsApp CTA Button */}
              <a
                href={getWhatsAppLink('Hola, tengo una pregunta sobre contenedores SMI')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full
                           bg-green-600 hover:bg-green-700
                           text-white text-lg font-semibold
                           px-8 py-4 rounded-lg
                           transition-colors duration-200
                           shadow-md hover:shadow-lg"
              >
                {/* WhatsApp Icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chatear Ahora
              </a>

              {/* Social Proof */}
              <p className="text-sm text-slate-500 mt-6">
                ⏱️ Respuesta en menos de 2 horas
              </p>
            </div>

            {/* Additional Info */}
            <p className="text-sm text-slate-500 text-center mt-4">
              También puedes llamarnos al {SMI_WHATSAPP_DISPLAY}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
