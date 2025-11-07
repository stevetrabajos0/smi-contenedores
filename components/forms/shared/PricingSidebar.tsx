'use client';

import { PRECIOS_BANOS, PRECIO_COCINA, IVA_RATE, type TipoBano } from '@/lib/constants/pricing';

interface PricingSidebarProps {
  precioBase: number;
  tipoBano: TipoBano;
  cocina: boolean;
  modeloNombre: string;
}

export default function PricingSidebar({
  precioBase,
  tipoBano,
  cocina,
  modeloNombre,
}: PricingSidebarProps) {
  // Calculate extras using shared constants
  const precioBano = PRECIOS_BANOS[tipoBano];
  const precioCocina = cocina ? PRECIO_COCINA : 0;

  // Calculate totals
  const subtotal = precioBase + precioBano + precioCocina;
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-lg">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] px-6 py-4">
          <h3 className="text-xl font-bold text-white">Resumen de Cotización</h3>
          <p className="text-sm text-white/90 mt-1">{modeloNombre}</p>
        </div>

        {/* Pricing breakdown */}
        <div className="px-6 py-5 space-y-4">
          {/* Base price */}
          <div className="flex items-center justify-between">
            <span className="text-base text-slate-700">Precio base</span>
            <span className="text-lg font-semibold text-slate-900">
              {formatCurrency(precioBase)}
            </span>
          </div>

          {/* Extras section - only show if there are extras */}
          {(precioBano > 0 || precioCocina > 0) && (
            <div className="border-t border-slate-300 pt-4 space-y-3">
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                Extras
              </p>

              {/* Baño */}
              {precioBano > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    {tipoBano === 'simple' ? 'Baño Simple' : 'Baño Completo'}
                  </span>
                  <span className="text-base font-medium text-[#D32F2F]">
                    +{formatCurrency(precioBano)}
                  </span>
                </div>
              )}

              {/* Cocina */}
              {precioCocina > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Cocina Completa</span>
                  <span className="text-base font-medium text-[#D32F2F]">
                    +{formatCurrency(precioCocina)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Subtotal */}
          <div className="border-t border-slate-300 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-slate-700">Subtotal</span>
              <span className="text-lg font-semibold text-slate-900">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>

          {/* IVA */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">IVA (16%)</span>
            <span className="text-base font-medium text-slate-700">
              {formatCurrency(iva)}
            </span>
          </div>

          {/* Total - highlighted */}
          <div className="bg-gradient-to-r from-[#FFEBEE] to-[#FCE4EC] border-2 border-[#D32F2F] rounded-xl px-4 py-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-[#D32F2F]">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
                <p className="text-xs font-semibold text-blue-900">
                  Cotización estimada
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  El precio final puede variar según especificaciones y acabados. Nuestro
                  equipo te contactará con una cotización detallada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
