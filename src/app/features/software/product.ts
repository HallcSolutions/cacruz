/** Un producto real construido por Christian; sin `url` aún no es público (R64). */
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
