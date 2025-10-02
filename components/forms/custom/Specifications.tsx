'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';
import PostalCodeField from '../inputs/PostalCodeField';

interface SpecificationsProps {
  onNext: (data: any) => void;
  initialData?: any;
}

const ROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '4+', label: '4+' },
];

const BATHROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '3+', label: '3+' },
];

const LAND_OPTIONS = [
  { value: 'si', label: 'Sí, tengo terreno', description: 'Ya cuento con el espacio' },
  { value: 'no', label: 'No tengo terreno', description: 'Aún no tengo donde colocarlo' },
  { value: 'asesoria', label: 'Necesito asesoría', description: 'Quiero ayuda para encontrar terreno' },
];

export default function Specifications({
  onNext,
  initialData = {},
}: SpecificationsProps) {
  const [formData, setFormData] = useState({
    habitaciones: initialData.habitaciones || '',
    banos: initialData.banos || '',
    metrosCuadrados: initialData.metrosCuadrados || '',
    tieneTerreno: initialData.tieneTerreno || '',
    codigoPostalTerreno: initialData.codigoPostalTerreno || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.habitaciones) {
      newErrors.habitaciones = 'Selecciona el número de habitaciones/oficinas';
    }

    if (!formData.banos) {
      newErrors.banos = 'Selecciona el número de baños';
    }

    if (!formData.metrosCuadrados) {
      newErrors.metrosCuadrados = 'Ingresa los metros cuadrados aproximados';
    }

    if (!formData.tieneTerreno) {
      newErrors.tieneTerreno = 'Indica si tienes terreno';
    }

    if (formData.tieneTerreno === 'si' && !formData.codigoPostalTerreno) {
      newErrors.codigoPostalTerreno = 'Ingresa el código postal del terreno';
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
      <h2 className="text-xl font-semibold">Especificaciones del Proyecto</h2>

      {/* Rooms/Offices */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Habitaciones/Oficinas <span className="text-red-500">*</span>
        </label>
        {errors.habitaciones && (
          <p className="text-sm text-red-600 mb-2">{errors.habitaciones}</p>
        )}
        <div className="flex gap-2">
          {ROOM_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange('habitaciones', option.value)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                formData.habitaciones === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de Baños <span className="text-red-500">*</span>
        </label>
        {errors.banos && (
          <p className="text-sm text-red-600 mb-2">{errors.banos}</p>
        )}
        <div className="flex gap-2">
          {BATHROOM_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange('banos', option.value)}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                formData.banos === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Square Meters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Metros Cuadrados Aproximados <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={formData.metrosCuadrados}
          onChange={(e) => handleChange('metrosCuadrados', e.target.value)}
          placeholder="Ej: 80"
          className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
            errors.metrosCuadrados
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } focus:outline-none focus:ring-2`}
        />
        {errors.metrosCuadrados && (
          <p className="mt-1 text-sm text-red-600">{errors.metrosCuadrados}</p>
        )}
      </div>

      {/* Land Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Tienes terreno? <span className="text-red-500">*</span>
        </label>
        {errors.tieneTerreno && (
          <p className="text-sm text-red-600 mb-2">{errors.tieneTerreno}</p>
        )}
        <div className="space-y-3">
          {LAND_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              selected={formData.tieneTerreno === option.value}
              onChange={(value) => handleChange('tieneTerreno', value)}
            />
          ))}
        </div>
      </div>

      {/* Conditional Postal Code */}
      {formData.tieneTerreno === 'si' && (
        <div>
          <PostalCodeField
            label="Código Postal del Terreno"
            register={{
              name: 'codigoPostalTerreno',
              onChange: (e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                handleChange('codigoPostalTerreno', value);
              },
              onBlur: () => {},
              ref: () => {},
            }}
            error={errors.codigoPostalTerreno}
            placeholder="83000"
            required
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}
