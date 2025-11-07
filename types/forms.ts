export interface StorageFormData {
  tipoServicio: string;
  codigoPostal: string;
  tamanoContenedor: '10' | '20' | '40';
  codigoPostalDestino?: string;
  ubicacionContenedor?: string;
  fechaEntrega: string;
  duracionAlmacenamiento?: string;
  nombre: string;
  whatsapp: string;
  correo: string;
  preferenciaContacto: string;
}

export interface StandardFormData {
  modeloSeleccionado: string;
  tiempoEntrega: string;
  tieneTerreno: string;
  presupuesto: string;
  nombre: string;
  empresa: string;
  whatsapp: string;
  correo: string;
  codigoPostal: string;
  comentarios: string;
}

export interface CustomFormData {
  tipoProyecto: string;
  habitaciones: string;
  banos: string;
  metrosCuadrados: string;
  tieneTerreno: string;
  codigoPostalTerreno: string;
  tiempoEntrega: string;
  presupuesto: string;
  descripcion: string;
  archivosInspiracion: string;
  nombre: string;
  empresa: string;
  whatsapp: string;
  correo: string;
  necesitaFinanciamiento: string;
}
