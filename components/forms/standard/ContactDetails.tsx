'use client';

import { useState } from 'react';
import PhoneField from '../inputs/PhoneField';

interface ContactDetailsProps {
  onSubmit: (data: any) => void;
  onChange?: (data: any) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

export default function ContactDetails({
  onSubmit,
  onChange,
  initialData = {},
  isSubmitting = false,
}: ContactDetailsProps) {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    empresa: initialData.empresa || '',
    whatsapp: initialData.whatsapp || '',
    correo: initialData.correo || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Notificar al parent inmediatamente para persistencia en tiempo real
    if (onChange) {
      onChange(updated);
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const cleanWhatsapp = formData.whatsapp.replace(/\s/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length !== 10) {
      newErrors.whatsapp = 'El WhatsApp debe tener 10 dígitos';
    }

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Información de Contacto</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            placeholder="Tu nombre"
            className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
              errors.nombre
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]'
            } focus:outline-none focus:ring-2`}
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empresa <span className="text-gray-400">(Opcional)</span>
          </label>
          <input
            type="text"
            value={formData.empresa}
            onChange={(e) => handleInputChange('empresa', e.target.value)}
            placeholder="Nombre de tu empresa"
            className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
          />
        </div>

        <PhoneField
          label="WhatsApp"
          register={{
            name: 'whatsapp',
            onChange: (e) => handleInputChange('whatsapp', e.target.value),
            onBlur: () => {},
            ref: () => {},
          }}
          error={errors.whatsapp}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.correo}
            onChange={(e) => handleInputChange('correo', e.target.value)}
            placeholder="tu@email.com"
            className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
              errors.correo
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]'
            } focus:outline-none focus:ring-2`}
          />
          {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full sm:w-auto px-8 py-3 bg-[#D32F2F] text-white rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Enviando...
          </>
        ) : (
          'Enviar Cotización'
        )}
      </button>
    </div>
  );
}
