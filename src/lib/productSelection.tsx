import { createContext, useContext } from 'react';
import type { Product } from '../data/products';

// The currently-selected showroom item. Set when a 3D item is clicked/tapped;
// the Content Panel renders its details. Provided by ShowroomExperience.
export interface ProductSelection {
  selectedProduct: Product | null;
  clearProduct: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ProductSelectionContext = createContext<ProductSelection | null>(null);

export function useProductSelection(): ProductSelection {
  const ctx = useContext(ProductSelectionContext);
  if (!ctx) throw new Error('useProductSelection must be used within ProductSelectionContext.Provider');
  return ctx;
}
