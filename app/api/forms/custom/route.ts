import { NextRequest, NextResponse } from 'next/server';
import { customSchema } from '@/lib/validations/form-schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod schema
    const validationResult = customSchema.safeParse(body);

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
    //   'Tipo Proyecto': formData.tipoProyecto,
    //   'Habitaciones': formData.habitaciones,
    //   'Baños': formData.banos,
    //   'Metros Cuadrados': formData.metrosCuadrados,
    //   'Tiene Terreno': formData.tieneTerreno,
    //   'Código Postal Terreno': formData.codigoPostalTerreno || '',
    //   'Tiempo Entrega': formData.tiempoEntrega,
    //   'Presupuesto': formData.presupuesto,
    //   'Descripción': formData.descripcion,
    //   'Archivos Inspiración': formData.archivosInspiracion || '',
    //   'Nombre': formData.nombre,
    //   'Empresa': formData.empresa || '',
    //   'WhatsApp': formData.whatsapp,
    //   'Correo': formData.correo,
    //   'Necesita Financiamiento': formData.necesitaFinanciamiento,
    //   'Mejor Horario Contacto': formData.mejorHorarioContacto,
    //   'Tracking Code': trackingCode,
    //   'Fecha Creación': new Date().toISOString(),
    // };

    // For now, just log the data
    console.log('Custom form submission:', {
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
    console.error('Error processing custom form:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar la cotización',
      },
      { status: 500 }
    );
  }
}
