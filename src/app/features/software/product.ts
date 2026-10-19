/** Un producto real de Christian; web o tienda indican un destino público (R64, R19). */
export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  logo: string;
  url?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}
