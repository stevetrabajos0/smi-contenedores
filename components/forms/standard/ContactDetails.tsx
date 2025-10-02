'use client';

import { useState } from 'react';
import PhoneField from '../inputs/PhoneField';
import PostalCodeField from '../inputs/PostalCodeField';

interface ContactDetailsProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function ContactDetails({
  onSubmit,
  initialData = {},
}: ContactDetailsProps) {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    empresa: initialData.empresa || '',
    whatsapp: initialData.whatsapp || '',
    correo: initialData.correo || '',
    codigoPostal: initialData.codigoPostal || '',
    comentarios: initialData.comentarios || '',
    tieneTerreno: initialData.tieneTerreno || '',
    necesitaFinanciamiento: initialData.necesitaFinanciamiento || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.whatsapp || formData.whatsapp.length !== 10) {
      newErrors.whatsapp = 'El WhatsApp debe tener 10 dígitos';
    }

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    if (!formData.codigoPostal || formData.codigoPostal.length !== 5) {
      newErrors.codigoPostal = 'El código postal debe tener 5 dígitos';
    }

    if (!formData.tieneTerreno) {
      newErrors.tieneTerreno = 'Indica si tienes terreno';
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
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
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
            className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
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
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            } focus:outline-none focus:ring-2`}
          />
          {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
        </div>

        <PostalCodeField
          label="Código Postal de Entrega"
          register={{
            name: 'codigoPostal',
            onChange: (e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 5);
              handleInputChange('codigoPostal', value);
            },
            onBlur: () => {},
            ref: () => {},
          }}
          error={errors.codigoPostal}
          placeholder="83000"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ¿Tienes terreno donde colocar el contenedor? <span className="text-red-500">*</span>
          </label>
          {errors.tieneTerreno && (
            <p className="text-sm text-red-600 mb-2">{errors.tieneTerreno}</p>
          )}
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="tieneTerreno"
                value="si"
                checked={formData.tieneTerreno === 'si'}
                onChange={(e) => handleInputChange('tieneTerreno', e.target.value)}
                className="mr-2"
              />
              Sí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tieneTerreno"
                value="no"
                checked={formData.tieneTerreno === 'no'}
                onChange={(e) => handleInputChange('tieneTerreno', e.target.value)}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comentarios <span className="text-gray-400">(Opcional)</span>
          </label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => handleInputChange('comentarios', e.target.value)}
            placeholder="Cuéntanos más sobre tu proyecto..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base transition-colors focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring-2"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="necesitaFinanciamiento"
            checked={formData.necesitaFinanciamiento}
            onChange={(e) => handleInputChange('necesitaFinanciamiento', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="necesitaFinanciamiento" className="ml-2 text-sm text-gray-700">
            Necesito información sobre financiamiento
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Enviar Cotización
      </button>
    </div>
  );
}
