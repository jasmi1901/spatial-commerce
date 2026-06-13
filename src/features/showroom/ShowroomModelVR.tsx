import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Decimated VR model — used ONLY in a headset session.
//
// The full scene.gltf is ~2.18M render-vertices across 110 meshes. A desktop GPU
// draws that at 60fps mono without trouble, but a standalone headset must render it
// TWICE (stereo) at 72-90Hz and collapses to single-digit FPS — at which point
// reprojection makes the world swim with your head ("moves along the camera, swims").
// Draco compression does NOT help: it only shrinks the download; the GPU still draws
// every vertex after decode.
//
// The fix is mesh DECIMATION (not compression): this model is simplified to ~10% of
// the triangles (~418K verts, geometry/bbox intact), textures capped at 512px, and
// draw calls joined where materials allow — then Draco/WebP compressed (~3 MB).
// Not preloaded — it only fetches when you enter VR.
const VR_MODEL_URL = '/3d/scene-vr.glb';

export function ShowroomModelVR() {
  const { scene } = useGLTF(VR_MODEL_URL);

  // Quest 2 is fill-rate / bandwidth bound. A transmission (glass refraction)
  // material forces three.js to render the ENTIRE scene an extra time per frame to
  // build the refraction buffer — unaffordable here. Neutralize any transmissive
  // material to a cheap opaque one in VR (the showroom has just one). Runs once per
  // loaded scene (useGLTF caches it), so it's effectively free.
  useMemo(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const m of mats) {
        const phys = m as THREE.MeshPhysicalMaterial;
        if (phys && 'transmission' in phys && phys.transmission > 0) {
          phys.transmission = 0;
          phys.transparent = false;
          phys.opacity = 1;
          phys.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={0.5} />;
}
