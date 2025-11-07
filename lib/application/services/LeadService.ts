import { Contact } from '@/lib/domain/entities/Contact';
import { Opportunity } from '@/lib/domain/entities/Opportunity';
import { IContactRepository } from '@/lib/domain/interfaces/IContactRepository';
import { IOpportunityRepository } from '@/lib/domain/interfaces/IOpportunityRepository';

export interface CreateLeadInput {
  // Contact info
  nombre: string;
  whatsapp: string;
  correo?: string;
  empresa?: string;

  // Opportunity info - críticos
  tipoServicio: 'almacenamiento' | 'mudanza' | 'almacenamiento-mudanza' | 'modelo-estandar' | 'personalizado' | 'consulta-general';
  codigoPostal: string;

  // Almacenamiento/Mudanza
  subtipo?: string;
  tamanoContenedor?: '10' | '20' | '40';
  duracionAlmacenamiento?: string;
  ubicacionContenedor?: 'mi-ubicacion' | 'bodega-smi';
  tipoAcceso?: 'cortinilla' | 'puertas-dobles';
  codigoPostalDestino?: string;

  // Modelo Estándar
  modeloSeleccionado?: string;
  tieneTerreno?: boolean;
  necesitaFinanciamiento?: boolean;

  // Personalizado
  tipoProyecto?: string;
  habitaciones?: number;
  banos?: number;
  metrosCuadrados?: number;
  tipoNegocio?: string;
  numeroEmpleados?: number;
  descripcionProyecto?: string;
  // TODO Día 3-4: Cambiar a string[] (URLs de Supabase Storage después de upload)
  // Por ahora: placeholder vacío o "pendiente"
  archivosInspiracion?: string;

  // Universales
  timeline?: string;
  presupuesto?: string;
  preferenciaContacto?: 'whatsapp' | 'correo' | 'telefono';
  modalidadAlmacenamiento?: 'renta' | 'compra';
  pricingBreakdown?: any; // CotizacionRenta | CotizacionCompra from pricing.ts
  comentarios?: string;
}

export interface CreateLeadOutput {
  contact: Contact;
  opportunity: Opportunity;
  trackingCode: string;
  isNewContact: boolean;
}

export class LeadService {
  constructor(
    private contactRepository: IContactRepository,
    private opportunityRepository: IOpportunityRepository
  ) {}

  async createLead(input: CreateLeadInput, source: string = 'web'): Promise<CreateLeadOutput> {
    const t0 = Date.now();
    console.log('⏱️ [LeadService] Iniciado');

    try {
      // ⚡ OPTIMIZACIÓN CRÍTICA: Skip findByWhatsApp (tardaba 11+ segundos en Airtable)
      // Siempre crear contacto nuevo = submit ultra-rápido (<1s)
      // Deduplicación de contactos manejada por n8n workflow
      console.log('⚡ [OPTIMIZACIÓN] Creando contacto directo (skip búsqueda lenta)');

      const newContact = new Contact(
        input.nombre,
        input.whatsapp,
        input.correo,
        new Date(),
        input.empresa,
        undefined
      );

      const contact = await this.contactRepository.create(newContact);
      const isNewContact = true;

      const t1 = Date.now();
      console.log('⏱️ [LeadService] Contact.create en:', (t1 - t0), 'ms');

      if (!contact.id) {
        throw new Error('Contact ID is required');
      }

      // Step 2: Create opportunity with tracking code
      const trackingCode = Opportunity.generateTrackingCode();

      // Calcular valor estimado ANTES de crear opportunity
      const estimatedValue = this.calculateEstimatedValue(input);
      console.log('💰 [LeadService] Estimated value calculado:', estimatedValue);

      const opportunity = new Opportunity(
        null, // id will be assigned by Supabase
        contact.id,
        input.tipoServicio,
        input.codigoPostal,
        trackingCode,
        input.subtipo,
        input.tamanoContenedor,
        input.duracionAlmacenamiento,
        input.ubicacionContenedor,
        input.tipoAcceso,
        input.codigoPostalDestino,
        input.modeloSeleccionado,
        input.tieneTerreno,
        input.necesitaFinanciamiento,
        input.tipoProyecto,
        input.habitaciones,
        input.banos,
        input.metrosCuadrados,
        input.tipoNegocio,
        input.numeroEmpleados,
        input.descripcionProyecto,
        input.archivosInspiracion,
        input.timeline,
        input.presupuesto,
        input.preferenciaContacto,
        undefined, // nombre - removed redundant 'Lead - X' generation
        'Nuevo Prospecto', // stage
        estimatedValue, // valorEstimado
        undefined, // fechaCierreEstimada
        new Date(), // fechaCreacion
        source
      );

      const tOppStart = Date.now();
      const createdOpportunity = await this.opportunityRepository.create(opportunity);

      const tOppEnd = Date.now();
      console.log('⏱️ [LeadService] Opportunity.create en:', (tOppEnd - tOppStart), 'ms');

      // Notify n8n webhook
      if (process.env.N8N_WEBHOOK_URL) {
        const tWebhookStart = Date.now();
        try {
          await fetch(process.env.N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'lead.created',
              trackingCode: createdOpportunity.trackingCode,
              contact: {
                id: contact.id,
                nombre: contact.nombre,
                whatsapp: contact.whatsapp,
                correo: contact.correo,
              },
              opportunity: {
                id: createdOpportunity.id,
                tipoServicio: createdOpportunity.tipoServicio,
                codigoPostal: createdOpportunity.codigoPostal,
                presupuesto: createdOpportunity.presupuesto,
                timeline: createdOpportunity.timeline,
                preferenciaContacto: createdOpportunity.preferenciaContacto,

                // Campos Storage
                tamanoContenedor: createdOpportunity.tamanoContenedor,
                duracionAlmacenamiento: createdOpportunity.duracionAlmacenamiento,
                ubicacionContenedor: createdOpportunity.ubicacionContenedor,
                codigoPostalDestino: createdOpportunity.codigoPostalDestino,

                // Campos Standard
                modeloSeleccionado: createdOpportunity.modeloSeleccionado,
                tieneTerreno: createdOpportunity.tieneTerreno,

                // Campos Custom
                tipoProyecto: createdOpportunity.tipoProyecto,
                habitaciones: createdOpportunity.habitaciones,
                metrosCuadrados: createdOpportunity.metrosCuadrados,
              },
              source,
              timestamp: new Date().toISOString(),
            }),
          });
          const tWebhookEnd = Date.now();
          console.log('⏱️ [LeadService] n8n webhook en:', (tWebhookEnd - tWebhookStart), 'ms');
          console.log('✅ n8n notified:', createdOpportunity.trackingCode);
        } catch (error) {
          console.error('❌ Failed to notify n8n:', error);
          // No fallar el lead creation si webhook falla
        }
      }

      const tTotal = Date.now();
      console.log('⏱️ [LeadService] TOTAL:', (tTotal - t0), 'ms');

      return {
        contact,
        opportunity: createdOpportunity,
        trackingCode: createdOpportunity.trackingCode,
        isNewContact,
      };
    } catch (error) {
      const tError = Date.now();
      console.error('⏱️ [LeadService] Error en:', (tError - t0), 'ms');
      console.error('Error in createLead:', error);
      throw error;
    }
  }

  /**
   * Calcula el valor estimado del opportunity según tipo de servicio
   */
  private calculateEstimatedValue(input: CreateLeadInput): number {
    const service = input.tipoServicio;

    // Almacenamiento y almacenamiento-mudanza
    if (service === 'almacenamiento' || service === 'almacenamiento-mudanza') {
      const duration = parseInt(input.duracionAlmacenamiento || '1');
      const basePrice = 3500; // Promedio mensual
      return basePrice * duration;
    }

    // Mudanza standalone
    if (service === 'mudanza') {
      return 10000; // Base estimado para mudanza
    }

    // Modelo estándar - usar presupuesto numérico del API route
    if (service === 'modelo-estandar') {
      if (input.presupuesto) {
        const parsed = parseInt(input.presupuesto);
        if (!isNaN(parsed)) return parsed;
      }
      return 150000; // Default si no hay presupuesto
    }

    // Proyecto personalizado - usar presupuesto o estimar por specs
    if (service === 'personalizado') {
      if (input.presupuesto) {
        const parsed = parseInt(input.presupuesto);
        if (!isNaN(parsed)) return parsed;
      }

      // Estimar por habitaciones si no hay presupuesto
      const rooms = input.habitaciones || 2;
      const baths = input.banos || 1;
      return (rooms * 150000) + (baths * 50000);
    }

    // Consulta general - sin valor estimado real
    if (service === 'consulta-general') {
      return 0;
    }

    // Default fallback
    return 50000;
  }

  async getOpportunitiesByContact(contactId: string): Promise<Opportunity[]> {
    return await this.opportunityRepository.findByContactId(contactId);
  }

  async updateOpportunityStatus(
    opportunityId: string,
    status: string
  ): Promise<Opportunity> {
    return await this.opportunityRepository.updateStatus(opportunityId, status);
  }
}
