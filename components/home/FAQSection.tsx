'use client';

import { useState } from 'react';

// Type-safe data structure
interface FAQ {
  id: number;
  pregunta: string;
  respuesta: string;
}

// 6 FAQs críticos - extraídos del documento oficial
const FAQS: FAQ[] = [
  {
    id: 1,
    pregunta: '¿Entregan fuera de Hermosillo?',
    respuesta: 'Sí, entregamos en toda Sonora y nivel nacional. En Hermosillo el transporte es GRATIS. Fuera de Hermosillo cobramos $60/km desde nuestro taller. Cubrimos 21 ciudades principales en Sonora.'
  },
  {
    id: 2,
    pregunta: '¿Cuánto tiempo tarda la construcción?',
    respuesta: 'Depende del proyecto: Almacenamiento (1-3 días), Modelos Estándar (2-6 semanas), Proyectos Personalizados (8-16 semanas). Te damos timeline exacto al cotizar.'
  },
  {
    id: 3,
    pregunta: '¿Necesito permisos de construcción?',
    respuesta: 'Depende de tu municipio. En Hermosillo, contenedores temporales (almacenamiento) generalmente NO requieren permiso. Para modelos habitables o comerciales, recomendamos consultar con tu municipio. Nosotros te asesoramos.'
  },
  {
    id: 4,
    pregunta: '¿Ustedes instalan el contenedor o solo lo entregan?',
    respuesta: 'Nosotros ENTREGAMOS en tu ubicación (gratis en Hermosillo). La instalación en sitio (anclaje, conexiones) corre por tu cuenta. Para almacenamiento, solo lo dejamos. Para modelos, tú contratas conexión eléctrica/agua. Te recomendamos proveedores si necesitas.'
  },
  {
    id: 5,
    pregunta: '¿Puedo visitar el taller antes de comprar?',
    respuesta: '¡Claro! Estamos en Hermosillo, Sonora. Puedes ver contenedores reales, proyectos en construcción y hablar con nuestro equipo. Horario: L-V 8am-6pm, S 8am-2pm. Agenda tu visita por WhatsApp: 662-103-0059'
  },
  {
    id: 6,
    pregunta: '¿Tienen financiamiento y aceptan pagos parciales?',
    respuesta: 'No ofrecemos financiamiento externo (bancario) actualmente. SÍ aceptamos pagos en parcialidades según el servicio: Almacenamiento (pago mensual), Modelos Estándar (50% anticipo + 50% entrega), Proyectos Custom (40/30/20/10 por avances de obra).'
  }
];

// Componente individual FAQ con accordion
function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                   hover:bg-slate-50 transition-all duration-200 rounded-xl"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
          {faq.pregunta}
        </h3>

        {/* Icono mejorado con background circular */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                        flex items-center justify-center
                        group-hover:bg-[#D32F2F] transition-colors duration-200">
          <svg
            className={`w-5 h-5 text-slate-600 group-hover:text-white
                        transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Respuesta expandible */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-8' : 'max-h-0'
        }`}
      >
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
          {faq.respuesta}
        </p>
      </div>
    </div>
  );
}

// Componente principal
export default function FAQSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-slate-600">
            Resolvemos las dudas más comunes
          </p>
        </div>

        {/* Accordion de 6 FAQs con mejor spacing */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg divide-y divide-slate-200 overflow-hidden">
          {FAQS.map((faq) => (
            <FAQItem key={faq.id} faq={faq} />
          ))}
        </div>

        {/* CTA WhatsApp mejorado */}
        <div className="text-center mt-16 pt-12 border-t border-slate-200">
          <p className="text-lg text-slate-600 mb-8">
            ¿Tienes más preguntas?
          </p>
          <a
            href="https://wa.me/5216621030059"
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
  );
}
