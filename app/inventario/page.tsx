import InventoryGrid from '@/components/inventory/InventoryGrid';
import { InventoryItem } from '@/types/inventory';

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    assetId: 'CONT-001',
    type: 'Contenedor de Almacenamiento 20ft',
    description: 'Contenedor estándar de 20 pies, ideal para almacenamiento general. En excelentes condiciones.',
    status: 'Disponible',
    salePrice: 45000,
    rentPrice: 3500,
    photos: [],
    location: 'Monterrey, NL',
  },
  {
    id: '2',
    assetId: 'CONT-002',
    type: 'Contenedor de Almacenamiento 40ft',
    description: 'Contenedor de 40 pies con mayor capacidad de almacenamiento. Perfecto para grandes volúmenes.',
    status: 'Disponible',
    salePrice: 75000,
    rentPrice: 5500,
    photos: [],
    location: 'Guadalajara, JAL',
  },
  {
    id: '3',
    assetId: 'OFF-001',
    type: 'Contenedor de Oficina',
    description: 'Contenedor acondicionado como oficina con instalación eléctrica, clima y acabados interiores.',
    status: 'Rentado',
    salePrice: 120000,
    rentPrice: 8500,
    photos: [],
    location: 'Ciudad de México',
  },
  {
    id: '4',
    assetId: 'WAR-001',
    type: 'Contenedor Bodega 40ft',
    description: 'Contenedor tipo bodega con puertas dobles y rampa de acceso. Ideal para almacén industrial.',
    status: 'Disponible',
    salePrice: 85000,
    rentPrice: 6500,
    photos: [],
    location: 'Tijuana, BC',
  },
  {
    id: '5',
    assetId: 'CONT-003',
    type: 'Contenedor de Almacenamiento 20ft',
    description: 'Contenedor refrigerado, perfecto para productos que requieren temperatura controlada.',
    status: 'Disponible',
    salePrice: 95000,
    rentPrice: 7500,
    photos: [],
    location: 'Querétaro, QRO',
  },
  {
    id: '6',
    assetId: 'OFF-002',
    type: 'Contenedor de Oficina Premium',
    description: 'Oficina de lujo con baño, kitchenette, aire acondicionado y mobiliario incluido.',
    status: 'Vendido',
    salePrice: 150000,
    rentPrice: 10000,
    photos: [],
    location: 'Puebla, PUE',
  },
];

export default function InventarioPage() {
  return (
    <div className="min-h-screen py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Inventario</h1>
        <p className="text-xl text-slate-600 mb-8">Unidades disponibles para venta y renta</p>
        <InventoryGrid items={mockInventory} />
      </div>
    </div>
  );
}
