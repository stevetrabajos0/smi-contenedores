import { NextRequest, NextResponse } from 'next/server';
import { storageSchema } from '@/lib/validations/form-schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validationResult = storageSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const formData = validationResult.data;

    // Generate tracking code
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const trackingCode = `SMI-${year}-${randomNum}`;

    // TODO: Save to Airtable
    // const airtableData = {
    //   'Tipo Servicio': formData.tipoServicio,
    //   'Código Postal': formData.codigoPostal,
    //   'Mudanza Hacia': formData.mudanzaHacia || '',
    //   'Fecha Entrega': formData.fechaEntrega,
    //   'Duración Almacenamiento': formData.duracionAlmacenamiento,
    //   'Ubicación Almacenamiento': formData.ubicacionAlmacenamiento,
    //   'Nombre': formData.nombre,
    //   'WhatsApp': formData.whatsapp,
    //   'Correo': formData.correo,
    //   'Preferencia Contacto': formData.preferenciaContacto,
    //   'Tracking Code': trackingCode,
    //   'Fecha Creación': new Date().toISOString(),
    // };

    // For now, just log the data
    console.log('Storage form submission:', {
      trackingCode,
      formData,
    });

    return NextResponse.json(
      {
        success: true,
        trackingCode,
        message: 'Cotización recibida correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing storage form:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la cotización',
      },
      { status: 500 }
    );
  }
}
