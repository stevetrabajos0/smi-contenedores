'use client';

import { CheckCircle2, Calendar, Phone, MessageCircle } from 'lucide-react';

interface SuccessInlineProps {
  projectType: string;
  showPricing?: boolean;
  estimatedPrice?: string;
  // trackingCode still generated on backend but not displayed to users
  trackingCode?: string;
}

export default function SuccessInline({
  projectType,
  showPricing = false,
  estimatedPrice,
}: SuccessInlineProps) {
  const handleWhatsAppClick = () => {
    const message = `Hola, acabo de enviar una cotización para ${projectType}. Me gustaría recibir más información.`;
    const whatsappUrl = `https://wa.me/5216621030059?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const timeline = [
    {
      time: '1-2 días',
      title: 'Revisión inicial',
      description: 'Analizamos tu solicitud y requisitos específicos',
    },
    {
      time: '3-5 días',
      title: 'Cotización detallada',
      description: 'Te enviamos propuesta completa con precios y plazos',
    },
    {
      time: '5-7 días',
      title: 'Ajustes y firma',
      description: 'Refinamos detalles y formalizamos el proyecto',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          ¡Cotización Enviada con Éxito!
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-2">
          Hemos recibido tu solicitud para {projectType}
        </p>
        <p className="text-gray-600">
          Te contactaremos en las próximas 24 horas para darte seguimiento personalizado.
        </p>
      </div>

      {/* Optional Pricing Summary */}
      {showPricing && estimatedPrice && (
        <div className="bg-[#FFEBEE] border-2 border-[#D32F2F] rounded-xl p-6 mb-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Precio Estimado
            </p>
            <p className="text-3xl font-bold text-[#D32F2F]">
              {estimatedPrice}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              *Precio sujeto a confirmación según especificaciones finales
            </p>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#D32F2F]" />
          Próximos Pasos
        </h2>
        <div className="space-y-4">
          {timeline.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-[#D32F2F] text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 mt-2" />
                )}
              </div>
              <div className="pb-4 flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-[#D32F2F]">
                    {step.time}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {step.title}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA - Primary Action */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              ¿Tienes dudas? ¡Contáctanos ahora!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Escríbenos por WhatsApp
            </p>
            <button
              onClick={handleWhatsAppClick}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Chatear por WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600 mb-3">
          También puedes contactarnos por teléfono
        </p>
        <a
          href="tel:+526621030059"
          className="inline-flex items-center gap-2 text-lg font-semibold text-[#D32F2F] hover:text-[#B71C1C] transition-colors"
        >
          <Phone className="w-5 h-5" />
          (662) 103-0059
        </a>
      </div>
    </div>
  );
}
