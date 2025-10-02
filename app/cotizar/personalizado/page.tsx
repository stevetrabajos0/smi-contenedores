'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import FormLayout from '@/components/forms/FormLayout';
import ProgressIndicator from '@/components/forms/ProgressIndicator';
import ProjectTypeGrid from '@/components/forms/custom/ProjectTypeGrid';
import Specifications from '@/components/forms/custom/Specifications';
import BudgetTimeline from '@/components/forms/custom/BudgetTimeline';
import Inspiration from '@/components/forms/custom/Inspiration';
import WhatsAppButton from '@/components/forms/WhatsAppButton';

const STORAGE_KEY = 'smi-custom-form';

export default function PersonalizadoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const handleStep1Submit = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Submit = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep4Submit = async (data: any) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);

    try {
      const response = await fetch('/api/forms/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`¡Cotización enviada! Código: ${result.trackingCode}`);
        localStorage.removeItem(STORAGE_KEY);

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast.error(result.error || 'Error al enviar la cotización');
      }
    } catch (error) {
      toast.error('Error de conexión. Por favor intenta de nuevo.');
    }
  };

  const handleSkipStep4 = async () => {
    // Submit without inspiration details
    await handleStep4Submit({
      descripcion: 'No especificado',
      archivosInspiracion: '',
    });
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <FormLayout
        title="Cotización de Proyecto Personalizado"
        progressIndicator={
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={4}
            labels={['Tipo', 'Especificaciones', 'Presupuesto', 'Detalles']}
          />
        }
      >
        {currentStep === 1 && (
          <>
            <ProjectTypeGrid
              onNext={handleStep1Submit}
              initialData={formData}
            />
            <div className="mt-6 pt-6 border-t">
              <WhatsAppButton context="personalizado" />
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver
            </button>
            <Specifications
              onNext={handleStep2Submit}
              initialData={formData}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver
            </button>
            <BudgetTimeline
              onNext={handleStep3Submit}
              initialData={formData}
            />
          </>
        )}

        {currentStep === 4 && (
          <>
            <button
              type="button"
              onClick={handlePrevious}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver
            </button>
            <Inspiration
              onNext={handleStep4Submit}
              onSkip={handleSkipStep4}
              initialData={formData}
            />
          </>
        )}
      </FormLayout>
    </>
  );
}
