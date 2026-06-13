import { Home, Info, LayoutGrid, Mail, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { useContentView } from '../../lib/ContentContext';
import { scrollShowroomToTop } from '../../lib/scroll';
import { ProductCatalog } from './ProductCatalog';
import { VRButton } from './VRButton';

interface SidebarProps {
  onNavigate?: (page: string) => void;
}

// Desktop spatial navigation rail. Feels attached to space, not the browser edge.
export function Sidebar({ onNavigate }: SidebarProps) {
  const { isDark, toggle } = useTheme();
  const { view, setView } = useContentView();

  const toggleCatalog = () => setView(view === 'catalog' ? 'welcome' : 'catalog');

  return (
    <>
      <div className="hidden lg:flex items-start gap-4 shrink-0 pointer-events-auto">
        <div className="w-22 h-160 glass-panel rounded-[44px] flex flex-col items-center py-6 justify-between relative shadow-2xl shrink-0">
          <div className="flex flex-col items-center">
            <button
              type="button"
              aria-label="Home"
              onClick={scrollShowroomToTop}
              className="w-13 h-13 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform bg-transparent"
            >
              <img
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,h=180,fit=crop,f=png/AR011XeLz8S08XZD/favi-mp84bX6L2wtL0M02.png"
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </button>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <button type="button" aria-label="Home" className="glass-button w-14 h-14 rounded-full flex items-center justify-center bg-white shadow-md dark:bg-transparent dark:shadow-lg transition-all hover:scale-105 active:scale-95">
              <Home className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <button
              type="button"
              aria-label="Info"
              onClick={() => onNavigate?.('information')}
              className="w-14 h-14 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            >
              <Info className="w-6 h-6" />
            </button>
            <button
              type="button"
              aria-label="Collections"
              onClick={toggleCatalog}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                view === 'catalog'
                  ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              <LayoutGrid className="w-6 h-6" />
            </button>
            <button
              type="button"
              aria-label="Team Members"
              onClick={() => setView(view === 'team' ? 'welcome' : 'team')}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                view === 'team'
                  ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              <Mail className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <VRButton className="w-14 h-14 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all" />
            <button
              type="button"
              aria-label="Toggle Theme"
              onClick={toggle}
              className="w-14 h-14 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all"
            >
              {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div
          className={`glass-panel rounded-[32px] h-160 shadow-2xl overflow-hidden transition-all duration-300 ${
            view === 'catalog' ? 'w-[300px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          <ProductCatalog />
        </div>
      </div>
    </>
  );
}
