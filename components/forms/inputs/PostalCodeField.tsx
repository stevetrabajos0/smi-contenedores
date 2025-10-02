import { UseFormRegisterReturn } from 'react-hook-form';

interface PostalCodeFieldProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export default function PostalCodeField({
  label,
  register,
  error,
  placeholder = '12345',
  required = false,
}: PostalCodeFieldProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        {...register}
        placeholder={placeholder}
        maxLength={5}
        className={`
          w-full px-4 py-2 rounded-lg border transition-colors
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
