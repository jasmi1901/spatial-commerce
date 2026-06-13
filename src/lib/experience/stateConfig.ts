import { ExperienceState } from './states';

// Per-state behavior config — the single place that says what each experience
// state activates, replacing scattered booleans (e.g. `tourActive = state===...`).
// Consumed by ShowroomScene (camera authority) and ShowroomExperience (UI reveal).

export type CameraMode = 'theatre' | 'orbit' | 'explore';

export interface StateBehavior {
  /** Who owns the camera in this state. */
  cameraMode: CameraMode;
  /** Whether scroll drives the cinematic journey (off during free-explore / focus). */
  scrollJourney: boolean;
  /** Whether the spatial UI overlay is revealed. */
  uiRevealed: boolean;
  /** Whether the cinematic landing overlay is shown on top. */
  showLandingOverlay: boolean;
}

export const STATE_CONFIG: Record<ExperienceState, StateBehavior> = {
  // Cinematic spine — scroll scrubs the Theatre camera through these.
  [ExperienceState.Landing]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: false, showLandingOverlay: true },
  [ExperienceState.Descent]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: false, showLandingOverlay: false },
  [ExperienceState.ExteriorOrbit]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: false, showLandingOverlay: false },
  [ExperienceState.UiReveal]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: true, showLandingOverlay: false },
  [ExperienceState.InteriorEntry]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: true, showLandingOverlay: false },
  [ExperienceState.GuidedTour]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: true, showLandingOverlay: false },

  // Entered explicitly — scroll journey is suspended.
  [ExperienceState.Explore]: { cameraMode: 'explore', scrollJourney: false, uiRevealed: true, showLandingOverlay: false },
  [ExperienceState.ProductFocus]: { cameraMode: 'theatre', scrollJourney: false, uiRevealed: true, showLandingOverlay: false },
  [ExperienceState.Cart]: { cameraMode: 'theatre', scrollJourney: false, uiRevealed: true, showLandingOverlay: false },
  [ExperienceState.ReturnToExterior]: { cameraMode: 'theatre', scrollJourney: true, uiRevealed: true, showLandingOverlay: false },
};
