import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { ExperienceState, EXPERIENCE_JOURNEY } from './states';

export interface ExperienceContextValue {
  state: ExperienceState;
  setState: (next: ExperienceState) => void;
  advance: () => void;
  back: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ExperienceContext = createContext<ExperienceContextValue | null>(null);

interface ExperienceProviderProps {
  children: ReactNode;
  initialState?: ExperienceState;
}

// Single source of truth for the user's position in the experience journey.
// Backed by React state only (no external store) per BRAIN.md.
export function ExperienceProvider({
  children,
  initialState = ExperienceState.Landing,
}: ExperienceProviderProps) {
  const [state, setState] = useState<ExperienceState>(initialState);

  const advance = useCallback(() => {
    setState((current) => {
      const index = EXPERIENCE_JOURNEY.indexOf(current);
      return EXPERIENCE_JOURNEY[Math.min(index + 1, EXPERIENCE_JOURNEY.length - 1)];
    });
  }, []);

  const back = useCallback(() => {
    setState((current) => {
      const index = EXPERIENCE_JOURNEY.indexOf(current);
      return EXPERIENCE_JOURNEY[Math.max(index - 1, 0)];
    });
  }, []);

  const value = useMemo<ExperienceContextValue>(
    () => ({ state, setState, advance, back }),
    [state, advance, back],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
