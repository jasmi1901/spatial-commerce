import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { hasAuthoredTour, tourSheet } from '../../lib/theatre/project';
import { TOUR_LENGTH, TOUR_STOPS } from './tourStops';

// Theatre-authored camera target. Registered on the Tour sheet so it shows in
// Studio for authoring; when authored state exists its keyframes drive the camera.
const cameraObject = tourSheet.object('Camera', {
  position: { x: 0, y: 1.6, z: 6 },
  lookAt: { x: 0, y: 0.5, z: 0 },
});

// Continuous, C1-smooth paths through the tour stops. Using splines (rather than
// per-segment lerp) removes the velocity discontinuities that made the camera
// decelerate at every stop — the motion now flows as one calm move (BRAIN.md:
// slow, premium, no abrupt motion). centripetal Catmull-Rom avoids overshoot.
const cameraCurve = new THREE.CatmullRomCurve3(
  TOUR_STOPS.map((s) => new THREE.Vector3(...s.camera)),
  false,
  'centripetal',
);
const lookAtCurve = new THREE.CatmullRomCurve3(
  TOUR_STOPS.map((s) => new THREE.Vector3(...s.lookAt)),
  false,
  'centripetal',
);

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Applies the Theatre-driven pose to the live R3F camera each frame.
//  - Authored mode: Studio-exported keyframes drive `cameraObject` (onValuesChange).
//  - Placeholder mode: the sequence playhead (scrubbed by scroll) selects a point
//    on the spline; the camera DAMPS toward it so motion stays smooth and premium
//    even when scroll input is uneven (VisionOS-like glide).
// Mounted only when the active cameraMode is 'theatre'.
export function TheatreCamera() {
  const camera = useThree((state) => state.camera);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3(0, 0.5, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0.5, 0));
  const prevSeq = useRef(0);
  const idleAmt = useRef(1); // 1 = at rest (full drift), 0 = scrolling (no drift)

  useEffect(() => {
    if (!hasAuthoredTour) return;
    const unsubscribe = cameraObject.onValuesChange((values) => {
      targetPos.current.set(values.position.x, values.position.y, values.position.z);
      targetLook.current.set(values.lookAt.x, values.lookAt.y, values.lookAt.z);
    });
    return unsubscribe;
  }, []);

  useFrame((stateThree, delta) => {
    if (!hasAuthoredTour) {
      const seq = tourSheet.sequence.position;
      const t = clamp01(seq / TOUR_LENGTH);
      cameraCurve.getPointAt(t, targetPos.current);
      lookAtCurve.getPointAt(t, targetLook.current);

      // Idle drift — a slow breath so the frame is alive when scroll is still,
      // but GATED by scroll motion so it never fights the scroll-locked camera
      // (smoothness). Fades out while moving, eases back in at rest.
      if (!prefersReducedMotion) {
        const speed = Math.abs(seq - prevSeq.current) / Math.max(delta, 1e-4);
        idleAmt.current = THREE.MathUtils.damp(idleAmt.current, speed > 0.05 ? 0 : 1, 2.5, delta);
        const e = stateThree.clock.elapsedTime;
        targetPos.current.x += Math.sin(e * 0.25) * 0.06 * idleAmt.current;
        targetPos.current.y += Math.sin(e * 0.19 + 1.3) * 0.04 * idleAmt.current;
      }
      prevSeq.current = seq;
    }

    // Frame-rate-independent damping for a calm, controlled glide. Tuned to
    // follow scroll closely while smoothing micro-jitter (premium, not laggy).
    const lambda = 4.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.current.x, lambda, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.current.y, lambda, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.current.z, lambda, delta);
    currentLook.current.x = THREE.MathUtils.damp(currentLook.current.x, targetLook.current.x, lambda, delta);
    currentLook.current.y = THREE.MathUtils.damp(currentLook.current.y, targetLook.current.y, lambda, delta);
    currentLook.current.z = THREE.MathUtils.damp(currentLook.current.z, targetLook.current.z, lambda, delta);
    camera.lookAt(currentLook.current);
  });

  return null;
}
