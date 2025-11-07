/**
 * SMI CONTENEDORES - SUPABASE CLIENT
 *
 * Cliente configurado con service_role_key para uso en API Routes.
 * NO usar en frontend - solo backend.
 *
 * Versión: 1.0
 * Fecha: 2025-01-09
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// ============================================
// VALIDACIÓN DE ENV VARS
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Add it to .env.local'
  );
}

if (!supabaseServiceKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY environment variable. ' +
    'Add it to .env.local. ' +
    '⚠️ NEVER use service_role_key in frontend!'
  );
}

// ============================================
// SUPABASE CLIENT (Service Role)
// ============================================

/**
 * Cliente Supabase con service_role_key
 *
 * ⚠️ CRITICAL:
 * - Solo usar en API Routes (server-side)
 * - NUNCA exportar a frontend
 * - Bypasses Row Level Security (RLS)
 * - Tiene permisos totales en la base de datos
 *
 * @example
 * // En API Route:
 * import { supabaseAdmin } from '@/lib/supabase/client';
 * const { data } = await supabaseAdmin.from('cotizaciones').insert({...});
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
  }
);

// ============================================
// HELPER TYPES
// ============================================

/**
 * Tipo para una cotización completa
 */
export type Cotizacion = Database['public']['Tables']['cotizaciones']['Row'];

/**
 * Tipo para INSERT de cotización (sin campos auto-generados)
 */
export type CotizacionInsert = Database['public']['Tables']['cotizaciones']['Insert'];

/**
 * Tipo para UPDATE de cotización
 */
export type CotizacionUpdate = Database['public']['Tables']['cotizaciones']['Update'];

/**
 * Form types válidos
 */
export type FormType = 'modelo_estandar' | 'almacenamiento' | 'personalizado';
