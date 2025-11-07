import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Configuration
 *
 * This module provides two distinct Supabase client instances:
 *
 * 1. supabaseAdmin (SERVICE_ROLE_KEY):
 *    - Bypasses Row Level Security (RLS)
 *    - Use ONLY in server-side code (API routes, server components)
 *    - Has full database access - handle with care
 *    - Example: Admin operations, background jobs, system tasks
 *
 * 2. supabaseClient (ANON_KEY):
 *    - Respects Row Level Security (RLS)
 *    - Safe for client-side and server-side code
 *    - Limited to permissions defined in RLS policies
 *    - Example: User-facing features, authenticated operations
 */

// Singleton instances
let adminInstance: SupabaseClient | null = null;
let clientInstance: SupabaseClient | null = null;

/**
 * Validates that all required Supabase environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
function validateEnvironmentVariables(): void {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
  }

  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
  }

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set');
  }
}

/**
 * Get Supabase Admin client instance (SERVICE_ROLE_KEY)
 *
 * ⚠️  WARNING: This client bypasses Row Level Security (RLS)
 * Only use in secure server-side contexts (API routes, server components)
 *
 * Configuration:
 * - autoRefreshToken: false (no session management needed)
 * - persistSession: false (stateless, no browser storage)
 *
 * @returns {SupabaseClient} Admin client with full database access
 * @throws {Error} If required environment variables are not set
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminInstance) {
    return adminInstance;
  }

  validateEnvironmentVariables();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  adminInstance = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    } as any, // Type assertion needed for Supabase auth config
  });

  return adminInstance;
}

/**
 * Get Supabase Client instance (ANON_KEY)
 *
 * ✅ This client respects Row Level Security (RLS)
 * Safe for both client-side and server-side usage
 *
 * Configuration:
 * - Standard browser-compatible settings
 * - Supports authentication flows
 * - Limited to RLS policy permissions
 *
 * @returns {SupabaseClient} Client instance with RLS enforcement
 * @throws {Error} If required environment variables are not set
 */
export function getSupabaseClient(): SupabaseClient {
  if (clientInstance) {
    return clientInstance;
  }

  validateEnvironmentVariables();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  clientInstance = createClient(url, anonKey);

  return clientInstance;
}

/**
 * Logs the duration of a Supabase operation
 *
 * Format: ⏱️  [Supabase] {operation} en: {duration}ms
 *
 * @param operation - Name of the operation being logged
 * @param startTime - Start time in milliseconds (from performance.now() or Date.now())
 * @returns {number} Duration in milliseconds
 *
 * @example
 * const startTime = Date.now();
 * const result = await supabase.from('users').select('*');
 * logSupabaseOperation('users.select', startTime);
 * // Output: ⏱️  [Supabase] users.select en: 145ms
 */
export function logSupabaseOperation(operation: string, startTime: number): number {
  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`⏱️  [Supabase] ${operation} en: ${duration}ms`);

  return duration;
}

/**
 * Reset Supabase client instances (useful for testing)
 * Clears singleton instances, forcing recreation on next access
 */
export function resetSupabaseInstances(): void {
  adminInstance = null;
  clientInstance = null;
}
