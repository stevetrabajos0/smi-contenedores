import { getWhatsAppLink, WHATSAPP_MESSAGES } from '@/lib/constants';

type WhatsAppContext = 'almacenamiento' | 'modelo-estandar' | 'personalizado';

/**
 * @deprecated Use getWhatsAppLink from @/lib/constants instead
 */
export function generateWhatsAppLink(context: WhatsAppContext): string {
  const messageKey = context === 'modelo-estandar' ? 'modeloEstandar' : context;
  const message = WHATSAPP_MESSAGES[messageKey as keyof typeof WHATSAPP_MESSAGES] || WHATSAPP_MESSAGES.general;
  return getWhatsAppLink(message);
}

/**
 * @deprecated Use getWhatsAppLink from @/lib/constants instead
 */
export function openWhatsApp(context: WhatsAppContext): void {
  const url = generateWhatsAppLink(context);
  window.open(url, '_blank');
}
