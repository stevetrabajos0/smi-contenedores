'use client';

interface PostalCodeFieldRegister {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<void | boolean>;
  onBlur: () => void | Promise<void | boolean>;
  ref: (instance: HTMLInputElement | null) => void;
}

interface PostalCodeFieldProps {
  // Modo Controlled (para useState forms)
  value?: string;
  onChange?: (value: string) => void;

  // Modo RHF (para React Hook Form)
  register?: PostalCodeFieldRegister;

  // Props comunes
  name?: string;
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function PostalCodeField({
  value,
  onChange,
  register,
  name,
  label = 'Código Postal',
  error,
  required = true,
  placeholder = '12345',
  className = '',
}: PostalCodeFieldProps) {
  // Detectar modo de operación
  const isControlled = value !== undefined && onChange !== undefined;
  const isRHF = register !== undefined;

  // Determinar el nombre del campo (desde prop o desde register)
  const fieldName = name || register?.name || 'postalCode';

  // Handler para modo controlled
  const handleControlledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isControlled && onChange) {
      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 5);
      onChange(sanitized);
    }
  };

  // Handler para modo RHF
  const handleRHFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isRHF && register) {
      const sanitized = e.target.value.replace(/\D/g, '').slice(0, 5);
      e.target.value = sanitized;
      register.onChange(e);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-900 mb-1.5">
        {label}
        {required && <span className="text-[#D32F2F] ml-1">*</span>}
      </label>

      <div className="relative">
        {/* Location Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <input
          type="text"
          id={fieldName}
          name={fieldName}
          inputMode="numeric"
          maxLength={5}
          placeholder={placeholder}
          // Conditional props based on mode
          {...(isControlled && {
            value: value,
            onChange: handleControlledChange,
          })}
          {...(isRHF && {
            ...register,
            onChange: handleRHFChange,
          })}
          className={`
            w-full pl-12 pr-3 py-2.5
            border-2 rounded-lg
            text-gray-900 placeholder-gray-400
            transition-colors duration-200
            ${error
              ? 'border-[#D32F2F] focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20'
              : 'border-gray-300 focus:border-[#D32F2F] focus:ring-2 focus:ring-[#D32F2F]/20'
            }
            focus:outline-none
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${fieldName}-error` : undefined}
        />
      </div>

      {error && (
        <p id={`${fieldName}-error`} className="mt-1.5 text-sm text-[#D32F2F]">
          {error}
        </p>
      )}
    </div>
  );
}
