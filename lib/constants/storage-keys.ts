/**
 * Centralized localStorage keys and utilities for form data persistence
 *
 * Usage:
 * - Import STORAGE_KEYS for key references
 * - Use helper functions for safe localStorage operations with try-catch protection
 */

export const STORAGE_KEYS = {
  almacenamiento: 'smi-form-almacenamiento',
  modeloEstandar: 'smi-form-modelo-estandar',
  personalizado: 'smi-form-personalizado',
} as const;

/**
 * Load form data from localStorage
 *
 * @param key - Storage key from STORAGE_KEYS
 * @returns Parsed data or null if not found or error occurs
 */
export function loadFormData<T>(key: string): T | null {
  try {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
}

/**
 * Save form data to localStorage
 *
 * @param key - Storage key from STORAGE_KEYS
 * @param data - Data to save
 */
export function saveFormData<T>(key: string, data: T): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
}

/**
 * Clear specific form data from localStorage
 *
 * @param key - Storage key from STORAGE_KEYS
 */
export function clearFormData(key: string): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing form data:', error);
  }
}

/**
 * Clear all SMI form data from localStorage
 */
export function clearAllFormData(): void {
  try {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all form data:', error);
  }
}
