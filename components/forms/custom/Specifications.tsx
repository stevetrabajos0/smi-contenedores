'use client';

import { useState } from 'react';

interface SpecificationsProps {
  onNext: (data: any) => void;
  onChange?: (data: any) => void;
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

export default function Specifications({
  onNext,
  onChange,
  initialData = {},
}: SpecificationsProps) {
  // Get tipoProyecto from parent to determine which fields to show
  const tipoProyecto = initialData.tipoProyecto || '';

  const [formData, setFormData] = useState({
    habitaciones: initialData.habitaciones || '',
    banos: initialData.banos || '',
    metrosCuadrados: initialData.metrosCuadrados || '',
    tipoNegocio: initialData.tipoNegocio || '',
    numeroEmpleados: initialData.numeroEmpleados || '',
    descripcion: initialData.descripcion || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Notify parent of changes in real-time
    if (onChange) {
      onChange(updatedData);
    }

    // Clear error for field being changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Conditional validation based on tipoProyecto
    const isCasa = tipoProyecto === 'casa-cabana';
    const isOficinas = tipoProyecto === 'oficinas-corporativas';
    const isLocal = tipoProyecto === 'local-comercial';
    const isEspecial = tipoProyecto === 'proyecto-especial';

    // ============================================
    // UNIVERSAL FIELDS (ALL TYPES)
    // ============================================

    // Metros Cuadrados (required for all types)
    if (!formData.metrosCuadrados || formData.metrosCuadrados.trim() === '') {
      newErrors.metrosCuadrados = 'Ingresa los metros cuadrados aproximados';
    } else {
      const metros = parseFloat(formData.metrosCuadrados);
      // Validate minimum by type
      if (isCasa) {
        if (isNaN(metros) || metros < 10) {
          newErrors.metrosCuadrados = 'Para casa/cabaña se requieren mínimo 10 m²';
        }
      } else if (isOficinas) {
        if (isNaN(metros) || metros < 20) {
          newErrors.metrosCuadrados = 'Para oficinas corporativas se requieren mínimo 20 m²';
        }
      } else if (isLocal) {
        if (isNaN(metros) || metros < 15) {
          newErrors.metrosCuadrados = 'Para local comercial se requieren mínimo 15 m²';
        }
      } else {
        // Proyecto especial - just needs to be valid number
        if (isNaN(metros) || metros <= 0) {
          newErrors.metrosCuadrados = 'Los metros cuadrados deben ser un número válido mayor a 0';
        }
      }
    }

    // Descripción (required for all types, different minimums)
    if (!formData.descripcion || formData.descripcion.trim() === '') {
      newErrors.descripcion = 'La descripción del proyecto es requerida';
    } else {
      const minLength = isEspecial ? 50 : 10;
      if (formData.descripcion.trim().length < minLength) {
        newErrors.descripcion = `La descripción debe tener al menos ${minLength} caracteres${isEspecial ? ' para proyectos especiales' : ''}`;
      }
    }

    // ============================================
    // CONDITIONAL FIELDS BY TYPE
    // ============================================

    // CASA/CABAÑA: habitaciones + baños REQUIRED
    if (isCasa) {
      if (!formData.habitaciones) {
        newErrors.habitaciones = 'Selecciona el número de habitaciones';
      }
      if (!formData.banos) {
        newErrors.banos = 'Selecciona el número de baños';
      }
    }

    // LOCAL COMERCIAL: tipoNegocio REQUIRED
    if (isLocal) {
      if (!formData.tipoNegocio || formData.tipoNegocio.trim() === '') {
        newErrors.tipoNegocio = 'Ingresa el tipo de negocio';
      }
    }

    // OFICINAS: numeroEmpleados is optional, no validation needed
    // PROYECTO ESPECIAL: Only universal fields (m² and descripción already validated above)

    // terreno y CP ya fueron validados en Step 1 (fail-fast)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  // Determine which fields to show
  const isCasa = tipoProyecto === 'casa-cabana';
  const isOficinas = tipoProyecto === 'oficinas-corporativas';
  const isLocal = tipoProyecto === 'local-comercial';
  const isEspecial = tipoProyecto === 'proyecto-especial';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Especificaciones del Proyecto</h2>

      {/* ============================================ */}
      {/* SECCIÓN 1: CAMPOS UNIVERSALES (TODOS)       */}
      {/* ============================================ */}

      <div className="space-y-4">
        {/* Metros Cuadrados - UNIVERSAL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Metros Cuadrados Aproximados <span className="text-red-500">*</span>
            {isCasa && <span className="text-xs text-gray-500 ml-2">(Mínimo 10 m²)</span>}
            {isOficinas && <span className="text-xs text-gray-500 ml-2">(Mínimo 20 m²)</span>}
            {isLocal && <span className="text-xs text-gray-500 ml-2">(Mínimo 15 m²)</span>}
            {isEspecial && <span className="text-xs text-gray-500 ml-2">(Aproximado)</span>}
          </label>
          <input
            type="number"
            value={formData.metrosCuadrados}
            onChange={(e) => handleChange('metrosCuadrados', e.target.value)}
            placeholder={isOficinas ? "Ej: 50" : isLocal ? "Ej: 30" : isCasa ? "Ej: 80" : "Ej: 100"}
            className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
              errors.metrosCuadrados
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]'
            } focus:outline-none focus:ring-2`}
          />
          {errors.metrosCuadrados && (
            <p className="mt-1 text-sm text-red-600">{errors.metrosCuadrados}</p>
          )}
        </div>

        {/* Descripción del Proyecto - UNIVERSAL (OPCIONAL) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Proyecto <span className="text-gray-500">(Opcional)</span>
            <span className="text-xs text-gray-500 ml-2">
              {isEspecial
                ? '(Recomendado: 50+ caracteres para proyectos especiales)'
                : '(Ayúdanos a entender mejor tu visión)'}
            </span>
          </label>
          <textarea
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder={
              isEspecial
                ? "Opcional: Describe tu proyecto especial en detalle - características únicas, materiales especiales, funcionalidades específicas..."
                : "Opcional: Describe brevemente tu proyecto, funcionalidades específicas o características que te gustaría incluir..."
            }
            rows={isEspecial ? 5 : 4}
            className={`w-full px-4 py-2.5 rounded-lg border text-base transition-colors ${
              errors.descripcion
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]'
            } focus:outline-none focus:ring-2`}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">
              {formData.descripcion.length} caracteres
              {formData.descripcion && formData.descripcion.length > 0 && isEspecial && (
                <span className={formData.descripcion.length >= 50 ? 'text-green-600 ml-2' : 'text-amber-600 ml-2'}>
                  {formData.descripcion.length >= 50 ? '✓ Suficiente detalle' : '(recomendamos 50+ para mejores resultados)'}
                </span>
              )}
            </p>
          </div>
          {errors.descripcion && (
            <p className="text-sm text-red-600 mt-1">{errors.descripcion}</p>
          )}
        </div>
      </div>

      {/* ============================================ */}
      {/* SECCIÓN 2: CAMPOS CONDICIONALES POR TIPO    */}
      {/* ============================================ */}

      {/* Casa/Cabaña - Campos específicos */}
      {isCasa && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800">Detalles de Vivienda</h3>

          {/* Habitaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Habitaciones <span className="text-red-500">*</span>
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
                      ? 'border-[#D32F2F] bg-[#FFEBEE] text-[#D32F2F] font-semibold'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Baños */}
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
                      ? 'border-[#D32F2F] bg-[#FFEBEE] text-[#D32F2F] font-semibold'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Oficinas - Campos específicos */}
      {isOficinas && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800">Detalles de Oficina</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Empleados <span className="text-xs text-gray-500">(Opcional)</span>
            </label>
            <input
              type="number"
              value={formData.numeroEmpleados}
              onChange={(e) => handleChange('numeroEmpleados', e.target.value)}
              placeholder="Ej: 10"
              className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Ayúdanos a dimensionar espacios de trabajo y áreas comunes
            </p>
          </div>
        </div>
      )}

      {/* Local Comercial - Campos específicos */}
      {isLocal && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-800">Detalles del Local</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Negocio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tipoNegocio}
              onChange={(e) => handleChange('tipoNegocio', e.target.value)}
              placeholder="Ej: Cafetería, Tienda de ropa, Gimnasio, Consultorio..."
              className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
                errors.tipoNegocio
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#D32F2F] focus:ring-[#D32F2F]'
              } focus:outline-none focus:ring-2`}
            />
            {errors.tipoNegocio && (
              <p className="mt-1 text-sm text-red-600">{errors.tipoNegocio}</p>
            )}
          </div>
        </div>
      )}

      {/* Proyecto Especial - Info message */}
      {isEspecial && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm text-blue-900 font-medium">
                Proyecto Especial
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Para proyectos especiales, todos los campos son opcionales.
                Sin embargo, recomendamos proporcionar una descripción detallada
                (50+ caracteres) para ayudarnos a entender mejor tu visión y darte
                una cotización más precisa.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
