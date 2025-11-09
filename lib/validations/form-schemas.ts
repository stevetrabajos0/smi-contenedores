import { z } from 'zod';

// STORAGE FORM SCHEMA
export const storageSchema = z.object({
  // Datos del servicio
  tipoServicio: z.enum(['mudanza', 'almacenamiento', 'ambos']),
  modalidadAlmacenamiento: z.enum(['renta', 'compra'], {
    message: 'Selecciona modalidad (renta o compra)'
  }).optional(),
  tamanoContenedor: z.enum(['10', '20', '40']),
  codigoPostal: z.string().length(5).regex(/^\d+$/, 'Código postal debe tener 5 dígitos numéricos'),

  // Campos condicionales
  codigoPostalDestino: z.string().optional(),
  ubicacionContenedor: z.enum(['mi-ubicacion', 'bodega-smi']).optional(),
  duracionAlmacenamiento: z.string().optional(),
  tipoAcceso: z.enum(['cortinilla', 'puertas-dobles']).optional(),
  origenCiudad: z.string().optional(), // Ciudad de origen para mudanzas

  // Campos obligatorios del formulario
  fechaEntrega: z.string().min(1, 'Fecha de entrega es requerida'),

  // Datos de contacto
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  whatsapp: z.string()
    .length(10, 'WhatsApp debe tener 10 dígitos')
    .regex(/^[2-9]\d{9}$/, 'WhatsApp debe iniciar con dígito 2-9'),
  correo: z.string().email('Correo electrónico inválido'),
  empresa: z.string().optional(),
  comentarios: z.string().optional(),
}).refine((data) => {
  // VALIDACIÓN 1: Si almacenamiento o ambos → modalidad es REQUIRED
  if (data.tipoServicio === 'almacenamiento' || data.tipoServicio === 'ambos') {
    return !!data.modalidadAlmacenamiento;
  }
  return true;
}, {
  message: "Modalidad de almacenamiento es requerida (renta o compra)",
  path: ["modalidadAlmacenamiento"]
}).refine((data) => {
  // VALIDACIÓN 2: Si es mudanza o ambos, código postal destino es requerido
  if (data.tipoServicio === 'mudanza' || data.tipoServicio === 'ambos') {
    return data.codigoPostalDestino && data.codigoPostalDestino.length === 5;
  }
  return true;
}, {
  message: "El código postal de destino es requerido para mudanza",
  path: ["codigoPostalDestino"],
}).refine((data) => {
  // VALIDACIÓN 3: ubicacionContenedor solo required si RENTA
  if ((data.tipoServicio === 'almacenamiento' || data.tipoServicio === 'ambos')
      && data.modalidadAlmacenamiento === 'renta') {
    return data.ubicacionContenedor && data.ubicacionContenedor.length > 0;
  }
  return true;
}, {
  message: "Ubicación del contenedor es requerida para renta",
  path: ["ubicacionContenedor"],
}).refine((data) => {
  // VALIDACIÓN 4: duracionAlmacenamiento solo required si RENTA
  if ((data.tipoServicio === 'almacenamiento' || data.tipoServicio === 'ambos')
      && data.modalidadAlmacenamiento === 'renta') {
    return data.duracionAlmacenamiento && data.duracionAlmacenamiento.length > 0;
  }
  return true;
}, {
  message: "Duración de almacenamiento es requerida para renta",
  path: ["duracionAlmacenamiento"],
}).refine((data) => {
  // VALIDACIÓN 5: tipoAcceso solo required si COMPRA
  if ((data.tipoServicio === 'almacenamiento' || data.tipoServicio === 'ambos')
      && data.modalidadAlmacenamiento === 'compra') {
    return data.tipoAcceso && data.tipoAcceso.length > 0;
  }
  return true;
}, {
  message: "Tipo de acceso es requerido para compra",
  path: ["tipoAcceso"],
});

// STANDARD FORM SCHEMA
export const standardSchema = z.object({
  modeloSeleccionado: z.string().min(1, 'Debe seleccionar un modelo'),
  tiempoEntrega: z.string().min(1, 'Tiempo de entrega es requerido'),
  tipoBano: z.enum(['ninguno', 'simple', 'completo'], {
    message: 'Tipo de baño es requerido'
  }),
  cocina: z.boolean(),
  tieneTerreno: z.enum(['si', 'no']),
  codigoPostalTerreno: z.string().optional(),
  necesitaFinanciamiento: z.boolean(),
  comentarios: z.string().optional(),

  // Datos de contacto
  nombre: z.string().min(2),
  whatsapp: z.string().length(10).regex(/^[2-9]\d{9}$/, 'WhatsApp debe ser un número válido de 10 dígitos'),
  correo: z.string().email(),
  empresa: z.string().optional(),
}).refine((data) => {
  // Validar que si tieneTerreno='si', debe tener codigoPostalTerreno
  if (data.tieneTerreno === 'si') {
    return data.codigoPostalTerreno && data.codigoPostalTerreno.length === 5;
  }
  return true;
}, {
  message: "El código postal del terreno es requerido si ya tienes terreno",
  path: ["codigoPostalTerreno"],
});

// CUSTOM FORM SCHEMA
export const customSchema = z.object({
  tipoProyecto: z.string().min(1, 'Tipo de proyecto es requerido'),

  // Conditional fields (validated in refine)
  habitaciones: z.string().optional(),
  banos: z.string().optional(),
  metrosCuadrados: z.string().optional(),
  tipoNegocio: z.string().optional(),
  numeroEmpleados: z.string().optional(),

  tieneTerreno: z.enum(['si', 'no', 'asesoria']),
  codigoPostalTerreno: z.string().optional(),
  tiempoEntrega: z.string().min(1, 'Tiempo de entrega es requerido'),
  presupuesto: z.string().min(1, 'Presupuesto es requerido'),
  descripcion: z.string().optional(),
  necesitaFinanciamiento: z.enum(['si', 'no']),

  // Datos de contacto
  nombre: z.string().min(2),
  whatsapp: z.string().length(10).regex(/^[2-9]\d{9}$/, 'WhatsApp debe ser un número válido de 10 dígitos'),
  correo: z.string().email(),
  empresa: z.string().optional(),
  comentarios: z.string().optional(),

  // Campos opcionales
  archivosInspiracion: z.string().optional(),
}).refine((data) => {
  // Si tiene terreno, el código postal es obligatorio
  if (data.tieneTerreno === 'si') {
    return data.codigoPostalTerreno && data.codigoPostalTerreno.length === 5;
  }
  return true;
}, {
  message: "El código postal del terreno es requerido si ya tienes terreno",
  path: ["codigoPostalTerreno"],
}).refine((data) => {
  // CASA/CABAÑA: habitaciones, baños, m² REQUIRED
  if (data.tipoProyecto === 'casa-cabana') {
    if (!data.habitaciones || data.habitaciones.length === 0) {
      return false;
    }
    if (!data.banos || data.banos.length === 0) {
      return false;
    }
    if (!data.metrosCuadrados || data.metrosCuadrados.length === 0) {
      return false;
    }
    const metros = parseFloat(data.metrosCuadrados);
    if (isNaN(metros) || metros <= 0) {
      return false;
    }
  }
  return true;
}, {
  message: "Para casas/cabañas: habitaciones, baños y metros cuadrados son requeridos",
  path: ["habitaciones"],
}).refine((data) => {
  // OFICINAS: m² REQUIRED (min 20)
  if (data.tipoProyecto === 'oficinas-corporativas') {
    if (!data.metrosCuadrados || data.metrosCuadrados.length === 0) {
      return false;
    }
    const metros = parseFloat(data.metrosCuadrados);
    if (isNaN(metros) || metros < 20) {
      return false;
    }
  }
  return true;
}, {
  message: "Para oficinas corporativas se requieren mínimo 20 m²",
  path: ["metrosCuadrados"],
}).refine((data) => {
  // LOCAL COMERCIAL: tipoNegocio + m² REQUIRED (min 15)
  if (data.tipoProyecto === 'local-comercial') {
    if (!data.tipoNegocio || data.tipoNegocio.trim().length === 0) {
      return false;
    }
    if (!data.metrosCuadrados || data.metrosCuadrados.length === 0) {
      return false;
    }
    const metros = parseFloat(data.metrosCuadrados);
    if (isNaN(metros) || metros < 15) {
      return false;
    }
  }
  return true;
}, {
  message: "Para local comercial: tipo de negocio y mínimo 15 m² son requeridos",
  path: ["tipoNegocio"],
}).refine((data) => {
  // DESCRIPCIÓN: Si se proporciona, debe cumplir longitud mínima
  if (data.descripcion && data.descripcion.trim() !== '') {
    const minLength = data.tipoProyecto === 'proyecto-especial' ? 50 : 10;
    return data.descripcion.length >= minLength;
  }
  return true; // Si está vacío, OK (es opcional)
}, {
  message: "Si proporcionas una descripción, debe tener al menos 10 caracteres (50 para proyectos especiales)",
  path: ["descripcion"],
});

// Type exports para TypeScript
export type StorageFormData = z.infer<typeof storageSchema>;
export type StandardFormData = z.infer<typeof standardSchema>;
export type CustomFormData = z.infer<typeof customSchema>;
