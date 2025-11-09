'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import FormLayout from '@/components/forms/FormLayout';
import ModelGrid from '@/components/forms/standard/ModelGrid';
import TimelineBudget from '@/components/forms/standard/TimelineBudget';
import ContactDetails from '@/components/forms/standard/ContactDetails';
import WhatsAppButton from '@/components/forms/WhatsAppButton';
import { loadFormData, saveFormData, clearFormData, STORAGE_KEYS } from '@/lib/constants/storage-keys';
import type { ModeloEstandar } from '@/lib/constants/pricing';
import { logger } from '@/lib/utils';

export default function ModeloEstandarPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      // Try loading from new storage key
      const saved = loadFormData<any>(STORAGE_KEYS.modeloEstandar);
      if (saved) return saved;

      // Migration: try loading from old key
      try {
        const oldKey = 'smi-standard-form';
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          // Save to new key and remove old key
          saveFormData(STORAGE_KEYS.modeloEstandar, parsed);
          localStorage.removeItem(oldKey);
          logger.log('✅ Migrated standard form data from old key to new key');
          return parsed;
        }
      } catch (e) {
        logger.error('Error migrating old standard form data:', e);
      }
    }
    return {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check for modelo query parameter for pre-selection
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const modeloParam = urlParams.get('modelo');

      // Valid modelo slugs
      const validModelos = ['10-pies', '20-pies', '40-pies'];

      if (modeloParam && validModelos.includes(modeloParam)) {
        // Only pre-select if no model is already selected
        if (!formData.modeloSeleccionado) {
          const updatedData = { ...formData, modeloSeleccionado: modeloParam };
          setFormData(updatedData);
          saveFormData(STORAGE_KEYS.modeloEstandar, updatedData);
          logger.log(`✅ Pre-selected modelo from URL: ${modeloParam}`);
        }
      }
    }
  }, []);

  const handleStep1Submit = (data: any) => {
    // Validar campos obligatorios del paso 1
    if (!data.modeloSeleccionado) {
      toast.error('Debes seleccionar un modelo');
      return;
    }

    // Si pasa validación, avanzar al siguiente paso
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    saveFormData(STORAGE_KEYS.modeloEstandar, updatedData);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (data: any) => {
    // Validar campos obligatorios del paso 2
    if (!data.tiempoEntrega) {
      toast.error('El tiempo de entrega es requerido');
      return;
    }

    if (!data.tieneTerreno) {
      toast.error('Debes indicar si tienes terreno');
      return;
    }

    // Validación condicional del código postal del terreno
    if (data.tieneTerreno === 'si') {
      if (!data.codigoPostalTerreno || data.codigoPostalTerreno.length !== 5) {
        toast.error('Código postal del terreno válido es requerido (5 dígitos)');
        return;
      }
      if (!/^\d{5}$/.test(data.codigoPostalTerreno)) {
        toast.error('El código postal debe contener solo números');
        return;
      }
    }

    // Validación de financiamiento (requerido)
    if (data.necesitaFinanciamiento === null || data.necesitaFinanciamiento === undefined) {
      toast.error('Debes indicar si necesitas financiamiento');
      return;
    }

    // Si pasa validación, avanzar al siguiente paso
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    saveFormData(STORAGE_KEYS.modeloEstandar, updatedData);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Submit = async (data: any) => {
    const t0 = performance.now();
    logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.log('⏱️ [FRONTEND STANDARD] Submit iniciado:', new Date().toISOString());

    const finalData = { ...formData, ...data };
    setFormData(finalData);

    const t1 = performance.now();
    logger.log('⏱️ [FRONTEND STANDARD] Data preparada en:', (t1 - t0).toFixed(2), 'ms');
    logger.log('📤 Enviando a API:', finalData);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forms/standard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const t2 = performance.now();
      logger.log('⏱️ [FRONTEND STANDARD] Fetch completado en:', (t2 - t1).toFixed(2), 'ms');

      const result = await response.json();

      const t3 = performance.now();
      logger.log('⏱️ [FRONTEND STANDARD] JSON parseado en:', (t3 - t2).toFixed(2), 'ms');

      if (response.ok) {
        logger.log('⏱️ [FRONTEND STANDARD] TOTAL FRONTEND:', (t3 - t0).toFixed(2), 'ms');
        logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        logger.log('✅ Respuesta API:', result);

        // Guardar datos del modelo para mostrar en página de gracias
        const datosParaGracias = {
          modeloSeleccionado: finalData.modeloSeleccionado,
          tipoBano: finalData.tipoBano || 'ninguno',
          cocina: finalData.cocina || false,
          nombre: finalData.nombre,
          whatsapp: finalData.whatsapp,
          timestamp: new Date().toISOString()
        };

        localStorage.setItem('smi-ultimo-modelo-cotizado', JSON.stringify(datosParaGracias));

        toast.success('¡Cotización enviada exitosamente!');
        clearFormData(STORAGE_KEYS.modeloEstandar);

        // Redirect a página de éxito (sin trackingCode en URL)
        window.location.href = `/gracias?tipo=modelo-estandar`;
      } else {
        const tError = performance.now();
        logger.log('⏱️ [FRONTEND STANDARD] Error en:', (tError - t0).toFixed(2), 'ms');
        logger.error('❌ Error API:', result.error);
        logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        toast.error(result.error || 'Error al enviar la cotización');
      }
    } catch (error) {
      const tError = performance.now();
      logger.log('⏱️ [FRONTEND STANDARD] Error en:', (tError - t0).toFixed(2), 'ms');
      logger.error('❌ Error de conexión:', error);
      logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      toast.error('Error de conexión. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle real-time pricing updates (for Step 2 sidebar)
  const handlePricingChange = (data: { tipoBano: string; cocina: boolean }) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    saveFormData(STORAGE_KEYS.modeloEstandar, updatedData);
  };

  return (
    <>
      <Toaster position="top-center" />
      <FormLayout
        title="Cotización de Modelo Estándar"
        progressIndicator={
          <div className="mb-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {/* PASO 1 - Modelo */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 1 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {currentStep > 1 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '1'}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>
                  Modelo
                </span>
              </div>

              {/* LÍNEA CONECTORA */}
              <div className={`flex-1 h-1 mx-1 sm:mx-2 ${currentStep > 1 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

              {/* PASO 2 - Detalles */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 2 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {currentStep > 2 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '2'}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>
                  Detalles
                </span>
              </div>

              {/* LÍNEA CONECTORA */}
              <div className={`flex-1 h-1 mx-1 sm:mx-2 ${currentStep > 2 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

              {/* PASO 3 - Contacto */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 3 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {currentStep > 3 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : '3'}
                </div>
                <span className={`text-xs sm:text-sm font-medium transition-colors ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>
                  Contacto
                </span>
              </div>
            </div>
          </div>
        }
      >
        {!isMounted ? (
          <div className="text-center py-16">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Preparando tu cotización
            </h3>
            <p className="text-sm text-slate-600">
              Cargando formulario...
            </p>
          </div>
        ) : (
          <>
            {currentStep === 1 && (
              <>
                <ModelGrid
                  onNext={handleStep1Submit}
                  initialData={formData}
                />
                <div className="mt-6 pt-6 border-t">
                  <WhatsAppButton context="modeloEstandar" />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="mb-6 text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Volver
                </button>

                {/* Form centrado sin sidebar */}
                <div className="max-w-2xl mx-auto">
                  <TimelineBudget
                    onNext={handleStep2Submit}
                    onChange={handlePricingChange}
                    initialData={formData}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="mb-4 text-[#D32F2F] hover:text-[#B71C1C] font-medium"
                >
                  ← Volver
                </button>
                <ContactDetails
                  onSubmit={handleStep3Submit}
                  onChange={(data) => {
                    const updated = { ...formData, ...data };
                    setFormData(updated);
                    saveFormData(STORAGE_KEYS.modeloEstandar, updated);
                  }}
                  initialData={formData}
                  isSubmitting={isSubmitting}
                />
              </>
            )}
          </>
        )}
      </FormLayout>
    </>
  );
}
