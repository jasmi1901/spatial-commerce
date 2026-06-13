import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

// Cinematic loader — nothing pops in (Active Theory reference; BRAIN.md Pillar 1
// "create anticipation"). Holds a calm, minimal screen reporting real glTF load
// progress, then slow-fades to reveal the pre-landing once assets are ready.
export function SceneLoader() {
  const { progress } = useProgress();
  const ready = progress >= 100;
  const [removed, setRemoved] = useState(false);

  // Unmount only after the fade-out completes, so the reveal is smooth.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setRemoved(true), 1200);
    return () => clearTimeout(t);
  }, [ready]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#15151b] text-white transition-opacity duration-[1100ms] ease-out ${
        ready ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <p className="text-[0.7rem] tracking-[0.45em] uppercase opacity-50">Spatial Commerce</p>

      {/* Thin progress line — restrained, premium. */}
      <div className="mt-8 h-px w-40 overflow-hidden bg-white/15">
        <div
          className="h-full bg-white/80 transition-[width] duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.round(progress))}%` }}
        />
      </div>

      <p className="mt-4 text-xs tabular-nums tracking-widest opacity-50">
        {Math.min(100, Math.round(progress))}
      </p>
    </div>
  );
}
