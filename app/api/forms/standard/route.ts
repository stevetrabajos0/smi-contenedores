import { NextRequest, NextResponse } from 'next/server';
import { standardSchema } from '@/lib/validations/form-schemas';
import { getLeadService, getValidationService } from '@/lib/application/container';
import { PRECIOS_BASE_MODELOS, PRECIOS_BANOS, PRECIO_COCINA, IVA_RATE, type TipoBano, type ModeloEstandar } from '@/lib/constants/pricing';
import { logger } from '@/lib/utils';

// Helper function to convert modelo slug to pricing key
function getModeloKey(modeloSlug: string): ModeloEstandar {
  // Convert '10-pies' → '10', '20-pies' → '20', '40-pies' → '40'
  const match = modeloSlug?.match(/^(\d+)-pies$/);
  return (match ? match[1] : '20') as ModeloEstandar;
}

// Helper function to get modelo name
function getModeloName(modeloSlug: string): string {
  const modeloNames: Record<string, string> = {
    '10-pies': 'Modelo 10 Pies',
    '20-pies': 'Modelo 20 Pies',
    '40-pies': 'Modelo 40 Pies',
  };
  return modeloNames[modeloSlug] || 'Modelo Estándar';
}

export async function POST(request: NextRequest) {
  const t0 = Date.now();
  logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.log('⏱️ [API STANDARD] Request recibido:', new Date().toISOString());

  try {
    const body = await request.json();

    const t1 = Date.now();
    logger.log('⏱️ [API STANDARD] Body parseado en:', (t1 - t0), 'ms');
    logger.log('📥 STANDARD API recibió:', JSON.stringify(body, null, 2));

    // Validate request body with Zod schema
    const validationResult = standardSchema.safeParse(body);

    const t2 = Date.now();
    logger.log('⏱️ [API STANDARD] Validación Zod en:', (t2 - t1), 'ms');

    if (!validationResult.success) {
      logger.error('❌ ERROR DE VALIDACIÓN STANDARD:');
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

    // Calcular presupuesto completo con extras
    logger.log('🔄 Paso 2: Calculando presupuesto con extras...');
    const modeloKey = getModeloKey(formData.modeloSeleccionado);
    const modeloNombre = getModeloName(formData.modeloSeleccionado);
    const precioBase = PRECIOS_BASE_MODELOS[modeloKey];
    const precioBano = PRECIOS_BANOS[formData.tipoBano as TipoBano] || 0;
    const precioCocina = formData.cocina ? PRECIO_COCINA : 0;

    const subtotal = precioBase + precioBano + precioCocina;
    const iva = Math.round(subtotal * IVA_RATE);
    const total = subtotal + iva;

    logger.log('💰 Desglose de precios:');
    logger.log(`   - Precio base (${modeloNombre}): $${precioBase.toLocaleString('es-MX')}`);
    logger.log(`   - Baño (${formData.tipoBano}): $${precioBano.toLocaleString('es-MX')}`);
    logger.log(`   - Cocina: $${precioCocina.toLocaleString('es-MX')}`);
    logger.log(`   - Subtotal: $${subtotal.toLocaleString('es-MX')}`);
    logger.log(`   - IVA (16%): $${iva.toLocaleString('es-MX')}`);
    logger.log(`   - TOTAL: $${total.toLocaleString('es-MX')}`);
    logger.log(`✅ Form: modelo-estandar, Precio calculado: $${total.toLocaleString('es-MX')}`);

    // Validate business rules
    logger.log('🔄 Paso 3: Validando reglas de negocio...');
    const businessValidation = validationService.validateLeadData({
      nombre: formData.nombre,
      whatsapp: formData.whatsapp,
      correo: formData.correo,
      tipoServicio: 'modelo-estandar',
      presupuesto: total,
      codigoPostal: formData.codigoPostalTerreno || '',
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
    const leadData: any = {
      nombre: formData.nombre,
      whatsapp: formData.whatsapp,
      correo: formData.correo,
      empresa: formData.empresa || null,
      tipoServicio: 'modelo-estandar',
      codigoPostal: formData.codigoPostalTerreno || '', // Usar CP del terreno como CP de entrega
      modeloSeleccionado: formData.modeloSeleccionado,
      tipoBano: formData.tipoBano,
      cocina: formData.cocina,
      tieneTerreno: formData.tieneTerreno === 'si',
      necesitaFinanciamiento: formData.necesitaFinanciamiento || false,
      timeline: formData.tiempoEntrega,
      presupuesto: total,
      comentarios: formData.comentarios,
      // Pricing breakdown stored in form_data JSONB
      pricingBreakdown: {
        precioBase,
        modeloNombre: modeloNombre,
        precioBano,
        tipoBano: formData.tipoBano,
        precioCocina,
        subtotal,
        iva,
        total,
      },
    };

    // Solo incluir codigoPostalTerreno si tieneTerreno='si'
    if (formData.tieneTerreno === 'si' && formData.codigoPostalTerreno) {
      leadData.codigoPostalTerreno = formData.codigoPostalTerreno;
    }

    logger.log('🔄 Paso 4: Creando lead con datos:', leadData);

    const tLeadStart = Date.now();
    let result;
    try {
      result = await leadService.createLead(leadData);
      const tLeadEnd = Date.now();
      logger.log('⏱️ [API STANDARD] LeadService.createLead en:', (tLeadEnd - tLeadStart), 'ms');
      logger.log('⏱️ [API STANDARD] TOTAL API:', (tLeadEnd - t0), 'ms');
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
    logger.log('⏱️ [API STANDARD] Error en:', (tError - t0), 'ms');
    logger.error('❌ Error processing standard form:', error);
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
