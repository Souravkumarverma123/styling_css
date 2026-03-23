/**
 * Chai CSS — TypeScript Type Definitions
 */

export interface ChaiConfig {
  /** Custom class prefix (default: 'chai-') */
  prefix?: string;
  /** Dark mode strategy: 'media' (prefers-color-scheme) or 'class' */
  darkMode?: 'media' | 'class';
  /** Class name to use for dark mode when darkMode is 'class' (default: 'dark') */
  darkModeClass?: string;
  /** Enable MutationObserver for dynamically added elements (default: true) */
  observe?: boolean;
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

export interface ParsedClass {
  /** Variant prefix (e.g. 'hover', 'md', 'dark', null) */
  variant: string | null;
  /** Utility token (e.g. 'bg-red-500', 'p-4', 'flex') */
  utility: string;
}

export interface ColorPalette {
  [key: string]: string | { [shade: string]: string };
}

/**
 * Initialize the Lemon CSS engine.
 * Call this once at app startup.
 */
export function initLemon(config?: ChaiConfig): void;

/**
 * Apply chai-* classes on a specific element.
 * Useful for manually processing dynamically created elements.
 */
export function applyElement(element: HTMLElement): void;

/**
 * Resolve a color token to its hex value.
 * Checks tea colors first, then Tailwind scales.
 *
 * @example
 * resolveColor("blue-500")       // "#3b82f6"
 * resolveColor("masala-chai")    // "#c68642"
 * resolveColor("unknown")        // null
 */
export function resolveColor(token: string): string | null;

/**
 * Escape special CSS selector characters in a class name.
 */
export function escapeCSSSelector(className: string): string;

/**
 * Extract the raw value from an arbitrary-value token.
 *
 * @example
 * extractArbitraryValue("[20px]")  // "20px"
 * extractArbitraryValue("500")     // null
 */
export function extractArbitraryValue(token: string): string | null;

/** Full Tailwind CSS color palette */
export const TAILWIND_COLORS: ColorPalette;

/** Chai CSS tea color palette */
export const TEA_COLORS: ColorPalette;
