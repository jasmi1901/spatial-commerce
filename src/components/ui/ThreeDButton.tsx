import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'white' | 'blue' | 'red' | 'gray';

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const VARIANTS: Record<Variant, string> = {
  white: 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]',
  blue: 'bg-cyan-950/40 border border-cyan-400/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]',
  red: 'bg-black/40 border border-white/20 text-white shadow-none',
  gray: 'bg-white/5 border border-white/5 text-zinc-400 shadow-none',
};

// visionOS-style action button — a clean glass/solid pill, sentence case, medium
// weight, with a soft gaze-hover lift.
export function Button3D({ children, variant = 'white', className = '', ...rest }: Button3DProps) {
  return (
    <button
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative flex items-center justify-center font-semibold text-sm tracking-normal px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      <span className="absolute inset-0 border-t border-white/25 pointer-events-none rounded-[inherit]" />
      {children}
    </button>
  );
}

interface CircleBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function CircleBtn({ children, className = '', ...rest }: CircleBtnProps) {
  return (
    <button
      className={`flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-black/40 text-cyan-400 text-xs font-bold shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
