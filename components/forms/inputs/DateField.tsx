'use client';

import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css';

// Register Spanish locale
registerLocale('es', es);

interface DateFieldRegister {
  name: string;
  onChange: (e: { target: { value: string } }) => void | Promise<void | boolean>;
  onBlur: () => void | Promise<void | boolean>;
  ref: (instance: any) => void;
}

interface DateFieldProps {
  label: string;
  register: DateFieldRegister;
  error?: string;
  required?: boolean;
  minDate?: string;
}

export default function DateField({
  label,
  register,
  error,
  required = false,
  minDate,
}: DateFieldProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get minimum date (today by default)
  const today = new Date();
  const minimumDate = minDate ? new Date(minDate) : today;

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);

    // Update the form value in YYYY-MM-DD format
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      // Create a synthetic event to trigger react-hook-form onChange
      const syntheticEvent = {
        target: {
          name: register.name,
          value: formattedDate,
        },
      };
      register.onChange(syntheticEvent);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {/* Calendar Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={minimumDate}
          locale="es"
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/aaaa"
          className={`
            w-full pl-12 pr-4 py-2.5 h-11 rounded-lg border text-base transition-colors cursor-pointer
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0
          `}
          calendarClassName="modern-datepicker"
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
