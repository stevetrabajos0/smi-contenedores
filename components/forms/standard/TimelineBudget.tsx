'use client';

import { useState } from 'react';
import RadioCard from '../inputs/RadioCard';
import PostalCodeField from '../inputs/PostalCodeField';

interface TimelineBudgetProps {
  onNext: (data: {
    tiempoEntrega: string;
    tipoBano: string;
    cocina: boolean;
    tieneTerreno: string;
    codigoPostalTerreno?: string;
    necesitaFinanciamiento: boolean;
    comentarios?: string;
  }) => void;
  onChange?: (data: {
    tipoBano: string;
    cocina: boolean;
  }) => void;
  initialData?: {
    tiempoEntrega?: string;
    tipoBano?: string;
    cocina?: boolean;
    tieneTerreno?: string;
    codigoPostalTerreno?: string;
    necesitaFinanciamiento?: boolean;
    comentarios?: string;
  };
}

const TIMELINE_OPTIONS = [
  { value: 'esta-semana', label: 'Esta semana', description: 'Entrega urgente' },
  { value: '2-4-semanas', label: '2-4 semanas', description: 'Plazo corto' },
  { value: '1-2-meses', label: '1-2 meses', description: 'Plazo estándar' },
  { value: 'mas-2-meses', label: 'Más de 2 meses', description: 'Sin prisa' },
];

export default function TimelineBudget({
  onNext,
  onChange,
  initialData,
}: TimelineBudgetProps) {
  const [formData, setFormData] = useState({
    tiempoEntrega: initialData?.tiempoEntrega || '',
    tipoBano: initialData?.tipoBano || 'ninguno',
    cocina: initialData?.cocina ?? false,
    tieneTerreno: initialData?.tieneTerreno || '',
    codigoPostalTerreno: initialData?.codigoPostalTerreno || '',
    necesitaFinanciamiento: initialData?.necesitaFinanciamiento ?? null,
    comentarios: initialData?.comentarios || '',
  });
  const [errors, setErrors] = useState<{
    tiempoEntrega?: string;
    tipoBano?: string;
    tieneTerreno?: string;
    codigoPostalTerreno?: string;
    necesitaFinanciamiento?: string;
  }>({});

  const handleSubmit = () => {
    const newErrors: {
      tiempoEntrega?: string;
      tieneTerreno?: string;
      codigoPostalTerreno?: string;
      necesitaFinanciamiento?: string;
    } = {};

    if (!formData.tiempoEntrega) {
      newErrors.tiempoEntrega = 'Selecciona un tiempo de entrega';
    }

    if (!formData.tieneTerreno) {
      newErrors.tieneTerreno = 'Debes indicar si tienes terreno';
    }

    // Validación condicional de código postal del terreno
    if (formData.tieneTerreno === 'si') {
      if (!formData.codigoPostalTerreno || formData.codigoPostalTerreno.length !== 5) {
        newErrors.codigoPostalTerreno = 'Ingresa un código postal válido de 5 dígitos';
      } else if (!/^\d{5}$/.test(formData.codigoPostalTerreno)) {
        newErrors.codigoPostalTerreno = 'El código postal debe contener solo números';
      }
    }

    // Validación de financiamiento (requerido)
    if (formData.necesitaFinanciamiento === null || formData.necesitaFinanciamiento === undefined) {
      newErrors.necesitaFinanciamiento = 'Debes indicar si necesitas financiamiento';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      tiempoEntrega: formData.tiempoEntrega,
      tipoBano: formData.tipoBano,
      cocina: formData.cocina,
      tieneTerreno: formData.tieneTerreno,
      codigoPostalTerreno: formData.codigoPostalTerreno,
      necesitaFinanciamiento: formData.necesitaFinanciamiento ?? false,
      comentarios: formData.comentarios,
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Notify parent of pricing-related changes for real-time sidebar updates
    if ((field === 'tipoBano' || field === 'cocina') && onChange) {
      onChange({
        tipoBano: field === 'tipoBano' ? String(value) : updatedData.tipoBano,
        cocina: field === 'cocina' ? Boolean(value) : updatedData.cocina,
      });
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

      {/* Tipo de Baño Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          ¿Qué tipo de baño necesitas? <span className="text-red-500">*</span>
        </h2>
        {errors.tipoBano && (
          <p className="text-sm text-red-600 mb-2">{errors.tipoBano}</p>
        )}
        <div className="space-y-3">
          {/* Ninguno */}
          <button
            type="button"
            onClick={() => handleChange('tipoBano', 'ninguno')}
            className={`
              w-full px-6 py-4 rounded-lg text-left
              transition-all border-2
              ${formData.tipoBano === 'ninguno'
                ? 'border-[#D32F2F] bg-[#FFEBEE] text-slate-900'
                : 'border-gray-300 bg-white hover:border-gray-400'}
            `}
          >
            <div className="font-semibold text-base">Ninguno</div>
            <div className="text-sm text-slate-600">Sin instalaciones sanitarias</div>
          </button>

          {/* Baño Simple */}
          <button
            type="button"
            onClick={() => handleChange('tipoBano', 'simple')}
            className={`
              w-full px-6 py-4 rounded-lg text-left
              transition-all border-2
              ${formData.tipoBano === 'simple'
                ? 'border-[#D32F2F] bg-[#FFEBEE] text-slate-900'
                : 'border-gray-300 bg-white hover:border-gray-400'}
            `}
          >
            <div className="font-semibold text-base flex items-center justify-between">
              <span>Baño Simple</span>
              <span className="text-[#D32F2F] font-bold">+$15,000</span>
            </div>
            <div className="text-sm text-slate-600">WC + lavabo</div>
          </button>

          {/* Baño Completo */}
          <button
            type="button"
            onClick={() => handleChange('tipoBano', 'completo')}
            className={`
              w-full px-6 py-4 rounded-lg text-left
              transition-all border-2
              ${formData.tipoBano === 'completo'
                ? 'border-[#D32F2F] bg-[#FFEBEE] text-slate-900'
                : 'border-gray-300 bg-white hover:border-gray-400'}
            `}
          >
            <div className="font-semibold text-base flex items-center justify-between">
              <span>Baño Completo</span>
              <span className="text-[#D32F2F] font-bold">+$30,000</span>
            </div>
            <div className="text-sm text-slate-600">WC + lavabo + regadera</div>
          </button>
        </div>
      </div>

      {/* Cocina Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Extras opcionales</h2>
        <label
          className={`
            flex items-start gap-4 px-6 py-4 rounded-lg cursor-pointer
            transition-all border-2
            ${formData.cocina
              ? 'border-[#D32F2F] bg-[#FFEBEE]'
              : 'border-gray-300 bg-white hover:border-gray-400'}
          `}
        >
          <input
            type="checkbox"
            checked={formData.cocina}
            onChange={(e) => handleChange('cocina', e.target.checked)}
            className="mt-1 w-5 h-5 text-[#D32F2F] border-gray-300 rounded focus:ring-[#D32F2F]"
          />
          <div className="flex-1">
            <div className="font-semibold text-base flex items-center justify-between">
              <span>Cocina Completa</span>
              <span className="text-[#D32F2F] font-bold">+$13,000</span>
            </div>
            <div className="text-sm text-slate-600">Tarja + alacenas + instalación</div>
          </div>
        </label>
      </div>

      {/* Tienes Terreno Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          ¿Ya tienes terreno? <span className="text-red-500">*</span>
        </h2>
        {errors.tieneTerreno && (
          <p className="text-sm text-red-600 mb-2">{errors.tieneTerreno}</p>
        )}
        <div className="grid grid-cols-2 gap-3">
          {/* Botón SÍ */}
          <button
            type="button"
            onClick={() => handleChange('tieneTerreno', 'si')}
            className={`
              px-6 py-3 rounded-lg text-base font-semibold
              transition-all border-2
              ${formData.tieneTerreno === 'si'
                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
            `}
          >
            Sí
          </button>

          {/* Botón NO */}
          <button
            type="button"
            onClick={() => handleChange('tieneTerreno', 'no')}
            className={`
              px-6 py-3 rounded-lg text-base font-semibold
              transition-all border-2
              ${formData.tieneTerreno === 'no'
                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
            `}
          >
            No
          </button>
        </div>
      </div>

      {/* Código Postal del Terreno (condicional) */}
      {formData.tieneTerreno === 'si' && (
        <PostalCodeField
          name="codigoPostalTerreno"
          label="¿Dónde está tu terreno?"
          value={formData.codigoPostalTerreno}
          onChange={(value) => handleChange('codigoPostalTerreno', value)}
          error={errors.codigoPostalTerreno}
          placeholder="12345"
          required
        />
      )}

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
            onClick={() => handleChange('necesitaFinanciamiento', true)}
            className={`
              px-6 py-3 rounded-lg text-base font-semibold
              transition-all border-2
              ${formData.necesitaFinanciamiento === true
                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
            `}
          >
            Sí
          </button>

          {/* Botón NO */}
          <button
            type="button"
            onClick={() => handleChange('necesitaFinanciamiento', false)}
            className={`
              px-6 py-3 rounded-lg text-base font-semibold
              transition-all border-2
              ${formData.necesitaFinanciamiento === false
                ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
            `}
          >
            No
          </button>
        </div>
      </div>

      {/* Comentarios - Campo movido desde Step 3 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ¿Necesitas algo especial en tu contenedor? <span className="text-gray-400">(Opcional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Ejemplo: ventanas más grandes, color específico, puerta reforzada, instalaciones especiales, etc.
        </p>
        <textarea
          name="comentarios"
          value={formData.comentarios}
          onChange={(e) => handleChange('comentarios', e.target.value)}
          placeholder="Describe cualquier requerimiento especial..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
        />
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
