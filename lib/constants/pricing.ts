/**
 * Pricing Constants - Single Source of Truth
 * SMI Contenedores - Sistema de Cotización
 *
 * Este archivo centraliza TODOS los precios, descuentos y cálculos
 * para garantizar consistencia en toda la aplicación.
 */

// ============================================
// TIPOS
// ============================================

export type ModeloEstandar = '10' | '20' | '40';
export type TipoBano = 'ninguno' | 'simple' | 'completo';
export type Modalidad = 'renta' | 'compra';
export type UbicacionContenedor = 'terreno' | 'bodega';

// ============================================
// CONSTANTES DE PRECIOS BASE
// ============================================

/**
 * Precios base de modelos estándar (COMPRA)
 * Precios sin IVA
 */
export const PRECIOS_BASE_MODELOS: Record<ModeloEstandar, number> = {
  '10': 130000,  // $130,000 MXN
  '20': 230000,  // $230,000 MXN
  '40': 330000,  // $330,000 MXN
};

/**
 * Precios de extras - Baños
 * Precios sin IVA
 */
export const PRECIOS_BANOS: Record<TipoBano, number> = {
  'ninguno': 0,
  'simple': 15000,    // $15,000 MXN
  'completo': 30000,  // $30,000 MXN
};

/**
 * Precio de cocina
 * Precio sin IVA
 */
export const PRECIO_COCINA = 13000;  // $13,000 MXN

// ============================================
// RENTA MENSUAL
// ============================================

/**
 * Precios de renta mensual por modelo
 * Precios sin IVA
 */
export const PRECIOS_RENTA_MENSUAL: Record<ModeloEstandar, number> = {
  '10': 3000,   // $3,000 MXN/mes
  '20': 4500,   // $4,500 MXN/mes
  '40': 8000,   // $8,000 MXN/mes
};

/**
 * Extras mensuales para renta
 */
export const PRECIOS_RENTA_EXTRAS_MENSUAL = {
  banoSimple: 500,      // $500 MXN/mes
  banoCompleto: 1000,   // $1,000 MXN/mes
  cocina: 800,          // $800 MXN/mes
};

// ============================================
// DESCUENTOS
// ============================================

/**
 * Descuentos por duración de renta (acumulables)
 * Porcentajes expresados como decimales
 */
export const DESCUENTOS_DURACION: Record<number, number> = {
  1: 0,      // 1 mes: 0%
  3: 0,      // 3 meses: 0%
  6: 0.10,   // 6 meses: 10%
  12: 0.10,  // 12 meses: 10%
};

/**
 * Descuento por ubicación en bodega (acumulable)
 */
export const DESCUENTO_BODEGA = 0.10;  // 10%

// ============================================
// COMPRA DE CONTENEDORES PARA ALMACENAMIENTO
// ============================================

/**
 * Precios de COMPRA para contenedores de almacenamiento
 * (Diferentes de modelos estándar habitables)
 * Precios sin IVA
 */
export const PRECIOS_COMPRA_CONTENEDORES: Record<ModeloEstandar, {
  'cortinilla': number | null;
  'puertas-dobles': number;
}> = {
  '10': {
    'cortinilla': 55000,  // $55,000 MXN
    'puertas-dobles': 57000,  // $57,000 MXN
  },
  '20': {
    'cortinilla': 60000,  // $60,000 MXN
    'puertas-dobles': 70000,  // $70,000 MXN
  },
  '40': {
    'cortinilla': null,  // Bajo pedido (40' no disponible con cortinilla)
    'puertas-dobles': 83000,  // $83,000 MXN
  },
};

// ============================================
// TRANSPORTE
// ============================================

/**
 * Costo de transporte por kilómetro
 * Aplica para ambas modalidades (renta y compra)
 */
export const COSTO_TRANSPORTE_POR_KM = 35;  // $35 MXN/km

/**
 * Multiplicadores de distancia por zona
 * Aproximación basada en código postal
 */
export const DISTANCIA_APROXIMADA_KM: Record<string, number> = {
  // Zonas cercanas (0-50 km)
  '01': 30,
  '02': 35,
  '03': 40,

  // Zonas medias (50-100 km)
  '04': 70,
  '05': 80,
  '06': 90,

  // Zonas lejanas (100+ km)
  '07': 120,
  '08': 150,
  '09': 180,
};

// ============================================
// IVA
// ============================================

/**
 * Tasa de IVA en México
 */
export const IVA_RATE = 0.16;  // 16%

// ============================================
// HELPERS - CÁLCULO DE PRECIOS
// ============================================

/**
 * Calcula el precio total de un modelo estándar (COMPRA)
 * Incluye: modelo base + baño + cocina (si aplica)
 * NO incluye IVA ni transporte
 */
export function calcularPrecioModeloEstandar(
  modelo: ModeloEstandar,
  tipoBano: TipoBano = 'ninguno',
  necesitaCocina: boolean = false
): number {
  const precioBase = PRECIOS_BASE_MODELOS[modelo];
  const precioBano = PRECIOS_BANOS[tipoBano];
  const precioCocina = necesitaCocina ? PRECIO_COCINA : 0;

  return precioBase + precioBano + precioCocina;
}

/**
 * Calcula el porcentaje total de descuentos acumulables (RENTA)
 *
 * @param duracionMeses - Duración del contrato de renta (1, 3, 6, 12)
 * @param ubicacion - Ubicación del contenedor ('terreno' o 'bodega')
 * @returns Porcentaje total de descuento (ej: 0.25 = 25%)
 */
export function calcularDescuentosRenta(
  duracionMeses: number,
  ubicacion: UbicacionContenedor
): number {
  const descuentoDuracion = DESCUENTOS_DURACION[duracionMeses] || 0;
  const descuentoUbicacion = ubicacion === 'bodega' ? DESCUENTO_BODEGA : 0;

  // Los descuentos son acumulables
  return descuentoDuracion + descuentoUbicacion;
}

/**
 * Calcula el precio de renta mensual con extras
 * NO incluye descuentos, IVA ni transporte
 */
export function calcularPrecioRentaMensual(
  modelo: ModeloEstandar,
  tipoBano: TipoBano = 'ninguno',
  necesitaCocina: boolean = false
): number {
  const precioBaseRenta = PRECIOS_RENTA_MENSUAL[modelo];

  let precioExtrasBano = 0;
  if (tipoBano === 'simple') {
    precioExtrasBano = PRECIOS_RENTA_EXTRAS_MENSUAL.banoSimple;
  } else if (tipoBano === 'completo') {
    precioExtrasBano = PRECIOS_RENTA_EXTRAS_MENSUAL.banoCompleto;
  }

  const precioExtrasCocina = necesitaCocina ? PRECIOS_RENTA_EXTRAS_MENSUAL.cocina : 0;

  return precioBaseRenta + precioExtrasBano + precioExtrasCocina;
}

/**
 * Calcula el costo TOTAL de renta para todo el período
 * Aplica descuentos acumulables
 * NO incluye IVA ni transporte
 */
export function calcularCostoTotalRenta(
  modelo: ModeloEstandar,
  duracionMeses: number,
  ubicacion: UbicacionContenedor,
  tipoBano: TipoBano = 'ninguno',
  necesitaCocina: boolean = false
): number {
  const precioMensual = calcularPrecioRentaMensual(modelo, tipoBano, necesitaCocina);
  const costoSinDescuento = precioMensual * duracionMeses;

  const descuentoTotal = calcularDescuentosRenta(duracionMeses, ubicacion);
  const montoDescuento = costoSinDescuento * descuentoTotal;

  return costoSinDescuento - montoDescuento;
}

/**
 * Calcula el costo de transporte basado en código postal
 *
 * @param codigoPostal - Código postal de destino (primeros 2 dígitos)
 * @returns Costo de transporte en MXN
 */
export function calcularTransporte(codigoPostal: string): number {
  // Extraer los primeros 2 dígitos
  const zona = codigoPostal.substring(0, 2);

  // Buscar distancia aproximada
  const distanciaKm = DISTANCIA_APROXIMADA_KM[zona] || 50; // Default 50 km si no se encuentra

  return distanciaKm * COSTO_TRANSPORTE_POR_KM;
}

/**
 * Calcula el monto de IVA
 */
export function calcularIVA(subtotal: number): number {
  return subtotal * IVA_RATE;
}

/**
 * Calcula el total con IVA
 */
export function calcularTotalConIVA(subtotal: number): number {
  return subtotal + calcularIVA(subtotal);
}

// ============================================
// HELPERS - FORMATEO
// ============================================

/**
 * Formatea un número como pesos mexicanos
 * Ejemplo: 130000 → "$130,000 MXN"
 */
export function formatMXN(amount: number): string {
  return `$${amount.toLocaleString('es-MX')} MXN`;
}

/**
 * Formatea un porcentaje
 * Ejemplo: 0.25 → "25%"
 */
export function formatPercent(decimal: number): string {
  return `${(decimal * 100).toFixed(0)}%`;
}

// ============================================
// HELPERS - COTIZACIÓN COMPLETA
// ============================================

export interface CotizacionCompra {
  modelo: ModeloEstandar;
  tipoBano: TipoBano;
  necesitaCocina: boolean;
  codigoPostalDestino: string;

  // Desglose
  precioBase: number;
  precioBano: number;
  precioCocina: number;
  subtotalProducto: number;
  costoTransporte: number;
  subtotal: number;
  iva: number;
  total: number;
}

export interface CotizacionRenta {
  modelo: ModeloEstandar;
  tipoBano: TipoBano;
  necesitaCocina: boolean;
  duracionMeses: number;
  ubicacion: UbicacionContenedor;
  codigoPostalDestino: string;

  // Desglose
  precioMensual: number;
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
}

/**
 * Genera una cotización completa para COMPRA
 */
export function generarCotizacionCompra(params: {
  modelo: ModeloEstandar;
  tipoBano?: TipoBano;
  necesitaCocina?: boolean;
  codigoPostalDestino: string;
}): CotizacionCompra {
  const { modelo, tipoBano = 'ninguno', necesitaCocina = false, codigoPostalDestino } = params;

  const precioBase = PRECIOS_BASE_MODELOS[modelo];
  const precioBano = PRECIOS_BANOS[tipoBano];
  const precioCocina = necesitaCocina ? PRECIO_COCINA : 0;
  const subtotalProducto = precioBase + precioBano + precioCocina;

  const costoTransporte = calcularTransporte(codigoPostalDestino);
  const subtotal = subtotalProducto + costoTransporte;
  const iva = calcularIVA(subtotal);
  const total = subtotal + iva;

  return {
    modelo,
    tipoBano,
    necesitaCocina,
    codigoPostalDestino,
    precioBase,
    precioBano,
    precioCocina,
    subtotalProducto,
    costoTransporte,
    subtotal,
    iva,
    total,
  };
}

/**
 * Genera una cotización completa para RENTA
 */
export function generarCotizacionRenta(params: {
  modelo: ModeloEstandar;
  duracionMeses: number;
  ubicacion: UbicacionContenedor;
  tipoBano?: TipoBano;
  necesitaCocina?: boolean;
  codigoPostalDestino: string;
}): CotizacionRenta {
  const {
    modelo,
    duracionMeses,
    ubicacion,
    tipoBano = 'ninguno',
    necesitaCocina = false,
    codigoPostalDestino,
  } = params;

  const precioMensual = calcularPrecioRentaMensual(modelo, tipoBano, necesitaCocina);
  const costoSinDescuento = precioMensual * duracionMeses;

  const descuentoDuracion = DESCUENTOS_DURACION[duracionMeses] || 0;
  const descuentoUbicacion = ubicacion === 'bodega' ? DESCUENTO_BODEGA : 0;
  const descuentoTotal = descuentoDuracion + descuentoUbicacion;
  const montoDescuento = costoSinDescuento * descuentoTotal;

  const subtotalRenta = costoSinDescuento - montoDescuento;
  const costoTransporte = calcularTransporte(codigoPostalDestino);
  const subtotal = subtotalRenta + costoTransporte;
  const iva = calcularIVA(subtotal);
  const total = subtotal + iva;

  return {
    modelo,
    tipoBano,
    necesitaCocina,
    duracionMeses,
    ubicacion,
    codigoPostalDestino,
    precioMensual,
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
  };
}
