/**
 * index.js — Public API entry point for lemon-css
 *
 * Import this in your project:
 *   import { initChai } from 'lemon-css';
 *   initChai();
 */

export { initChai, applyElement } from './engine.js';
export { resolveColor, TAILWIND_COLORS, TEA_COLORS } from './colors.js';
export { escapeCSSSelector, extractArbitraryValue }  from './utils.js';
