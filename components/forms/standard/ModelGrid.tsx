'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';
import { PRECIOS_BASE_MODELOS, formatMXN } from '@/lib/constants/pricing';

interface ModelGridProps {
  onNext: (data: { modeloSeleccionado: string }) => void;
  initialData?: { modeloSeleccionado?: string };
}

const MODELS = [
  {
    value: '10-pies',
    label: 'Modelo 10 Pies',
    description: 'Contenedor de 10 pies ideal para oficina individual o pequeño almacén (7m²)',
    price: formatMXN(PRECIOS_BASE_MODELOS['10']),
    image: '',
  },
  {
    value: '20-pies',
    label: 'Modelo 20 Pies',
    description: 'Espacio versátil para oficina, vivienda pequeña o bodega (14m²)',
    price: formatMXN(PRECIOS_BASE_MODELOS['20']),
    image: '',
  },
  {
    value: '40-pies',
    label: 'Modelo 40 Pies',
    description: 'Espacio amplio para vivienda, oficina grande o comercio (30m²)',
    price: formatMXN(PRECIOS_BASE_MODELOS['40']),
    image: '',
  },
  {
    value: 'personalizado',
    label: 'Proyecto Personalizado',
    description: 'Diseño único adaptado a tus necesidades específicas',
    price: 'Cotización',
    image: '',
  },
];

export default function ModelGrid({
  onNext,
  initialData,
}: ModelGridProps) {
  const [selectedModel, setSelectedModel] = useState(initialData?.modeloSeleccionado || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedModel) {
      setError('Selecciona un modelo');
      return;
    }

    // If personalizado is selected, redirect to custom flow
    if (selectedModel === 'personalizado') {
      window.location.href = '/cotizar/personalizado';
      return;
    }

    onNext({ modeloSeleccionado: selectedModel });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">¿Qué modelo te interesa?</h2>
        <p className="text-gray-600 mb-6">
          Selecciona el modelo que mejor se adapte a tus necesidades
        </p>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODELS.map((model) => (
            <RadioCard
              key={model.value}
              value={model.value}
              label={model.label}
              description={model.description}
              price={model.price}
              image={model.image}
              selected={selectedModel === model.value}
              onChange={(value) => {
                setSelectedModel(value);
                if (error) setError('');
              }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-auto px-8 py-3 bg-[#D32F2F] text-white rounded-lg font-semibold hover:bg-[#B71C1C] transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}
