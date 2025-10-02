'use client';

import { useState } from 'react';
import PhoneField from '../inputs/PhoneField';

interface InspirationProps {
  onNext: (data: any) => void;
  onSkip: () => void;
  initialData?: any;
}

export default function Inspiration({
  onNext,
  onSkip,
  initialData = {},
}: InspirationProps) {
  const [formData, setFormData] = useState({
    descripcion: initialData.descripcion || '',
    archivosInspiracion: initialData.archivosInspiracion || '',
    nombre: initialData.nombre || '',
    empresa: initialData.empresa || '',
    whatsapp: initialData.whatsapp || '',
    correo: initialData.correo || '',
    necesitaFinanciamiento: initialData.necesitaFinanciamiento || '',
    mejorHorarioContacto: initialData.mejorHorarioContacto || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.descripcion || formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.whatsapp || formData.whatsapp.length !== 10) {
      newErrors.whatsapp = 'El WhatsApp debe tener 10 dígitos';
    }

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    if (!formData.necesitaFinanciamiento) {
      newErrors.necesitaFinanciamiento = 'Indica si necesitas financiamiento';
    }

    if (!formData.mejorHorarioContacto) {
      newErrors.mejorHorarioContacto = 'Selecciona el mejor horario de contacto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Cuéntanos más sobre tu proyecto</h2>
        <p className="text-gray-600 mb-4">
          Describe tu visión y comparte referencias que te inspiren
        </p>
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción del Proyecto <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          placeholder="Describe tu proyecto: ¿Qué uso tendrá? ¿Qué estilo buscas? ¿Qué características especiales necesitas?"
          rows={6}
          className={`w-full px-4 py-2.5 rounded-lg border text-base transition-colors ${
            errors.descripcion
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } focus:outline-none focus:ring-2`}
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
        )}
      </div>

      {/* File Upload - Placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imágenes de Inspiración <span className="text-gray-400">(Opcional)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Arrastra imágenes aquí o haz clic para seleccionar
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG hasta 10MB (próximamente)
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Necesitas financiamiento? <span className="text-red-500">*</span>
            </label>
            {errors.necesitaFinanciamiento && (
              <p className="text-sm text-red-600 mb-2">{errors.necesitaFinanciamiento}</p>
            )}
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="necesitaFinanciamiento"
                  value="si"
                  checked={formData.necesitaFinanciamiento === 'si'}
                  onChange={(e) => handleInputChange('necesitaFinanciamiento', e.target.value)}
                  className="mr-2"
                />
                Sí
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="necesitaFinanciamiento"
                  value="no"
                  checked={formData.necesitaFinanciamiento === 'no'}
                  onChange={(e) => handleInputChange('necesitaFinanciamiento', e.target.value)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mejor Horario de Contacto <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.mejorHorarioContacto}
              onChange={(e) => handleInputChange('mejorHorarioContacto', e.target.value)}
              className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
                errors.mejorHorarioContacto
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            >
              <option value="">Selecciona un horario</option>
              <option value="manana">Mañana (9am - 12pm)</option>
              <option value="tarde">Tarde (12pm - 6pm)</option>
              <option value="noche">Noche (6pm - 9pm)</option>
              <option value="cualquiera">Cualquier horario</option>
            </select>
            {errors.mejorHorarioContacto && (
              <p className="mt-1 text-sm text-red-600">{errors.mejorHorarioContacto}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSkip}
          className="flex-1 sm:flex-none px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Saltar este paso
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 sm:flex-none px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Enviar Cotización
        </button>
      </div>
    </div>
  );
}
