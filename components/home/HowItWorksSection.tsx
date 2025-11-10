import Link from 'next/link';

// Type-safe data structure
interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// 3 pasos - flujo de usuario para cotizar
const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '1',
    title: 'Elige tu Servicio',
    description: 'Oficinas listas, almacenamiento o proyecto a tu medida'
  },
  {
    number: '2',
    title: 'Completa el Formulario',
    description: '5-8 preguntas simples según lo que necesites'
  },
  {
    number: '3',
    title: 'Recibe Cotización',
    description: 'Propuesta detallada en minutos por WhatsApp'
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
            Cotiza tu proyecto en 3 pasos
          </p>
        </div>

        {/* Timeline horizontal - Desktop (lg+) */}
        <div className="hidden lg:block relative">

          {/* Línea conectora horizontal */}
          <div className="absolute top-12 left-[12%] right-[12%] h-1 bg-slate-300"
               style={{zIndex: 0}} />

          {/* Grid de 3 columnas */}
          <div className="grid grid-cols-3 gap-8 relative z-10">
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
          <a
            href="#servicios"
            className="inline-block bg-[#D32F2F] hover:bg-[#B71C1C]
                       text-white px-8 py-4 rounded-lg font-semibold text-lg
                       transition-colors duration-200 shadow-xl hover:shadow-2xl">
            Empezar Mi Cotización →
          </a>
          <p className="text-sm text-slate-500 mt-4">
            Sin compromiso. Precio transparente en minutos.
          </p>
        </div>
      </div>
    </section>
  );
}
