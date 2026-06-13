import { useEffect, useState } from 'react';
import { xrStore } from '../../lib/xr';

// VR headset / goggles glyph (visor with a centre nose-notch — the WebXR shape).
function VRGoggles({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 9a2.5 2.5 0 0 1 2.5-2.5h13A2.5 2.5 0 0 1 21 9v5a2.5 2.5 0 0 1-2.5 2.5h-3.1a1.6 1.6 0 0 1-1.28-.64l-.84-1.12a1.5 1.5 0 0 0-2.36 0l-.84 1.12a1.6 1.6 0 0 1-1.28.64H5.5A2.5 2.5 0 0 1 3 14z" />
    </svg>
  );
}

interface VRButtonProps {
  className?: string;
}

// Enters immersive VR (BRAIN.md XR pillar). Shown always so it's discoverable;
// dimmed with a hint when the device/browser has no immersive-vr support.
export function VRButton({ className = '' }: VRButtonProps) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const xr = (navigator as Navigator & { xr?: { isSessionSupported?: (m: string) => Promise<boolean> } }).xr;
    if (!xr?.isSessionSupported) return;
    xr.isSessionSupported('immersive-vr').then(setSupported).catch(() => setSupported(false));
  }, []);

  return (
    <button
      type="button"
      aria-label={supported ? 'Enter VR' : 'VR not supported on this device'}
      title={supported ? 'Enter VR' : 'VR not supported on this device'}
      onClick={() => {
        if (supported) void xrStore.enterVR();
      }}
      className={`${className} ${supported ? '' : 'opacity-40'}`}
    >
      <VRGoggles className="w-6 h-6" />
    </button>
  );
}
