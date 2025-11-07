'use client';

import { useState, useEffect } from 'react';
import ProgressIndicator from './ProgressIndicator';

interface FormStep {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface FormEngineProps {
  steps: FormStep[];
  formKey: string; // Unique key for localStorage
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function FormEngine({
  steps,
  formKey,
  onSubmit,
  initialData = {},
}: FormEngineProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(formKey);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [formKey]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(formKey, JSON.stringify(formData));
    }
  }, [formData, formKey]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    // Clear localStorage after successful submission
    localStorage.removeItem(formKey);
  };

  const updateFormData = (stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }));
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          labels={steps.map((step) => step.label)}
        />
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        {currentStepData?.component}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className={`
            px-6 py-2 rounded-lg font-semibold transition-colors
            ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }
          `}
        >
          Anterior
        </button>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Enviar Cotización
          </button>
        )}
      </div>

      {/* Form Data Provider - pass updateFormData and formData to children */}
      <FormDataContext.Provider value={{ formData, updateFormData }}>
        <div className="hidden">{/* Context provider wrapper */}</div>
      </FormDataContext.Provider>
    </div>
  );
}

// Create context for form data sharing
import { createContext, useContext } from 'react';

interface FormDataContextType {
  formData: any;
  updateFormData: (data: any) => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export function useFormData() {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error('useFormData must be used within FormEngine');
  }
  return context;
}
