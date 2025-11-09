'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import FormLayout from '@/components/forms/FormLayout';
import ProjectTypeGrid from '@/components/forms/custom/ProjectTypeGrid';
import Specifications from '@/components/forms/custom/Specifications';
import BudgetTimeline from '@/components/forms/custom/BudgetTimeline';
import WhatsAppButton from '@/components/forms/WhatsAppButton';
import PhoneField from '@/components/forms/inputs/PhoneField';
import { loadFormData, saveFormData, clearFormData, STORAGE_KEYS } from '@/lib/constants/storage-keys';
import SuccessInline from '@/app/cotizar/_components/SuccessInline';
import { logger } from '@/lib/utils';

export default function PersonalizadoPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Try loading from new storage key
        const saved = loadFormData<any>(STORAGE_KEYS.personalizado);
        if (saved) {
          logger.log('✅ [PersonalizadoPage] Loaded form data from localStorage');
          return saved;
        }

        // Migration: try loading from old key
        const oldKey = 'smi-custom-form';
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          // Save to new key and remove old key
          saveFormData(STORAGE_KEYS.personalizado, parsed);
          localStorage.removeItem(oldKey);
          logger.log('✅ [PersonalizadoPage] Migrated custom form data from old key to new key');
          return parsed;
        }
      } catch (e) {
        logger.error('❌ [PersonalizadoPage] Error loading/migrating form data:', e);
        // Clear potentially corrupted data
        try {
          localStorage.removeItem('smi-custom-form');
          localStorage.removeItem(STORAGE_KEYS.personalizado);
          logger.log('🧹 [PersonalizadoPage] Cleared corrupted localStorage data');
        } catch (clearError) {
          logger.error('❌ [PersonalizadoPage] Could not clear localStorage:', clearError);
        }
      }
    }
    logger.log('📝 [PersonalizadoPage] Using empty form data');
    return {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  useEffect(() => {
    logger.log('[PersonalizadoPage] Component mounting... setting isMounted to true');
    setIsMounted(true);
    logger.log('[PersonalizadoPage] isMounted is now true - component should render');
  }, []);

  const handleStep1Submit = (data: any) => {
    // Validar campos obligatorios del paso 1
    if (!data.tipoProyecto) {
      toast.error('Debes seleccionar un tipo de proyecto');
      return;
    }

    // Validar si tiene terreno (FAIL-FAST)
    if (!data.tieneTerreno) {
      toast.error('Debes indicar si tienes terreno');
      return;
    }

    // Validación condicional: si tiene terreno, CP es obligatorio (FAIL-FAST)
    if (data.tieneTerreno === 'si') {
      if (!data.codigoPostalTerreno || data.codigoPostalTerreno.length !== 5) {
        toast.error('Código postal del terreno es requerido (5 dígitos)');
        return;
      }

      // Validación del formato (FAIL-FAST)
      if (!/^\d{5}$/.test(data.codigoPostalTerreno)) {
        toast.error('El código postal debe contener solo números');
        return;
      }
    }

    // Si pasa validación, avanzar al siguiente paso
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    saveFormData(STORAGE_KEYS.personalizado, updatedData);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = () => {
    // Validar campos obligatorios del Step 2 - Especificaciones
    // VALIDACIÓN: Universal fields (todos) + Conditional fields (por tipo)

    const tipo = formData.tipoProyecto;

    // ============================================
    // VALIDACIÓN UNIVERSAL (TODOS LOS TIPOS)
    // ============================================

    // Metros Cuadrados (requerido para todos)
    if (!formData.metrosCuadrados || formData.metrosCuadrados.trim() === '') {
      toast.error('Los metros cuadrados son requeridos');
      return;
    }

    const metros = parseFloat(formData.metrosCuadrados);
    // Validar mínimo según tipo
    if (tipo === 'casa-cabana') {
      if (isNaN(metros) || metros < 10) {
        toast.error('Para casa/cabaña se requieren mínimo 10 m²');
        return;
      }
    } else if (tipo === 'oficinas-corporativas') {
      if (isNaN(metros) || metros < 20) {
        toast.error('Para oficinas corporativas se requieren mínimo 20 m²');
        return;
      }
    } else if (tipo === 'local-comercial') {
      if (isNaN(metros) || metros < 15) {
        toast.error('Para local comercial se requieren mínimo 15 m²');
        return;
      }
    } else {
      // Proyecto especial - solo número válido
      if (isNaN(metros) || metros <= 0) {
        toast.error('Los metros cuadrados deben ser un número válido mayor a 0');
        return;
      }
    }

    // Descripción (opcional, pero si se llena debe cumplir mínimo)
    if (formData.descripcion && formData.descripcion.trim() !== '') {
      const minLength = tipo === 'proyecto-especial' ? 50 : 10;
      if (formData.descripcion.trim().length < minLength) {
        toast.error(`Si proporcionas una descripción, debe tener al menos ${minLength} caracteres`);
        return;
      }
    }
    // Si está vacío, no hay error (es opcional)

    // ============================================
    // VALIDACIÓN CONDICIONAL POR TIPO
    // ============================================

    // CASA/CABAÑA - Requiere: habitaciones, baños
    if (tipo === 'casa-cabana') {
      if (!formData.habitaciones) {
        toast.error('Número de habitaciones es requerido para casa/cabaña');
        return;
      }

      if (!formData.banos) {
        toast.error('Número de baños es requerido para casa/cabaña');
        return;
      }
    }

    // LOCAL COMERCIAL - Requiere: tipo de negocio
    if (tipo === 'local-comercial') {
      if (!formData.tipoNegocio || formData.tipoNegocio.trim() === '') {
        toast.error('Tipo de negocio es requerido para local comercial');
        return;
      }
    }

    // OFICINAS - numeroEmpleados es OPCIONAL, no validar
    // PROYECTO ESPECIAL - solo universal (m² y descripción), ya validados arriba

    // terreno y CP ya fueron validados en Step 1 (fail-fast)

    // Si pasa validación, avanzar a Step 3 (Presupuesto y Timeline)
    saveFormData(STORAGE_KEYS.personalizado, formData);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Submit = () => {
    // Validar campos obligatorios del Step 3 - Presupuesto y Timeline
    if (!formData.tiempoEntrega) {
      toast.error('El tiempo de entrega es requerido');
      return;
    }

    if (!formData.presupuesto) {
      toast.error('El presupuesto es requerido');
      return;
    }

    if (!formData.necesitaFinanciamiento) {
      toast.error('Debes indicar si necesitas financiamiento');
      return;
    }

    // descripción ya fue validada en Step 2

    // Si pasa validación, avanzar a Step 4 (Información de contacto)
    saveFormData(STORAGE_KEYS.personalizado, formData);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = async (data: any) => {
    const t0 = performance.now();
    logger.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.log('⏱️ [FRONTEND CUSTOM] Submit iniciado:', new Date().toISOString());

    const finalData = { ...formData, ...data };

    // Validar nombre
    if (!finalData.nombre || finalData.nombre.trim() === '') {
      toast.error('Por favor ingresa tu nombre completo');
      return;
    }

    if (finalData.nombre.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }

    // Validar WhatsApp
    if (!finalData.whatsapp || finalData.whatsapp.trim() === '') {
      toast.error('Por favor ingresa tu WhatsApp');
      return;
    }

    const cleanWhatsapp = finalData.whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length !== 10) {
      toast.error('El WhatsApp debe tener 10 dígitos');
      return;
    }

    // Validar correo
    if (!finalData.correo || finalData.correo.trim() === '') {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(finalData.correo)) {
      toast.error('Por favor ingresa un correo válido');
      return;
    }

    // Prevenir doble submit
    if (isSubmitting) {
      return;
    }

    setFormData(finalData);

    // Filtrar campos condicionales según reglas de negocio
    const cleanedData = { ...finalData };

    // Si no tiene terreno, remover código postal del terreno
    if (cleanedData.tieneTerreno !== 'si') {
      delete cleanedData.codigoPostalTerreno;
    }

    // Usar WhatsApp limpio (solo dígitos)
    cleanedData.whatsapp = cleanWhatsapp;

    const t1 = performance.now();
    logger.log('⏱️ [FRONTEND CUSTOM] Data preparada en:', (t1 - t0).toFixed(2), 'ms');
    logger.log('📤 Enviando datos a API:', cleanedData);

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forms/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });

      const t2 = performance.now();
      logger.log('⏱️ [FRONTEND CUSTOM] Fetch completado en:', (t2 - t1).toFixed(2), 'ms');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const tError = performance.now();
        logger.log('⏱️ [FRONTEND CUSTOM] Error en:', (tError - t0).toFixed(2), 'ms');
        logger.error('❌ Error API:', errorData);
        logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        throw new Error(errorData.error || 'Error al enviar cotización');
      }

      const result = await response.json();

      const t3 = performance.now();
      logger.log('⏱️ [FRONTEND CUSTOM] JSON parseado en:', (t3 - t2).toFixed(2), 'ms');
      logger.log('⏱️ [FRONTEND CUSTOM] TOTAL FRONTEND:', (t3 - t0).toFixed(2), 'ms');
      logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      logger.log('✅ Respuesta API:', result);

      // Guardar datos para página de gracias
      const datosParaGracias = {
        tipoProyecto: finalData.tipoProyecto,
        metrosCuadrados: finalData.metrosCuadrados,
        presupuesto: finalData.presupuesto,
        nombre: finalData.nombre,
        empresa: finalData.empresa,
        whatsapp: finalData.whatsapp,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('smi-ultimo-personalizado', JSON.stringify(datosParaGracias));

      toast.success('¡Cotización enviada exitosamente!');
      clearFormData(STORAGE_KEYS.personalizado);

      // Redirect a página de gracias
      window.location.href = '/gracias?tipo=proyecto-personalizado';
    } catch (error) {
      const tError = performance.now();
      logger.log('⏱️ [FRONTEND CUSTOM] Error en:', (tError - t0).toFixed(2), 'ms');
      logger.error('❌ Error completo:', error);
      logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      toast.error('Error al enviar. Por favor intenta de nuevo o contáctanos por WhatsApp.');
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

  return (
    <>
      <Toaster position="top-center" />

      <div>
        {/* Clear Form Button - Only show if formData has values */}
        {isMounted && Object.keys(formData).length > 0 && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-4 pt-4">
            <button
              onClick={() => {
                if (confirm('¿Estás seguro de que quieres limpiar el formulario? Se perderán todos los datos ingresados.')) {
                  setFormData({});
                  clearFormData(STORAGE_KEYS.personalizado);
                  setCurrentStep(1);
                  toast.success('Formulario limpiado exitosamente');
                }
              }}
              className="text-sm text-gray-600 hover:text-[#D32F2F] underline transition-colors"
            >
              🧹 Limpiar formulario y empezar de nuevo
            </button>
          </div>
        )}

        <FormLayout
          title="Cotización de Proyecto Personalizado"
          progressIndicator={
            <div className="mb-6">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                {/* PASO 1 - Tipo */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 1 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {currentStep > 1 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : '1'}
                  </div>
                  <span className={`hidden sm:block text-xs sm:text-sm font-medium transition-colors ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>
                    Tipo
                  </span>
                </div>

                {/* LÍNEA CONECTORA */}
                <div className={`flex-1 h-1 mx-1 sm:mx-2 ${currentStep > 1 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

                {/* PASO 2 - Especificaciones */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 2 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {currentStep > 2 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : '2'}
                  </div>
                  <span className={`hidden sm:block text-xs sm:text-sm font-medium transition-colors ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>
                    Espec
                  </span>
                </div>

                {/* LÍNEA CONECTORA */}
                <div className={`flex-1 h-1 mx-1 sm:mx-2 ${currentStep > 2 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

                {/* PASO 3 - Presupuesto */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 3 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {currentStep > 3 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : '3'}
                  </div>
                  <span className={`hidden sm:block text-xs sm:text-sm font-medium transition-colors ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>
                    Presu
                  </span>
                </div>

                {/* LÍNEA CONECTORA */}
                <div className={`flex-1 h-1 mx-1 sm:mx-2 ${currentStep > 3 ? 'bg-[#D32F2F]' : 'bg-slate-200'}`} />

                {/* PASO 4 - Contacto */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep >= 4 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {currentStep > 4 ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : '4'}
                  </div>
                  <span className={`hidden sm:block text-xs sm:text-sm font-medium transition-colors ${currentStep >= 4 ? 'text-slate-900' : 'text-slate-500'}`}>
                    Contacto
                  </span>
                </div>
              </div>
            </div>
          }
        >
        {!isMounted ? (
          <div className="text-center py-16">
            {(() => { logger.log('[PersonalizadoPage] 🔄 Rendering LOADING state - isMounted:', isMounted); return null; })()}
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
        ) : submitSuccess ? (
          <>
            {(() => { logger.log('[PersonalizadoPage] ✅ Rendering SUCCESS state - trackingCode:', trackingCode); return null; })()}
            <SuccessInline
              projectType="Proyecto Personalizado"
            />
          </>
        ) : (
          <>
            {(() => { logger.log('[PersonalizadoPage] 📝 Rendering FORM state - currentStep:', currentStep); return null; })()}
        {currentStep === 1 && (
          <>
            <div className="space-y-6">
              {/* Tipo de Proyecto */}
              <div>
                <h2 className="text-xl font-semibold mb-4">¿Qué tipo de proyecto tienes en mente?</h2>
                <p className="text-gray-600 mb-6">
                  Selecciona la opción que mejor describe tu proyecto personalizado
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'casa-cabana', label: 'Casa/Cabaña', description: 'Vivienda residencial o casa de descanso con contenedores' },
                    { value: 'oficinas-corporativas', label: 'Oficinas Corporativas', description: 'Espacios de trabajo modernos y funcionales' },
                    { value: 'local-comercial', label: 'Local Comercial', description: 'Tienda, restaurante, showroom o espacio comercial' },
                    { value: 'proyecto-especial', label: 'Proyecto Especial', description: 'Hotel, centro educativo, clínica u otro proyecto único' },
                  ].map((tipo) => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, tipoProyecto: tipo.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.tipoProyecto === tipo.value
                          ? 'border-[#D32F2F] bg-[#FFEBEE]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">{tipo.label}</div>
                      <div className="text-sm text-slate-600 mt-1">{tipo.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terreno - Solo mostrar si ya seleccionó tipo de proyecto */}
              {formData.tipoProyecto && (
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">¿Tienes terreno para el proyecto?</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tieneTerreno: 'si' })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.tieneTerreno === 'si'
                          ? 'border-[#D32F2F] bg-[#FFEBEE]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">Sí, tengo terreno</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, tieneTerreno: 'no', codigoPostalTerreno: '' })}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.tieneTerreno === 'no'
                          ? 'border-[#D32F2F] bg-[#FFEBEE]'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">No, necesito terreno</div>
                    </button>
                  </div>

                  {/* CP - Solo mostrar si tiene terreno */}
                  {formData.tieneTerreno === 'si' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Código Postal del Terreno <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.codigoPostalTerreno || ''}
                        onChange={(e) => setFormData({ ...formData, codigoPostalTerreno: e.target.value })}
                        placeholder="Ej: 12345"
                        maxLength={5}
                        className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Ingresa tu código postal (5 dígitos)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Botón Continuar */}
              <button
                type="button"
                onClick={() => handleStep1Submit({
                  tipoProyecto: formData.tipoProyecto || '',
                  tieneTerreno: formData.tieneTerreno || '',
                  codigoPostalTerreno: formData.codigoPostalTerreno || '',
                })}
                disabled={!formData.tipoProyecto}
                className="w-full sm:w-auto px-8 py-3 bg-[#D32F2F] text-white rounded-lg font-semibold hover:bg-[#B71C1C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <WhatsAppButton context="personalizado" />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="mb-4 text-[#D32F2F] hover:text-[#B71C1C] font-medium"
            >
              ← Volver
            </button>
            <div className="space-y-6">
              {/* Especificaciones Section */}
              <Specifications
                onChange={(data) => {
                  const updatedData = { ...formData, ...data };
                  setFormData(updatedData);
                  saveFormData(STORAGE_KEYS.personalizado, updatedData);
                }}
                onNext={handleStep2Submit}
                initialData={formData}
              />

              {/* Submit Button for Step 2 */}
              <button
                type="button"
                onClick={handleStep2Submit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-[#D32F2F] text-white rounded-lg font-semibold hover:bg-[#B71C1C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
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
            <div className="space-y-6">
              {/* Presupuesto y Timeline Section */}
              <BudgetTimeline
                onChange={(data) => {
                  const updatedData = { ...formData, ...data };
                  setFormData(updatedData);
                  saveFormData(STORAGE_KEYS.personalizado, updatedData);
                }}
                onNext={handleStep3Submit}
                initialData={formData}
              />

              {/* Submit Button for Step 3 */}
              <button
                type="button"
                onClick={handleStep3Submit}
                disabled={
                  !formData.tiempoEntrega ||
                  !formData.presupuesto ||
                  !formData.necesitaFinanciamiento
                }
                className="w-full sm:w-auto px-8 py-3 bg-[#D32F2F] text-white rounded-lg font-semibold hover:bg-[#B71C1C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {currentStep === 4 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="mb-4 text-[#D32F2F] hover:text-[#B71C1C] font-medium"
            >
              ← Volver
            </button>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Información de Contacto</h2>
                <p className="text-gray-600 mb-4">
                  Para poder enviarte la cotización personalizada
                </p>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
                />
              </div>

              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empresa <span className="text-gray-400">(Opcional)</span>
                </label>
                <input
                  type="text"
                  value={formData.empresa || ''}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  placeholder="Nombre de tu empresa"
                  className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
                />
              </div>

              {/* WhatsApp */}
              <PhoneField
                label="WhatsApp"
                register={{
                  name: 'whatsapp',
                  onChange: (e) => setFormData({ ...formData, whatsapp: e.target.value }),
                  onBlur: () => {},
                  ref: () => {},
                }}
                error={''}
                required
              />

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.correo || ''}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2.5 h-11 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
                />
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios <span className="text-gray-400">(Opcional)</span>
                </label>
                <textarea
                  value={formData.comentarios || ''}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                  placeholder="Cuéntanos más sobre tu proyecto..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base transition-colors focus:border-[#D32F2F] focus:ring-[#D32F2F] focus:outline-none focus:ring-2"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFinalSubmit({
                  nombre: formData.nombre || '',
                  empresa: formData.empresa || '',
                  whatsapp: formData.whatsapp || '',
                  correo: formData.correo || '',
                  comentarios: formData.comentarios || '',
                })}
                disabled={
                  isSubmitting ||
                  !formData.nombre ||
                  formData.nombre.trim().length < 2 ||
                  !formData.whatsapp ||
                  (formData.whatsapp.replace(/\D/g, '').length !== 10) ||
                  !formData.correo ||
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
                }
                className={`w-full sm:w-auto px-8 py-3 bg-[#D32F2F] text-white rounded-lg font-semibold hover:bg-[#B71C1C] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors ${isSubmitting ? 'opacity-50' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  'Enviar Cotización'
                )}
              </button>
            </div>
          </>
        )}
          </>
        )}
        </FormLayout>
      </div>
    </>
  );
}
