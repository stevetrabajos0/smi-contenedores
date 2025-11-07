'use client';

import PhoneField from '../inputs/PhoneField';

interface ContactFieldsProps {
  formData: {
    nombre: string;
    whatsapp: string;
    correo: string;
    preferenciaContacto?: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  includePreferenciaContacto?: boolean;
}

export default function ContactFields({
  formData,
  errors,
  onChange,
  includePreferenciaContacto = true,
}: ContactFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => onChange('nombre', e.target.value)}
          placeholder="Tu nombre"
          className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
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
          onChange: (e) => onChange('whatsapp', e.target.value),
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
          onChange={(e) => onChange('correo', e.target.value)}
          placeholder="tu@email.com"
          className={`w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors ${
            errors.correo
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          } focus:outline-none focus:ring-2`}
        />
        {errors.correo && <p className="mt-1 text-sm text-red-600">{errors.correo}</p>}
      </div>

      {includePreferenciaContacto && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ¿Cómo prefieres que te contactemos? <span className="text-red-500">*</span>
          </label>
          {errors.preferenciaContacto && (
            <p className="text-sm text-red-600 mb-2">{errors.preferenciaContacto}</p>
          )}
          <div className="space-y-3">
            {/* WhatsApp */}
            <label
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.preferenciaContacto === 'whatsapp'
                  ? 'border-[#D32F2F] bg-[#FFEBEE]'
                  : 'border-slate-300 hover:border-[#D32F2F]'
              }`}
            >
              <input
                type="radio"
                name="preferenciaContacto"
                value="whatsapp"
                checked={formData.preferenciaContacto === 'whatsapp'}
                onChange={(e) => onChange('preferenciaContacto', e.target.value)}
                className="w-4 h-4 text-[#D32F2F] focus:ring-[#D32F2F]"
              />
              <span className="ml-3 text-base font-medium text-slate-900">WhatsApp</span>
            </label>

            {/* Correo */}
            <label
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                formData.preferenciaContacto === 'correo'
                  ? 'border-[#D32F2F] bg-[#FFEBEE]'
                  : 'border-slate-300 hover:border-[#D32F2F]'
              }`}
            >
              <input
                type="radio"
                name="preferenciaContacto"
                value="correo"
                checked={formData.preferenciaContacto === 'correo'}
                onChange={(e) => onChange('preferenciaContacto', e.target.value)}
                className="w-4 h-4 text-[#D32F2F] focus:ring-[#D32F2F]"
              />
              <span className="ml-3 text-base font-medium text-slate-900">Correo Electrónico</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
