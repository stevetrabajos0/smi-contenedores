const WHATSAPP_PHONE = '526621234567';

type WhatsAppContext = 'almacenamiento' | 'modelo-estandar' | 'personalizado';

const MESSAGES: Record<WhatsAppContext, string> = {
  almacenamiento:
    'Hola, me gustaría solicitar información sobre servicios de almacenamiento y renta de contenedores.',
  'modelo-estandar':
    'Hola, me gustaría cotizar un contenedor de modelo estándar para mi proyecto.',
  personalizado:
    'Hola, me gustaría cotizar un proyecto personalizado de contenedor adaptado a mis necesidades.',
};

export function generateWhatsAppLink(context: WhatsAppContext): string {
  const message = MESSAGES[context] || MESSAGES['almacenamiento'];
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

export function openWhatsApp(context: WhatsAppContext): void {
  const url = generateWhatsAppLink(context);
  window.open(url, '_blank');
}
