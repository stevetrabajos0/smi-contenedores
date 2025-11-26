/**
 * CONSTANTES GLOBALES DE LA APLICACIÓN SMI CONTENEDORES
 */

// ============================================
// WHATSAPP CONFIGURATION
// ============================================

/**
 * Formatea un número de teléfono mexicano al formato de WhatsApp API
 *
 * WhatsApp API requiere:
 * - Código de país: 52 (México)
 * - "1" adicional para móviles: 1
 * - Número local: 10 dígitos
 *
 * Ejemplo: 6621234567 → 5216621234567
 *
 * @param phoneNumber - Número de 10 dígitos (formato local mexicano)
 * @returns Número formateado para WhatsApp API (13 dígitos)
 */
export function formatWhatsAppNumber(phoneNumber: string): string {
  // Remover cualquier caracter no numérico
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Si ya tiene el prefijo 521, retornar como está
  if (cleaned.startsWith('521') && cleaned.length === 13) {
    return cleaned;
  }

  // Si tiene solo 10 dígitos (número local), agregar prefijo 521
  if (cleaned.length === 10) {
    return `521${cleaned}`;
  }

  // Si tiene 12 dígitos y empieza con 52, agregar el 1
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    return `521${cleaned.slice(2)}`;
  }

  // En cualquier otro caso, intentar usar los últimos 10 dígitos
  if (cleaned.length >= 10) {
    const last10 = cleaned.slice(-10);
    return `521${last10}`;
  }

  // Fallback: retornar el número limpio (aunque sea inválido)
  console.warn(`⚠️ Número de WhatsApp inválido: ${phoneNumber}`);
  return cleaned;
}

/**
 * Número de WhatsApp de SMI Contenedores
 * Formato: 10 dígitos (número local mexicano)
 * Ejemplo: 6621553087 para Hermosillo, Sonora
 */
export const SMI_WHATSAPP_NUMBER = '6621553087';

/**
 * Número de WhatsApp formateado para display (con formato legible)
 */
export const SMI_WHATSAPP_DISPLAY = '(662) 155-3087';

/**
 * URL completa de WhatsApp (pre-calculada para performance)
 */
export const SMI_WHATSAPP_URL = `https://wa.me/${formatWhatsAppNumber(SMI_WHATSAPP_NUMBER)}`;

/**
 * Genera un enlace de WhatsApp con mensaje pre-escrito
 *
 * @param message - Mensaje pre-escrito (opcional)
 * @param phoneNumber - Número personalizado (opcional, usa SMI_WHATSAPP_NUMBER por defecto)
 * @returns URL completa de WhatsApp
 */
export function getWhatsAppLink(message?: string, phoneNumber?: string): string {
  const number = phoneNumber ? formatWhatsAppNumber(phoneNumber) : formatWhatsAppNumber(SMI_WHATSAPP_NUMBER);
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${encodedMessage}`;
}

// ============================================
// MENSAJES PREDEFINIDOS DE WHATSAPP
// ============================================

export const WHATSAPP_MESSAGES = {
  almacenamiento: 'Hola, me gustaría solicitar información sobre servicios de almacenamiento.',
  estandar: 'Hola, me gustaría cotizar un contenedor estándar.',
  modeloEstandar: 'Hola, me gustaría cotizar un contenedor estándar.',
  personalizado: 'Hola, me gustaría cotizar un proyecto personalizado de contenedor.',
  general: 'Hola, me gustaría solicitar información sobre sus servicios.',
} as const;

/**
 * Contextos válidos para mensajes de WhatsApp
 * Usar 'modeloEstandar' en lugar de 'modelo-estandar' para compatibilidad
 */
export type WhatsAppContext = keyof typeof WHATSAPP_MESSAGES;

// ============================================
// STORAGE KEYS (LocalStorage)
// ============================================

export const STORAGE_KEYS = {
  almacenamiento: 'smi-storage-form',
  estandar: 'smi-standard-form',
  personalizado: 'smi-custom-form',
} as const;

// ============================================
// OTRAS CONSTANTES
// ============================================

/**
 * Código postal base de Hermosillo, Sonora
 */
export const BASE_POSTAL_CODE = '83000';

/**
 * Tiempo de auto-guardado en localStorage (ms)
 */
export const AUTO_SAVE_DELAY = 500;

/**
 * Tiempo de transición del carousel (ms)
 */
export const CAROUSEL_INTERVAL = 6000;
