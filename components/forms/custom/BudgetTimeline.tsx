'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';

interface BudgetTimelineProps {
  onNext: (data: {
    tiempoEntrega: string;
    presupuesto: string;
    necesitaFinanciamiento: string;
  }) => void;
  onChange?: (data: {
    tiempoEntrega: string;
    presupuesto: string;
    necesitaFinanciamiento: string;
  }) => void;
  initialData?: {
    tiempoEntrega?: string;
    presupuesto?: string;
    necesitaFinanciamiento?: string;
  };
}

const TIMELINE_OPTIONS = [
  { value: '1-3-meses', label: '1-3 meses', description: 'Lo antes posible' },
  { value: '3-6-meses', label: '3-6 meses', description: 'Plazo moderado' },
  { value: '6-12-meses', label: '6-12 meses', description: 'Sin prisa' },
  { value: 'mas-1-ano', label: 'Más de 1 año', description: 'Plazo flexible' },
];

const BUDGET_OPTIONS = [
  { value: '500k-1m', label: '$500,000 - $1,000,000' },
  { value: '1m-2m', label: '$1,000,000 - $2,000,000' },
  { value: '2m-5m', label: '$2,000,000 - $5,000,000' },
  { value: 'mas-5m', label: 'Más de $5,000,000' },
  { value: 'necesito-cotizacion', label: 'Necesito cotización primero' },
];

export default function BudgetTimeline({
  onNext,
  onChange,
  initialData,
}: BudgetTimelineProps) {
  const [formData, setFormData] = useState({
    tiempoEntrega: initialData?.tiempoEntrega || '',
    presupuesto: initialData?.presupuesto || '',
    necesitaFinanciamiento: initialData?.necesitaFinanciamiento || '',
  });
  const [errors, setErrors] = useState<{
    tiempoEntrega?: string;
    presupuesto?: string;
    necesitaFinanciamiento?: string;
  }>({});

  const handleSubmit = () => {
    const newErrors: {
      tiempoEntrega?: string;
      presupuesto?: string;
      necesitaFinanciamiento?: string;
    } = {};

    if (!formData.tiempoEntrega) {
      newErrors.tiempoEntrega = 'Selecciona un plazo de entrega';
    }

    if (!formData.presupuesto) {
      newErrors.presupuesto = 'Selecciona un rango de presupuesto';
    }

    if (!formData.necesitaFinanciamiento) {
      newErrors.necesitaFinanciamiento = 'Debes indicar si necesitas financiamiento';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData);
  };

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Notify parent of changes in real-time
    if (onChange) {
      onChange(updatedData);
    }

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">¿Cuándo te gustaría tenerlo listo?</h2>
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
        <h2 className="text-xl font-semibold mb-4">Presupuesto estimado</h2>
        <p className="text-sm text-gray-600 mb-4">
          Esto nos ayuda a diseñar una propuesta acorde a tus posibilidades
        </p>
        {errors.presupuesto && (
          <p className="text-sm text-red-600 mb-2">{errors.presupuesto}</p>
        )}
        <div className="space-y-3">
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

      {/* Necesita Financiamiento Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          ¿Necesitas financiamiento? <span className="text-red-500">*</span>
        </h2>
        {errors.necesitaFinanciamiento && (
          <p className="text-sm text-red-600 mb-2">{errors.necesitaFinanciamiento}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {/* Botón SÍ */}
          <button
            type="button"
            onClick={() => handleChange('necesitaFinanciamiento', 'si')}
            className={`
              px-6 py-3 rounded-lg text-base font-semibold
              transition-all border-2
              ${formData.necesitaFinanciamiento === 'si'
                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
            `}
          >
            Sí
          </button>

          {/* Botón NO */}
          <button
            type="button"
            onClick={() => handleChange('necesitaFinanciamiento', 'no')}
            className={`
              px-6 py-3 rounded-lg text-base font-semibold
              transition-all border-2
              ${formData.necesitaFinanciamiento === 'no'
                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
            `}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
