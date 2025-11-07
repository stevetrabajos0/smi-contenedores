/**
 * SUPABASE DATABASE TYPES
 *
 * Generado manualmente desde schema de cotizaciones.
 * TODO: Automatizar con `supabase gen types typescript`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cotizaciones: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          form_type: 'modelo_estandar' | 'almacenamiento' | 'personalizado'
          nombre: string
          whatsapp: string
          correo: string
          empresa: string | null
          source: string
          user_agent: string | null
          ip_address: string | null
          form_data: Json
          pricing_data: Json | null
          airtable_contact_id: string | null
          airtable_opportunity_id: string | null
          airtable_synced_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          form_type: 'modelo_estandar' | 'almacenamiento' | 'personalizado'
          nombre: string
          whatsapp: string
          correo: string
          empresa?: string | null
          source?: string
          user_agent?: string | null
          ip_address?: string | null
          form_data?: Json
          pricing_data?: Json | null
          airtable_contact_id?: string | null
          airtable_opportunity_id?: string | null
          airtable_synced_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          form_type?: 'modelo_estandar' | 'almacenamiento' | 'personalizado'
          nombre?: string
          whatsapp?: string
          correo?: string
          empresa?: string | null
          source?: string
          user_agent?: string | null
          ip_address?: string | null
          form_data?: Json
          pricing_data?: Json | null
          airtable_contact_id?: string | null
          airtable_opportunity_id?: string | null
          airtable_synced_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
