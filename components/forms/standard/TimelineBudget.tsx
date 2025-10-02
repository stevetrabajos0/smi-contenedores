'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';

interface TimelineBudgetProps {
  onNext: (data: { tiempoEntrega: string; presupuesto: string }) => void;
  initialData?: { tiempoEntrega?: string; presupuesto?: string };
}

const TIMELINE_OPTIONS = [
  { value: 'esta-semana', label: 'Esta semana', description: 'Entrega urgente' },
  { value: '2-4-semanas', label: '2-4 semanas', description: 'Plazo corto' },
  { value: '1-2-meses', label: '1-2 meses', description: 'Plazo estándar' },
  { value: 'mas-2-meses', label: 'Más de 2 meses', description: 'Sin prisa' },
];

const BUDGET_OPTIONS = [
  { value: 'menos-100k', label: 'Menos de $100,000' },
  { value: '100k-250k', label: '$100,000 - $250,000' },
  { value: '250k-500k', label: '$250,000 - $500,000' },
  { value: 'mas-500k', label: 'Más de $500,000' },
];

export default function TimelineBudget({
  onNext,
  initialData,
}: TimelineBudgetProps) {
  const [formData, setFormData] = useState({
    tiempoEntrega: initialData?.tiempoEntrega || '',
    presupuesto: initialData?.presupuesto || '',
  });
  const [errors, setErrors] = useState<{ tiempoEntrega?: string; presupuesto?: string }>({});

  const handleSubmit = () => {
    const newErrors: { tiempoEntrega?: string; presupuesto?: string } = {};

    if (!formData.tiempoEntrega) {
      newErrors.tiempoEntrega = 'Selecciona un tiempo de entrega';
    }

    if (!formData.presupuesto) {
      newErrors.presupuesto = 'Selecciona un rango de presupuesto';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">¿Para cuándo lo necesitas?</h2>
        {errors.tiempoEntrega && (
          <p className="text-sm text-red-600 mb-2">{errors.tiempoEntrega}</p>
        )}
        <div className="space-y-3">
          {TIMELINE_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              selected={formData.tiempoEntrega === option.value}
              onChange={(value) => handleChange('tiempoEntrega', value)}
            />
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Presupuesto aproximado</h2>
        <p className="text-sm text-gray-600 mb-4">
          Esto nos ayuda a ofrecerte las mejores opciones
        </p>
        {errors.presupuesto && (
          <p className="text-sm text-red-600 mb-2">{errors.presupuesto}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BUDGET_OPTIONS.map((option) => (
            <RadioCard
              key={option.value}
              value={option.value}
              label={option.label}
              selected={formData.presupuesto === option.value}
              onChange={(value) => handleChange('presupuesto', value)}
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
