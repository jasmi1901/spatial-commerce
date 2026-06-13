import { Home, Info, LayoutGrid, Mail, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/theme/ThemeProvider';
import { useContentView } from '../../lib/ContentContext';
import { VRButton } from './VRButton';

interface MobileBarProps {
  onNavigate?: (page: string) => void;
}

// Mobile bottom navigation bar.
export function MobileBar({ onNavigate }: MobileBarProps) {
  const { isDark, toggle } = useTheme();
  const { view, setView } = useContentView();

  return (
    <div className="lg:hidden absolute bottom-6 left-6 right-6 z-50 glass-panel rounded-4xl h-18 flex items-center px-4 pointer-events-auto shadow-2xl">
      <div className="flex items-center justify-between flex-1">
        <button
          type="button"
          aria-label="Reload — back to start"
          onClick={() => window.location.reload()}
          className="glass-button w-11 h-11 rounded-full flex items-center justify-center text-gray-900 dark:text-white hover:scale-105 active:scale-95 transition-transform"
        >
          <Home className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Info"
          onClick={() => onNavigate?.('information')}
          className="w-11 h-11 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all"
        >
          <Info className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Collections"
          onClick={() => setView(view === 'catalog' ? 'welcome' : 'catalog')}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            view === 'catalog'
              ? 'bg-white shadow-sm dark:bg-white/20 text-gray-900 dark:text-white'
              : 'text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button type="button" aria-label="Messages" className="w-11 h-11 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all">
          <Mail className="w-5 h-5" />
        </button>
        <VRButton className="w-11 h-11 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all" />
        <button
          type="button"
          aria-label="Toggle Theme"
          onClick={toggle}
          className="w-11 h-11 rounded-full flex items-center justify-center text-gray-900/70 hover:text-gray-900 hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10 transition-all"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
