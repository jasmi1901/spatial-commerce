import { Suspense, useEffect, useState, type RefObject } from 'react';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { Center, ContactShadows, CameraControls } from '@react-three/drei';
import { XR, XROrigin, useXR } from '@react-three/xr';
import type CameraControlsImpl from 'camera-controls';
import * as THREE from 'three';
import { xrStore } from '../lib/xr';
import { ShowroomModel } from '../features/showroom/ShowroomModel';
import { ShowroomModelVR } from '../features/showroom/ShowroomModelVR';
import { ShowroomEnvironment } from '../features/showroom/ShowroomEnvironment';
import { ShowroomAtmosphere } from '../features/showroom/ShowroomAtmosphere';
import { ShowroomEffects } from '../features/showroom/ShowroomEffects';
import { productForObject } from '../features/products/itemMap';
import { JOURNEY_STOPS } from '../features/tour/tourStops';

interface ShowroomSceneProps {
  isDark: boolean;
  /** Shared with the composition root so Next/Back can glide the camera to stops. */
  controlsRef: RefObject<CameraControlsImpl | null>;
  /** Select the clicked item's product (its details show in the Content Panel). */
  onSelectProduct: (productId: string) => void;
}

// Controlled camera (Chartogne-Taillet reference): the user can rotate, dolly
// (zoom), and pan with the mouse, but within bounds and with damping — never a
// free-fly. The same control is glided programmatically between tour stops
// (setLookAt) by the UI buttons. Scroll over the canvas dollies; it does NOT drive
// a journey (that lives on the UI now).
function ControlledCamera({ controlsRef }: { controlsRef: RefObject<CameraControlsImpl | null> }) {
  // In an XR session the headset drives the view — stand the desktop camera down.
  const inSession = useXR((state) => state.session != null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const s = JOURNEY_STOPS[0];
    // Initial framing (landing) without a transition.
    void controls.setLookAt(s.camera[0], s.camera[1], s.camera[2], s.lookAt[0], s.lookAt[1], s.lookAt[2], false);
  }, [controlsRef]);

  // Dev-only pose capture: orbit/zoom/pan to frame a shot, press "P", and a
  // paste-ready `camera`/`lookAt` line is logged for tourStops.ts authoring.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const pos = new THREE.Vector3();
    const tgt = new THREE.Vector3();
    const r = (v: number) => Math.round(v * 100) / 100;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'p') return;
      const controls = controlsRef.current;
      if (!controls) return;
      controls.getPosition(pos);
      controls.getTarget(tgt);
      // eslint-disable-next-line no-console
      console.log(`camera: [${r(pos.x)}, ${r(pos.y)}, ${r(pos.z)}], lookAt: [${r(tgt.x)}, ${r(tgt.y)}, ${r(tgt.z)}],`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [controlsRef]);

  if (inSession) return null;

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={1}
      maxDistance={16}
      minPolarAngle={0.18}
      maxPolarAngle={1.5}
      smoothTime={0.5}
      draggingSmoothTime={0.18}
      dollySpeed={2}
      dollyToCursor
    />
  );
}

function SceneContents({ isDark, controlsRef, onSelectProduct }: ShowroomSceneProps) {
  // Post-processing (EffectComposer) is NOT WebXR-compatible — it breaks stereo
  // frame submission and renders black in a headset. Disable it during a session.
  const inSession = useXR((state) => state.session != null);

  // Click (desktop) / tap (mobile) an item: focus the camera on it AND select its
  // product (details render in the Content Panel). The clicked mesh's name maps to
  // a product (see itemMap.ts); in dev the name is logged to build that mapping.
  const handleItemClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const controls = controlsRef.current;
    if (import.meta.env.DEV) {
      const r = (v: number) => Math.round(v * 100) / 100;
      // eslint-disable-next-line no-console
      console.log(`clicked item: "${e.object.name}"  point: [${r(e.point.x)}, ${r(e.point.y)}, ${r(e.point.z)}]`);
    }
    if (controls) {
      void controls.setTarget(e.point.x, e.point.y, e.point.z, true);
      void controls.dollyTo(Math.max(controls.distance * 0.8, controls.minDistance), true);
    }
    onSelectProduct(productForObject(e.object.name));
  };

  return (
    <>
      <ShowroomAtmosphere isDark={isDark} />
      <ShowroomEnvironment />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} castShadow={!inSession} />

      <ControlledCamera controlsRef={controlsRef} />

      <Suspense fallback={null}>
        {/* Fixed model placement — identical on mobile and desktop so the
            world-space camera stops frame it the same on both. The items
            themselves are the click targets. Scaled up in VR for presence. */}
        <group scale={inSession ? 1.6 : 1}>
          <group onClick={handleItemClick}>
            <Center position={[0, -0.5, 0]}>
              {/* Full scene.gltf (~2.2M verts) on desktop; decimated model (~755K)
                  in VR so a standalone headset holds framerate. */}
              {inSession ? <ShowroomModelVR /> : <ShowroomModel />}
            </Center>
          </group>
        </group>
        {!inSession && <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4} />}
      </Suspense>

      {!inSession && <ShowroomEffects isDark={isDark} />}
    </>
  );
}

// VR player rig. The player stands on the floor (y≈-2), close to the showroom.
// The head is tracked by driving XROrigin's OWN position (state) — never wrap it
// in a transformed group, or head-tracking gets applied in the wrong frame and the
// world appears to follow your gaze. Movement is TELEPORT ONLY (a faulty thumbstick
// would drift/shake the view): aim a controller at the floor and pull the TRIGGER.
function VRRig() {
  const [position, setPosition] = useState(() => new THREE.Vector3(0, -2, 2.2));

  const teleport = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setPosition(new THREE.Vector3(e.point.x, -2, e.point.z));
  };

  return (
    <>
      <XROrigin position={position} />
      {/* Invisible teleport floor — trigger-click to jump there. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} onClick={teleport}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

// The showroom world. The 3D scene is the application; UI overlays support it.
export function ShowroomScene({ isDark, controlsRef, onSelectProduct }: ShowroomSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: true, alpha: true }}
      // Opaque dark clear (matches the in-scene atmosphere) so the very first
      // frames — before scene.background is set — aren't a black blink.
      onCreated={({ gl }) => gl.setClearColor(0x15151b, 1)}
    >
      <XR store={xrStore}>
        <VRRig />
        <SceneContents isDark={isDark} controlsRef={controlsRef} onSelectProduct={onSelectProduct} />
      </XR>
    </Canvas>
  );
}
