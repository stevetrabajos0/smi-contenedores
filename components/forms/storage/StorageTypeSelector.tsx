'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';
import PostalCodeField from '../inputs/PostalCodeField';
import { isValidPostalCode, getPostalCodeError } from '@/lib/validations/postal-codes';

interface StorageTypeSelectorProps {
  onNext: (data: { tipoServicio: string; codigoPostal: string }) => void;
  initialData?: { tipoServicio?: string; codigoPostal?: string };
}

const SERVICE_OPTIONS = [
  {
    value: 'mudanza',
    label: 'Solo Mudanza',
    description: 'Necesito mover mis pertenencias a una nueva ubicación',
  },
  {
    value: 'almacenamiento',
    label: 'Solo Almacenamiento',
    description: 'Necesito espacio para guardar mis pertenencias',
  },
  {
    value: 'ambos',
    label: 'Mudanza + Almacenamiento',
    description: 'Necesito moverme y almacenar temporalmente',
  },
];

export default function StorageTypeSelector({
  onNext,
  initialData,
}: StorageTypeSelectorProps) {
  const [tipoServicio, setTipoServicio] = useState(initialData?.tipoServicio || '');
  const [codigoPostal, setCodigoPostal] = useState(initialData?.codigoPostal || '');
  const [errors, setErrors] = useState<{ tipoServicio?: string; codigoPostal?: string }>({});

  const handleSubmit = () => {
    const newErrors: { tipoServicio?: string; codigoPostal?: string } = {};

    if (!tipoServicio) {
      newErrors.tipoServicio = 'Selecciona el tipo de servicio';
    }

    const postalError = getPostalCodeError(codigoPostal);
    if (postalError) {
      newErrors.codigoPostal = postalError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({ tipoServicio, codigoPostal });
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setCodigoPostal(value);

    // Clear error when user starts typing
    if (errors.codigoPostal) {
      setErrors({ ...errors, codigoPostal: undefined });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">¿Qué servicio necesitas?</h2>
        {errors.tipoServicio && (
          <p className="text-sm text-red-600 mb-2">{errors.tipoServicio}</p>
        )}
        <div className="space-y-3">
          {SERVICE_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              selected={tipoServicio === option.value}
              onChange={(value) => {
                setTipoServicio(value);
                if (errors.tipoServicio) {
                  setErrors({ ...errors, tipoServicio: undefined });
                }
              }}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Código Postal</h2>
        <div className="max-w-xs">
          <PostalCodeField
            label="Código Postal"
            register={{
              name: 'codigoPostal',
              onChange: handlePostalCodeChange,
              onBlur: () => {},
              ref: () => {},
            }}
            error={errors.codigoPostal}
            placeholder="83000"
            required
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Comenzar Cotización
      </button>
    </div>
  );
}
