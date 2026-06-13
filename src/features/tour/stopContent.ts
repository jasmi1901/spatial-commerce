import { JOURNEY_STOPS } from './tourStops';

// Narrative that the Content Panel surfaces as the journey scrolls/advances through
// stops. Keyed by stop id; pure lookup so a later panel-router can reuse/override it.
// Cinematic-transit stops (landing/descent/exterior) have no content — the UI is
// still faded out there.
export interface StopContent {
  eyebrow?: string;
  title: string;
  body: string;
  productId?: string;
}

export const STOP_CONTENT: Record<string, StopContent> = {
  'ui-reveal': {
    eyebrow: 'Welcome',
    title: 'Step inside',
    body: 'A showroom that moves with you. Scroll to drift through the space, or use Next to glide stop to stop.',
  },
  'entrance-through': {
    eyebrow: 'The threshold',
    title: 'Cross into the room',
    body: 'Light pools across considered surfaces. The world stays present; the panel only ever supports it.',
  },
  'tour-01': {
    eyebrow: 'Tour · 01',
    title: 'The reception',
    body: 'Where the collection begins — a single material, shaped around how it catches the light.',
  },
  'tour-02': {
    eyebrow: 'Tour · 02',
    title: 'Display stand',
    body: 'Each object earns its place. Pause here, or keep moving — the camera follows your pace.',
  },
  'tour-03': {
    eyebrow: 'Tour · 03',
    title: 'Feature corner',
    body: 'A quiet moment in the room, designed for the pieces that ask to be considered slowly.',
  },
  'tour-04': {
    eyebrow: 'Tour · 04',
    title: 'A quiet future',
    body: 'Calm objects for considered spaces. From here, explore freely or return to the entrance.',
  },
};

// Content for the stop at a given index (undefined for transit stops).
export function contentForStop(index: number): StopContent | undefined {
  const stop = JOURNEY_STOPS[index];
  return stop ? STOP_CONTENT[stop.id] : undefined;
}
