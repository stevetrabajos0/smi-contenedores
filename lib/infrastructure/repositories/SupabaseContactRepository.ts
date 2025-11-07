import { SupabaseClient } from '@supabase/supabase-js';
import { Contact } from '@/lib/domain/entities/Contact';
import { IContactRepository } from '@/lib/domain/interfaces/IContactRepository';
import { getSupabaseAdmin, logSupabaseOperation } from '../config/supabase.config';

/**
 * Supabase implementation of IContactRepository
 *
 * Uses SERVICE_ROLE_KEY via getSupabaseAdmin() for backend operations.
 * This client bypasses Row Level Security (RLS) - use only in server-side contexts.
 *
 * Database Mappings (Domain ↔ Supabase):
 * - whatsapp ↔ phone
 * - nombre ↔ name
 * - correo ↔ email
 * - empresa ↔ company
 * - fechaRegistro ↔ created_at
 */
export class SupabaseContactRepository implements IContactRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = getSupabaseAdmin();
  }

  /**
   * Creates or updates a contact using direct upsert
   *
   * Uses Supabase upsert for phone-based deduplication:
   * - If phone exists: updates the existing record
   * - If phone is new: creates a new record
   *
   * @param contact - Contact entity to create
   * @returns Created/updated contact with database-generated ID
   */
  async create(contact: Contact): Promise<Contact> {
    const startTime = Date.now();
    console.log('⏱️  [ContactRepo] create iniciado');

    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .upsert(
          {
            phone: contact.whatsapp,
            name: contact.nombre,
            email: contact.correo || null,
            company: contact.empresa || null,
            source: 'web',
          },
          {
            onConflict: 'phone',
            ignoreDuplicates: false
          }
        )
        .select()
        .single();

      if (error) {
        console.error('❌ Error upserting contact:', error);
        throw new Error(`Failed to create contact: ${error.message}`);
      }

      const endTime = Date.now();
      console.log('⏱️  [ContactRepo] create completado en:', endTime - startTime, 'ms');

      return this.mapToContact(data);
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  /**
   * Finds a contact by its UUID
   *
   * @param id - Contact UUID
   * @returns Contact if found, null otherwise
   */
  async findById(id: string): Promise<Contact | null> {
    const startTime = Date.now();

    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();

      logSupabaseOperation('contact.findById', startTime);

      // PGRST116: Row not found
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error finding contact by ID:', error);
        throw new Error(`Failed to find contact: ${error.message}`);
      }

      return this.mapToContact(data);
    } catch (error) {
      console.error('Error finding contact by ID:', error);
      return null;
    }
  }

  /**
   * Finds a contact by WhatsApp phone number
   *
   * @param whatsapp - Phone number (10 digits)
   * @returns Contact if found, null otherwise
   */
  async findByWhatsApp(whatsapp: string): Promise<Contact | null> {
    const startTime = Date.now();
    console.log('⏱️  [ContactRepo] findByWhatsApp iniciado');

    try {
      const { data, error } = await this.supabase
        .from('contacts')
        .select('*')
        .eq('phone', whatsapp)
        .limit(1)
        .maybeSingle();

      logSupabaseOperation('contact.findByWhatsApp', startTime);

      if (error) {
        console.error('Error finding contact by WhatsApp:', error);
        throw new Error(`Failed to find contact: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return this.mapToContact(data);
    } catch (error) {
      console.error('Error finding contact by WhatsApp:', error);
      return null;
    }
  }

  /**
   * Updates a contact with partial data
   * Only updates fields that are provided in the data parameter
   *
   * @param id - Contact UUID
   * @param data - Partial contact data to update
   * @returns Updated contact
   */
  async update(id: string, data: Partial<Contact>): Promise<Contact> {
    const startTime = Date.now();

    try {
      // Build update object with only provided fields
      const updateData: Record<string, any> = {};

      if (data.nombre !== undefined) updateData.name = data.nombre;
      if (data.whatsapp !== undefined) updateData.phone = data.whatsapp;
      if (data.correo !== undefined) updateData.email = data.correo || null;
      if (data.empresa !== undefined) updateData.company = data.empresa;

      const { data: updatedRow, error } = await this.supabase
        .from('contacts')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      logSupabaseOperation('contact.update', startTime);

      if (error) {
        console.error('Error updating contact:', error);
        throw new Error(`Failed to update contact: ${error.message}`);
      }

      return this.mapToContact(updatedRow);
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  }

  /**
   * Lists all contacts with optional filtering
   *
   * @param filters - Optional filters (maxRecords, sort, etc.)
   * @returns Array of contacts
   */
  async list(filters?: any): Promise<Contact[]> {
    const startTime = Date.now();

    try {
      let query = this.supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters if provided
      if (filters?.maxRecords) {
        query = query.limit(filters.maxRecords);
      }

      const { data, error } = await query;

      logSupabaseOperation('contact.list', startTime);

      if (error) {
        console.error('Error listing contacts:', error);
        throw new Error(`Failed to list contacts: ${error.message}`);
      }

      return data.map((row) => this.mapToContact(row));
    } catch (error) {
      console.error('Error listing contacts:', error);
      throw error;
    }
  }

  /**
   * Maps a Supabase contact row to a Contact entity
   *
   * @param row - Supabase contact row
   * @returns Contact entity
   */
  private mapToContact(row: any): Contact {
    return new Contact(
      row.name,           // nombre
      row.phone,          // whatsapp
      row.email,          // correo
      new Date(row.created_at), // fechaRegistro
      row.company,        // empresa
      row.id              // id
    );
  }
}
