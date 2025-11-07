export class Contact {
  id?: string;
  nombre: string;
  whatsapp: string;
  correo?: string;
  empresa?: string;
  fechaRegistro: Date;

  constructor(
    nombre: string,
    whatsapp: string,
    correo: string | undefined,
    fechaRegistro: Date,
    empresa?: string,
    id?: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.whatsapp = whatsapp;
    this.correo = correo;
    this.empresa = empresa;
    this.fechaRegistro = fechaRegistro;
  }

  static create(data: {
    nombre: string;
    whatsapp: string;
    correo?: string;
    empresa?: string;
    id?: string;
  }): Contact {
    // Validate nombre is not empty
    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }

    // Validate whatsapp is 10 digits
    const whatsappDigits = data.whatsapp.replace(/\D/g, '');
    if (whatsappDigits.length !== 10) {
      throw new Error('El WhatsApp debe tener 10 dígitos');
    }

    // Validate email format (only if provided)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.correo && !emailRegex.test(data.correo)) {
      throw new Error('El formato del correo electrónico es inválido');
    }

    return new Contact(
      data.nombre.trim(),
      whatsappDigits,
      data.correo ? data.correo.trim().toLowerCase() : undefined,
      new Date(),
      data.empresa?.trim(),
      data.id
    );
  }
}
