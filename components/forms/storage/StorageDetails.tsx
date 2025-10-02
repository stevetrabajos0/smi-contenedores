'use client';

import { useState } from 'react';
import DateField from '../inputs/DateField';
import PhoneField from '../inputs/PhoneField';
import PostalCodeField from '../inputs/PostalCodeField';
import RadioCard from '../inputs/RadioCard';
import DurationDropdown from '../inputs/DurationDropdown';

interface StorageDetailsProps {
  serviceType: string;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const LOCATION_OPTIONS = [
  { value: 'mi-ubicacion', label: 'Mi ubicación' },
  { value: 'bodega-smi', label: 'Bodega SMI' },
];

const CONTACT_PREFERENCE_OPTIONS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'correo', label: 'Correo Electrónico' },
  { value: 'telefono', label: 'Llamada Telefónica' },
];

export default function StorageDetails({
  serviceType,
  onSubmit,
  initialData = {},
}: StorageDetailsProps) {
  const [formData, setFormData] = useState({
    codigoPostalDestino: initialData.codigoPostalDestino || '',
    ubicacionContenedor: initialData.ubicacionContenedor || '',
    fechaEntrega: initialData.fechaEntrega || '',
    duracionAlmacenamiento: initialData.duracionAlmacenamiento || '',
    nombre: initialData.nombre || '',
    whatsapp: initialData.whatsapp || '',
    correo: initialData.correo || '',
    preferenciaContacto: initialData.preferenciaContacto || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const showMudanzaFields = serviceType === 'mudanza' || serviceType === 'ambos';
  const showAlmacenamientoFields = serviceType === 'almacenamiento' || serviceType === 'ambos';

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (showMudanzaFields && !formData.codigoPostalDestino) {
      newErrors.codigoPostalDestino = 'El código postal es requerido';
    }

    if (!formData.fechaEntrega) {
      newErrors.fechaEntrega = 'La fecha de entrega es requerida';
    }

    if (showAlmacenamientoFields && !formData.ubicacionContenedor) {
      newErrors.ubicacionContenedor = 'La ubicación es requerida';
    }

    if (showAlmacenamientoFields && !formData.duracionAlmacenamiento) {
      newErrors.duracionAlmacenamiento = 'La duración es requerida';
    }

    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.whatsapp || formData.whatsapp.length !== 10) {
      newErrors.whatsapp = 'El WhatsApp debe tener 10 dígitos';
    }

    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Ingresa un correo electrónico válido';
    }

    if (!formData.preferenciaContacto) {
      newErrors.preferenciaContacto = 'Selecciona una preferencia de contacto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Detalles del Servicio</h2>

      {/* Almacenamiento Fields */}
      {showAlmacenamientoFields && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Dónde quieres tu contenedor? <span className="text-red-500">*</span>
            </label>
            {errors.ubicacionContenedor && (
              <p className="text-sm text-red-600 mb-2">{errors.ubicacionContenedor}</p>
            )}
            <div className="space-y-3">
              {LOCATION_OPTIONS.map((option) => (
                <RadioCard
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  selected={formData.ubicacionContenedor === option.value}
                  onChange={(value) => handleInputChange('ubicacionContenedor', value)}
                />
              ))}
            </div>
          </div>

          <DurationDropdown
            label="¿Por cuánto tiempo necesitas almacenamiento?"
            register={{
              name: 'duracionAlmacenamiento',
              onChange: (e) => handleInputChange('duracionAlmacenamiento', e.target.value),
              onBlur: () => {},
              ref: () => {},
            }}
            error={errors.duracionAlmacenamiento}
            required
          />
        </>
      )}

      {/* Mudanza Fields */}
      {showMudanzaFields && (
        <div>
          <PostalCodeField
            label="¿A dónde te mudas?"
            register={{
              name: 'codigoPostalDestino',
              onChange: (e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                handleInputChange('codigoPostalDestino', value);
              },
              onBlur: () => {},
              ref: () => {},
            }}
            error={errors.codigoPostalDestino}
            placeholder="Código postal de destino"
            required
          />
        </div>
      )}

      {/* Common Date Field */}
      <DateField
        label="¿Cuándo quieres que entreguen tu contenedor?"
        register={{
          name: 'fechaEntrega',
          onChange: (e) => handleInputChange('fechaEntrega', e.target.value),
          onBlur: () => {},
          ref: () => {},
        }}
        error={errors.fechaEntrega}
        required
      />

      {/* Contact Fields */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Tu nombre"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.nombre
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          <PhoneField
            label="WhatsApp"
            register={{
              name: 'whatsapp',
              onChange: (e) => handleInputChange('whatsapp', e.target.value),
              onBlur: () => {},
              ref: () => {},
            }}
            error={errors.whatsapp}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => handleInputChange('correo', e.target.value)}
              placeholder="tu@email.com"
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                errors.correo
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } focus:outline-none focus:ring-2`}
            />
            {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo prefieres que te contactemos? <span className="text-red-500">*</span>
            </label>
            {errors.preferenciaContacto && (
              <p className="text-sm text-red-600 mb-2">{errors.preferenciaContacto}</p>
            )}
            <div className="space-y-3">
              {CONTACT_PREFERENCE_OPTIONS.map((option) => (
                <RadioCard
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  selected={formData.preferenciaContacto === option.value}
                  onChange={(value) => handleInputChange('preferenciaContacto', value)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Enviar Cotización
      </button>
    </div>
  );
}
