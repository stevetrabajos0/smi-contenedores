import { PRECIOS_BASE_MODELOS } from '@/lib/constants/pricing';

// Data de modelos estándar (compartida entre lista y páginas individuales)
export const modelos = [
  {
    id: 'modelo-20',
    nombre: 'Modelo 20 Pies',
    metros: '14m²',
    metros_number: 14,
    contenedor: '20 pies',
    dimensiones: '6.06m × 2.44m × 2.59m',
    peso: '2,300 kg',
    imagenes: ['/images/modelos/modelo-20.webp'],
    precio_desde: PRECIOS_BASE_MODELOS['20'],
    descripcion: 'Nuestro modelo más vendido. Espacio suficiente para 1 recámara + sala o 4-6 estaciones de trabajo. Listo en 3-4 semanas desde anticipo.',
    use_case: 'Ideal para parejas, oficinas pequeñas o proyectos de renta',
    incluye_base: [
      'Pintura del color que elijas (exterior e interior)',
      'Minisplit 1.5 ton incluido e instalado',
      '2 ventanas correderas + puerta con cerradura',
      'Instalación eléctrica completa (contactos, apagadores, centro de carga)'
    ],
    personaliza: [
      'Baño Simple (+$15K) - WC + lavabo',
      'Baño Completo (+$30K) - WC + lavabo + regadera',
      'Cocina integral (+$13K)',
      'División de 2 espacios (+$8K)'
    ],
    ideal_para: [
      'Vivienda 1-2 personas',
      'Oficina 4-6 personas',
      'Consultorio médico',
      'Showroom compacto'
    ],
    specs_tecnicas: {
      'Área útil': '14m²',
      'Altura interior': '2.39m',
      'Aislamiento': 'Poliuretano expandido 50mm',
      'Ventanas': '2 ventanas correderas',
      'Puertas': '1 puerta principal',
      'Capacidad eléctrica': '110V/220V preparado'
    },
    tiempo_entrega: '3-4 semanas',
    slug: '20-pies',
    badge: 'MÁS VENDIDO'
  },
  {
    id: 'modelo-40',
    nombre: 'Modelo 40 Pies',
    metros: '30m²',
    metros_number: 30,
    contenedor: '40 pies',
    dimensiones: '12.19m × 2.44m × 2.59m',
    peso: '3,800 kg',
    imagenes: ['/images/modelos/modelo-40.webp'],
    precio_desde: PRECIOS_BASE_MODELOS['40'],
    descripcion: 'Amplitud y versatilidad para proyectos ambiciosos. Sistema de climatización incluido con distribución flexible para adaptarse a múltiples configuraciones residenciales o comerciales.',
    use_case: 'Perfecto para familias, oficinas completas o negocios con área de atención',
    incluye_base: [
      'Pintura del color que elijas (exterior e interior)',
      '2 minisplits de 1.5 ton incluidos e instalados',
      '4 ventanas correderas + puerta principal con cerradura',
      'Instalación eléctrica completa (contactos, apagadores, centro de carga)'
    ],
    personaliza: [
      'Añadir baño completo (+$25-30K)',
      'Añadir cocina integral (+$13K)',
      'Añadir 2-3 divisiones interiores (+$15-25K)',
      'Añadir segunda planta/mezzanine (+$80-120K)'
    ],
    ideal_para: [
      'Vivienda familiar 3-4 personas',
      'Oficina 8-12 personas',
      'Showroom premium',
      'Espacio comercial amplio'
    ],
    specs_tecnicas: {
      'Área útil': '30m²',
      'Altura interior': '2.39m',
      'Aislamiento': 'Poliuretano expandido 50mm',
      'Ventanas': '4 ventanas correderas',
      'Puertas': '1 puerta principal + 1 lateral',
      'Climatización': 'Preparado para 2-3 minisplits',
      'Capacidad eléctrica': '110V/220V preparado'
    },
    tiempo_entrega: '4-5 semanas',
    slug: '40-pies',
    badge: 'FAMILIAS'
  },
  {
    id: 'modelo-10',
    nombre: 'Modelo 10 Pies',
    metros: '7m²',
    metros_number: 7,
    contenedor: '10 pies',
    dimensiones: '2.99m × 2.44m × 2.59m',
    peso: '2,200 kg',
    imagenes: ['/images/modelos/modelo-10.webp'],
    precio_desde: PRECIOS_BASE_MODELOS['10'],
    descripcion: 'Espacio base compacto listo para personalizar según tu visión. Estructura certificada con todas las instalaciones base incluidas. Ideal para studio individual, oficina compacta o caseta de vigilancia.',
    use_case: 'Perfecto para 1 persona o espacio de trabajo individual',
    incluye_base: [
      'Pintura del color que elijas (exterior e interior)',
      'Minisplit 1 ton incluido e instalado',
      'Ventana corredera + puerta con cerradura',
      'Instalación eléctrica completa (contactos, apagadores, centro de carga)'
    ],
    personaliza: [
      'Añadir baño completo (+$15-20K)',
      'Añadir muebles fijos (+$8-15K)'
    ],
    ideal_para: [
      'Studio individual',
      'Oficina compacta 2-3 personas',
      'Caseta de vigilancia',
      'Espacio de almacenamiento premium'
    ],
    specs_tecnicas: {
      'Área útil': '7m²',
      'Altura interior': '2.39m',
      'Aislamiento': 'Poliuretano expandido 50mm',
      'Ventanas': '1 ventana corredera',
      'Puertas': '1 puerta de acceso',
      'Capacidad eléctrica': '110V/220V preparado'
    },
    tiempo_entrega: '2-3 semanas',
    slug: '10-pies',
    badge: 'OFICINA PERSONAL'
  }
];

export function getModeloBySlug(slug: string) {
  return modelos.find(m => m.slug === slug);
}

export function getAllModeloSlugs() {
  return modelos.map(m => ({ slug: m.slug }));
}
