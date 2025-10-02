import { z } from 'zod';

// Storage Form Schema
export const storageSchema = z.object({
  tipoServicio: z.string().min(1, 'Selecciona el tipo de servicio'),
  codigoPostal: z
    .string()
    .length(5, 'El código postal debe tener 5 dígitos')
    .regex(/^\d+$/, 'El código postal solo debe contener números'),
  codigoPostalDestino: z
    .string()
    .length(5, 'El código postal debe tener 5 dígitos')
    .regex(/^\d+$/, 'El código postal solo debe contener números')
    .optional()
    .or(z.literal('')),
  ubicacionContenedor: z.string().optional().or(z.literal('')),
  fechaEntrega: z.string().min(1, 'La fecha de entrega es requerida'),
  duracionAlmacenamiento: z.string().optional().or(z.literal('')),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  whatsapp: z
    .string()
    .length(10, 'El WhatsApp debe tener 10 dígitos')
    .regex(/^\d+$/, 'El WhatsApp solo debe contener números'),
  correo: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .min(1, 'El correo electrónico es requerido'),
  preferenciaContacto: z.string().min(1, 'Selecciona tu preferencia de contacto'),
});

// Standard Form Schema
export const standardSchema = z.object({
  modeloSeleccionado: z.string().min(1, 'Selecciona un modelo'),
  tiempoEntrega: z.string().min(1, 'El tiempo de entrega es requerido'),
  tieneTerreno: z.string().min(1, 'Indica si tienes terreno'),
  presupuesto: z.string().min(1, 'El presupuesto es requerido'),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().optional(),
  whatsapp: z
    .string()
    .length(10, 'El WhatsApp debe tener 10 dígitos')
    .regex(/^\d+$/, 'El WhatsApp solo debe contener números'),
  correo: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .min(1, 'El correo electrónico es requerido'),
  codigoPostal: z
    .string()
    .length(5, 'El código postal debe tener 5 dígitos')
    .regex(/^\d+$/, 'El código postal solo debe contener números'),
  comentarios: z.string().optional(),
});

// Custom Form Schema
export const customSchema = z.object({
  tipoProyecto: z.string().min(1, 'Selecciona el tipo de proyecto'),
  habitaciones: z.string().min(1, 'Indica el número de habitaciones'),
  banos: z.string().min(1, 'Indica el número de baños'),
  metrosCuadrados: z.string().min(1, 'Los metros cuadrados son requeridos'),
  tieneTerreno: z.string().min(1, 'Indica si tienes terreno'),
  codigoPostalTerreno: z
    .string()
    .length(5, 'El código postal debe tener 5 dígitos')
    .regex(/^\d+$/, 'El código postal solo debe contener números')
    .optional()
    .or(z.literal('')),
  tiempoEntrega: z.string().min(1, 'El tiempo de entrega es requerido'),
  presupuesto: z.string().min(1, 'El presupuesto es requerido'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  archivosInspiracion: z.string().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  empresa: z.string().optional(),
  whatsapp: z
    .string()
    .length(10, 'El WhatsApp debe tener 10 dígitos')
    .regex(/^\d+$/, 'El WhatsApp solo debe contener números'),
  correo: z
    .string()
    .email('Ingresa un correo electrónico válido')
    .min(1, 'El correo electrónico es requerido'),
  necesitaFinanciamiento: z.string().min(1, 'Indica si necesitas financiamiento'),
  mejorHorarioContacto: z.string().min(1, 'Selecciona el mejor horario de contacto'),
});

export type StorageFormData = z.infer<typeof storageSchema>;
export type StandardFormData = z.infer<typeof standardSchema>;
export type CustomFormData = z.infer<typeof customSchema>;
