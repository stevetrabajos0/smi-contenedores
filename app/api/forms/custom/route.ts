import { NextRequest, NextResponse } from 'next/server';
import { customSchema } from '@/lib/validations/form-schemas';
import { getLeadService, getValidationService } from '@/lib/application/container';
import { logger } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('⏱️ [API CUSTOM] Request recibido:', new Date().toISOString());

  try {
    const body = await request.json();

    const t1 = Date.now();
    logger.log('⏱️ [API CUSTOM] Body parseado en:', (t1 - t0), 'ms');
    logger.log('📥 CUSTOM API recibió:', JSON.stringify(body, null, 2));

    // Validate request body with Zod schema
    const validationResult = customSchema.safeParse(body);

    const t2 = Date.now();
    logger.log('⏱️ [API CUSTOM] Validación Zod en:', (t2 - t1), 'ms');

    if (!validationResult.success) {
      logger.error('❌ ERROR DE VALIDACIÓN CUSTOM:');
      logger.error(JSON.stringify(validationResult.error.issues, null, 2));

      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    logger.log('✅ Validación exitosa');
    const formData = validationResult.data;

    logger.log('🔄 Paso 1: Obteniendo servicios...');
    const validationService = getValidationService();
    const leadService = getLeadService();
    logger.log('✅ Servicios obtenidos');

    // Parse presupuesto (budget range)
    logger.log('🔄 Paso 2: Parseando presupuesto...');
    const presupuestoMap: Record<string, number> = {
      '500k-1m': 750000,
      '1m-2m': 1500000,
      '2m-5m': 3500000,
      'mas-5m': 6000000,
      'necesito-cotizacion': 500000,
    };
    const presupuesto = presupuestoMap[formData.presupuesto] || 500000;
    logger.log('✅ Presupuesto:', presupuesto);

    // Validate business rules
    logger.log('🔄 Paso 3: Validando reglas de negocio...');
    const businessValidation = validationService.validateLeadData({
      nombre: formData.nombre,
      whatsapp: formData.whatsapp,
      correo: formData.correo,
      tipoServicio: 'personalizado',
      presupuesto,
      codigoPostal: formData.codigoPostalTerreno,
      tieneTerreno: formData.tieneTerreno === 'si',
    });
    logger.log('Resultado validación negocio:', businessValidation);

    if (!businessValidation.isValid) {
      logger.error('❌ Validación de negocio falló:', businessValidation.errors);
      return NextResponse.json(
        {
          error: 'Validación de negocio fallida',
          details: businessValidation.errors,
        },
        { status: 400 }
      );
    }

    logger.log('✅ Validación de negocio exitosa');

    // Create lead using LeadService
    logger.log('🔄 Paso 4: Creando lead con datos:', {
      nombre: formData.nombre,
      whatsapp: formData.whatsapp,
      correo: formData.correo,
      empresa: formData.empresa,
      tipoServicio: 'personalizado',
      codigoPostal: formData.codigoPostalTerreno || '',
      tipoProyecto: formData.tipoProyecto,
      // Conditional fields (may be undefined depending on tipoProyecto)
      habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : undefined,
      banos: formData.banos ? parseInt(formData.banos) : undefined,
      metrosCuadrados: formData.metrosCuadrados ? parseInt(formData.metrosCuadrados) : undefined,
      tipoNegocio: formData.tipoNegocio,
      numeroEmpleados: formData.numeroEmpleados ? parseInt(formData.numeroEmpleados) : undefined,
      descripcionProyecto: formData.descripcion,
      tieneTerreno: formData.tieneTerreno === 'si',
      necesitaFinanciamiento: formData.necesitaFinanciamiento === 'si',
      timeline: formData.tiempoEntrega,
      presupuesto: formData.presupuesto,
      archivosInspiracion: formData.archivosInspiracion,
    });

    const tLeadStart = Date.now();
    let result;
    try {
      result = await leadService.createLead({
        nombre: formData.nombre,
        whatsapp: formData.whatsapp,
        correo: formData.correo,
        empresa: formData.empresa,
        tipoServicio: 'personalizado',
        codigoPostal: formData.codigoPostalTerreno || '',
        tipoProyecto: formData.tipoProyecto,
        habitaciones: formData.habitaciones ? parseInt(formData.habitaciones) : undefined,
        banos: formData.banos ? parseInt(formData.banos) : undefined,
        metrosCuadrados: formData.metrosCuadrados ? parseInt(formData.metrosCuadrados) : undefined,
        tipoNegocio: formData.tipoNegocio,
        numeroEmpleados: formData.numeroEmpleados ? parseInt(formData.numeroEmpleados) : undefined,
        descripcionProyecto: formData.descripcion,
        tieneTerreno: formData.tieneTerreno === 'si',
        necesitaFinanciamiento: formData.necesitaFinanciamiento === 'si',
        timeline: formData.tiempoEntrega,
        presupuesto: formData.presupuesto,
        archivosInspiracion: formData.archivosInspiracion,
        comentarios: formData.comentarios,
      });
      const tLeadEnd = Date.now();
      logger.log('⏱️ [API CUSTOM] LeadService.createLead en:', (tLeadEnd - tLeadStart), 'ms');
      logger.log('⏱️ [API CUSTOM] TOTAL API:', (tLeadEnd - t0), 'ms');
      logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      logger.log('✅ Lead creado exitosamente:', result.trackingCode);
    } catch (error) {
      logger.error('❌ ERROR creando lead:', error);
      throw error;
    }

    // NOTA: Notificaciones al usuario (WhatsApp/Email) se manejan en n8n
    // Ver workflow: https://paneln8n.fortumlab.com/webhook/lead-created

    return NextResponse.json(
      {
        success: true,
        trackingCode: result.trackingCode,
        message: 'Cotización recibida correctamente',
      },
      { status: 200 }
    );
  } catch (error) {
    const tError = Date.now();
    logger.log('⏱️ [API CUSTOM] Error en:', (tError - t0), 'ms');
    logger.error('❌ Error processing custom form:', error);
    logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return NextResponse.json(
      {
        error: 'Error al procesar la cotización',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
