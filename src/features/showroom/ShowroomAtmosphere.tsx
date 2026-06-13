import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ShowroomAtmosphereProps {
  isDark: boolean;
}

// Builds a 1-D vertical gradient as a CanvasTexture (cheap, one-time).
function makeGradient(top: string, bottom: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, top);
  grad.addColorStop(1, bottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// In-scene atmosphere — the load-bearing fix for "the atmosphere is not great".
// Renders an opaque gradient backdrop (so post-processing has a full frame to
// vignette/grain) and exponential fog whose colour matches the backdrop's base,
// so the model's ground-floor edges and far geometry DISSOLVE into the haze
// instead of ending on a hard edge. Theme-aware; cleans up on unmount.
export function ShowroomAtmosphere({ isDark }: ShowroomAtmosphereProps) {
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const top = isDark ? '#202028' : '#eef0f3';
    const bottom = isDark ? '#0b0b11' : '#d6d7db';
    const fogColor = bottom; // match the backdrop base — mismatch shows a halo

    const texture = makeGradient(top, bottom);
    const prevBackground = scene.background;
    const prevFog = scene.fog;

    scene.background = texture;
    // Light haze — just enough to soften far/low geometry (the floor rim) without
    // washing the model out.
    scene.fog = new THREE.FogExp2(new THREE.Color(fogColor), 0.02);

    return () => {
      scene.background = prevBackground;
      scene.fog = prevFog;
      texture.dispose();
    };
  }, [scene, isDark]);

  return null;
}
