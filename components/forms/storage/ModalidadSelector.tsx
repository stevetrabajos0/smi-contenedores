'use client';

import { CheckCircleIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalidadSelectorProps {
  value: 'renta' | 'compra' | '';
  onChange: (value: 'renta' | 'compra') => void;
  tipoServicio: 'almacenamiento' | 'ambos' | 'mudanza';
  tamano?: '10' | '20' | '40';
}

export function ModalidadSelector({
  value,
  onChange,
  tipoServicio,
  tamano = '20'
}: ModalidadSelectorProps) {
  // Solo mostrar si almacenamiento o ambos (no mudanza)
  if (tipoServicio === 'mudanza') return null;

  // Precios base para hints (desde documento oficial SMI)
  const preciosRenta = { '10': 3000, '20': 4500, '40': 8000 };
  const preciosCompra = { '10': 55000, '20': 65000, '40': 83000 };

  const precioRentaMes = preciosRenta[tamano];
  const precioCompraTotal = preciosCompra[tamano];

  // Break-even months (documento oficial SMI)
  const breakEvenMeses = { '10': 21, '20': 17, '40': 12 };
  const breakEven = breakEvenMeses[tamano];

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-900">
        ¿Cómo necesitas el contenedor?
        <span className="text-red-500 ml-1">*</span>
      </label>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ===================================
            RENTA CARD
            =================================== */}
        <button
          type="button"
          onClick={() => onChange('renta')}
          className={cn(
            "relative rounded-xl border-2 p-5 text-left transition-all duration-200",
            "hover:shadow-md active:scale-[0.98]",
            value === 'renta'
              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          )}
          aria-pressed={value === 'renta'}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Título */}
              <p className="text-base font-semibold text-gray-900">
                Renta Temporal
              </p>

              {/* Precio */}
              <p className="mt-1 text-sm text-gray-600">
                Desde <span className="font-semibold text-gray-900">
                  ${precioRentaMes.toLocaleString()}/mes
                </span>
              </p>

              {/* Beneficios */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Incluye transporte ida y vuelta
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Sin compromiso a largo plazo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Descuentos por 6+ meses
                  </span>
                </div>
              </div>
            </div>

            {/* Check Icon */}
            {value === 'renta' && (
              <CheckCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            )}
          </div>
        </button>

        {/* ===================================
            COMPRA CARD
            =================================== */}
        <button
          type="button"
          onClick={() => onChange('compra')}
          className={cn(
            "relative rounded-xl border-2 p-5 text-left transition-all duration-200",
            "hover:shadow-md active:scale-[0.98]",
            value === 'compra'
              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2"
              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          )}
          aria-pressed={value === 'compra'}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Título */}
              <p className="text-base font-semibold text-gray-900">
                Compra Permanente
              </p>

              {/* Precio */}
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  ${precioCompraTotal.toLocaleString()}
                </span> una vez
              </p>

              {/* Beneficios */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Tuyo para siempre
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Modifícalo como quieras
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-gray-600">
                    Valorizado como activo
                  </span>
                </div>
              </div>
            </div>

            {/* Check Icon */}
            {value === 'compra' && (
              <CheckCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            )}
          </div>
        </button>
      </div>

      {/* ===================================
          HINT INTELIGENTE (Psychology: Anchoring)
          =================================== */}
      {value === 'renta' && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-lg">💡</span>
          <p className="text-xs text-amber-800">
            <strong>Tip de ahorro:</strong> Si necesitas por más de {breakEven} meses,
            comprar es {Math.round((breakEven * precioRentaMes / precioCompraTotal - 1) * 100)}%
            más económico a largo plazo.
          </p>
        </div>
      )}

      {value === 'compra' && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-lg">✅</span>
          <p className="text-xs text-blue-800">
            <strong>Gran elección.</strong> El contenedor será tuyo y podrás
            revenderlo en el futuro si ya no lo necesitas.
          </p>
        </div>
      )}
    </div>
  );
}
