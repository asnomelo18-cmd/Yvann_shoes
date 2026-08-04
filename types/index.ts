export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  basePrice: number;
  compareAtPrice: number | null;
  imageUrl: string;
  isNew: boolean;
  avgRating: number;
}

export interface SizeOption {
  id: string;
  eu: number;
  available: boolean;
}

export interface ColorOption {
  id: string;
  name: string;
  hexCode: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  materials: string | null;
  careInstructions: string | null;
  images: { url: string; angle: string | null; isVideo: boolean }[];
  sizes: SizeOption[];
  colors: ColorOption[];
  reviewCount: number;
}
