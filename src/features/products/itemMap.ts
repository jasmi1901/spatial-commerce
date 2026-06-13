import { PRODUCTS } from '../../data/products';

// The glTF meshes are non-semantic (Object_0..N). To tie a clicked item to a
// product, add explicit overrides here (build them with the dev click-logger —
// clicking an item logs its mesh name to the console). Until an item is mapped,
// a stable fallback derives a product from the mesh name so every item still
// shows *a* product (and the same one each time).
export const OBJECT_TO_PRODUCT: Record<string, string> = {
  // 'Object_12': 'aurora-vase',
};

export function productForObject(name: string): string {
  if (OBJECT_TO_PRODUCT[name]) return OBJECT_TO_PRODUCT[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % PRODUCTS.length;
  return PRODUCTS[hash].id;
}
