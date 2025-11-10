'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ContactFields from '@/components/forms/shared/ContactFields';
import SelectField from '@/components/forms/shared/SelectField';
import PostalCodeField from '@/components/forms/inputs/PostalCodeField';
import { getWhatsAppLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { loadFormData, saveFormData, clearFormData, STORAGE_KEYS } from '@/lib/constants/storage-keys';
import { DESCUENTOS_DURACION } from '@/lib/constants/pricing';
import { logger } from '@/lib/utils';

export default function AlmacenamientoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      // Try loading from new storage key
      const saved = loadFormData<any>(STORAGE_KEYS.almacenamiento);
      if (saved) {
        const isRecent = Date.now() - saved.timestamp < 30 * 60 * 1000; // 30 min
        if (isRecent) {
          // Convertir fechaEntrega de string a Date
          if (saved.fechaEntrega) {
            saved.fechaEntrega = new Date(saved.fechaEntrega);
          }
          return saved;
        }
      } else {
        // Migration: try loading from old key
        try {
          const oldKey = 'smi-storage-form-cotizar';
          const oldData = localStorage.getItem(oldKey);
          if (oldData) {
            const parsed = JSON.parse(oldData);
            const isRecent = Date.now() - parsed.timestamp < 30 * 60 * 1000;
            if (isRecent) {
              // Convertir fechaEntrega de string a Date
              if (parsed.fechaEntrega) {
                parsed.fechaEntrega = new Date(parsed.fechaEntrega);
              }
              // Save to new key and remove old key
              saveFormData(STORAGE_KEYS.almacenamiento, parsed);
              localStorage.removeItem(oldKey);
              logger.log('✅ Migrated form data from old key to new key');
              return parsed;
            }
          }
        } catch (e) {
          logger.error('Error migrating old form data:', e);
        }
      }
    }
    return {
      tipoServicio: '',
      modalidadAlmacenamiento: '',
      tipoAcceso: '', // NUEVO: tipo de acceso para COMPRA (cortinilla o puertas)
      origenCiudad: '',
      codigoPostal: '',
      tamanoContenedor: '',
      ubicacionContenedor: '',
      duracionAlmacenamiento: '',
      fechaEntrega: null as Date | null,
      codigoPostalDestino: '',
      nombre: '',
      whatsapp: '',
      correo: '',
      empresa: '',
      comentarios: '',
      newsletter: false
    };
  });

  // Mount detection para evitar hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Helper function to get discount info from pricing SSOT
  const getDiscountInfo = (duracion: string): { discount: number; label: string } => {
    const months = duracion === '12+' ? 12 : parseInt(duracion);
    const discountRate = DESCUENTOS_DURACION[months] || 0;
    const discountPercent = Math.round(discountRate * 100);

    return discountPercent > 0
      ? { discount: discountPercent, label: `¡${discountPercent}% de descuento!` }
      : { discount: 0, label: '' };
  };

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Persistir en localStorage en tiempo real
    saveFormData(STORAGE_KEYS.almacenamiento, updated);

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipoServicio) {
      newErrors.tipoServicio = 'Selecciona un tipo de servicio';
    }

    if (!formData.codigoPostal || formData.codigoPostal.length !== 5) {
      newErrors.codigoPostal = 'Ingresa un código postal válido de 5 dígitos';
    } else if (!/^\d{5}$/.test(formData.codigoPostal)) {
      newErrors.codigoPostal = 'El código postal debe contener solo números';
    }

    // NUEVO: Validar modalidadAlmacenamiento si es almacenamiento o ambos
    if (formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') {
      if (!formData.modalidadAlmacenamiento) {
        newErrors.modalidadAlmacenamiento = 'Selecciona si quieres rentar o comprar';
      }

      // NUEVO: Validar tipoAcceso solo si modalidad es COMPRA
      if (formData.modalidadAlmacenamiento === 'compra' && !formData.tipoAcceso) {
        newErrors.tipoAcceso = 'Selecciona el tipo de acceso que prefieres';
      }
    }

    // NUEVO: Validar origenCiudad si es mudanza o ambos
    if (formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos') {
      if (!formData.origenCiudad || formData.origenCiudad.trim().length < 2) {
        newErrors.origenCiudad = 'Ingresa la ciudad de origen';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleStep1Next = () => {
    if (!validateStep1()) return;

    saveFormData(STORAGE_KEYS.almacenamiento, {
      ...formData,
      fechaEntrega: formData.fechaEntrega ? formData.fechaEntrega.toISOString() : null,
      currentStep: 2,
      timestamp: Date.now()
    });

    setCurrentStep(2);
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tamanoContenedor) {
      newErrors.tamanoContenedor = 'Selecciona un tamaño de contenedor';
    }

    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'Selecciona una fecha de entrega';
    }

    // ACTUALIZADO: Solo validar ubicacion y duracion si modalidad es RENTA
    if ((formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') &&
        formData.modalidadAlmacenamiento === 'renta') {
      if (!formData.ubicacionContenedor) {
        newErrors.ubicacionContenedor = 'Selecciona una ubicación';
      }
      if (!formData.duracionAlmacenamiento) {
        newErrors.duracionAlmacenamiento = 'Selecciona una duración';
      }
    }

    if (formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos') {
      if (!formData.codigoPostalDestino || formData.codigoPostalDestino.length !== 5) {
        newErrors.codigoPostalDestino = 'Ingresa el código postal de destino';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleStep2Next = () => {
    if (!validateStep2()) return;

    saveFormData(STORAGE_KEYS.almacenamiento, {
      ...formData,
      fechaEntrega: formData.fechaEntrega ? formData.fechaEntrega.toISOString() : null,
      currentStep: 3,
      timestamp: Date.now()
    });

    setCurrentStep(3);
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'Ingresa tu nombre completo';
    }

    const cleanWhatsapp = formData.whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length !== 10) {
      newErrors.whatsapp = 'Ingresa un WhatsApp válido de 10 dígitos';
    }

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleFinalSubmit = async () => {
    if (!validateStep3()) return;

    const t0 = performance.now();
    logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.log('⏱️ [FRONTEND STORAGE] Submit iniciado:', new Date().toISOString());

    setIsSubmitting(true);

    try {
      const cleanedData: any = {
        tipoServicio: formData.tipoServicio,
        codigoPostal: formData.codigoPostal,
        tamanoContenedor: formData.tamanoContenedor,
        fechaEntrega: formData.fechaEntrega
          ? formData.fechaEntrega.toISOString().split('T')[0]
          : '',
        nombre: formData.nombre,
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
        correo: formData.correo,
        preferenciaContacto: 'whatsapp', // Hardcoded default
        // NUEVO: Campos opcionales
        empresa: formData.empresa || undefined,
        comentarios: formData.comentarios || undefined,
        newsletter: formData.newsletter,
      };

      // NUEVO: Siempre incluir modalidadAlmacenamiento si aplica
      if (formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') {
        cleanedData.modalidadAlmacenamiento = formData.modalidadAlmacenamiento;

        // Solo incluir ubicacion y duracion si modalidad es RENTA
        if (formData.modalidadAlmacenamiento === 'renta') {
          cleanedData.ubicacionContenedor = formData.ubicacionContenedor;
          cleanedData.duracionAlmacenamiento = formData.duracionAlmacenamiento;
        }

        // NUEVO: Solo incluir tipoAcceso si modalidad es COMPRA
        if (formData.modalidadAlmacenamiento === 'compra') {
          cleanedData.tipoAcceso = formData.tipoAcceso;
        }
      }

      if (formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos') {
        cleanedData.origenCiudad = formData.origenCiudad;
        cleanedData.codigoPostalDestino = formData.codigoPostalDestino;
      }

      const t1 = performance.now();
      logger.log('⏱️ [FRONTEND STORAGE] Data preparada en:', (t1 - t0).toFixed(2), 'ms');
      logger.log('📤 Enviando a API:', cleanedData);

      const response = await fetch('/api/forms/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      const t2 = performance.now();
      logger.log('⏱️ [FRONTEND STORAGE] Fetch completado en:', (t2 - t1).toFixed(2), 'ms');

      if (!response.ok) {
        throw new Error('Error al enviar cotización');
      }

      const data = await response.json();

      const t3 = performance.now();
      logger.log('⏱️ [FRONTEND STORAGE] JSON parseado en:', (t3 - t2).toFixed(2), 'ms');
      logger.log('⏱️ [FRONTEND STORAGE] TOTAL FRONTEND:', (t3 - t0).toFixed(2), 'ms');
      logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      logger.log('✅ Respuesta API:', data);

      // Guardar datos para página de gracias (SIEMPRE, no solo RENTA)
      const datosParaGracias: any = {
        tipoServicio: formData.tipoServicio,
        modalidadAlmacenamiento: formData.modalidadAlmacenamiento,
        tamanoContenedor: formData.tamanoContenedor,
        ubicacionContenedor: formData.ubicacionContenedor,
        tipoAcceso: formData.tipoAcceso, // Para COMPRA
        nombre: formData.nombre,
        whatsapp: formData.whatsapp,
        timestamp: new Date().toISOString()
      };

      // Si hay pricing breakdown (RENTA), incluirlo
      if (data.pricingBreakdown) {
        Object.assign(datosParaGracias, data.pricingBreakdown);
      }

      localStorage.setItem('smi-ultimo-almacenamiento', JSON.stringify(datosParaGracias));
      logger.log('✅ Datos guardados en localStorage para /gracias');

      toast.success('¡Cotización enviada exitosamente!');
      clearFormData(STORAGE_KEYS.almacenamiento);

      // Redirect a página de éxito
      window.location.href = `/gracias?tipo=almacenamiento`;

    } catch (error) {
      const tError = performance.now();
      logger.log('⏱️ [FRONTEND STORAGE] Error en:', (tError - t0).toFixed(2), 'ms');
      logger.error('❌ Error:', error);
      logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      toast.error('Hubo un error al enviar. Por favor intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowSuccess(false);
    setCurrentStep(1);
    setFormData({
      tipoServicio: '',
      modalidadAlmacenamiento: '',
      tipoAcceso: '',
      codigoPostal: '',
      tamanoContenedor: '',
      ubicacionContenedor: '',
      duracionAlmacenamiento: '',
      fechaEntrega: null as Date | null,
      codigoPostalDestino: '',
      nombre: '',
      whatsapp: '',
      correo: '',
      empresa: '',
      comentarios: '',
      newsletter: false
    });
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Progress Bar Inline - SMI */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">

              {/* Paso 1: Servicio */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 1 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {currentStep > 1 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '1'}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors hidden sm:inline ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>
                  Servicio
                </span>
              </div>

              {/* Línea conectora */}
              <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-colors ${currentStep > 1 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

              {/* Paso 2: Detalles */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 2 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {currentStep > 2 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '2'}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors hidden sm:inline ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>
                  Detalles
                </span>
              </div>

              {/* Línea conectora */}
              <div className={`flex-1 h-1 mx-1 sm:mx-2 transition-colors ${currentStep > 2 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

              {/* Paso 3: Contacto */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 3 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  3
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors hidden sm:inline ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>
                  Contacto
                </span>
              </div>

            </div>
          </div>

          {/* Card Blanca con Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">

                    {/* Loading State (durante hydration) */}
                    {!isMounted ? (
                      <div className="text-center py-16">
                        {/* Spinner animado */}
                        <div className="relative w-16 h-16 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-[#D32F2F] border-t-transparent
                                          rounded-full animate-spin"></div>
                        </div>

                        {/* Texto */}
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Preparando tu cotización
                        </h3>
                        <p className="text-sm text-slate-600">
                          Cargando formulario...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Success State */}
                        {showSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full
                                        flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">
                          ¡Cotización Enviada!
                        </h3>
                        <p className="text-slate-600 mb-6">
                          Te contactaremos por WhatsApp en menos de 2 horas para
                          enviarte tu cotización personalizada.
                        </p>
                        <button
                          onClick={resetForm}
                          className="text-[#D32F2F] hover:underline font-medium"
                        >
                          Solicitar otra cotización
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* PASO 1: Tipo de Servicio + CP */}
                        {currentStep === 1 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">
                                ¿Cómo te podemos ayudar?
                              </h3>
                              <p className="text-sm text-slate-600 mb-3">
                                Selecciona el servicio que necesitas
                              </p>
                            </div>

                            {/* Botones Horizontales */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tipo de servicio *
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleChange('tipoServicio', 'mudanza')}
                                  className={`
                                    px-3 py-2.5 rounded-lg text-sm font-semibold
                                    transition-all border-2
                                    ${formData.tipoServicio === 'mudanza'
                                      ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                  `}
                                >
                                  Mudanza
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleChange('tipoServicio', 'almacenamiento')}
                                  className={`
                                    px-3 py-2.5 rounded-lg text-sm font-semibold
                                    transition-all border-2
                                    ${formData.tipoServicio === 'almacenamiento'
                                      ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                  `}
                                >
                                  Almacenamiento
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleChange('tipoServicio', 'ambos')}
                                  className={`
                                    px-3 py-2.5 rounded-lg text-sm font-semibold
                                    transition-all border-2
                                    ${formData.tipoServicio === 'ambos'
                                      ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                  `}
                                >
                                  Ambos
                                </button>
                              </div>
                              {errors.tipoServicio && (
                                <p className="text-red-600 text-sm mt-1">{errors.tipoServicio}</p>
                              )}
                            </div>

                            {/* NUEVO: Modalidad de Almacenamiento (solo si es almacenamiento o ambos) */}
                            {(formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  ¿Qué necesitas? *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleChange('modalidadAlmacenamiento', 'renta')}
                                    className={`
                                      px-4 py-3 rounded-lg text-sm font-semibold
                                      transition-all border-2
                                      ${formData.modalidadAlmacenamiento === 'renta'
                                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                    `}
                                  >
                                    <div className="font-bold mb-0.5">Rentar</div>
                                    <div className={`text-xs ${
                                      formData.modalidadAlmacenamiento === 'renta'
                                        ? 'text-white/80'
                                        : 'text-slate-500'
                                    }`}>
                                      Por periodo de tiempo
                                    </div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleChange('modalidadAlmacenamiento', 'compra')}
                                    className={`
                                      px-4 py-3 rounded-lg text-sm font-semibold
                                      transition-all border-2
                                      ${formData.modalidadAlmacenamiento === 'compra'
                                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                    `}
                                  >
                                    <div className="font-bold mb-0.5">Comprar</div>
                                    <div className={`text-xs ${
                                      formData.modalidadAlmacenamiento === 'compra'
                                        ? 'text-white/80'
                                        : 'text-slate-500'
                                    }`}>
                                      Adquirir el contenedor
                                    </div>
                                  </button>
                                </div>
                                {errors.modalidadAlmacenamiento && (
                                  <p className="text-red-600 text-sm mt-1">{errors.modalidadAlmacenamiento}</p>
                                )}
                              </div>
                            )}

                            {/* NUEVO: Tipo de Acceso (solo si modalidad es COMPRA) */}
                            {formData.modalidadAlmacenamiento === 'compra' && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  ¿Qué tipo de acceso prefieres? *
                                </label>
                                <div className="grid grid-cols-1 gap-3">
                                  <button
                                    type="button"
                                    onClick={() => handleChange('tipoAcceso', 'cortinilla')}
                                    className={`
                                      px-4 py-3 rounded-lg text-sm font-semibold text-left
                                      transition-all border-2
                                      ${formData.tipoAcceso === 'cortinilla'
                                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                    `}
                                  >
                                    <div className="font-bold mb-0.5">Cortinilla lateral</div>
                                    <div className={`text-xs ${
                                      formData.tipoAcceso === 'cortinilla'
                                        ? 'text-white/80'
                                        : 'text-slate-500'
                                    }`}>
                                      Roll-up door - Apertura lateral tipo persiana
                                    </div>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleChange('tipoAcceso', 'puertas-dobles')}
                                    className={`
                                      px-4 py-3 rounded-lg text-sm font-semibold text-left
                                      transition-all border-2
                                      ${formData.tipoAcceso === 'puertas-dobles'
                                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                    `}
                                  >
                                    <div className="font-bold mb-0.5">Puertas dobles originales</div>
                                    <div className={`text-xs ${
                                      formData.tipoAcceso === 'puertas-dobles'
                                        ? 'text-white/80'
                                        : 'text-slate-500'
                                    }`}>
                                      Standard double doors - Apertura trasera tradicional
                                    </div>
                                  </button>
                                </div>
                                {errors.tipoAcceso && (
                                  <p className="text-red-600 text-sm mt-1">{errors.tipoAcceso}</p>
                                )}
                              </div>
                            )}

                            {/* NUEVO: Ciudad de Origen (solo mudanza/ambos) */}
                            {(formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos') && (
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                  Ciudad de origen *
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                  Desde dónde recogeremos el contenedor
                                </p>
                                <input
                                  type="text"
                                  value={formData.origenCiudad}
                                  onChange={(e) => handleChange('origenCiudad', e.target.value)}
                                  placeholder="Ej: Hermosillo, Sonora"
                                  className={`
                                    w-full border-2 rounded-lg px-4 py-2.5 text-base outline-none
                                    transition-colors
                                    ${errors.origenCiudad
                                      ? 'border-red-600 focus:border-red-600'
                                      : 'border-slate-300 focus:border-[#D32F2F]'}
                                  `}
                                />
                                {errors.origenCiudad && (
                                  <p className="text-red-600 text-sm mt-1">{errors.origenCiudad}</p>
                                )}
                              </div>
                            )}

                            {/* Código Postal */}
                            <PostalCodeField
                              name="codigoPostal"
                              label={formData.tipoServicio === 'mudanza' ? 'Código postal de origen' : 'Código postal de entrega'}
                              value={formData.codigoPostal}
                              onChange={(value) => handleChange('codigoPostal', value)}
                              error={errors.codigoPostal}
                              placeholder="83000"
                              required
                            />

                            {/* Botón Siguiente */}
                            <button
                              onClick={handleStep1Next}
                              disabled={
                                !isMounted ||
                                !formData.tipoServicio ||
                                formData.codigoPostal.length !== 5 ||
                                ((formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') && !formData.modalidadAlmacenamiento)
                              }
                              className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-slate-300
                                         text-white px-6 py-3 rounded-lg font-semibold
                                         transition-colors disabled:cursor-not-allowed"
                            >
                              Siguiente →
                            </button>

                            {/* WhatsApp alternativo */}
                            <p className="text-xs text-center text-slate-500">
                              ¿Prefieres cotizar por{' '}
                              <a
                                href={getWhatsAppLink(WHATSAPP_MESSAGES.almacenamiento)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#D32F2F] hover:underline font-medium"
                              >
                                WhatsApp
                              </a>?
                            </p>
                          </div>
                        )}

                        {/* PASO 2: Detalles del Servicio */}
                        {currentStep === 2 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">
                                Detalles del Servicio
                              </h3>
                              <p className="text-sm text-slate-600 mb-3">
                                Ayúdanos a cotizar exactamente lo que necesitas
                              </p>
                            </div>

                            {/* Tamaño - Horizontal */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Tamaño del contenedor *
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  {
                                    value: '10',
                                    label: 'Pequeño',
                                    dimensions: '2.82m × 2.34m × 2.39m'
                                  },
                                  {
                                    value: '20',
                                    label: 'Mediano',
                                    dimensions: '5.90m × 2.35m × 2.39m'
                                  },
                                  {
                                    value: '40',
                                    label: 'Grande',
                                    dimensions: '12.03m × 2.35m × 2.39m'
                                  }
                                ].map((size) => (
                                  <button
                                    key={size.value}
                                    type="button"
                                    onClick={() => handleChange('tamanoContenedor', size.value)}
                                    className={`
                                      p-3 rounded-lg text-center border-2 transition-all
                                      ${formData.tamanoContenedor === size.value
                                        ? 'bg-[#D32F2F] text-white border-[#D32F2F]'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'}
                                    `}
                                  >
                                    <div className="font-bold text-base mb-1">{size.label}</div>
                                    <div className={`text-xs leading-tight ${
                                      formData.tamanoContenedor === size.value
                                        ? 'text-white/90'
                                        : 'text-slate-500'
                                    }`}>
                                      {size.dimensions}
                                    </div>
                                  </button>
                                ))}
                              </div>
                              {errors.tamanoContenedor && (
                                <p className="text-red-600 text-sm mt-1">{errors.tamanoContenedor}</p>
                              )}
                            </div>

                            {/* Campos condicionales de ALMACENAMIENTO - RENTA */}
                            {(formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') &&
                             formData.modalidadAlmacenamiento === 'renta' && (
                              <>
                                {/* Ubicación - Dropdown Custom */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    ¿Dónde quieres tu contenedor? *
                                  </label>
                                  <SelectField
                                    value={formData.ubicacionContenedor}
                                    onChange={(value) => handleChange('ubicacionContenedor', value)}
                                    options={[
                                      { value: 'mi-ubicacion', label: 'Mi ubicación' },
                                      { value: 'bodega-smi', label: 'Bodega SMI' }
                                    ]}
                                    placeholder="Selecciona una opción"
                                    error={errors.ubicacionContenedor}
                                  />
                                </div>

                                {/* Duración - Dropdown Custom */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    ¿Por cuánto tiempo? *
                                  </label>
                                  <SelectField
                                    value={formData.duracionAlmacenamiento}
                                    onChange={(value) => handleChange('duracionAlmacenamiento', value)}
                                    options={[
                                      { value: '1', label: '1 mes' },
                                      { value: '2', label: '2 meses' },
                                      { value: '3', label: '3 meses' },
                                      { value: '4', label: '4 meses' },
                                      { value: '5', label: '5 meses' },
                                      { value: '6', label: '6 meses' },
                                      { value: '7', label: '7 meses' },
                                      { value: '8', label: '8 meses' },
                                      { value: '9', label: '9 meses' },
                                      { value: '10', label: '10 meses' },
                                      { value: '11', label: '11 meses' },
                                      { value: '12', label: '12 meses' },
                                      { value: '12+', label: 'Más de 12 meses' }
                                    ]}
                                    placeholder="Selecciona los meses"
                                    error={errors.duracionAlmacenamiento}
                                  />

                                  {/* Discount Badge */}
                                  {formData.duracionAlmacenamiento && getDiscountInfo(formData.duracionAlmacenamiento).discount > 0 && (
                                    <div className="mt-3 flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-lg p-4">
                                      <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="font-bold text-green-800 text-lg">
                                          {getDiscountInfo(formData.duracionAlmacenamiento).label}
                                        </p>
                                        <p className="text-sm text-green-700 mt-1">
                                          {formData.duracionAlmacenamiento === '12+'
                                            ? 'Ahorra con contratos de 12+ meses. Te contactaremos con el precio final.'
                                            : 'Ahorra con contratos de 6+ meses. Te contactaremos con el precio final.'
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                            {/* Campos condicionales de MUDANZA */}
                            {(formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos') && (
                              <PostalCodeField
                                name="codigoPostalDestino"
                                label="¿A dónde te mudas? (Código postal)"
                                value={formData.codigoPostalDestino}
                                onChange={(value) => handleChange('codigoPostalDestino', value)}
                                error={errors.codigoPostalDestino}
                                placeholder="12345"
                                required
                              />
                            )}

                            {/* Fecha entrega - DatePicker Moderno */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                ¿Cuándo quieres que te entreguen? *
                              </label>
                              <div className="relative">
                                <DatePicker
                                  selected={formData.fechaEntrega}
                                  onChange={(date) => handleChange('fechaEntrega', date)}
                                  minDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  locale={es}
                                  placeholderText="Selecciona una fecha"
                                  className={`
                                    w-full border-2 rounded-lg px-4 py-2.5 text-base outline-none
                                    transition-colors cursor-pointer
                                    ${errors.fechaEntrega
                                      ? 'border-red-600 focus:border-red-600'
                                      : 'border-slate-300 focus:border-[#D32F2F]'}
                                  `}
                                  calendarClassName="custom-calendar"
                                  wrapperClassName="w-full"
                                  showPopperArrow={false}
                                  popperPlacement="bottom-start"
                                  popperModifiers={[
                                    {
                                      name: 'offset',
                                      options: {
                                        offset: [0, 8],
                                      },
                                    },
                                  ]}
                                />
                                {/* Icono de calendario */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg
                                    className="w-5 h-5 text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                </div>
                              </div>
                              {errors.fechaEntrega && (
                                <p className="text-red-600 text-sm mt-1">{errors.fechaEntrega}</p>
                              )}
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={() => setCurrentStep(1)}
                                className="flex-1 border-2 border-slate-300 hover:border-slate-400
                                           text-slate-900 px-4 py-2.5 rounded-lg font-semibold
                                           transition-colors"
                              >
                                ← Atrás
                              </button>
                              <button
                                onClick={handleStep2Next}
                                className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C]
                                           text-white px-4 py-2.5 rounded-lg font-semibold
                                           transition-colors"
                              >
                                Siguiente →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* PASO 3: Contacto */}
                        {currentStep === 3 && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900 mb-1">
                                Información de Contacto
                              </h3>
                              <p className="text-sm text-slate-600 mb-3">
                                Para enviarte tu cotización personalizada
                              </p>
                            </div>

                            {/* ContactFields */}
                            <ContactFields
                              formData={formData}
                              errors={errors}
                              onChange={handleChange}
                              includePreferenciaContacto={false}
                            />

                            {/* NUEVO: Empresa (opcional) */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Empresa <span className="text-slate-500 text-xs">(opcional)</span>
                              </label>
                              <input
                                type="text"
                                value={formData.empresa}
                                onChange={(e) => handleChange('empresa', e.target.value)}
                                placeholder="Nombre de tu empresa"
                                className="w-full border-2 border-slate-300 focus:border-[#D32F2F] rounded-lg px-4 py-2.5 outline-none transition-colors"
                              />
                            </div>

                            {/* NUEVO: Comentarios (opcional) */}
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Comentarios adicionales <span className="text-slate-500 text-xs">(opcional)</span>
                              </label>
                              <textarea
                                value={formData.comentarios}
                                onChange={(e) => handleChange('comentarios', e.target.value)}
                                placeholder="¿Algo más que debamos saber?"
                                rows={3}
                                className="w-full border-2 border-slate-300 focus:border-[#D32F2F] rounded-lg px-4 py-2.5 outline-none transition-colors resize-none"
                              />
                            </div>

                            {/* NUEVO: Newsletter (opcional) */}
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                id="newsletter"
                                checked={formData.newsletter}
                                onChange={(e) => handleChange('newsletter', e.target.checked)}
                                className="w-5 h-5 mt-0.5 rounded border-2 border-slate-300 text-[#D32F2F]
                                           focus:ring-2 focus:ring-[#D32F2F] focus:ring-offset-0 cursor-pointer"
                              />
                              <label htmlFor="newsletter" className="text-sm text-slate-700 cursor-pointer">
                                Quiero recibir noticias y ofertas especiales de SMI Contenedores
                              </label>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 border-2 border-slate-300 hover:border-slate-400
                                           text-slate-900 px-4 py-2.5 rounded-lg font-semibold
                                           transition-colors"
                              >
                                ← Atrás
                              </button>
                              <button
                                onClick={handleFinalSubmit}
                                disabled={!isMounted || isSubmitting}
                                className="flex-1 bg-[#D32F2F] hover:bg-[#B71C1C] disabled:bg-slate-300
                                           text-white px-4 py-2.5 rounded-lg font-semibold
                                           transition-colors disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? 'Enviando...' : 'Enviar Cotización'}
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                      </>
                    )}

          </div>  {/* Close white card */}
        </div>  {/* Close max-w-4xl container */}
      </div>  {/* Close bg-slate-50 */}

    </>
  );
}
