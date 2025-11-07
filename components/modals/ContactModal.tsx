'use client';

import { useEffect } from 'react';
import GeneralContactForm from '../forms/GeneralContactForm';

interface ContactModalProps {
  isOpen: boolean;                 // Controla visibilidad
  onClose: () => void;             // Callback para cerrar
  preSelectedService?: string;     // Pre-selecciona servicio (ej: "almacenamiento-mudanza")
  source: string;                  // Tracking
}

export default function ContactModal({
  isOpen,
  onClose,
  preSelectedService,
  source
}: ContactModalProps) {

  // Prevenir scroll del body cuando modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4
                 animate-in fade-in duration-200"
      onClick={onClose}  // Cerrar al hacer click en backdrop
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-8 relative
                   animate-in zoom-in-95 duration-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}  // NO cerrar al hacer click en modal
      >

        {/* Botón cerrar X */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600
                     transition-colors p-1 hover:bg-slate-100 rounded-lg"
          aria-label="Cerrar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            ¿Necesitas Ayuda?
          </h3>
          <p className="text-slate-600">
            Déjanos tus datos y un asesor te contacta en menos de 2 horas
          </p>
        </div>

        {/* Form General */}
        <GeneralContactForm
          preSelectedService={preSelectedService}
          source={source}
          onSuccess={onClose}  // Cierra modal cuando envío exitoso
        />

      </div>
    </div>
  );
}
