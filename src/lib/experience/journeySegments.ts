import { ExperienceState } from './states';
import { JOURNEY_STOPS, STOP_PROGRESS, TOUR_LENGTH } from '../../features/tour/tourStops';

// Derivations over the journey spine (tourStops.ts). The scroll journey maps
// Lenis progress(0→1) to a Theatre playhead position + an ExperienceState bucket;
// Next/Back navigation snaps progress to stop boundaries. Everything is derived
// from the single ordered stop list — no second source of truth.

const clamp01 = (p: number): number => Math.min(1, Math.max(0, p));
const EPS = 1e-4;

// Index of the stop the given progress currently sits in (last stop at-or-before).
export function currentStopIndex(progress: number): number {
  const p = clamp01(progress);
  let idx = 0;
  for (let i = 0; i < STOP_PROGRESS.length; i++) {
    if (STOP_PROGRESS[i] <= p + EPS) idx = i;
    else break;
  }
  return idx;
}

// The experience state for a given scroll progress (the active stop's state).
export function stateForProgress(progress: number): ExperienceState {
  return JOURNEY_STOPS[currentStopIndex(progress)].state;
}

// The Theatre sequence position (seconds) for a given scroll progress.
// Linear across the whole timeline so the camera spline scrubs continuously.
export function sequencePositionForProgress(progress: number): number {
  return clamp01(progress) * TOUR_LENGTH;
}

// The scroll progress at which a given state first appears (e.g. the Enter button
// scrolls to UiReveal).
export function progressForState(state: ExperienceState): number {
  const i = JOURNEY_STOPS.findIndex((s) => s.state === state);
  return i >= 0 ? STOP_PROGRESS[i] : 0;
}

// The scroll progress of a specific stop id (deep-linking / targeted moves).
export function progressForStop(id: string): number {
  const i = JOURNEY_STOPS.findIndex((s) => s.id === id);
  return i >= 0 ? STOP_PROGRESS[i] : 0;
}

// Next/previous stop progress — Next/Back buttons drive the SAME scroll to these.
export function nextStopProgress(progress: number): number {
  const p = clamp01(progress);
  const next = STOP_PROGRESS.find((sp) => sp > p + EPS);
  return next ?? STOP_PROGRESS[STOP_PROGRESS.length - 1];
}

export function prevStopProgress(progress: number): number {
  const p = clamp01(progress);
  let prev = STOP_PROGRESS[0];
  for (const sp of STOP_PROGRESS) {
    if (sp < p - EPS) prev = sp;
    else break;
  }
  return prev;
}
