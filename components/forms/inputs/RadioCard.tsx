interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
  price?: string;
  image?: string;
  selected: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function RadioCard({
  value,
  label,
  description,
  price,
  image,
  selected,
  onChange,
  disabled = false,
}: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(value)}
      disabled={disabled}
      className={`
        relative w-full p-4 rounded-lg border-2 text-left transition-all
        ${
          selected
            ? 'border-[#D32F2F] bg-[#FFEBEE] ring-2 ring-[#D32F2F] ring-offset-2'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Selected Indicator */}
      <div className="absolute top-3 right-3">
        <div className={`bg-[#D32F2F] rounded-full p-1 transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}>
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Optional Image */}
        {image && (
          <div className="flex-shrink-0">
            <img
              src={image}
              alt={label}
              className="w-16 h-16 object-cover rounded-md"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className={`font-semibold ${selected ? 'text-[#B71C1C]' : 'text-gray-900'}`}>
                {label}
              </h4>
              {description && (
                <p className={`mt-1 text-sm ${selected ? 'text-[#D32F2F]' : 'text-gray-600'}`}>
                  {description}
                </p>
              )}
            </div>
            {price && (
              <div className="ml-4">
                <span className={`font-bold ${selected ? 'text-[#B71C1C]' : 'text-gray-900'}`}>
                  {price}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
