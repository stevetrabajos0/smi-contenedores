import Link from 'next/link';

// Type-safe data structure
interface GalleryItem {
  id: number;
  image: string; // Placeholder por ahora
  title: string;
  landing: string;
}

// Data minimalista - 9 casos de uso
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    image: '/gallery/home-office.webp',
    title: 'Home Office',
    landing: '/cotizar/modelo-estandar'
  },
  {
    id: 2,
    image: '/gallery/puesto-comida.webp',
    title: 'Puesto de Comida',
    landing: '/cotizar/personalizado'
  },
  {
    id: 3,
    image: '/gallery/tiny-home.webp',
    title: 'Tiny Home',
    landing: '/cotizar/modelo-estandar'
  },
  {
    id: 4,
    image: '/gallery/airbnb.webp',
    title: 'Casa de Playa',
    landing: '/cotizar/personalizado'
  },
  {
    id: 5,
    image: '/gallery/restaurante.webp',
    title: 'Restaurante',
    landing: '/cotizar/personalizado'
  },
  {
    id: 6,
    image: '/gallery/oficinas-corporativas.webp',
    title: 'Oficinas Corporativas',
    landing: '/cotizar/personalizado'
  },
  {
    id: 7,
    image: '/gallery/bodega.webp',
    title: 'Bodega Permanente',
    landing: '/cotizar/almacenamiento'
  },
  {
    id: 8,
    image: '/gallery/plaza.webp',
    title: 'Plaza Comercial',
    landing: '/cotizar/personalizado'
  },
  {
    id: 9,
    image: '/gallery/casa-lujo.webp',
    title: 'Casa de Lujo',
    landing: '/cotizar/personalizado'
  }
];

export default function GallerySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header minimalista */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Qué Puedes Crear
          </h2>
        </div>

        {/* Grid: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.landing}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl
                         bg-slate-100 transition-all duration-200
                         hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Imagen real optimizada */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />

              {/* Overlay gradient para legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

              {/* Título - ÚNICO texto */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
