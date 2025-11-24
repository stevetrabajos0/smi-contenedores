'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}: ImageLightboxProps) {
  // Prevenir scroll del body cuando el lightbox está abierto
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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galería de imágenes"
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20
                   rounded-full flex items-center justify-center
                   transition-colors z-10"
        aria-label="Cerrar galería"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Contenedor de imagen */}
      <div
        className="relative max-w-7xl w-full h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1} de ${images.length}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />

        {/* Navegación - Solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <>
            {/* Botón anterior */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2
                         w-12 h-12 bg-white/10 hover:bg-white/20
                         rounded-full flex items-center justify-center
                         transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Botón siguiente */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2
                         w-12 h-12 bg-white/10 hover:bg-white/20
                         rounded-full flex items-center justify-center
                         transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Contador de imágenes */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                            bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-sm font-medium text-white">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
