'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ModeloGalleryProps {
  imagenes: string[];
  nombre: string;
}

export default function ModeloGallery({ imagenes, nombre }: ModeloGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Galería Principal */}
      <div className="space-y-4">

        {/* Imagen Principal */}
        <div className="relative aspect-[4/3] bg-slate-100 rounded-2xl overflow-hidden group">
          <Image
            src={imagenes[currentIndex]}
            alt={`${nombre} - Imagen ${currentIndex + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover cursor-zoom-in"
            onClick={() => setShowLightbox(true)}
          />

          {/* Navegación Arrows */}
          {imagenes.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2
                           w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full
                           flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity
                           hover:bg-white hover:shadow-lg"
                aria-label="Imagen anterior"
              >
                <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full
                           flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity
                           hover:bg-white hover:shadow-lg"
                aria-label="Siguiente imagen"
              >
                <svg className="w-6 h-6 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Indicador de Click para Zoom */}
          <div className="absolute bottom-4 right-4
                          bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full
                          opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs font-medium text-slate-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
              Click para ampliar
            </p>
          </div>
        </div>

        {/* Thumbnails */}
        {imagenes.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imagenes.map((imagen, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden
                           border-2 transition-all
                           ${index === currentIndex
                             ? 'border-[#D32F2F] ring-2 ring-[#D32F2F]/20'
                             : 'border-slate-200 hover:border-slate-300'}`}
              >
                <Image
                  src={imagen}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Contador */}
        <p className="text-sm text-slate-500 text-center">
          Imagen {currentIndex + 1} de {imagenes.length}
        </p>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20
                       rounded-full flex items-center justify-center
                       transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-w-7xl w-full h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={imagenes[currentIndex]}
              alt={`${nombre} - Imagen ampliada ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {/* Navegación en Lightbox */}
            {imagenes.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2
                             w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                             flex items-center justify-center transition-colors"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2
                             w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full
                             flex items-center justify-center transition-colors"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Contador en Lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2
                            bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-sm font-medium text-white">
                {currentIndex + 1} / {imagenes.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
