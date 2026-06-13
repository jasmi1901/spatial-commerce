import { useGLTF } from '@react-three/drei';

// Original glTF export (scene.gltf + scene.bin + textures/) — used in both the flat
// web view and VR. The source model is authored in large units; the parent <Center>
// recenters it and `scale` normalizes it to showroom size. Tweak `scale` to taste.
const MODEL_URL = '/3d/scene.gltf';

export function ShowroomModel() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={0.5} castShadow receiveShadow />;
}

useGLTF.preload(MODEL_URL);
