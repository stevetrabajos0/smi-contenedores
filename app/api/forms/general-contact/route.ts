import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getLeadService } from '@/lib/application/container';

/**
 * Schema de validación para formulario de contacto general
 * Campos mínimos para leads "warm" de asesoría general
 */
const generalContactSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener mínimo 2 caracteres'),
  whatsapp: z.string().regex(/^\d{10}$/, 'WhatsApp debe ser 10 dígitos'),
  servicioInteres: z.enum([
    'almacenamiento',
    'mudanza',
    'almacenamiento-mudanza',
    'modelo-estandar',
    'proyecto-personalizado',
    'no-estoy-seguro'
  ]),
  mensaje: z.string().max(200, 'Mensaje muy largo').optional(),
  source: z.string()
});

/**
 * NOTA: Todas las consultas generales se marcan como 'consulta-general'
 * El servicioInteres específico se preserva en metadata para seguimiento
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('📥 API General Contact recibió:', body);

    // Validación con Zod
    const validatedData = generalContactSchema.parse(body);

    console.log('✅ Validación exitosa');

    // Obtener LeadService
    const leadService = getLeadService();

    // Crear lead - SIEMPRE como 'consulta-general'
    const result = await leadService.createLead({
      // Contacto básico
      nombre: validatedData.nombre,
      whatsapp: validatedData.whatsapp,
      correo: undefined,  // Email no capturado (nullable desde Phase 1.1)
      empresa: undefined,  // No capturamos en form general

      // Oportunidad - FORZAR consulta-general
      tipoServicio: 'consulta-general',
      codigoPostal: '83000', // Placeholder - Hermosillo base

      // Metadata: Preservar servicioInteres original + mensaje
      ...(validatedData.mensaje && {
        descripcionProyecto: validatedData.mensaje
      }),
      timeline: 'Por definir',

      // Preservar el interés original del usuario en comentarios
      comentarios: `Servicio de interés: ${validatedData.servicioInteres}`
    }, validatedData.source);

    console.log('✅ Lead general creado:', result.trackingCode);

    return NextResponse.json({
      success: true,
      trackingCode: result.trackingCode,
      message: 'Contacto registrado exitosamente'
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error en API General Contact:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos',
        details: error.issues
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error al procesar solicitud'
    }, { status: 500 });
  }
}
