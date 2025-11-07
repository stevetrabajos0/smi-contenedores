import Link from 'next/link';

// Type-safe data structure
interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// 4 pasos unificados - proceso real SMI
const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '1',
    title: 'Cotiza en Minutos',
    description: 'Responde 5-8 preguntas según lo que necesites. Precio transparente al instante.'
  },
  {
    number: '2',
    title: 'Confirma y Paga',
    description: 'Anticipo según proyecto: desde depósito de 1 mes hasta 50% para construcción.'
  },
  {
    number: '3',
    title: 'Construimos o Entregamos',
    description: 'De 1-3 días para almacenamiento hasta 16 semanas para proyectos personalizados.'
  },
  {
    number: '4',
    title: 'Instalamos en Tu Ubicación',
    description: 'Entrega con transporte incluido en Hermosillo. $60/km fuera de la ciudad.'
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Cómo Funciona
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Proceso transparente en 4 pasos. De cotización a entrega.
          </p>
        </div>

        {/* Timeline horizontal - Desktop (lg+) */}
        <div className="hidden lg:block relative">

          {/* Línea conectora horizontal */}
          <div className="absolute top-12 left-[12%] right-[12%] h-1 bg-slate-300"
               style={{zIndex: 0}} />

          {/* Grid de 4 columnas */}
          <div className="grid grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center">

                {/* Círculo con número */}
                <div className="w-24 h-24 rounded-full bg-[#D32F2F]
                                flex items-center justify-center
                                shadow-xl mb-6">
                  <span className="text-white text-4xl font-bold">
                    {step.number}
                  </span>
                </div>

                {/* Contenido centrado */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack vertical - Tablet y Mobile (< lg) */}
        <div className="lg:hidden space-y-8">
          {PROCESS_STEPS.map((step) => (
            <div key={step.number}
                 className="flex gap-6 items-start">

              {/* Número */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#D32F2F]
                                flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl font-bold">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <Link
            href="/cotizar"
            className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C]
                       text-white px-8 py-4 rounded-lg font-semibold text-lg
                       transition-colors duration-200 shadow-xl hover:shadow-2xl">
            Empezar Mi Cotización →
          </Link>
          <p className="text-sm text-slate-500 mt-4">
            Sin compromiso. Precio transparente en minutos.
          </p>
        </div>
      </div>
    </section>
  );
}
