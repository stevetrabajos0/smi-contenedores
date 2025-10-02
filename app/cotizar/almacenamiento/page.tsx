'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import FormLayout from '@/components/forms/FormLayout';
import ProgressIndicator from '@/components/forms/ProgressIndicator';
import StorageTypeSelector from '@/components/forms/storage/StorageTypeSelector';
import StorageDetails from '@/components/forms/storage/StorageDetails';
import WhatsAppButton from '@/components/forms/WhatsAppButton';

const STORAGE_KEY = 'smi-storage-form';

export default function AlmacenamientoPage() {
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

  const handleStep2Submit = async (data: any) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);

    try {
      const response = await fetch('/api/forms/storage', {
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

  const handlePrevious = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTitle = () => {
    const serviceType = formData.tipoServicio;
    if (serviceType === 'mudanza') return 'Cotización de Mudanza';
    if (serviceType === 'almacenamiento') return 'Cotización de Almacenamiento';
    if (serviceType === 'ambos') return 'Cotización de Mudanza y Almacenamiento';
    return 'Cotización de Almacenamiento';
  };

  return (
    <>
      <Toaster position="top-center" />
      <FormLayout
        title={getTitle()}
        progressIndicator={
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={2}
            labels={['Tipo de Servicio', 'Detalles']}
          />
        }
      >
        {currentStep === 1 && (
          <>
            <StorageTypeSelector
              onNext={handleStep1Submit}
              initialData={formData}
            />
            <div className="mt-6 pt-6 border-t">
              <WhatsAppButton context="almacenamiento" />
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
            <StorageDetails
              serviceType={formData.tipoServicio}
              onSubmit={handleStep2Submit}
              initialData={formData}
            />
          </>
        )}
      </FormLayout>
    </>
  );
}
