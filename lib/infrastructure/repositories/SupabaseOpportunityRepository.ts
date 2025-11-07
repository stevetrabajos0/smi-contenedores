import { SupabaseClient } from '@supabase/supabase-js';
import { Opportunity } from '@/lib/domain/entities/Opportunity';
import { IOpportunityRepository } from '@/lib/domain/interfaces/IOpportunityRepository';
import { getSupabaseAdmin, logSupabaseOperation } from '../config/supabase.config';

/**
 * Supabase implementation of IOpportunityRepository
 *
 * Uses SERVICE_ROLE_KEY via getSupabaseAdmin() for backend operations.
 * This client bypasses Row Level Security (RLS) - use only in server-side contexts.
 *
 * Database Mappings (Domain ↔ Supabase):
 * - tipoServicio ↔ service_type
 * - stage ↔ stage
 * - valorEstimado ↔ estimated_value
 * - All optional fields ↔ metadata (JSONB)
 *
 * Workflow:
 * 1. INSERT opportunity record
 * 2. Call calculate_score(opportunity_id) RPC
 * 3. Fetch updated record with score and temperature
 */
export class SupabaseOpportunityRepository implements IOpportunityRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = getSupabaseAdmin();
  }

  /**
   * Creates a new opportunity and calculates its score
   *
   * Process:
   * 1. INSERT into opportunities table
   * 2. Call calculate_score RPC to compute score and temperature
   * 3. Fetch updated opportunity with all fields
   *
   * @param opportunity - Opportunity entity to create
   * @returns Created opportunity with score and temperature
   */
  async create(opportunity: Opportunity): Promise<Opportunity> {
    const startTime = Date.now();
    console.log('⏱️  [OpportunityRepo] create iniciado');

    try {
      // Build metadata object with all optional fields
      const metadata: Record<string, any> = {
        codigoPostal: opportunity.codigoPostal,
      };

      // Add all optional fields to metadata
      if (opportunity.subtipo) metadata.subtipo = opportunity.subtipo;
      if (opportunity.tamanoContenedor) metadata.tamanoContenedor = opportunity.tamanoContenedor;
      if (opportunity.duracionAlmacenamiento) metadata.duracionAlmacenamiento = opportunity.duracionAlmacenamiento;
      if (opportunity.ubicacionContenedor) metadata.ubicacionContenedor = opportunity.ubicacionContenedor;
      if (opportunity.tipoAcceso) metadata.tipoAcceso = opportunity.tipoAcceso;
      if (opportunity.codigoPostalDestino) metadata.codigoPostalDestino = opportunity.codigoPostalDestino;
      if (opportunity.modeloSeleccionado) metadata.modeloSeleccionado = opportunity.modeloSeleccionado;
      if (opportunity.tieneTerreno !== undefined) metadata.tieneTerreno = opportunity.tieneTerreno;
      if (opportunity.necesitaFinanciamiento !== undefined) metadata.necesitaFinanciamiento = opportunity.necesitaFinanciamiento;
      if (opportunity.tipoProyecto) metadata.tipoProyecto = opportunity.tipoProyecto;
      if (opportunity.habitaciones) metadata.habitaciones = opportunity.habitaciones;
      if (opportunity.banos) metadata.banos = opportunity.banos;
      if (opportunity.metrosCuadrados) metadata.metrosCuadrados = opportunity.metrosCuadrados;
      if (opportunity.tipoNegocio) metadata.tipoNegocio = opportunity.tipoNegocio;
      if (opportunity.numeroEmpleados) metadata.numeroEmpleados = opportunity.numeroEmpleados;
      if (opportunity.descripcionProyecto) metadata.descripcionProyecto = opportunity.descripcionProyecto;
      if (opportunity.archivosInspiracion) metadata.archivosInspiracion = opportunity.archivosInspiracion;
      if (opportunity.timeline) metadata.timeline = opportunity.timeline;
      if (opportunity.presupuesto) metadata.presupuesto = opportunity.presupuesto;
      if (opportunity.preferenciaContacto) metadata.preferenciaContacto = opportunity.preferenciaContacto;
      if (opportunity.nombre) metadata.nombre = opportunity.nombre;

      // INSERT opportunity
      const { data: insertedRow, error: insertError } = await this.supabase
        .from('opportunities')
        .insert({
          contact_id: opportunity.contactId,
          service_type: this.mapServiceTypeToDb(opportunity.tipoServicio),
          estimated_value: opportunity.valorEstimado || null,
          source: opportunity.source || 'web',
          stage: this.mapStageToDb(opportunity.stage),
          metadata: metadata,
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error inserting opportunity:', insertError);
        throw new Error(`Failed to create opportunity: ${insertError.message}`);
      }

      logSupabaseOperation('opportunity.insert', startTime);

      // Call calculate_score RPC
      const scoreStartTime = Date.now();
      const { error: scoreError } = await this.supabase.rpc('calculate_score', {
        p_opportunity_id: insertedRow.id,
      });

      if (scoreError) {
        console.error('Error calculating score:', scoreError);
        // Don't throw - score calculation is non-critical
        console.warn('Continuing without score calculation');
      } else {
        logSupabaseOperation('opportunity.calculate_score', scoreStartTime);
      }

      // Fetch updated opportunity with score and temperature
      const fetchStartTime = Date.now();
      const { data: updatedRow, error: fetchError } = await this.supabase
        .from('opportunities')
        .select('*')
        .eq('id', insertedRow.id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated opportunity:', fetchError);
        throw new Error(`Failed to fetch updated opportunity: ${fetchError.message}`);
      }

      logSupabaseOperation('opportunity.select', fetchStartTime);

      return this.mapToOpportunity(updatedRow);
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  }

  /**
   * Finds an opportunity by its UUID
   *
   * @param id - Opportunity UUID
   * @returns Opportunity if found, null otherwise
   */
  async findById(id: string): Promise<Opportunity | null> {
    const startTime = Date.now();

    try {
      const { data, error } = await this.supabase
        .from('opportunities')
        .select('*')
        .eq('id', id)
        .single();

      logSupabaseOperation('opportunity.findById', startTime);

      // PGRST116: Row not found
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error finding opportunity by ID:', error);
        throw new Error(`Failed to find opportunity: ${error.message}`);
      }

      return this.mapToOpportunity(data);
    } catch (error) {
      console.error('Error finding opportunity by ID:', error);
      return null;
    }
  }

  /**
   * Finds all opportunities for a specific contact
   *
   * @param contactId - Contact UUID
   * @returns Array of opportunities ordered by creation date (newest first)
   */
  async findByContactId(contactId: string): Promise<Opportunity[]> {
    const startTime = Date.now();

    try {
      const { data, error } = await this.supabase
        .from('opportunities')
        .select('*')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      logSupabaseOperation('opportunity.findByContactId', startTime);

      if (error) {
        console.error('Error finding opportunities by contact ID:', error);
        throw new Error(`Failed to find opportunities: ${error.message}`);
      }

      return data.map((row) => this.mapToOpportunity(row));
    } catch (error) {
      console.error('Error finding opportunities by contact ID:', error);
      return [];
    }
  }

  /**
   * Updates an opportunity with partial data
   * Only updates fields that are provided in the data parameter
   *
   * @param id - Opportunity UUID
   * @param data - Partial opportunity data to update
   * @returns Updated opportunity
   */
  async update(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
    const startTime = Date.now();

    try {
      // Build update object with only provided fields
      const updateData: Record<string, any> = {};

      if (data.tipoServicio !== undefined) updateData.service_type = this.mapServiceTypeToDb(data.tipoServicio);
      if (data.valorEstimado !== undefined) updateData.estimated_value = data.valorEstimado;
      if (data.stage !== undefined) updateData.stage = this.mapStageToDb(data.stage);

      // Update metadata if any optional fields are provided
      const existingOpportunity = await this.findById(id);
      if (!existingOpportunity) {
        throw new Error(`Opportunity with ID ${id} not found`);
      }

      // Merge existing metadata with updates
      const updatedMetadata = { ...((existingOpportunity as any).metadata || {}) };

      if (data.codigoPostal !== undefined) updatedMetadata.codigoPostal = data.codigoPostal;
      if (data.trackingCode !== undefined) updatedMetadata.trackingCode = data.trackingCode;
      if (data.subtipo !== undefined) updatedMetadata.subtipo = data.subtipo;
      if (data.tamanoContenedor !== undefined) updatedMetadata.tamanoContenedor = data.tamanoContenedor;
      if (data.duracionAlmacenamiento !== undefined) updatedMetadata.duracionAlmacenamiento = data.duracionAlmacenamiento;
      if (data.ubicacionContenedor !== undefined) updatedMetadata.ubicacionContenedor = data.ubicacionContenedor;
      if (data.codigoPostalDestino !== undefined) updatedMetadata.codigoPostalDestino = data.codigoPostalDestino;
      if (data.modeloSeleccionado !== undefined) updatedMetadata.modeloSeleccionado = data.modeloSeleccionado;
      if (data.tieneTerreno !== undefined) updatedMetadata.tieneTerreno = data.tieneTerreno;
      if (data.necesitaFinanciamiento !== undefined) updatedMetadata.necesitaFinanciamiento = data.necesitaFinanciamiento;
      if (data.tipoProyecto !== undefined) updatedMetadata.tipoProyecto = data.tipoProyecto;
      if (data.habitaciones !== undefined) updatedMetadata.habitaciones = data.habitaciones;
      if (data.banos !== undefined) updatedMetadata.banos = data.banos;
      if (data.metrosCuadrados !== undefined) updatedMetadata.metrosCuadrados = data.metrosCuadrados;
      if (data.descripcionProyecto !== undefined) updatedMetadata.descripcionProyecto = data.descripcionProyecto;
      if (data.archivosInspiracion !== undefined) updatedMetadata.archivosInspiracion = data.archivosInspiracion;
      if (data.timeline !== undefined) updatedMetadata.timeline = data.timeline;
      if (data.presupuesto !== undefined) updatedMetadata.presupuesto = data.presupuesto;
      if (data.preferenciaContacto !== undefined) updatedMetadata.preferenciaContacto = data.preferenciaContacto;
      if (data.nombre !== undefined) updatedMetadata.nombre = data.nombre;

      updateData.metadata = updatedMetadata;

      const { data: updatedRow, error } = await this.supabase
        .from('opportunities')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      logSupabaseOperation('opportunity.update', startTime);

      if (error) {
        console.error('Error updating opportunity:', error);
        throw new Error(`Failed to update opportunity: ${error.message}`);
      }

      return this.mapToOpportunity(updatedRow);
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
  }

  /**
   * Updates only the status/stage of an opportunity
   * This is a convenience method for stage transitions
   *
   * @param id - Opportunity UUID
   * @param status - New stage value
   * @returns Updated opportunity
   */
  async updateStatus(id: string, status: string): Promise<Opportunity> {
    const startTime = Date.now();

    try {
      const { data: updatedRow, error } = await this.supabase
        .from('opportunities')
        .update({ stage: this.mapStageToDb(status) })
        .eq('id', id)
        .select('*')
        .single();

      logSupabaseOperation('opportunity.updateStatus', startTime);

      if (error) {
        console.error('Error updating opportunity status:', error);
        throw new Error(`Failed to update opportunity status: ${error.message}`);
      }

      return this.mapToOpportunity(updatedRow);
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      throw error;
    }
  }

  /**
   * Maps a Supabase opportunity row to an Opportunity entity
   *
   * @param row - Supabase opportunity row
   * @returns Opportunity entity
   */
  private mapToOpportunity(row: any): Opportunity {
    const metadata = row.metadata || {};

    return new Opportunity(
      row.id,                                     // id
      row.contact_id,                             // contactId
      row.service_type,                           // tipoServicio
      metadata.codigoPostal,                      // codigoPostal
      metadata.trackingCode,                      // trackingCode
      metadata.subtipo,                           // subtipo
      metadata.tamanoContenedor,                  // tamanoContenedor
      metadata.duracionAlmacenamiento,            // duracionAlmacenamiento
      metadata.ubicacionContenedor,               // ubicacionContenedor
      metadata.tipoAcceso,                        // tipoAcceso
      metadata.codigoPostalDestino,               // codigoPostalDestino
      metadata.modeloSeleccionado,                // modeloSeleccionado
      metadata.tieneTerreno,                      // tieneTerreno
      metadata.necesitaFinanciamiento,            // necesitaFinanciamiento
      metadata.tipoProyecto,                      // tipoProyecto
      metadata.habitaciones,                      // habitaciones
      metadata.banos,                             // banos
      metadata.metrosCuadrados,                   // metrosCuadrados
      metadata.tipoNegocio,                       // tipoNegocio
      metadata.numeroEmpleados,                   // numeroEmpleados
      metadata.descripcionProyecto,               // descripcionProyecto
      metadata.archivosInspiracion,               // archivosInspiracion
      metadata.timeline,                          // timeline
      metadata.presupuesto,                       // presupuesto
      metadata.preferenciaContacto,               // preferenciaContacto
      metadata.nombre,                            // nombre
      this.mapStageFromDb(row.stage),             // stage (DB inglés → Domain español)
      row.estimated_value,                        // valorEstimado
      row.estimated_close_date ? new Date(row.estimated_close_date) : undefined, // fechaCierreEstimada
      row.created_at ? new Date(row.created_at) : undefined, // fechaCreacion
      metadata.source                             // source
    );
  }

  /**
   * Maps stage from Domain (español) to Database (inglés)
   *
   * @param stage - Stage in Spanish
   * @returns Stage in English for database
   */
  private mapStageToDb(stage?: string): string {
    const stageMap: Record<string, string> = {
      'Nuevo Prospecto': 'new',
      'Calificando': 'qualifying',
      'Calificado': 'qualified',
      'Cotizado': 'quoted',
      'Cerrado': 'closed',
      'Perdido': 'lost',
    };
    return stageMap[stage || ''] || 'new';
  }

  /**
   * Maps stage from Database (inglés) to Domain (español)
   *
   * @param stage - Stage in English from database
   * @returns Stage in Spanish for domain
   */
  private mapStageFromDb(stage: string): string {
    const stageMap: Record<string, string> = {
      'new': 'Nuevo Prospecto',
      'qualifying': 'Calificando',
      'qualified': 'Calificado',
      'quoted': 'Cotizado',
      'closed': 'Cerrado',
      'lost': 'Perdido',
    };
    return stageMap[stage] || 'Nuevo Prospecto';
  }

  /**
   * Maps service type from Domain to Database format
   *
   * Handles constraint differences:
   * - Domain uses kebab-case without accents: 'modelo-estandar'
   * - DB uses accented lowercase: 'estándar'
   *
   * @param serviceType - Service type from domain/frontend
   * @returns Service type for database constraint
   */
  private mapServiceTypeToDb(serviceType: string): string {
    const serviceTypeMap: Record<string, string> = {
      'modelo-estandar': 'estándar',           // With tilde accent
      'proyecto-personalizado': 'personalizado', // Without prefix
      'almacenamiento': 'almacenamiento',      // Already correct
      'mudanza': 'almacenamiento',             // Maps to almacenamiento
      'combo': 'almacenamiento',               // Maps to almacenamiento
      'almacenamiento-mudanza': 'almacenamiento', // Combo variant
      'consulta-general': 'consulta-general',  // General inquiries (1:1)
    };

    const mapped = serviceTypeMap[serviceType] || serviceType;
    console.log(`[OpportunityRepo] Mapping service_type: ${serviceType} → ${mapped}`);
    return mapped;
  }
}
