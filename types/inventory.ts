export interface InventoryItem {
  id: string;
  assetId: string;
  type: string;
  description: string;
  status: string;
  salePrice: number;
  rentPrice: number;
  photos: string[];
  location: string;
}
