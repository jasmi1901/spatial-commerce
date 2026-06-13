import { ShoppingBag } from 'lucide-react';
import { useCart, useCommerceNav } from '../../features/commerce';

// Floating top chrome: brand logo (center) and cart access (right).
export function TopBar() {
  const { itemCount } = useCart();
  const { openCart } = useCommerceNav();

  return (
    <div className="absolute top-6 lg:top-12 left-0 right-0 z-50 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-12 flex justify-between items-center">
        <div className="flex-1 hidden lg:block" />

        <div className="flex-1 flex justify-center">
          <button
            type="button"
            aria-label="Reload — back to start"
            onClick={() => window.location.reload()}
            className="font-display pointer-events-auto cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-2xl tracking-tight text-gray-800 hover:text-black dark:text-white/80 dark:hover:text-white mb-1"
          >
            <span className="font-bold">Spatial</span>
            <span className="font-normal opacity-80">Commerce</span>
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            type="button"
            aria-label="Shopping Bag"
            onClick={openCart}
            className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-gray-800 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all pointer-events-auto"
          >
            <ShoppingBag className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-white text-gray-900 text-[10px] font-bold flex items-center justify-center shadow-md dark:bg-white/90">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
