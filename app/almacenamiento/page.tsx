'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import ContactFields from '@/components/forms/shared/ContactFields';
import LocationSection from '@/components/sections/LocationSection';
import { getWhatsAppLink, WHATSAPP_MESSAGES } from '@/lib/constants';
import 'react-datepicker/dist/react-datepicker.css';

const STORAGE_KEY = 'smi-storage-form';

export default function AlmacenamientoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const isRecent = Date.now() - parsed.timestamp < 30 * 60 * 1000; // 30 min
          if (isRecent) {
            // Convertir fechaEntrega de string a Date
            if (parsed.fechaEntrega) {
              parsed.fechaEntrega = new Date(parsed.fechaEntrega);
            }
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
    return {
      tipoServicio: '',
      modalidadAlmacenamiento: '',
      codigoPostal: '',
      tamanoContenedor: '',
      ubicacionContenedor: '',
      duracionAlmacenamiento: '',
      tipoAcceso: '',
      usoContenedor: '',
      urgenciaEntrega: '',
      fechaEntrega: null as Date | null,
      codigoPostalDestino: '',
      nombre: '',
      whatsapp: '',
      correo: ''
    };
  });

  // Mount detection para evitar hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect para inyectar estilos del DatePicker (post-hydration)
  useEffect(() => {
    const styleId = 'datepicker-custom-styles';

    // Solo inyectar si no existe ya
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Calendar container */
      .react-datepicker {
        font-family: inherit;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      /* Header (mes/año) */
      .react-datepicker__header {
        background-color: #D32F2F;
        border-bottom: none;
        padding-top: 12px;
      }

      .react-datepicker__current-month {
        color: white;
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 8px;
      }

      .react-datepicker__day-name {
        color: white;
        font-weight: 500;
        width: 2.5rem;
        line-height: 2rem;
        margin: 0.2rem;
      }

      /* Navigation arrows */
      .react-datepicker__navigation {
        top: 14px;
      }

      .react-datepicker__navigation-icon::before {
        border-color: white;
        border-width: 2px 2px 0 0;
      }

      .react-datepicker__navigation:hover *::before {
        border-color: rgba(255, 255, 255, 0.8);
      }

      /* Days */
      .react-datepicker__day {
        width: 2.5rem;
        line-height: 2.5rem;
        margin: 0.2rem;
        border-radius: 8px;
        color: #0f172a;
        transition: all 0.2s;
      }

      .react-datepicker__day:hover {
        background-color: #ffebee;
        color: #D32F2F;
      }

      .react-datepicker__day--selected {
        background-color: #D32F2F !important;
        color: white !important;
        font-weight: 600;
      }

      .react-datepicker__day--keyboard-selected {
        background-color: #ffebee;
        color: #D32F2F;
      }

      .react-datepicker__day--today {
        font-weight: 600;
        color: #D32F2F;
        background-color: #fff1f2;
      }

      .react-datepicker__day--disabled {
        color: #cbd5e1;
        cursor: not-allowed;
      }

      .react-datepicker__day--disabled:hover {
        background-color: transparent;
      }

      /* Month container */
      .react-datepicker__month {
        margin: 0.8rem;
      }

      /* Popper (dropdown container) */
      .react-datepicker-popper {
        z-index: 9999;
      }
    `;

    document.head.appendChild(style);

    // Cleanup: remover estilos cuando el componente se desmonte
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []); // [] = solo ejecuta una vez al montar

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
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

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleStep1Next = () => {
    if (!validateStep1()) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...formData,
      fechaEntrega: formData.fechaEntrega ? formData.fechaEntrega.toISOString() : null,
      currentStep: 2,
      timestamp: Date.now()
    }));

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

    if (formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') {
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

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...formData,
      fechaEntrega: formData.fechaEntrega ? formData.fechaEntrega.toISOString() : null,
      currentStep: 3,
      timestamp: Date.now()
    }));

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

    // preferenciaContacto ahora es opcional (includePreferenciaContacto={false})

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors)[0]);
      return false;
    }

    return true;
  };

  const handleFinalSubmit = async () => {
    if (!validateStep3()) return;

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
        // preferenciaContacto removido (includePreferenciaContacto={false})
      };

      if (formData.tipoServicio === 'almacenamiento' || formData.tipoServicio === 'ambos') {
        cleanedData.ubicacionContenedor = formData.ubicacionContenedor;
        cleanedData.duracionAlmacenamiento = formData.duracionAlmacenamiento;
      }

      if (formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos') {
        cleanedData.codigoPostalDestino = formData.codigoPostalDestino;
      }

      console.log('📤 Enviando a API:', cleanedData);

      const response = await fetch('/api/forms/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData)
      });

      if (!response.ok) {
        throw new Error('Error al enviar cotización');
      }

      const data = await response.json();

      console.log('✅ Respuesta API:', data);

      localStorage.removeItem(STORAGE_KEY);

      setShowSuccess(true);

      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('❌ Error:', error);
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
      codigoPostal: '',
      tamanoContenedor: '',
      ubicacionContenedor: '',
      duracionAlmacenamiento: '',
      tipoAcceso: '',
      usoContenedor: '',
      urgenciaEntrega: '',
      fechaEntrega: null as Date | null,
      codigoPostalDestino: '',
      nombre: '',
      whatsapp: '',
      correo: ''
    });
    localStorage.removeItem(STORAGE_KEY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Toaster position="top-center" />

      <main className="min-h-screen bg-white">

        {/* HERO SECTION - COMPACT WITH INLINE FORM */}
        <section className="relative bg-gradient-to-b from-slate-50 to-white py-6 sm:py-8 min-h-[25vh] sm:min-h-[20vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back navigation */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-600
                         hover:text-[#D32F2F] mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </Link>

            {/* Headline - ULTRA SHORT */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 text-center">
              Almacenamiento en Hermosillo
            </h1>

            {/* 3 Pricing Pills - COMPACT INLINE */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">

              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-300
                              rounded-full px-3 py-1.5 text-xs sm:text-sm shadow-sm">
                <span className="text-base">🚛</span>
                <span className="text-slate-700">Mudanza</span>
                <span className="text-[#D32F2F] font-bold">$60/km</span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-300
                              rounded-full px-3 py-1.5 text-xs sm:text-sm shadow-sm">
                <span className="text-base">📦</span>
                <span className="text-slate-700">Renta</span>
                <span className="text-[#D32F2F] font-bold">$3K/mes</span>
              </div>

              <div className="inline-flex items-center gap-1.5 bg-white border border-slate-300
                              rounded-full px-3 py-1.5 text-xs sm:text-sm shadow-sm">
                <span className="text-base">🏠</span>
                <span className="text-slate-700">Compra</span>
                <span className="text-[#D32F2F] font-bold">$55K</span>
              </div>

            </div>

            {/* Single trust signal - MINIMAL */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm text-slate-600">
                Entrega gratis en Hermosillo • Contenedores 10&apos;, 20&apos; y 40&apos;
              </span>
            </div>

          </div>
        </section>

        {/* Form section */}
        <section className="bg-white pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 lg:p-8">

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
                      <div className="p-8 sm:p-12">

                        {/* Icono de éxito */}
                        <div className="flex justify-center mb-6">
                          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>

                        {/* Título */}
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-center">
                          ¡Gracias por tu Interés!
                        </h2>

                        {/* Mensaje personalizado */}
                        <div className="text-center mb-8">
                          <p className="text-xl text-slate-600 mb-2">
                            Tu Solicitud de Contenedor ha sido Recibida
                          </p>
                          <p className="text-base text-slate-500">
                            Revisaremos la disponibilidad y te enviaremos una cotización personalizada
                          </p>
                        </div>

                        {/* Info esencial */}
                        <div className="space-y-4 mb-8">

                          {/* Te contactaremos pronto */}
                          <div className="flex items-start gap-3 text-left bg-blue-50 rounded-lg p-4">
                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <p className="font-semibold text-slate-900">
                                Te contactaremos pronto
                              </p>
                              <p className="text-slate-600 text-sm">
                                Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en las próximas <strong>2 horas hábiles</strong>
                              </p>
                            </div>
                          </div>

                          {/* WhatsApp */}
                          <div className="flex items-start gap-3 text-left bg-[#FFEBEE] rounded-lg p-4">
                            <svg className="w-6 h-6 text-[#D32F2F] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <div>
                              <p className="font-semibold text-slate-900">
                                ¿Tienes dudas urgentes?
                              </p>
                              <a
                                href="https://wa.me/5216621030059?text=Hola,%20tengo%20una%20duda%20sobre%20mi%20cotización"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#D32F2F] hover:text-[#B71C1C] font-medium transition-colors text-sm inline-flex items-center gap-1"
                              >
                                Escríbenos por WhatsApp
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            </div>
                          </div>

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
                          <button
                            onClick={resetForm}
                            className="border-2 border-slate-300 hover:border-[#D32F2F]
                                     hover:bg-slate-50 text-slate-900
                                     px-8 py-3 rounded-lg font-semibold transition-colors
                                     inline-flex items-center justify-center"
                          >
                            Nueva Cotización
                          </button>
                        </div>

                        {/* Mensaje final */}
                        <p className="text-center text-slate-500 mt-6 text-sm">
                          También te enviaremos una confirmación por correo electrónico
                        </p>

                      </div>
                    ) : (
                      <>
                        {/* Progress Bar Inline */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">

                            {/* PASO 1 */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className={`
                                w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                                text-sm font-semibold transition-colors
                                ${currentStep >= 1 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-400'}
                              `}>
                                {currentStep > 1 ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : '1'}
                              </div>
                              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                                currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'
                              }`}>
                                Servicio
                              </span>
                            </div>

                            {/* LÍNEA CONECTORA */}
                            <div className={`flex-1 h-1 mx-1 sm:mx-2 ${
                              currentStep > 1 ? 'bg-[#D32F2F]' : 'bg-slate-300'
                            }`} />

                            {/* PASO 2 */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className={`
                                w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                                text-sm font-semibold transition-colors
                                ${currentStep >= 2 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-400'}
                              `}>
                                {currentStep > 2 ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : '2'}
                              </div>
                              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                                currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'
                              }`}>
                                Detalles
                              </span>
                            </div>

                            {/* LÍNEA CONECTORA */}
                            <div className={`flex-1 h-1 mx-1 sm:mx-2 ${
                              currentStep > 2 ? 'bg-[#D32F2F]' : 'bg-slate-300'
                            }`} />

                            {/* PASO 3 */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className={`
                                w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center
                                text-sm font-semibold transition-colors
                                ${currentStep >= 3 ? 'bg-[#D32F2F] text-white' : 'bg-slate-200 text-slate-400'}
                              `}>
                                {currentStep > 3 ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : '3'}
                              </div>
                              <span className={`text-xs sm:text-sm font-medium transition-colors ${
                                currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'
                              }`}>
                                Contacto
                              </span>
                            </div>

                          </div>
                        </div>

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

                            {/* NIVEL 1: Tipo de Servicio */}
                            <div className="mb-6">
                              <label className="block text-sm font-semibold text-slate-900 mb-3">
                                ¿Qué necesitas?
                              </label>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Mudanza */}
                                <button
                                  type="button"
                                  data-servicio="mudanza"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      tipoServicio: 'mudanza',
                                      modalidadAlmacenamiento: '' // Reset nivel 2
                                    });
                                  }}
                                  className={`
                                    p-4 rounded-lg border-2 text-center transition-all
                                    ${formData.tipoServicio === 'mudanza'
                                      ? 'border-[#D32F2F] bg-[#D32F2F]/5 shadow-md'
                                      : 'border-slate-200 hover:border-slate-300'
                                    }
                                  `}
                                >
                                  <div className="text-2xl mb-2">🚚</div>
                                  <div className="font-semibold text-sm text-slate-900">Mudanza</div>
                                  <div className="text-xs text-slate-600 mt-1">$60/km</div>
                                </button>

                                {/* Almacenamiento */}
                                <button
                                  type="button"
                                  data-servicio="almacenamiento"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      tipoServicio: 'almacenamiento',
                                      modalidadAlmacenamiento: '' // Forzar elegir renta/compra
                                    });
                                  }}
                                  className={`
                                    p-4 rounded-lg border-2 text-center transition-all
                                    ${formData.tipoServicio === 'almacenamiento'
                                      ? 'border-[#D32F2F] bg-[#D32F2F]/5 shadow-md'
                                      : 'border-slate-200 hover:border-slate-300'
                                    }
                                  `}
                                >
                                  <div className="text-2xl mb-2">📦</div>
                                  <div className="font-semibold text-sm text-slate-900">Almacenamiento</div>
                                  <div className="text-xs text-slate-600 mt-1">Renta o compra</div>
                                </button>

                                {/* Ambos */}
                                <button
                                  type="button"
                                  data-servicio="ambos"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      tipoServicio: 'ambos',
                                      modalidadAlmacenamiento: 'renta' // Auto-asumir renta
                                    });
                                  }}
                                  className={`
                                    p-4 rounded-lg border-2 text-center transition-all
                                    ${formData.tipoServicio === 'ambos'
                                      ? 'border-[#D32F2F] bg-[#D32F2F]/5 shadow-md'
                                      : 'border-slate-200 hover:border-slate-300'
                                    }
                                  `}
                                >
                                  <div className="text-2xl mb-2">📦🚚</div>
                                  <div className="font-semibold text-sm text-slate-900">Ambos</div>
                                  <div className="text-xs text-slate-600 mt-1">Renta + mudanza</div>
                                </button>
                              </div>

                              {/* Helper text nivel 1 */}
                              {formData.tipoServicio && (
                                <p className="text-xs text-slate-600 mt-2">
                                  {formData.tipoServicio === 'mudanza' && 'Servicio puntual de transporte local'}
                                  {formData.tipoServicio === 'almacenamiento' && 'Elige si rentar o comprar →'}
                                  {formData.tipoServicio === 'ambos' && 'Renta mensual + servicio de mudanza incluido'}
                                </p>
                              )}

                              {errors.tipoServicio && (
                                <p className="text-red-600 text-sm mt-1">{errors.tipoServicio}</p>
                              )}
                            </div>

                            {/* NIVEL 2: Modalidad Almacenamiento (SOLO si almacenamiento) */}
                            {formData.tipoServicio === 'almacenamiento' && (
                              <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-900 mb-3">
                                  ¿Prefieres rentar o comprar?
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                  {/* Renta */}
                                  <button
                                    type="button"
                                    data-modalidad="renta"
                                    onClick={() => setFormData({ ...formData, modalidadAlmacenamiento: 'renta' })}
                                    className={`
                                      p-4 rounded-lg border-2 text-center transition-all
                                      ${formData.modalidadAlmacenamiento === 'renta'
                                        ? 'border-[#D32F2F] bg-[#D32F2F]/5 shadow-md'
                                        : 'border-slate-200 hover:border-slate-300'
                                      }
                                    `}
                                  >
                                    <div className="text-2xl mb-2">📦</div>
                                    <div className="font-semibold text-sm text-slate-900">Renta</div>
                                    <div className="text-xs text-slate-600 mt-1">Desde $3,000/mes</div>
                                    <div className="text-xs text-slate-500 mt-1">Sin compromiso largo</div>
                                  </button>

                                  {/* Compra */}
                                  <button
                                    type="button"
                                    data-modalidad="compra"
                                    onClick={() => setFormData({ ...formData, modalidadAlmacenamiento: 'compra' })}
                                    className={`
                                      p-4 rounded-lg border-2 text-center transition-all
                                      ${formData.modalidadAlmacenamiento === 'compra'
                                        ? 'border-[#D32F2F] bg-[#D32F2F]/5 shadow-md'
                                        : 'border-slate-200 hover:border-slate-300'
                                      }
                                    `}
                                  >
                                    <div className="text-2xl mb-2">🏢</div>
                                    <div className="font-semibold text-sm text-slate-900">Compra</div>
                                    <div className="text-xs text-slate-600 mt-1">Desde $55,000</div>
                                    <div className="text-xs text-slate-500 mt-1">Inversión permanente</div>
                                  </button>
                                </div>

                                {/* Helper text nivel 2 */}
                                {formData.modalidadAlmacenamiento && (
                                  <p className="text-xs text-slate-600 mt-2">
                                    {formData.modalidadAlmacenamiento === 'renta' && 'Flexible - Cancela cuando quieras con 15 días de aviso'}
                                    {formData.modalidadAlmacenamiento === 'compra' && 'Recuperas tu inversión en 12-21 meses vs renta'}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Separador visual */}
                            <div className="border-t border-slate-200 my-6"></div>

                            {/* Código Postal */}
                            <div>
                              <label className="block text-sm font-medium text-slate-900 mb-2">
                                {formData.tipoServicio === 'mudanza'
                                  ? '¿De dónde te mudas?'
                                  : '¿Dónde te encuentras?'} *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={formData.codigoPostal}
                                  onChange={(e) => handleChange('codigoPostal', e.target.value.replace(/\D/g, '').slice(0, 5))}
                                  maxLength={5}
                                  className={`
                                    w-full border-2 rounded-lg px-4 py-2.5 text-base outline-none pl-10
                                    transition-colors bg-white
                                    ${errors.codigoPostal
                                      ? 'border-red-600 focus:border-red-600'
                                      : 'border-slate-300 focus:border-[#D32F2F]'}
                                  `}
                                  placeholder="12345"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              {errors.codigoPostal && (
                                <p className="text-red-600 text-sm mt-1">{errors.codigoPostal}</p>
                              )}
                            </div>

                            {/* Botón Siguiente */}
                            <button
                              onClick={handleStep1Next}
                              disabled={!isMounted || !formData.tipoServicio || formData.codigoPostal.length !== 5}
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
                                className="text-[#D32F2F] hover:text-[#B71C1C] underline font-medium"
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

{/* Campos visibles SOLO si tiene selección completa */}
                            {(formData.tipoServicio === 'mudanza' || formData.modalidadAlmacenamiento || formData.tipoServicio === 'ambos') && (
                              <>
                                {/* ==================== CAMPOS RENTA ==================== */}
                                {((formData.tipoServicio === 'almacenamiento' && formData.modalidadAlmacenamiento === 'renta') ||
                                  formData.tipoServicio === 'ambos') && (
                                  <>
                                    {/* Tamaño */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tamaño de contenedor *
                                      </label>
                                      <select
                                        name="tamanoContenedor"
                                        value={formData.tamanoContenedor || ''}
                                        onChange={(e) => handleChange('tamanoContenedor', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">Selecciona un tamaño</option>
                                        <option value="10">10 pies (pequeño)</option>
                                        <option value="20">20 pies (mediano)</option>
                                        <option value="40">40 pies (grande)</option>
                                      </select>
                                    </div>

                                    {/* Duración */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Duración estimada *
                                      </label>
                                      <select
                                        name="duracionAlmacenamiento"
                                        value={formData.duracionAlmacenamiento || ''}
                                        onChange={(e) => handleChange('duracionAlmacenamiento', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">¿Cuánto tiempo?</option>
                                        <option value="1-3">1-3 meses</option>
                                        <option value="3-6">3-6 meses (10% descuento)</option>
                                        <option value="6-12">6-12 meses (10% descuento)</option>
                                        <option value="12+">Más de 12 meses (10% descuento)</option>
                                      </select>
                                    </div>

                                    {/* Ubicación */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Ubicación del contenedor *
                                      </label>
                                      <select
                                        name="ubicacionContenedor"
                                        value={formData.ubicacionContenedor || ''}
                                        onChange={(e) => handleChange('ubicacionContenedor', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">Selecciona ubicación</option>
                                        <option value="mi-ubicacion">En mi terreno/ubicación</option>
                                        <option value="bodega-smi">En bodega SMI (10% descuento adicional)</option>
                                      </select>
                                    </div>
                                  </>
                                )}

                                {/* ==================== CAMPOS COMPRA ==================== */}
                                {formData.tipoServicio === 'almacenamiento' && formData.modalidadAlmacenamiento === 'compra' && (
                                  <>
                                    {/* Tamaño */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tamaño de contenedor *
                                      </label>
                                      <select
                                        name="tamanoContenedor"
                                        value={formData.tamanoContenedor || ''}
                                        onChange={(e) => handleChange('tamanoContenedor', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">Selecciona un tamaño</option>
                                        <option value="10">10 pies</option>
                                        <option value="20">20 pies</option>
                                        <option value="40">40 pies</option>
                                      </select>
                                    </div>

                                    {/* Tipo de Acceso - CON PRICING DINÁMICO */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tipo de acceso *
                                      </label>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                          type="button"
                                          onClick={() => handleChange('tipoAcceso', 'cortinilla')}
                                          className={`
                                            p-4 rounded-lg border-2 text-left transition-all
                                            ${formData.tipoAcceso === 'cortinilla'
                                              ? 'border-[#D32F2F] bg-[#D32F2F]/5'
                                              : 'border-slate-200 hover:border-slate-300'
                                            }
                                          `}
                                        >
                                          <div className="font-semibold text-sm text-slate-900 mb-1">
                                            Cortinilla Lateral
                                          </div>
                                          <div className="text-xs text-slate-600 mb-2">
                                            Acceso lateral completo. Ideal para carga/descarga frecuente.
                                          </div>
                                          {formData.tamanoContenedor && (
                                            <div className="text-xs font-bold text-[#D32F2F]">
                                              {formData.tamanoContenedor === '10' && '$55,000'}
                                              {formData.tamanoContenedor === '20' && '$65,000'}
                                              {formData.tamanoContenedor === '40' && 'Contáctanos'}
                                            </div>
                                          )}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleChange('tipoAcceso', 'puertas')}
                                          className={`
                                            p-4 rounded-lg border-2 text-left transition-all
                                            ${formData.tipoAcceso === 'puertas'
                                              ? 'border-[#D32F2F] bg-[#D32F2F]/5'
                                              : 'border-slate-200 hover:border-slate-300'
                                            }
                                          `}
                                        >
                                          <div className="font-semibold text-sm text-slate-900 mb-1">
                                            Puertas Traseras
                                          </div>
                                          <div className="text-xs text-slate-600 mb-2">
                                            Más seguro. Ideal para almacenamiento largo plazo.
                                          </div>
                                          {formData.tamanoContenedor && (
                                            <div className="text-xs font-bold text-[#D32F2F]">
                                              {formData.tamanoContenedor === '10' && '$57,000'}
                                              {formData.tamanoContenedor === '20' && '$70,000'}
                                              {formData.tamanoContenedor === '40' && '$83,000 (1) / $75,000 (2+)'}
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                      <p className="text-xs text-slate-500 mt-2">
                                        El precio varía según el tipo de acceso
                                      </p>
                                    </div>

                                    {/* Uso */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        ¿Para qué lo usarás? *
                                      </label>
                                      <select
                                        name="usoContenedor"
                                        value={formData.usoContenedor || ''}
                                        onChange={(e) => handleChange('usoContenedor', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">Selecciona uso</option>
                                        <option value="bodega-personal">Bodega personal</option>
                                        <option value="bodega-comercial">Bodega comercial</option>
                                        <option value="oficina">Oficina</option>
                                        <option value="vivienda">Vivienda</option>
                                        <option value="otro">Otro</option>
                                      </select>
                                    </div>

                                    {/* Urgencia */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        ¿Cuándo lo necesitas? *
                                      </label>
                                      <select
                                        name="urgenciaEntrega"
                                        value={formData.urgenciaEntrega || ''}
                                        onChange={(e) => handleChange('urgenciaEntrega', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">Selecciona tiempo</option>
                                        <option value="urgente">Esta semana (urgente)</option>
                                        <option value="1-2-semanas">En 1-2 semanas</option>
                                        <option value="1-mes">En 1 mes</option>
                                        <option value="sin-prisa">No tengo prisa</option>
                                      </select>
                                    </div>
                                  </>
                                )}

                                {/* ==================== CAMPOS MUDANZA ==================== */}
                                {formData.tipoServicio === 'mudanza' && (
                                  <>
                                    {/* Tamaño */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Tamaño necesario *
                                      </label>
                                      <select
                                        name="tamanoContenedor"
                                        value={formData.tamanoContenedor || ''}
                                        onChange={(e) => handleChange('tamanoContenedor', e.target.value)}
                                        required
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      >
                                        <option value="">Selecciona un tamaño</option>
                                        <option value="10">10 pies (pequeño)</option>
                                        <option value="20">20 pies (mediano)</option>
                                        <option value="40">40 pies (grande)</option>
                                        <option value="no-se">No estoy seguro</option>
                                      </select>
                                    </div>

                                    {/* CP Destino */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Código postal destino *
                                      </label>
                                      <input
                                        type="text"
                                        name="codigoPostalDestino"
                                        value={formData.codigoPostalDestino || ''}
                                        onChange={(e) => handleChange('codigoPostalDestino', e.target.value.replace(/\D/g, '').slice(0, 5))}
                                        placeholder="Ej: 12345"
                                        required
                                        maxLength={5}
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      />
                                      <p className="text-xs text-slate-500 mt-1">¿Hacia dónde te mudas?</p>
                                    </div>

                                    {/* Fecha Mudanza */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Fecha aproximada de mudanza
                                      </label>
                                      <input
                                        type="date"
                                        name="fechaMudanza"
                                        value={formData.fechaEntrega ? formData.fechaEntrega.toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleChange('fechaEntrega', e.target.value ? new Date(e.target.value) : null)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      />
                                    </div>
                                  </>
                                )}

                                {/* ==================== CAMPOS AMBOS (Renta + Mudanza) ==================== */}
                                {formData.tipoServicio === 'ambos' && (
                                  <>
                                    {/* Nota explicativa */}
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                      <p className="text-sm text-blue-900">
                                        <strong>Servicio combinado:</strong> Renta mensual de contenedor + servicio de mudanza incluido
                                      </p>
                                    </div>

                                    {/* CP Destino para mudanza */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Código postal destino (mudanza) *
                                      </label>
                                      <input
                                        type="text"
                                        name="codigoPostalDestino"
                                        value={formData.codigoPostalDestino || ''}
                                        onChange={(e) => handleChange('codigoPostalDestino', e.target.value.replace(/\D/g, '').slice(0, 5))}
                                        placeholder="Ej: 12345"
                                        required
                                        maxLength={5}
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      />
                                      <p className="text-xs text-slate-500 mt-1">¿Hacia dónde lo llevamos?</p>
                                    </div>

                                    {/* Fecha Mudanza */}
                                    <div className="mb-4">
                                      <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Fecha aproximada de entrega
                                      </label>
                                      <input
                                        type="date"
                                        name="fechaMudanza"
                                        value={formData.fechaEntrega ? formData.fechaEntrega.toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleChange('fechaEntrega', e.target.value ? new Date(e.target.value) : null)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                      />
                                    </div>
                                  </>
                                )}

                                {/* ==================== CAMPOS UNIVERSALES ==================== */}

                                {/* Código postal origen (todos) - solo si no es "almacenamiento sin modalidad" */}
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Código postal {formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos' ? 'origen' : ''} *
                                  </label>
                                  <input
                                    type="text"
                                    name="codigoPostal"
                                    value={formData.codigoPostal || ''}
                                    onChange={(e) => handleChange('codigoPostal', e.target.value.replace(/\D/g, '').slice(0, 5))}
                                    placeholder="Ej: 12345"
                                    required
                                    maxLength={5}
                                    className="w-full border-2 border-slate-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20 rounded-lg px-4 py-3 text-base outline-none transition-colors duration-200"
                                  />
                                  <p className="text-xs text-slate-500 mt-1">
                                    {formData.tipoServicio === 'mudanza' || formData.tipoServicio === 'ambos'
                                      ? '¿Desde dónde?'
                                      : '¿Dónde te encuentras?'
                                    }
                                  </p>
                                </div>

                                {/* CTA Submit */}
                                <button
                                  type="button"
                                  onClick={handleStep2Next}
                                  className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-xl hover:shadow-2xl"
                                >
                                  Siguiente →
                                </button>
                              </>
                            )}

                            {/* Mensaje si NO ha completado selección */}
                            {!formData.tipoServicio && (
                              <div className="text-center py-8 text-slate-600">
                                <p className="text-sm">👆 Selecciona qué necesitas para continuar</p>
                              </div>
                            )}

                            {formData.tipoServicio === 'almacenamiento' && !formData.modalidadAlmacenamiento && (
                              <div className="text-center py-8 text-slate-600">
                                <p className="text-sm">👆 Elige si prefieres rentar o comprar</p>
                              </div>
                            )}

                            {/* Botón Atrás siempre visible */}
                            <button
                              onClick={() => setCurrentStep(1)}
                              className="w-full mt-3 border-2 border-slate-300 hover:border-slate-400
                                         bg-slate-50 hover:bg-slate-100
                                         text-slate-900 px-4 py-2.5 rounded-lg font-semibold
                                         transition-colors"
                            >
                              ← Atrás
                            </button>
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

                            {/* Botones */}
                            <div className="flex gap-3 pt-2">
                              <button
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 border-2 border-slate-300 hover:border-slate-400
                                           bg-slate-50 hover:bg-slate-100
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

            </div>
          </div>
        </section>

        {/* Nueva sección después del hero */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                ¿Qué Servicio Necesitas?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Tres formas de usar nuestros contenedores según tu situación
              </p>
            </div>

            {/* 3 Cards lado a lado */}
            <div className="grid lg:grid-cols-3 gap-8">

              {/* CARD 1: RENTA */}
              <div className="relative bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 hover:border-[#D32F2F] transition-all duration-200 group">

                {/* Badge "Más Popular" */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#D32F2F] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Más Popular
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-[#D32F2F] bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D32F2F] transition-colors">
                  <svg className="w-8 h-8 stroke-smi-red group-hover:stroke-white transition-colors" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Renta Mensual
                </h3>
                <p className="text-slate-600 mb-6">
                  Flexibilidad total sin compromisos largos
                </p>

                {/* Ideal para */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-900 mb-3">IDEAL PARA:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Remodelaciones (3-6 meses)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Inventario temporal</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Necesidad menor a 12 meses</span>
                    </li>
                  </ul>
                </div>

                {/* Cómo funciona */}
                <div className="mb-6 pb-6 border-b border-slate-300">
                  <p className="text-sm font-semibold text-slate-900 mb-3">CÓMO FUNCIONA:</p>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">1.</span>
                      <span>Cotizas y pagas depósito + mes 1</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">2.</span>
                      <span>Entregamos en 24-48h (gratis Hmo)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">3.</span>
                      <span>Usas mes a mes sin contrato largo</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">4.</span>
                      <span>Cancelas con 15 días de aviso</span>
                    </li>
                  </ol>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-1">Desde</p>
                  <p className="text-3xl font-bold text-slate-900">
                    $3,000<span className="text-lg font-normal text-slate-600">/mes</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">+ IVA • 10&apos; pies • Descuentos desde 6 meses</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    const formSection = document.querySelector('section');
                    const tipoServicioButtons = document.querySelectorAll('[data-servicio="almacenamiento"]');
                    if (tipoServicioButtons[0]) {
                      (tipoServicioButtons[0] as HTMLButtonElement).click();
                      setTimeout(() => {
                        const modalidadButtons = document.querySelectorAll('[data-modalidad="renta"]');
                        if (modalidadButtons[0]) (modalidadButtons[0] as HTMLButtonElement).click();
                      }, 100);
                    }
                    formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-6 py-3 sm:px-8 sm:py-3.5 text-base sm:text-lg rounded-lg font-semibold transition-colors duration-200"
                >
                  Cotizar Renta
                </button>
              </div>

              {/* CARD 2: COMPRA */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 hover:border-[#D32F2F] transition-all duration-200 group">

                {/* Icon */}
                <div className="w-16 h-16 bg-[#D32F2F] bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D32F2F] transition-colors">
                  <svg className="w-8 h-8 stroke-smi-red group-hover:stroke-white transition-colors" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Compra
                </h3>
                <p className="text-slate-600 mb-6">
                  Inversión que se paga sola en 12-21 meses
                </p>

                {/* Ideal para */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-900 mb-3">IDEAL PARA:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Bodega permanente de negocio</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Proyecto de conversión (oficina/casa)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Uso mayor a 18 meses</span>
                    </li>
                  </ul>
                </div>

                {/* Cómo funciona */}
                <div className="mb-6 pb-6 border-b border-slate-300">
                  <p className="text-sm font-semibold text-slate-900 mb-3">CÓMO FUNCIONA:</p>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">1.</span>
                      <span>Cotizas y eliges tipo de acceso</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">2.</span>
                      <span>Pagas y preparamos tu contenedor</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">3.</span>
                      <span>Entregamos en tu ubicación</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">4.</span>
                      <span>Es tuyo para siempre, $0 mensual</span>
                    </li>
                  </ol>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-1">Desde</p>
                  <p className="text-3xl font-bold text-slate-900">
                    $55,000
                  </p>
                  <p className="text-xs text-slate-500 mt-1">+ IVA • 10&apos; pies • Break-even en 21 meses vs renta</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    const formSection = document.querySelector('section');
                    const tipoServicioButtons = document.querySelectorAll('[data-servicio="almacenamiento"]');
                    if (tipoServicioButtons[0]) {
                      (tipoServicioButtons[0] as HTMLButtonElement).click();
                      setTimeout(() => {
                        const modalidadButtons = document.querySelectorAll('[data-modalidad="compra"]');
                        if (modalidadButtons[0]) (modalidadButtons[0] as HTMLButtonElement).click();
                      }, 100);
                    }
                    formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-[#D32F2F] px-6 py-3 sm:px-8 sm:py-3.5 text-base sm:text-lg rounded-lg font-semibold transition-all duration-200"
                >
                  Cotizar Compra
                </button>
              </div>

              {/* CARD 3: MUDANZA */}
              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-8 hover:border-[#D32F2F] transition-all duration-200 group">

                {/* Icon */}
                <div className="w-16 h-16 bg-[#D32F2F] bg-opacity-10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#D32F2F] transition-colors">
                  <svg className="w-8 h-8 stroke-smi-red group-hover:stroke-white transition-colors" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Mudanza
                </h3>
                <p className="text-slate-600 mb-6">
                  Servicio puntual de transporte seguro
                </p>

                {/* Ideal para */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-slate-900 mb-3">IDEAL PARA:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Cambio de casa o negocio</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Envío de inventario entre ciudades</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                      <span>Solo necesitas transporte</span>
                    </li>
                  </ul>
                </div>

                {/* Cómo funciona */}
                <div className="mb-6 pb-6 border-b border-slate-300">
                  <p className="text-sm font-semibold text-slate-900 mb-3">CÓMO FUNCIONA:</p>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">1.</span>
                      <span>Cotizas ruta ($60/km en Hermosillo)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">2.</span>
                      <span>Llevamos contenedor vacío, cargas 24h</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">3.</span>
                      <span>Transportamos seguro a destino</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="font-bold text-[#D32F2F] flex-shrink-0">4.</span>
                      <span>Descargas 24h, retiramos contenedor</span>
                    </li>
                  </ol>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <p className="text-sm text-slate-600 mb-1">Desde</p>
                  <p className="text-3xl font-bold text-slate-900">
                    $60<span className="text-lg font-normal text-slate-600">/km</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">+ IVA • Gratis en Hermosillo • Pago único</p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => {
                    const formSection = document.querySelector('section');
                    const tipoServicioButtons = document.querySelectorAll('[data-servicio="mudanza"]');
                    if (tipoServicioButtons[0]) {
                      (tipoServicioButtons[0] as HTMLButtonElement).click();
                    }
                    formSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-[#D32F2F] px-6 py-3 sm:px-8 sm:py-3.5 text-base sm:text-lg rounded-lg font-semibold transition-all duration-200"
                >
                  Cotizar Mudanza
                </button>
              </div>

            </div>

            {/* CTA Dudas WhatsApp - Secundario */}
            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-4">
                ¿No estás seguro cuál necesitas?
              </p>
              <a
                href="https://wa.me/6621030059?text=Hola,%20necesito%20ayuda%20para%20decidir%20qué%20servicio%20me%20conviene"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hablar con un asesor por WhatsApp
              </a>
            </div>

          </div>
        </section>

        {/* CÓMO FUNCIONA EL SERVICIO */}
        <section className="bg-white py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            {/* Header */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Cómo Funciona el Servicio
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Proceso simple y transparente de principio a fin
              </p>
            </div>

            {/* Timeline - Vertical on mobile, stays vertical on all sizes */}
            <div className="relative">

              {/* Vertical line connector (hidden on mobile for cleaner look) */}
              <div className="hidden sm:block absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200"></div>

              <div className="space-y-8">

                {/* Step 1: Cotiza Online */}
                <div className="relative flex gap-4 sm:gap-6">
                  {/* Number circle */}
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                  flex items-center justify-center text-white font-bold text-lg
                                  shadow-lg z-10">
                    1
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Cotiza Online
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                      Responde 5-6 preguntas sobre tamaño, duración y ubicación. Precio transparente
                      al instante. Confirma con depósito de 1 mes.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      ⏱️ 5 minutos
                    </p>
                  </div>
                </div>

                {/* Step 2: Entregamos */}
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                  flex items-center justify-center text-white font-bold text-lg
                                  shadow-lg z-10">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Entregamos en Tu Ubicación
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                      Llevamos el contenedor donde lo necesites. Hermosillo sin costo,
                      fuera de la ciudad $60/km.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      ⏱️ 24-48 horas
                    </p>
                  </div>
                </div>

                {/* Step 3: Cargas */}
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                  flex items-center justify-center text-white font-bold text-lg
                                  shadow-lg z-10">
                    3
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Cargas tus Cosas
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                      Tienes 24 horas para organizar y cargar.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      ⏱️ 1 día
                    </p>
                  </div>
                </div>

                {/* Step 4: Almacenas */}
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                  flex items-center justify-center text-white font-bold text-lg
                                  shadow-lg z-10">
                    4
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Almacenas el Tiempo que Necesites
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                      Pago mensual desde $3K. Descuentos automáticos si contratas 6+ meses (10%).
                      Bodega SMI o tu terreno, tú decides.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      ⏱️ Flexible (1 mes mínimo)
                    </p>
                  </div>
                </div>

                {/* Step 5: Retiramos */}
                <div className="relative flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#D32F2F] rounded-full
                                  flex items-center justify-center text-white font-bold text-lg
                                  shadow-lg z-10">
                    5
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      Retiramos Cuando Termines
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2">
                      Aviso con 15 días de anticipación. Recogemos contenedor sin costo en Hermosillo.
                      Depósito devuelto si está en buen estado.
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      ⏱️ 1 día
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Nota sobre compra */}
            <div className="mt-10 bg-slate-50 border-l-4 border-[#D32F2F] p-4 sm:p-6 rounded-r-lg">
              <div className="flex gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="text-sm sm:text-base text-slate-700 font-medium mb-1">
                    ¿Prefieres comprarlo?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600">
                    También vendemos contenedores. Es tuyo para siempre, lo modificas como quieras.
                    Desde $55K.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <a
                href="#formulario"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C] text-white
                           px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-semibold text-base sm:text-lg
                           transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Cotizar Ahora →
              </a>
            </div>

          </div>
        </section>

        {/* SECCIÓN FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-slate-600">
                Todo lo que necesitas saber sobre nuestros servicios
              </p>
            </div>

            {/* Accordion de 10 FAQs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg divide-y divide-slate-200 overflow-hidden">

              {/* FAQ 1 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 0 ? null : 0)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Puedo cancelar antes de tiempo?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 0 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 0 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    Sí, sin penalización. Solo necesitas avisar con 15 días de anticipación. Tu depósito se devuelve completo si el contenedor está en buen estado, o se aplica a tu último mes de renta.
                  </p>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 1 ? null : 1)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Puedo acceder al contenedor cuando quiera?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 1 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 1 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    Sí. Si está en tu terreno, tienes acceso 24/7. Si prefieres dejarlo en nuestra bodega, puedes acceder en horario laboral (lunes-viernes 8am-6pm, sábados 8am-2pm).
                  </p>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 2 ? null : 2)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Qué incluye la renta mensual?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 2 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 2 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    El contenedor limpio y listo para usar, más el transporte gratis en Hermosillo. También incluimos el retiro cuando termines de usarlo. Es un precio simple y transparente.
                  </p>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 3 ? null : 3)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Cuándo me conviene comprar en vez de rentar?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 3 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 3 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    Si lo necesitas por más de 18 meses, comprar es mejor inversión. El contenedor se paga solo entre 12-21 meses comparado con rentar. Después de eso, es tuyo para siempre sin pago mensual - puedes usarlo, modificarlo o venderlo.
                  </p>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 4 ? null : 4)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Qué diferencia hay entre cortinilla y puertas originales?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 4 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 4 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    Son dos tipos de acceso. Cortinilla: acceso lateral completo, ideal si entras y sales frecuentemente. Puertas: acceso trasero tradicional, más seguras para almacenamiento de largo plazo. Ambas son contenedores de calidad, elige según cómo lo usarás.
                  </p>
                </div>
              </div>

              {/* FAQ 6 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 5 ? null : 5)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Cómo funciona el servicio de mudanza?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 5 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 5 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    Simple: llevamos el contenedor a tu ubicación actual, lo dejas cargado (tienes 24 horas), lo transportamos seguro a tu nueva ubicación, y lo descargas (otras 24 horas). Es mudanza flexible a tu ritmo.
                  </p>
                </div>
              </div>

              {/* FAQ 7 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 6 ? null : 6)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Hasta dónde hacen mudanzas?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 6 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 6 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    Hermosillo gratis. También todo Sonora y nivel nacional - solo cobramos $60/km fuera de Hermosillo. Por ejemplo, una mudanza a Guaymas (130 km) cuesta $7,800 + IVA de transporte.
                  </p>
                </div>
              </div>

              {/* FAQ 8 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 7 ? null : 7)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Qué tamaño necesito?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 7 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 7 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    10 pies guarda lo de un cuarto o departamento pequeño. 20 pies lo de una casa 2-3 recámaras. 40 pies una casa completa. ¿Aún con dudas? Cotiza arriba y te asesoramos sin compromiso.
                  </p>
                </div>
              </div>

              {/* FAQ 9 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 8 ? null : 8)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Qué tan rápido lo entregan?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 8 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 8 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    En Hermosillo: 24-48 horas después de confirmar. Fuera de Hermosillo coordinamos la logística según la distancia, pero siempre con fechas claras desde la cotización.
                  </p>
                </div>
              </div>

              {/* FAQ 10 */}
              <div className="group">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === 9 ? null : 9)}
                  className="w-full py-8 px-6 sm:px-8 flex items-center justify-between gap-6 text-left
                             hover:bg-slate-50 transition-all duration-200 rounded-xl"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 leading-relaxed">
                    ¿Hay costos ocultos?
                  </h3>
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100
                                  flex items-center justify-center
                                  group-hover:bg-[#D32F2F] transition-colors duration-200">
                    <svg
                      className={`w-5 h-5 text-slate-600 group-hover:text-white
                                  transition-all duration-200 ${openFaqIndex === 9 ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaqIndex === 9 ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-6 sm:px-8">
                    No. Te damos el precio completo desde la cotización: renta/compra + transporte (si aplica) + IVA. Sin sorpresas, sin letra chica. Lo que ves es lo que pagas.
                  </p>
                </div>
              </div>

            </div>

            {/* CTA WhatsApp */}
            <div className="text-center mt-16 pt-12 border-t border-slate-200">
              <p className="text-lg text-slate-600 mb-8">
                ¿Tienes otra pregunta?
              </p>
              <a
                href="https://wa.me/6621030059?text=Hola,%20tengo%20una%20pregunta%20sobre%20los%20servicios%20de%20almacenamiento"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5A]
                           text-white px-8 py-4 rounded-xl font-semibold text-lg
                           transition-all duration-200 shadow-lg hover:shadow-xl
                           hover:scale-105"
              >
                {/* WhatsApp Icon */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hablar con un asesor
              </a>
            </div>

          </div>
        </section>

        {/* SECCIÓN DE UBICACIÓN + CONTACTO */}
        <LocationSection />

      </main>

    </>
  );
}
