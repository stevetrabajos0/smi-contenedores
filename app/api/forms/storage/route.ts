import { NextResponse } from 'next/server';
import { storageSchema } from '@/lib/validations/form-schemas';
import { getLeadService } from '@/lib/application/container';
import { logger } from '@/lib/utils';
import {
  generarCotizacionRenta,
  type ModeloEstandar,
  type UbicacionContenedor,
  type CotizacionRenta
} from '@/lib/constants/pricing';

export async function POST(request: Request) {
  const t0 = Date.now();
  logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('⏱️ [API STORAGE] Request recibido:', new Date().toISOString());

  try {
    const body = await request.json();

    const t1 = Date.now();
    logger.log('⏱️ [API STORAGE] Body parseado en:', (t1 - t0), 'ms');
    logger.log('📥 STORAGE API recibió:', JSON.stringify(body, null, 2));

    // Validar datos con schema centralizado
    let validatedData;
    try {
      validatedData = storageSchema.parse(body);
      const t2 = Date.now();
      logger.log('⏱️ [API STORAGE] Validación Zod en:', (t2 - t1), 'ms');
      logger.log('✅ Validación exitosa');
    } catch (error: any) {
      logger.error('❌ ERROR DE VALIDACIÓN STORAGE:');
      logger.error(JSON.stringify(error.issues || error, null, 2));
      throw error;
    }

    // Mapear solo 'ambos' a kebab-case, el resto pasa directo
    const tipoServicio = validatedData.tipoServicio === 'ambos'
      ? 'almacenamiento-mudanza'
      : validatedData.tipoServicio;

    // Calcular pricing si es renta
    let pricingBreakdown: CotizacionRenta | null = null;

    if (validatedData.modalidadAlmacenamiento === 'renta' &&
        (validatedData.tipoServicio === 'almacenamiento' || validatedData.tipoServicio === 'ambos')) {

      // Mapear ubicación: 'mi-ubicacion' → 'terreno', 'bodega-smi' → 'bodega'
      const ubicacion: UbicacionContenedor = validatedData.ubicacionContenedor === 'bodega-smi'
        ? 'bodega'
        : 'terreno';

      // Parsear duración a número (viene como '1', '3', '6', '12')
      const duracionMeses = parseInt(validatedData.duracionAlmacenamiento || '1', 10);

      // Generar cotización de renta
      pricingBreakdown = generarCotizacionRenta({
        modelo: validatedData.tamanoContenedor as ModeloEstandar,
        duracionMeses: duracionMeses,
        ubicacion: ubicacion,
        codigoPostalDestino: validatedData.codigoPostal, // Usar código postal origen como destino
      });

      logger.log('💰 Pricing calculado para renta:');
      logger.log('  - Modelo:', pricingBreakdown.modelo);
      logger.log('  - Precio mensual:', pricingBreakdown.precioMensual);
      logger.log('  - Duración:', pricingBreakdown.duracionMeses, 'meses');
      logger.log('  - Descuento total:', (pricingBreakdown.descuentoTotal * 100).toFixed(0) + '%');
      logger.log('  - Total:', pricingBreakdown.total);
    }

    // Crear lead con LeadService
    const tLeadStart = Date.now();
    const leadService = getLeadService();
    const result = await leadService.createLead({
      // Contacto
      nombre: validatedData.nombre,
      whatsapp: validatedData.whatsapp,
      correo: validatedData.correo,
      empresa: validatedData.empresa,

      // Oportunidad - Campos críticos
      tipoServicio: tipoServicio as 'almacenamiento' | 'mudanza' | 'almacenamiento-mudanza',
      codigoPostal: validatedData.codigoPostal,

      // Oportunidad - Campos específicos de Almacenamiento/Mudanza
      tamanoContenedor: validatedData.tamanoContenedor,
      duracionAlmacenamiento: validatedData.duracionAlmacenamiento || undefined,
      ubicacionContenedor: validatedData.ubicacionContenedor,
      tipoAcceso: validatedData.tipoAcceso || undefined,
      codigoPostalDestino: validatedData.codigoPostalDestino || undefined,

      // Oportunidad - Metadata
      timeline: validatedData.fechaEntrega,
      modalidadAlmacenamiento: validatedData.modalidadAlmacenamiento,
      pricingBreakdown: pricingBreakdown || undefined,
      comentarios: validatedData.comentarios,
    }, 'web');

    const tLeadEnd = Date.now();
    logger.log('⏱️ [API STORAGE] LeadService.createLead en:', (tLeadEnd - tLeadStart), 'ms');
    logger.log('⏱️ [API STORAGE] TOTAL API:', (tLeadEnd - t0), 'ms');
    logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    return NextResponse.json({
      success: true,
      trackingCode: result.trackingCode,
      contactId: result.contact.id,
      opportunityId: result.opportunity.id,
      pricingBreakdown: pricingBreakdown || undefined,
    });

  } catch (error: unknown) {
    const tError = Date.now();
    logger.log('⏱️ [API STORAGE] Error en:', (tError - t0), 'ms');
    logger.error('❌ Error en storage form:', error);
    logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    const err = error as Error & { name?: string; errors?: unknown };

    if (err.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: err.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: err.message || 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
