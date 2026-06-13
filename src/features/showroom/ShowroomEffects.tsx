import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface ShowroomEffectsProps {
  isDark: boolean;
}

// Filmic post-processing — deliberately restrained (audited down).
// DepthOfField was REMOVED: with a freely-orbiting camera and a fixed focus
// point it blurred the wrong things and read as "weird"; fog already supplies
// depth. What remains is a light, calm grade per BRAIN.md:
//  - Bloom: a faint glow on the brightest highlights only (high threshold).
//  - Vignette: a gentle inward draw, lighter in light theme.
//  - Noise: very fine grain to unify the image and kill gradient banding.
export function ShowroomEffects({ isDark }: ShowroomEffectsProps) {
  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={0.25} luminanceThreshold={0.9} luminanceSmoothing={0.3} mipmapBlur />
      <Vignette offset={0.35} darkness={isDark ? 0.3 : 0.2} eskil={false} blendFunction={BlendFunction.NORMAL} />
      <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
