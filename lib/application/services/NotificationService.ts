import { Contact } from '@/lib/domain/entities/Contact';
import { Opportunity } from '@/lib/domain/entities/Opportunity';

export interface WhatsAppNotificationPayload {
  phoneNumber: string;
  message: string;
}

export interface EmailConfirmationPayload {
  to: string;
  nombre: string;
  trackingCode: string;
  tipoServicio: string;
}

export interface InternalNotificationPayload {
  contact: Contact;
  opportunity: Opportunity;
  isNewContact: boolean;
}

export class NotificationService {
  /**
   * Send WhatsApp notification to new lead
   * In production, this would integrate with WhatsApp Business API or Twilio
   */
  async sendWhatsAppNotification(
    payload: WhatsAppNotificationPayload
  ): Promise<boolean> {
    try {
      console.log('[NotificationService] Sending WhatsApp notification:', {
        to: payload.phoneNumber,
        message: payload.message,
      });

      // TODO: Integrate with WhatsApp Business API
      // Example with Twilio:
      // await twilioClient.messages.create({
      //   from: 'whatsapp:+14155238886',
      //   to: `whatsapp:+52${payload.phoneNumber}`,
      //   body: payload.message
      // });

      return true;
    } catch (error) {
      console.error('[NotificationService] Error sending WhatsApp:', error);
      return false;
    }
  }

  /**
   * Send email confirmation with tracking code
   * In production, integrate with SendGrid, AWS SES, or similar
   */
  async sendEmailConfirmation(
    payload: EmailConfirmationPayload
  ): Promise<boolean> {
    try {
      console.log('[NotificationService] Sending email confirmation:', {
        to: payload.to,
        trackingCode: payload.trackingCode,
      });

      // TODO: Integrate with email service
      // Example with SendGrid:
      // await sgMail.send({
      //   to: payload.to,
      //   from: 'hola@smicontenedores.com',
      //   subject: `Cotización recibida - ${payload.trackingCode}`,
      //   html: emailContent,
      // });

      return true;
    } catch (error) {
      console.error('[NotificationService] Error sending email:', error);
      return false;
    }
  }

  /**
   * Notify internal team via Slack webhook
   * Alerts sales team about new leads
   */
  async notifyInternalTeam(
    payload: InternalNotificationPayload
  ): Promise<boolean> {
    try {
      const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

      if (!slackWebhookUrl) {
        console.warn(
          '[NotificationService] SLACK_WEBHOOK_URL not configured, skipping notification'
        );
        return false;
      }

      const slackMessage = this.buildSlackMessage(payload);

      const response = await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`);
      }

      console.log('[NotificationService] Slack notification sent successfully');
      return true;
    } catch (error) {
      console.error('[NotificationService] Error sending Slack notification:', error);
      return false;
    }
  }

  /**
   * Send all notifications for a new lead
   */
  async notifyNewLead(
    contact: Contact,
    opportunity: Opportunity,
    isNewContact: boolean
  ): Promise<void> {
    // Fire notifications in parallel (don't wait for all to complete)
    const notifications = [
      this.sendWhatsAppNotification({
        phoneNumber: contact.whatsapp,
        message: `¡Gracias por tu interés en SMI Contenedores! Hemos recibido tu cotización. Tu código de seguimiento es: ${opportunity.trackingCode}`,
      }),
      // Only send email if correo exists
      ...(contact.correo
        ? [
            this.sendEmailConfirmation({
              to: contact.correo,
              nombre: contact.nombre,
              trackingCode: opportunity.trackingCode,
              tipoServicio: opportunity.tipoServicio,
            }),
          ]
        : []),
      this.notifyInternalTeam({
        contact,
        opportunity,
        isNewContact,
      }),
    ];

    await Promise.allSettled(notifications);
  }

  private buildEmailTemplate(payload: EmailConfirmationPayload): string {
    return `
      <h1>¡Gracias por tu interés, ${payload.nombre}!</h1>
      <p>Hemos recibido tu solicitud de cotización para <strong>${payload.tipoServicio}</strong>.</p>
      <p>Tu código de seguimiento es: <strong>${payload.trackingCode}</strong></p>
      <p>Nuestro equipo se pondrá en contacto contigo pronto.</p>
      <br>
      <p>Saludos,<br>Equipo SMI Contenedores</p>
    `;
  }

  private buildSlackMessage(payload: InternalNotificationPayload): any {
    const { contact, opportunity, isNewContact } = payload;

    return {
      text: `${isNewContact ? '🆕 Nuevo Lead' : '🔄 Lead Existente'}: ${opportunity.trackingCode}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${isNewContact ? '🆕 Nuevo Lead' : '🔄 Lead Existente'} - ${opportunity.trackingCode}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Contacto:*\n${contact.nombre}`,
            },
            {
              type: 'mrkdwn',
              text: `*WhatsApp:*\n${contact.whatsapp}`,
            },
            {
              type: 'mrkdwn',
              text: `*Servicio:*\n${opportunity.tipoServicio}`,
            },
            {
              type: 'mrkdwn',
              text: `*Presupuesto:*\n$${opportunity.presupuesto}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Descripción:*\n${opportunity.descripcionProyecto || 'N/A'}`,
          },
        },
      ],
    };
  }
}
