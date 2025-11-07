'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PricingSidebar from '@/components/forms/shared/PricingSidebar';
import AlmacenamientoPricingSidebar from '@/components/forms/storage/AlmacenamientoPricingSidebar';
import CompraPricingSidebar from '@/components/forms/storage/CompraPricingSidebar';
import { PRECIOS_BASE_MODELOS, PRECIOS_COMPRA_CONTENEDORES, type ModeloEstandar } from '@/lib/constants/pricing';

// Helper functions (from modelo-estandar form)
function getModeloKey(modeloSlug: string): ModeloEstandar {
  const match = modeloSlug?.match(/^(\d+)-pies$/);
  return (match ? match[1] : '20') as ModeloEstandar;
}

function getModeloName(modeloSlug: string): string {
  const modeloNames: Record<string, string> = {
    '10-pies': 'Modelo 10 Pies',
    '20-pies': 'Modelo 20 Pies',
    '40-pies': 'Modelo 40 Pies',
  };
  return modeloNames[modeloSlug] || 'Modelo Estándar';
}

export default function GraciasContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);

  const tipo = searchParams.get('tipo') || '';
  // trackingCode still generated on backend but not displayed to users
  // const trackingCode = searchParams.get('trackingCode') || '';

  // Estado para datos del modelo cotizado
  const [modeloData, setModeloData] = useState<any>(null);
  const [proyectoData, setProyectoData] = useState<any>(null);
  const [almacenamientoData, setAlmacenamientoData] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Recuperar datos del modelo cotizado desde localStorage
  useEffect(() => {
    if (tipo === 'modelo-estandar') {
      const stored = localStorage.getItem('smi-ultimo-modelo-cotizado');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          // Verificar que no sea muy viejo (máx 1 hora)
          const timestamp = new Date(data.timestamp);
          const ahora = new Date();
          const horasTranscurridas = (ahora.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

          if (horasTranscurridas < 1) {
            setModeloData(data);
          }
          // Limpiar después de usar
          localStorage.removeItem('smi-ultimo-modelo-cotizado');
        } catch (e) {
          console.error('Error recuperando datos del modelo:', e);
        }
      }
    } else if (tipo === 'proyecto-personalizado') {
      const stored = localStorage.getItem('smi-ultimo-personalizado');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          // Verificar que no sea muy viejo (máx 1 hora)
          const timestamp = new Date(data.timestamp);
          const ahora = new Date();
          const horasTranscurridas = (ahora.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

          if (horasTranscurridas < 1) {
            setProyectoData(data);
          }
          // Limpiar después de usar
          localStorage.removeItem('smi-ultimo-personalizado');
        } catch (e) {
          console.error('Error recuperando datos del proyecto:', e);
        }
      }
    } else if (tipo === 'almacenamiento') {
      const stored = localStorage.getItem('smi-ultimo-almacenamiento');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          // Verificar que no sea muy viejo (máx 1 hora)
          const timestamp = new Date(data.timestamp);
          const ahora = new Date();
          const horasTranscurridas = (ahora.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

          if (horasTranscurridas < 1) {
            setAlmacenamientoData(data);
          }
          // Limpiar después de usar
          localStorage.removeItem('smi-ultimo-almacenamiento');
        } catch (e) {
          console.error('Error recuperando datos de almacenamiento:', e);
        }
      }
    }
  }, [tipo]);

  // Contenido personalizado según tipo
  const contenidoPorTipo = {
    'almacenamiento': {
      titulo: 'Tu Solicitud de Contenedor ha sido Recibida',
      descripcion: 'Revisaremos la disponibilidad y te enviaremos una cotización personalizada',
    },
    'modelo-estandar': {
      titulo: 'Tu Solicitud de Modelo Estándar ha sido Recibida',
      descripcion: 'Nuestro equipo revisará tu solicitud y te enviará opciones disponibles',
    },
    'proyecto-personalizado': {
      titulo: 'Tu Solicitud de Proyecto Personalizado ha sido Recibida',
      descripcion: 'Nuestro equipo de diseño analizará tu proyecto y preparará una propuesta',
    },
  };

  const contenido = contenidoPorTipo[tipo as keyof typeof contenidoPorTipo] || {
    titulo: 'Tu Cotización ha sido Recibida',
    descripcion: 'Te contactaremos pronto con más información',
  };

  // Construcción del mensaje de WhatsApp personalizado
  const tipoTexto = {
    'modelo-estandar': 'Modelo Estándar',
    'proyecto-personalizado': 'Proyecto Personalizado',
    'almacenamiento': 'Almacenamiento/Mudanza'
  }[tipo] || 'servicio';

  const whatsappMessage = encodeURIComponent(
    `¡Hola! Acabo de enviar una cotización de ${tipoTexto}. Me gustaría recibir más información.`
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 sm:p-12">

          {/* Icono de éxito */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Título personalizado */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
            ¡Gracias por tu Interés!
          </h1>

          {/* Mensaje personalizado según tipo */}
          <div className="text-center mb-8">
            <p className="text-xl text-slate-600 mb-2">
              {contenido.titulo}
            </p>
            <p className="text-base text-slate-500">
              {contenido.descripcion}
            </p>
            <p className="text-base text-slate-600 mt-4">
              Te contactaremos en las próximas 24 horas para darte seguimiento personalizado.
            </p>
          </div>

          {/* WhatsApp CTA Principal */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              ¿Tienes dudas? ¡Contáctanos ahora!
            </h3>
            <p className="text-gray-600 mb-4">
              Nuestro equipo está listo para atenderte y resolver cualquier pregunta sobre tu cotización.
            </p>

            <a
              href={`https://wa.me/526621030059?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chatear por WhatsApp
            </a>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t border-slate-200">
            <Link
              href="/"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                       px-8 py-3 rounded-lg font-semibold transition-colors
                       inline-flex items-center justify-center"
            >
              Volver al Inicio
            </Link>
            <Link
              href="/cotizar"
              className="border-2 border-slate-300 hover:border-[#D32F2F]
                       hover:bg-slate-50 text-slate-900
                       px-8 py-3 rounded-lg font-semibold transition-colors
                       inline-flex items-center justify-center"
            >
              Nueva Cotización
            </Link>
          </div>

          {/* Pricing para modelo estándar */}
          {tipo === 'modelo-estandar' && modeloData && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                Tu Cotización
              </h3>
              <PricingSidebar
                precioBase={PRECIOS_BASE_MODELOS[getModeloKey(modeloData.modeloSeleccionado)]}
                modeloNombre={getModeloName(modeloData.modeloSeleccionado)}
                tipoBano={modeloData.tipoBano}
                cocina={modeloData.cocina}
              />

              {/* Info adicional del cliente */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{modeloData.nombre}</strong>, te contactaremos al WhatsApp{' '}
                  <strong>{modeloData.whatsapp}</strong> con los detalles de tu cotización.
                </p>
              </div>
            </div>
          )}

          {/* Info para proyecto personalizado */}
          {tipo === 'proyecto-personalizado' && proyectoData && (
            <div className="mt-8 pt-8 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                Detalles de tu Proyecto
              </h3>
              <div className="bg-slate-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Tipo de proyecto:</span>
                  <span className="font-medium text-slate-900">
                    {proyectoData.tipoProyecto === 'casa-cabana' && 'Casa/Cabaña'}
                    {proyectoData.tipoProyecto === 'oficinas-corporativas' && 'Oficinas Corporativas'}
                    {proyectoData.tipoProyecto === 'local-comercial' && 'Local Comercial'}
                    {proyectoData.tipoProyecto === 'proyecto-especial' && 'Proyecto Especial'}
                  </span>
                </div>
                {proyectoData.metrosCuadrados && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Metros cuadrados:</span>
                    <span className="font-medium text-slate-900">{proyectoData.metrosCuadrados} m²</span>
                  </div>
                )}
                {proyectoData.presupuesto && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rango de presupuesto:</span>
                    <span className="font-medium text-slate-900">
                      {proyectoData.presupuesto === '500k-1m' && '$500K - $1M'}
                      {proyectoData.presupuesto === '1m-2m' && '$1M - $2M'}
                      {proyectoData.presupuesto === '2m-5m' && '$2M - $5M'}
                      {proyectoData.presupuesto === 'mas-5m' && 'Más de $5M'}
                      {proyectoData.presupuesto === 'necesito-cotizacion' && 'Necesito cotización'}
                    </span>
                  </div>
                )}
              </div>

              {/* Info adicional del cliente */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{proyectoData.nombre}</strong>
                  {proyectoData.empresa && ` de ${proyectoData.empresa}`}, te contactaremos al WhatsApp{' '}
                  <strong>{proyectoData.whatsapp}</strong> para analizar los detalles de tu proyecto personalizado.
                </p>
              </div>
            </div>
          )}

          {/* Pricing para almacenamiento */}
          {tipo === 'almacenamiento' && almacenamientoData && (() => {
            const { tipoServicio, modalidadAlmacenamiento, tamanoContenedor, tipoAcceso, nombre, whatsapp } = almacenamientoData;

            // CASO 1: RENTA - Mostrar pricing completo
            if (modalidadAlmacenamiento === 'renta' && almacenamientoData.modelo) {
              return (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                    Tu Cotización de Renta
                  </h3>
                  <AlmacenamientoPricingSidebar
                    precioMensual={almacenamientoData.precioMensual}
                    duracionMeses={almacenamientoData.duracionMeses}
                    costoSinDescuento={almacenamientoData.costoSinDescuento}
                    descuentoDuracion={almacenamientoData.descuentoDuracion}
                    descuentoUbicacion={almacenamientoData.descuentoUbicacion}
                    descuentoTotal={almacenamientoData.descuentoTotal}
                    montoDescuento={almacenamientoData.montoDescuento}
                    subtotalRenta={almacenamientoData.subtotalRenta}
                    costoTransporte={almacenamientoData.costoTransporte}
                    subtotal={almacenamientoData.subtotal}
                    iva={almacenamientoData.iva}
                    total={almacenamientoData.total}
                    modeloNombre={`Contenedor ${almacenamientoData.modelo} Pies`}
                  />

                  {/* Info adicional del cliente */}
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{nombre}</strong>, te contactaremos al WhatsApp{' '}
                      <strong>{whatsapp}</strong> para confirmar los detalles de tu renta.
                    </p>
                  </div>
                </div>
              );
            }

            // CASO 2: COMPRA - Mostrar pricing simple
            if (modalidadAlmacenamiento === 'compra' && tamanoContenedor && tipoAcceso) {
              const precioCompra = PRECIOS_COMPRA_CONTENEDORES[tamanoContenedor as ModeloEstandar]?.[tipoAcceso as 'cortinilla' | 'puertas-dobles'];

              if (precioCompra) {
                return (
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                      Tu Cotización de Compra
                    </h3>
                    <CompraPricingSidebar
                      precioBase={precioCompra}
                      modeloNombre={`Contenedor ${tamanoContenedor} Pies`}
                      tipoAcceso={tipoAcceso}
                    />

                    {/* Info adicional del cliente */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>{nombre}</strong>, te contactaremos al WhatsApp{' '}
                        <strong>{whatsapp}</strong> para confirmar los detalles de tu compra.
                      </p>
                    </div>
                  </div>
                );
              } else {
                // Precio bajo pedido
                return (
                  <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 text-center">
                      <h3 className="text-lg font-semibold text-amber-900 mb-2">
                        Cotización Personalizada
                      </h3>
                      <p className="text-amber-800">
                        El precio de este contenedor se cotiza bajo pedido. Te contactaremos pronto con el precio exacto.
                      </p>
                    </div>
                  </div>
                );
              }
            }

            // CASO 3: MUDANZA - NO mostrar pricing, solo mensaje
            if (tipoServicio === 'mudanza') {
              return (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 18.5a1.5 1.5 0 01-1.5-1.5 1.5 1.5 0 011.5-1.5 1.5 1.5 0 011.5 1.5 1.5 1.5 0 01-1.5 1.5m1.5-9l1.96 2.5H17V9.5M6 18.5A1.5 1.5 0 014.5 17 1.5 1.5 0 016 15.5 1.5 1.5 0 017.5 17 1.5 1.5 0 016 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 003 3 3 3 0 003-3h6a3 3 0 003 3 3 3 0 003-3h2v-5l-3-4z"/>
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">
                          Cotización de Mudanza
                        </h3>
                        <p className="text-sm text-blue-800 mb-3">
                          El precio de tu mudanza se calcula en función de la distancia entre tu ubicación y el destino.
                        </p>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Tarifa por distancia:
                          </p>
                          <p className="text-lg font-bold text-blue-700">
                            $60 por kilómetro
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            (Desde Hermosillo)
                          </p>
                        </div>
                        <p className="text-sm text-blue-700 mt-3">
                          <strong>{nombre}</strong>, te contactaremos al WhatsApp{' '}
                          <strong>{whatsapp}</strong> con la cotización exacta basada en tu ubicación.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })()}

        </div>

        {/* Mensaje final */}
        <p className="text-center text-slate-500 mt-6 text-sm">
          También te enviaremos una confirmación por correo electrónico
        </p>

      </div>
    </div>
  );
}
