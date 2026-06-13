// Dev-only Theatre.js Studio initialisation.
//
// This module statically imports @theatre/studio so the bundler's CJS→ESM
// interop resolves the default export correctly (a dynamic import's `.default`
// gets double-wrapped under Vite's optimizer, leaving `.initialize` undefined).
// It is only ever imported behind an `import.meta.env.DEV` guard, so the whole
// module — and @theatre/studio — is tree-shaken out of production builds.
//
// `@theatre/core` MUST be evaluated before `studio.initialize()` or Studio
// throws ("imported @theatre/studio without importing @theatre/core"). Importing
// the namespace and referencing it below guarantees core loads first and isn't
// tree-shaken away.
import * as theatreCore from '@theatre/core';
import studioDefault from '@theatre/studio';

interface StudioLike {
  initialize: (opts?: unknown) => void;
  ui: { hide: () => void; restore: () => void };
}

let initialized = false;

// Resolve the studio instance defensively across interop shapes
// (`default`, `default.default`, or the namespace itself).
function resolveStudio(): StudioLike | null {
  const direct = studioDefault as unknown as Partial<StudioLike>;
  if (typeof direct?.initialize === 'function') return direct as StudioLike;
  const wrapped = (direct as { default?: Partial<StudioLike> })?.default;
  if (typeof wrapped?.initialize === 'function') return wrapped as StudioLike;
  return null;
}

// Initialise the Studio editor once. Must run BEFORE any getProject() call so
// the editor attaches to the project (see main.tsx bootstrap).
export function initStudio(): void {
  if (initialized) return;
  // Touch the core namespace so the import is retained and evaluated before init.
  void theatreCore;
  const studio = resolveStudio();
  if (!studio) {
    console.error('[theatre] Could not resolve studio.initialize() from @theatre/studio', studioDefault);
    return;
  }
  studio.initialize();
  initialized = true;
}
