'use client';

import { formatMXN, formatPercent } from '@/lib/constants/pricing';

interface AlmacenamientoPricingSidebarProps {
  precioMensual: number;
  duracionMeses: number;
  costoSinDescuento: number;
  descuentoDuracion: number;
  descuentoUbicacion: number;
  descuentoTotal: number;
  montoDescuento: number;
  subtotalRenta: number;
  costoTransporte: number;
  subtotal: number;
  iva: number;
  total: number;
  modeloNombre: string;
}

export default function AlmacenamientoPricingSidebar({
  precioMensual,
  duracionMeses,
  costoSinDescuento,
  descuentoDuracion,
  descuentoUbicacion,
  descuentoTotal,
  montoDescuento,
  subtotalRenta,
  costoTransporte,
  subtotal,
  iva,
  total,
  modeloNombre,
}: AlmacenamientoPricingSidebarProps) {
  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-lg">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] px-6 py-4">
          <h3 className="text-xl font-bold text-white">Cotización de Renta</h3>
          <p className="text-sm text-white/90 mt-1">{modeloNombre}</p>
        </div>

        {/* Pricing breakdown */}
        <div className="px-6 py-5 space-y-4">
          {/* Monthly price & duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base text-slate-700">Renta mensual</span>
              <span className="text-lg font-semibold text-slate-900">
                {formatMXN(precioMensual)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Duración</span>
              <span className="text-base font-medium text-slate-700">
                {duracionMeses} {duracionMeses === 1 ? 'mes' : 'meses'}
              </span>
            </div>
          </div>

          {/* Subtotal before discounts */}
          <div className="border-t border-slate-300 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-slate-700">Costo sin descuento</span>
              <span className="text-lg font-semibold text-slate-900">
                {formatMXN(costoSinDescuento)}
              </span>
            </div>
          </div>

          {/* Discounts section - only show if there are discounts */}
          {descuentoTotal > 0 && (
            <div className="border-t border-slate-300 pt-4 space-y-3">
              <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                Descuentos
              </p>

              {/* Duration discount */}
              {descuentoDuracion > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">
                    Por duración ({duracionMeses} meses)
                  </span>
                  <span className="text-base font-medium text-green-600">
                    -{formatPercent(descuentoDuracion)}
                  </span>
                </div>
              )}

              {/* Location discount */}
              {descuentoUbicacion > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Por ubicación en bodega</span>
                  <span className="text-base font-medium text-green-600">
                    -{formatPercent(descuentoUbicacion)}
                  </span>
                </div>
              )}

              {/* Total discount amount */}
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="text-sm font-semibold text-green-800">
                  Ahorro total ({formatPercent(descuentoTotal)})
                </span>
                <span className="text-base font-bold text-green-700">
                  -{formatMXN(montoDescuento)}
                </span>
              </div>
            </div>
          )}

          {/* Subtotal rental */}
          <div className="border-t border-slate-300 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-slate-700">
                Subtotal renta ({duracionMeses} {duracionMeses === 1 ? 'mes' : 'meses'})
              </span>
              <span className="text-lg font-semibold text-slate-900">
                {formatMXN(subtotalRenta)}
              </span>
            </div>
          </div>

          {/* Transport cost */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Transporte</span>
            <span className="text-base font-medium text-slate-700">
              {formatMXN(costoTransporte)}
            </span>
          </div>

          {/* IVA */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">IVA (16%)</span>
            <span className="text-base font-medium text-slate-700">
              {formatMXN(iva)}
            </span>
          </div>

          {/* Total - highlighted */}
          <div className="bg-gradient-to-r from-[#FFEBEE] to-[#FCE4EC] border-2 border-[#D32F2F] rounded-xl px-4 py-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-[#D32F2F]">
                {formatMXN(total)}
              </span>
            </div>
          </div>

          {/* Monthly Payment - EMPHASIZED */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl px-4 py-4 mt-4 shadow-lg">
            <div className="text-center">
              <p className="text-sm text-white/90 mb-1">
                Pago mensual
              </p>
              <p className="text-3xl font-bold text-white mb-1">
                {formatMXN(Math.round(total / duracionMeses))}<span className="text-xl">/mes</span>
              </p>
              <p className="text-xs text-white/80">
                Cobro mensual por {duracionMeses} {duracionMeses === 1 ? 'mes' : 'meses'}
              </p>
            </div>
          </div>

          {/* Transport notice - separated from calculations */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-4">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5M6 18.5A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/>
              </svg>
              <div>
                <p className="text-xs font-semibold text-amber-900">
                  🚚 Transporte
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  • <span className="font-semibold text-green-700">Hermosillo: GRATIS</span>
                </p>
                <p className="text-xs text-amber-700">
                  • Fuera de Hermosillo: $60/km
                </p>
              </div>
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
                  El precio final puede variar según condiciones específicas. Nuestro
                  equipo te contactará con una cotización detallada personalizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
