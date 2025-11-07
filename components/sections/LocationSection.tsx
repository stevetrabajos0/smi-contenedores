'use client';

import GeneralContactForm from '@/components/forms/GeneralContactForm';
import { SMI_WHATSAPP_URL, SMI_WHATSAPP_DISPLAY } from '@/lib/constants';

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

            {/* Google Maps Embed */}
            <div className="aspect-[4/3] rounded-2xl overflow-hidden
                            border-2 border-slate-200 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3470.123!2d-110.9553!3d29.0892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDA1JzIxLjEiTiAxMTDCsDU3JzE5LjEiVw!5e0!3m2!1ses!2smx!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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

          {/* COLUMNA DERECHA - Form de Contacto General */}
          <div>
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">

              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                ¿Tienes Dudas?
              </h3>
              <p className="text-slate-600 mb-6">
                Déjanos tus datos y te contactamos en menos de 2 horas
                para resolver todas tus preguntas.
              </p>

              {/* GeneralContactForm - USO INLINE */}
              <GeneralContactForm
                source="homepage-ubicacion"
              />

            </div>

            {/* Trust badge */}
            <p className="text-sm text-slate-500 text-center mt-4">
              🔒 Tus datos están protegidos y no serán compartidos
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
