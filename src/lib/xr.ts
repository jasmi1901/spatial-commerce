import { createXRStore } from '@react-three/xr';

// Single XR store shared between the scene (<XR store={xrStore}>) and the VR
// button (xrStore.enterVR()). XR is an enhancement layered on the same world —
// the full experience works without a headset (BRAIN.md: web-first, XR-ready).
export const xrStore = createXRStore({
  // Heavy foveation — render the periphery at low res to spare the headset GPU
  // (the showroom model is large; standalone headsets are GPU/memory limited).
  foveation: 1,
  // Render fewer pixels per eye. A Quest 2 is fill-rate bound, and this large
  // showroom fills most of the FOV — dropping the framebuffer scale to 0.8 is the
  // single biggest win for holding 72fps (the alternative, low framerate, causes
  // the world to "swim" under reprojection). Tune 0.7–0.9 for sharpness vs framerate.
  frameBufferScaling: 0.8,
});
