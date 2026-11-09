// Shared motion presets for the /work-with-me page.

// Easing used by every entrance animation.
export const EASE_OUT = [0.22, 1, 0.36, 1];

/** Stagger delay for the i-th item of a list (capped so long lists don't lag). */
export const stagger = (i, step = 0.08) => Math.min(i, 6) * step;
