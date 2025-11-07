interface DurationDropdownRegister {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void | Promise<void | boolean>;
  onBlur: () => void | Promise<void | boolean>;
  ref: (instance: HTMLSelectElement | null) => void;
}

interface DurationDropdownProps {
  label: string;
  register: DurationDropdownRegister;
  error?: string;
  required?: boolean;
}

const DURATION_OPTIONS = [
  { value: '', label: 'Selecciona una duración' },
  { value: '1', label: '1 mes' },
  { value: '2', label: '2 meses' },
  { value: '3', label: '3 meses' },
  { value: '4', label: '4 meses' },
  { value: '5', label: '5 meses' },
  { value: '6', label: '6 meses' },
  { value: '7', label: '7 meses' },
  { value: '8', label: '8 meses' },
  { value: '9', label: '9 meses' },
  { value: '10', label: '10 meses' },
  { value: '11', label: '11 meses' },
  { value: '12', label: '12 meses' },
  { value: '12+', label: 'Más de 12 meses' },
];

export default function DurationDropdown({
  label,
  register,
  error,
  required = false,
}: DurationDropdownProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...register}
        className={`
          w-full px-4 py-2.5 h-11 rounded-lg border text-base transition-colors
          ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
        `}
      >
        {DURATION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
