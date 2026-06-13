import { ExperienceState } from '../../lib/experience';

// The journey spine — one ordered list of cinematic stops that everything derives
// from (camera spline, progress↔state mapping, Next/Back nav, per-stop content).
// Expresses BRAIN.md's beats: Landing → Descent → Exterior reveal/orbit → UI Reveal
// → Interior Entry → Guided Tour (stops 01–04).
//
// Timeline position is the array INDEX (so inserting a stop never renumbers).
// Camera poses are approximate and tunable — the real choreography is authored in
// Theatre Studio later (TheatreCamera's hasAuthoredTour path), which supersedes
// these without changing the journey structure.

export interface JourneyStop {
  id: string;
  state: ExperienceState;
  /** Camera world position. */
  camera: [x: number, y: number, z: number];
  /** Point the camera looks at. */
  lookAt: [x: number, y: number, z: number];
  /** Human-readable label (debug / UI). */
  label: string;
}

export const JOURNEY_STOPS: JourneyStop[] = [
  // Landing — far, high establishing shot. Anticipation, no UI.
  { id: 'landing', state: ExperienceState.Landing, camera: [0, 4.5, 11], lookAt: [0, 0.5, 0], label: 'Landing' },
  // Descent — the camera lowers toward the showroom.
  { id: 'descent', state: ExperienceState.Descent, camera: [2, 2.8, 8.5], lookAt: [0, 0.5, 0], label: 'Descent' },
  // Exterior orbit — a slow sweep around the exterior (two stops → gentle arc).
  { id: 'exterior-approach', state: ExperienceState.ExteriorOrbit, camera: [5, 1.9, 5.5], lookAt: [0, 0.5, 0], label: 'Exterior — approach' },
  { id: 'exterior-sweep', state: ExperienceState.ExteriorOrbit, camera: [-4.5, 1.9, 5], lookAt: [0, 0.5, 0], label: 'Exterior — sweep' },
  // UI Reveal — calm front framing; the spatial UI activates here.
  { id: 'ui-reveal', state: ExperienceState.UiReveal, camera: [-0.08, 1.21, 5.4], lookAt: [-0.08, -0.74, 0.2], label: 'UI Reveal' },
  // Interior Entry — approach the entrance, then move through it.
  { id: 'entrance-approach', state: ExperienceState.InteriorEntry, camera: [-1.18, -0.5, 1.95], lookAt: [-0.51, -0.67, 0.08], label: 'Interior — approach' },
  { id: 'entrance-through', state: ExperienceState.InteriorEntry, camera: [0.92, -0.57, 0.56], lookAt: [-0.51, -0.75, -1.55], label: 'Interior — entry' },
  // Guided Tour — interior stops (each may surface a product/story).
  { id: 'tour-01', state: ExperienceState.GuidedTour, camera: [1.83, -0.31, -1.8], lookAt: [-1.68, -1.06, -2.83], label: 'Tour Stop 01' },
  { id: 'tour-02', state: ExperienceState.GuidedTour, camera: [0.83, -0.51, -1.68], lookAt: [-0.11, -1.22, -3.84], label: 'Tour Stop 02' },
  { id: 'tour-03', state: ExperienceState.GuidedTour, camera: [0.99, -0.69, -2.01], lookAt: [2.28, -0.87, -2.97], label: 'Tour Stop 03' },
  { id: 'tour-04', state: ExperienceState.GuidedTour, camera: [-0.33, -0.5, 0.3], lookAt: [-0.6, -0.8, -1.44], label: 'Tour Stop 04' },
];

// Alias kept for the camera spline source (TheatreCamera samples these in order).
export const TOUR_STOPS = JOURNEY_STOPS;

// Timeline length: positions are the array index, so length = last index.
export const TOUR_LENGTH = JOURNEY_STOPS.length - 1;

// Normalized progress (0→1) of each stop along the journey — the shared list the
// camera spline samples and Next/Back navigation snaps to.
export const STOP_PROGRESS: number[] = JOURNEY_STOPS.map((_, i) => i / (JOURNEY_STOPS.length - 1));
