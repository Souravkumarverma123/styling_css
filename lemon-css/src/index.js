/**
 * index.js — Public API entry point for lemon-css
 *
 * Import this in your project:
 *   import { initLemon } from 'lemon-css';
 *   initLemon();
 */

export { initLemon, applyElement } from './engine.js';
export { resolveColor, TAILWIND_COLORS, TEA_COLORS } from './colors.js';
export { escapeCSSSelector, extractArbitraryValue }  from './utils.js';
