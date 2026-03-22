/**
 * utils.js — Shared helper utilities for the Chai CSS engine
 */

/**
 * Escapes special CSS selector characters so a class name string
 * can be safely used as a CSS selector.
 *
 * e.g. "chai-hover:bg-blue-500"  →  "chai-hover\\:bg-blue-500"
 *      "chai-p-[20px]"           →  "chai-p-\\[20px\\]"
 */
export function escapeCSSSelector(className) {
  return className.replace(/([:\[\]./])/g, '\\$1');
}

/**
 * Extracts the raw value from an arbitrary-value token like "[20px]".
 * Returns the inner string, or null if the token isn't wrapped in [...].
 *
 * e.g. "[20px]"   → "20px"
 *      "[#ff6b35]" → "#ff6b35"
 *      "500"       → null
 */
export function extractArbitraryValue(token) {
  if (token && token.startsWith('[') && token.endsWith(']')) {
    return token.slice(1, -1);
  }
  return null;
}
