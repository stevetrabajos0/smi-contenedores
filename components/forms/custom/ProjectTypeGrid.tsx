'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';

interface ProjectTypeGridProps {
  onNext: (data: { tipoProyecto: string }) => void;
  initialData?: { tipoProyecto?: string };
}

const PROJECT_TYPES = [
  {
    value: 'casa-cabana',
    label: 'Casa/Cabaña',
    description: 'Vivienda residencial o casa de descanso con contenedores',
    image: '',
  },
  {
    value: 'oficinas-corporativas',
    label: 'Oficinas Corporativas',
    description: 'Espacios de trabajo modernos y funcionales',
    image: '',
  },
  {
    value: 'local-comercial',
    label: 'Local Comercial',
    description: 'Tienda, restaurante, showroom o espacio comercial',
    image: '',
  },
  {
    value: 'proyecto-especial',
    label: 'Proyecto Especial',
    description: 'Hotel, centro educativo, clínica u otro proyecto único',
    image: '',
  },
];

export default function ProjectTypeGrid({
  onNext,
  initialData,
}: ProjectTypeGridProps) {
  const [selectedType, setSelectedType] = useState(initialData?.tipoProyecto || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!selectedType) {
      setError('Selecciona el tipo de proyecto');
      return;
    }

    onNext({ tipoProyecto: selectedType });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">¿Qué tipo de proyecto tienes en mente?</h2>
        <p className="text-gray-600 mb-6">
          Selecciona la opción que mejor describe tu proyecto personalizado
        </p>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROJECT_TYPES.map((type) => (
            <RadioCard
              key={type.value}
              value={type.value}
              label={type.label}
              description={type.description}
              image={type.image}
              selected={selectedType === type.value}
              onChange={(value) => {
                setSelectedType(value);
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
