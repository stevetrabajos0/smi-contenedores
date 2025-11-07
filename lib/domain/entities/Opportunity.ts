export class Opportunity {
  constructor(
    public readonly id: string | null,
    public readonly contactId: string,

    // Campos críticos
    public readonly tipoServicio: 'almacenamiento' | 'mudanza' | 'almacenamiento-mudanza' | 'modelo-estandar' | 'personalizado' | 'consulta-general',
    public readonly codigoPostal: string,
    public readonly trackingCode: string,

    // Almacenamiento/Mudanza (opcionales)
    public readonly subtipo?: string,
    public readonly tamanoContenedor?: '10' | '20' | '40',
    public readonly duracionAlmacenamiento?: string,
    public readonly ubicacionContenedor?: 'mi-ubicacion' | 'bodega-smi',
    public readonly tipoAcceso?: 'cortinilla' | 'puertas-dobles',
    public readonly codigoPostalDestino?: string,

    // Modelo Estándar (opcionales)
    public readonly modeloSeleccionado?: string,
    public readonly tieneTerreno?: boolean,
    public readonly necesitaFinanciamiento?: boolean,

    // Personalizado (opcionales)
    public readonly tipoProyecto?: string,
    public readonly habitaciones?: number,
    public readonly banos?: number,
    public readonly metrosCuadrados?: number,
    public readonly tipoNegocio?: string,
    public readonly numeroEmpleados?: number,
    public readonly descripcionProyecto?: string,
    public readonly archivosInspiracion?: string,

    // Universales (opcionales)
    public readonly timeline?: string,
    public readonly presupuesto?: string,
    public readonly preferenciaContacto?: 'whatsapp' | 'correo' | 'telefono',

    // Metadata
    public readonly nombre?: string,
    public readonly stage?: string,
    public readonly valorEstimado?: number,
    public readonly fechaCierreEstimada?: Date,
    public readonly fechaCreacion?: Date,
    public readonly source?: string,
  ) {}

  static generateTrackingCode(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `SMI-${year}-${random}`;
  }
}
