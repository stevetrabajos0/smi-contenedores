import { Suspense } from 'react';
import GraciasContent from './GraciasContent';

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Cargando...</div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
