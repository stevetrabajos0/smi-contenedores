'use client';

import { useState, useEffect } from 'react';

interface GeneralContactFormProps {
  preSelectedService?: string;     // Pre-selecciona servicio (para modal desde páginas específicas)
  source: string;                  // Tracking: "homepage-ubicacion", "modal-homepage", etc.
  onSuccess?: () => void;          // Callback cuando envío exitoso (para cerrar modal)
}

interface FormData {
  nombre: string;              // Requerido, min 2 chars
  whatsapp: string;            // Requerido, 10 dígitos exactos
  servicioInteres: string;     // Requerido, dropdown con 4 opciones
  mensaje: string;             // Opcional, max 200 chars
}

export default function GeneralContactForm({
  preSelectedService,
  source,
  onSuccess
}: GeneralContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    whatsapp: '',
    servicioInteres: preSelectedService || '',
    mensaje: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Pre-seleccionar servicio si cambia el prop
  useEffect(() => {
    if (preSelectedService) {
      setFormData(prev => ({
        ...prev,
        servicioInteres: preSelectedService
      }));
    }
  }, [preSelectedService]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Limpiar error del campo cuando usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Nombre (mínimo 2 caracteres)
    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Ingresa tu nombre completo';
    }

    // WhatsApp (exactamente 10 dígitos después de limpiar)
    const cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length !== 10) {
      newErrors.whatsapp = 'Ingresa un número válido de 10 dígitos';
    }

    // Servicio de interés (requerido)
    if (!formData.servicioInteres) {
      newErrors.servicioInteres = 'Selecciona un servicio';
    }

    // Mensaje es OPCIONAL - no validar

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forms/general-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          whatsapp: formData.whatsapp.replace(/\D/g, ''), // Solo dígitos
          source: source  // Tracking de dónde vino
        })
      });

      if (!response.ok) throw new Error('Error al enviar');

      const data = await response.json();

      console.log('✅ Contacto general enviado:', data);

      setSubmitSuccess(true);

      // Limpiar form
      setFormData({
        nombre: '',
        whatsapp: '',
        servicioInteres: preSelectedService || '',
        mensaje: ''
      });

      // Callback para cerrar modal (si viene de modal)
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000); // Espera 2s para que vea success message
      }

      // Auto-reset después de 3 segundos
      setTimeout(() => setSubmitSuccess(false), 3000);

    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al enviar. Por favor intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full
                        flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-xl font-bold text-slate-900 mb-2">
          ¡Gracias por tu interés!
        </h4>
        <p className="text-slate-600">
          Te contactaremos por WhatsApp en menos de 2 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors
                     ${errors.nombre
                       ? 'border-red-300 focus:border-red-500'
                       : 'border-slate-300 focus:border-[#D32F2F]'
                     }
                     focus:outline-none focus:ring-0`}
          placeholder="Juan Pérez"
          disabled={isSubmitting}
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 mb-2">
          WhatsApp <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <input
            id="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => {
              // Solo permitir números
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                handleChange('whatsapp', value);
              }
            }}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors
                       ${errors.whatsapp
                         ? 'border-red-300 focus:border-red-500'
                         : 'border-slate-300 focus:border-[#D32F2F]'
                       }
                       focus:outline-none focus:ring-0`}
            placeholder="6621234567"
            disabled={isSubmitting}
          />
        </div>
        {errors.whatsapp && (
          <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
        )}
      </div>

      {/* Servicio de Interés */}
      <div>
        <label htmlFor="servicioInteres" className="block text-sm font-medium text-slate-700 mb-2">
          ¿Qué servicio te interesa? <span className="text-red-500">*</span>
        </label>
        <select
          id="servicioInteres"
          value={formData.servicioInteres}
          onChange={(e) => handleChange('servicioInteres', e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors
                     ${errors.servicioInteres
                       ? 'border-red-300 focus:border-red-500'
                       : 'border-slate-300 focus:border-[#D32F2F]'
                     }
                     focus:outline-none focus:ring-0 bg-white`}
          disabled={isSubmitting}
        >
          <option value="">Selecciona una opción</option>
          <option value="almacenamiento">Solo Almacenamiento</option>
          <option value="mudanza">Solo Mudanza</option>
          <option value="almacenamiento-mudanza">Almacenamiento y Mudanza (combo)</option>
          <option value="modelo-estandar">Oficinas y Casas Listas</option>
          <option value="proyecto-personalizado">Proyecto Personalizado</option>
          <option value="no-estoy-seguro">No estoy seguro / Quiero asesoría</option>
        </select>
        {errors.servicioInteres && (
          <p className="mt-1 text-sm text-red-600">{errors.servicioInteres}</p>
        )}
      </div>

      {/* Mensaje Opcional */}
      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-2">
          Mensaje (opcional)
        </label>
        <textarea
          id="mensaje"
          value={formData.mensaje}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              handleChange('mensaje', e.target.value);
            }
          }}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border-2 border-slate-300
                     focus:border-[#D32F2F] focus:outline-none focus:ring-0
                     transition-colors resize-none"
          placeholder="Cuéntanos brevemente sobre tu proyecto o necesidad..."
          disabled={isSubmitting}
        />
        <div className="mt-1 text-right">
          <span className={`text-xs ${formData.mensaje.length >= 200 ? 'text-red-600' : 'text-slate-500'}`}>
            {formData.mensaje.length}/200
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                   px-8 py-4 rounded-lg font-semibold text-lg
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
      </button>

      {/* Privacy Note */}
      <p className="text-xs text-slate-500 text-center">
        Al enviar aceptas que te contactemos por WhatsApp
      </p>

    </form>
  );
}
