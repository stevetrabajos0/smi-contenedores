import { InventoryItem } from '@/types/inventory';
import Image from 'next/image';

interface InventoryCardProps {
  item: InventoryItem;
}

export default function InventoryCard({ item }: InventoryCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {item.photos && item.photos.length > 0 ? (
          <Image
            src={item.photos[0]}
            alt={item.description}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Status Badge */}
        <div className="mb-2">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              item.status === 'Disponible'
                ? 'bg-green-100 text-green-800'
                : item.status === 'Rentado'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {item.status}
          </span>
        </div>

        {/* Type */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {item.type}
        </h3>

        {/* Asset ID */}
        <p className="text-sm text-gray-600 mb-2">ID: {item.assetId}</p>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {item.description}
        </p>

        {/* Location */}
        <p className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Ubicación:</span> {item.location}
        </p>

        {/* Prices */}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Venta:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(item.salePrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Renta/mes:</span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(item.rentPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
