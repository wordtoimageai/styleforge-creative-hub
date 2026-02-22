export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
  brand?: string;
  brandLogo?: string;
  price?: number;
  buyUrl?: string;
  category?: 'panjabi' | 'sherwani' | 'fatua' | 'kurta' | 'tshirt' | 'shirt' | 'custom';
  isSponsored?: boolean;
  discount?: number;
  eidCollection?: boolean;
}

export interface OutfitLayer {
  garment: WardrobeItem | null;
  resultImage?: string;
}

export interface SavedOutfit {
  id: string;
  imageUrl: string;
  garmentNames: string[];
  timestamp: number;
}
