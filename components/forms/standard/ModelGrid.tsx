'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';

interface ModelGridProps {
  onNext: (data: { modeloSeleccionado: string }) => void;
  initialData?: { modeloSeleccionado?: string };
}

const MODELS = [
  {
    value: 'oficina-ejecutiva-20ft',
    label: 'Oficina Ejecutiva 20ft',
    description: 'Espacio ideal para oficina individual o pequeño equipo',
    price: '$120,000',
    image: '',
  },
  {
    value: 'oficina-premium-40ft',
    label: 'Oficina Premium 40ft',
    description: 'Oficina amplia con acabados de lujo y baño integrado',
    price: '$250,000',
    image: '',
  },
  {
    value: 'bodega-industrial-40ft',
    label: 'Bodega Industrial 40ft',
    description: 'Almacén robusto con puertas dobles y rampa',
    price: '$85,000',
    image: '',
  },
  {
    value: 'vivienda-basica-20ft',
    label: 'Vivienda Básica 20ft',
    description: 'Espacio habitable compacto con cocina y baño',
    price: '$180,000',
    image: '',
  },
  {
    value: 'vivienda-premium-40ft',
    label: 'Vivienda Premium 40ft',
    description: 'Casa contenedor de lujo con 2 habitaciones',
    price: '$350,000',
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
        className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}
