/**
 * engine.js — Core CSS injection engine for Chai CSS
 *
 * How it works (better than ChaiTail):
 *  - Injecting real <style> rules (NOT inline styles) means:
 *    ✅ hover:, focus:, active: pseudo-classes work
 *    ✅ Responsive breakpoints (md:, lg:, xl:) work
 *    ✅ Dark mode (dark:) works
 *    ✅ CSS transitions and animations work on hover
 *    ✅ Classes are KEPT on elements (used as CSS selectors) — SPA-safe
 *  - MutationObserver: dynamically added elements are auto-styled
 *  - Parse cache: each unique class is only resolved once
 */

import { resolveColor } from './colors.js';
import { escapeCSSSelector, extractArbitraryValue } from './utils.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const CLASS_PREFIX = 'chai-';

/** Responsive breakpoints (mobile-first min-width, matching Tailwind) */
const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/** Pseudo-class variants */
const PSEUDO_VARIANTS = {
  hover: ':hover',
  focus: ':focus',
  active: ':active',
  visited: ':visited',
  disabled: ':disabled',
  checked: ':checked',
  placeholder: '::placeholder',
  'first-child': ':first-child',
  'last-child': ':last-child',
  'odd': ':nth-child(odd)',
  'even': ':nth-child(even)',
};

// ─── Module state ─────────────────────────────────────────────────────────────

/** The single <style> tag Chai injects all rules into */
let chaiStyleSheet = null;

/** Tracks which CSS rules have already been injected (avoids duplicates) */
const injectedRules = new Set();

/** Cache: utility token → CSS declarations string */
const resolvedClassCache = new Map();

// ─── Style sheet setup ────────────────────────────────────────────────────────

function createStyleSheet() {
  if (chaiStyleSheet) return;
  const tag = document.createElement('style');
  tag.setAttribute('data-chai', 'true');
  document.head.appendChild(tag);
  chaiStyleSheet = tag.sheet;
}

function injectRule(cssRule) {
  if (injectedRules.has(cssRule)) return;
  injectedRules.add(cssRule);
  try {
    chaiStyleSheet.insertRule(cssRule, chaiStyleSheet.cssRules.length);
  } catch (e) {
    // invalid rule — silently skip
  }
}

// ─── Spacing scale ────────────────────────────────────────────────────────────

/** Converts a spacing token to a px/rem value.
 *  Numeric tokens follow Tailwind's 4px base unit (4 → 16px, 8 → 32px...).
 *  Arbitrary tokens like [20px] are passed through as-is. */
function resolveSpacing(token) {
  const arbitrary = extractArbitraryValue(token);
  if (arbitrary) return arbitrary;
  const n = parseFloat(token);
  if (!isNaN(n)) return `${n * 4}px`;
  return null;
}

// ─── Utility resolver ─────────────────────────────────────────────────────────

/**
 * Resolves a utility token (everything after "chai-[variant:]")
 * into a CSS declarations string, e.g. "p-4" → "padding: 16px".
 * Returns null for unrecognised utilities.
 */
function resolveUtility(utility) {
  // Try cache first
  if (resolvedClassCache.has(utility)) return resolvedClassCache.get(utility);

  const result = _resolve(utility);
  resolvedClassCache.set(utility, result);
  return result;
}

function _resolve(u) {

  // ── LAYOUT ───────────────────────────────────────────────────────────────
  const displayMap = {
    'flex': 'display:flex', 'block': 'display:block', 'inline': 'display:inline',
    'inline-flex': 'display:inline-flex', 'inline-block': 'display:inline-block',
    'grid': 'display:grid', 'hidden': 'display:none', 'contents': 'display:contents',
  };
  if (displayMap[u]) return displayMap[u];

  // Position
  const positionMap = { relative: 'relative', absolute: 'absolute', fixed: 'fixed', sticky: 'sticky' };
  if (positionMap[u]) return `position:${positionMap[u]}`;

  // Position offsets (top, left, right, bottom, inset)
  if (u.startsWith('top-')) {
    const token = u.slice(4);
    const a = extractArbitraryValue(token); if (a) return `top:${a}`;
    const n = parseFloat(token); if (!isNaN(n)) return `top:${n * 4}px`;
  }
  if (u.startsWith('left-')) {
    const token = u.slice(5);
    const a = extractArbitraryValue(token); if (a) return `left:${a}`;
    const n = parseFloat(token); if (!isNaN(n)) return `left:${n * 4}px`;
  }
  if (u.startsWith('right-')) {
    const token = u.slice(6);
    const a = extractArbitraryValue(token); if (a) return `right:${a}`;
    const n = parseFloat(token); if (!isNaN(n)) return `right:${n * 4}px`;
  }
  if (u.startsWith('bottom-')) {
    const token = u.slice(7);
    const a = extractArbitraryValue(token); if (a) return `bottom:${a}`;
    const n = parseFloat(token); if (!isNaN(n)) return `bottom:${n * 4}px`;
  }
  if (u.startsWith('inset-')) {
    const token = u.slice(6);
    const a = extractArbitraryValue(token); if (a) return `inset:${a}`;
    if (token === '0') return 'inset:0';
  }

  // ── FLEXBOX ───────────────────────────────────────────────────────────────
  if (u === 'flex-row') return 'flex-direction:row';
  if (u === 'flex-col') return 'flex-direction:column';
  if (u === 'flex-wrap') return 'flex-wrap:wrap';
  if (u === 'flex-nowrap') return 'flex-wrap:nowrap';
  if (u === 'flex-1') return 'flex:1 1 0%';
  if (u === 'flex-auto') return 'flex:1 1 auto';
  if (u === 'flex-none') return 'flex:none';
  if (u === 'shrink-0') return 'flex-shrink:0';
  if (u === 'grow') return 'flex-grow:1';
  if (u === 'mx-auto') return 'margin-left:auto;margin-right:auto';

  const justifyMap = {
    'justify-start': 'flex-start', 'justify-end': 'flex-end',
    'justify-center': 'center', 'justify-between': 'space-between',
    'justify-around': 'space-around', 'justify-evenly': 'space-evenly',
  };
  if (justifyMap[u]) return `justify-content:${justifyMap[u]}`;

  const alignMap = {
    'items-start': 'flex-start', 'items-end': 'flex-end',
    'items-center': 'center', 'items-baseline': 'baseline', 'items-stretch': 'stretch',
  };
  if (alignMap[u]) return `align-items:${alignMap[u]}`;

  // Flex self alignment
  const selfMap = {
    'self-start': 'flex-start', 'self-end': 'flex-end',
    'self-center': 'center', 'self-baseline': 'baseline', 'self-stretch': 'stretch',
  };
  if (selfMap[u]) return `align-self:${selfMap[u]}`;

  // Flex stretch shorthand
  if (u === 'stretch' || u === 'flex-stretch') return 'flex:1 1 stretch';

  // Align content
  const alignContentMap = {
    'content-start': 'flex-start', 'content-end': 'flex-end',
    'content-center': 'center', 'content-between': 'space-between',
    'content-around': 'space-around', 'content-evenly': 'space-evenly',
    'content-stretch': 'stretch',
  };
  if (alignContentMap[u]) return `align-content:${alignContentMap[u]}`;

  // ── GRID ──────────────────────────────────────────────────────────────────
  if (u.startsWith('grid-cols-')) {
    const val = u.slice(10);
    const a = extractArbitraryValue(val);
    if (a) return `grid-template-columns:${a}`;
    return `grid-template-columns:repeat(${val},minmax(0,1fr))`;
  }
  if (u.startsWith('col-span-')) return `grid-column:span ${u.slice(9)}/span ${u.slice(9)}`;
  if (u === 'col-span-full') return 'grid-column:1/-1';

  // ── SPACING ───────────────────────────────────────────────────────────────
  const spacingPrefixes = [
    ['p', token => `padding:${resolveSpacing(token)}`],
    ['px', token => { const v = resolveSpacing(token); return `padding-left:${v};padding-right:${v}`; }],
    ['py', token => { const v = resolveSpacing(token); return `padding-top:${v};padding-bottom:${v}`; }],
    ['pt', token => `padding-top:${resolveSpacing(token)}`],
    ['pb', token => `padding-bottom:${resolveSpacing(token)}`],
    ['pl', token => `padding-left:${resolveSpacing(token)}`],
    ['pr', token => `padding-right:${resolveSpacing(token)}`],
    ['m', token => `margin:${resolveSpacing(token)}`],
    ['mx', token => { const v = resolveSpacing(token); return `margin-left:${v};margin-right:${v}`; }],
    ['my', token => { const v = resolveSpacing(token); return `margin-top:${v};margin-bottom:${v}`; }],
    ['mt', token => `margin-top:${resolveSpacing(token)}`],
    ['mb', token => `margin-bottom:${resolveSpacing(token)}`],
    ['ml', token => `margin-left:${resolveSpacing(token)}`],
    ['mr', token => `margin-right:${resolveSpacing(token)}`],
    ['gap', token => `gap:${resolveSpacing(token)}`],
    ['gap-x', token => `column-gap:${resolveSpacing(token)}`],
    ['gap-y', token => `row-gap:${resolveSpacing(token)}`],
  ];
  for (const [prefix, fn] of spacingPrefixes) {
    if (u.startsWith(prefix + '-')) {
      const token = u.slice(prefix.length + 1);
      const v = resolveSpacing(token);
      if (v) return fn(token);
    }
  }

  // ── SIZING ────────────────────────────────────────────────────────────────
  const sizingMap = {
    'w-full': 'width:100%', 'w-screen': 'width:100vw', 'w-auto': 'width:auto',
    'h-full': 'height:100%', 'h-screen': 'height:100vh', 'h-auto': 'height:auto',
    'min-h-screen': 'min-height:100vh', 'min-h-full': 'min-height:100%',
    'min-w-full': 'min-width:100%',
  };
  if (sizingMap[u]) return sizingMap[u];

  if (u.startsWith('w-')) {
    const token = u.slice(2);
    const a = extractArbitraryValue(token); if (a) return `width:${a}`;
    const n = parseFloat(token);
    if (!isNaN(n)) return `width:${n * 4}px`;
  }
  if (u.startsWith('h-')) {
    const token = u.slice(2);
    const a = extractArbitraryValue(token); if (a) return `height:${a}`;
    const n = parseFloat(token);
    if (!isNaN(n)) return `height:${n * 4}px`;
  }
  if (u.startsWith('max-w-')) {
    const token = u.slice(6);
    const a = extractArbitraryValue(token); if (a) return `max-width:${a}`;
    const maxWMap = {
      xs: '320px', sm: '384px', md: '448px', lg: '512px', xl: '576px',
      '2xl': '672px', '3xl': '768px', '4xl': '896px', '5xl': '1024px', '6xl': '1152px',
      '7xl': '1280px', 'full': '100%', 'screen': '100vw', 'none': 'none', 'prose': '65ch'
    };
    if (maxWMap[token]) return `max-width:${maxWMap[token]}`;
    const n = parseFloat(token);
    if (!isNaN(n)) return `max-width:${n}px`;
  }
  if (u.startsWith('min-h-')) {
    const token = u.slice(6);
    const a = extractArbitraryValue(token); if (a) return `min-height:${a}`;
  }
  if (u.startsWith('max-h-')) {
    const token = u.slice(6);
    const a = extractArbitraryValue(token); if (a) return `max-height:${a}`;
  }

  // ── COLORS – BACKGROUND ───────────────────────────────────────────────────
  if (u.startsWith('bg-')) {
    const token = u.slice(3);
    const a = extractArbitraryValue(token); if (a) return `background-color:${a}`;
    const color = resolveColor(token); if (color) return `background-color:${color}`;
    // Named CSS colors / transparent / inherit
    return `background-color:${token}`;
  }

  // ── COLORS – TEXT ─────────────────────────────────────────────────────────
  if (u.startsWith('text-')) {
    const token = u.slice(5);
    // Text align
    if (['left', 'center', 'right', 'justify', 'start', 'end'].includes(token))
      return `text-align:${token}`;
    // Font size named
    const fzMap = {
      xs: '0.75rem/1rem', sm: '0.875rem/1.25rem', base: '1rem/1.5rem',
      md: '1rem/1.5rem', lg: '1.125rem/1.75rem', xl: '1.25rem/1.75rem',
      '2xl': '1.5rem/2rem', '3xl': '1.875rem/2.25rem', '4xl': '2.25rem/2.5rem',
      '5xl': '3rem/1', '6xl': '3.75rem/1', '7xl': '4.5rem/1', '8xl': '6rem/1', '9xl': '8rem/1'
    };
    if (fzMap[token]) {
      const [fs, lh] = fzMap[token].split('/');
      return `font-size:${fs};line-height:${lh}`;
    }
    // Arbitrary size
    const a = extractArbitraryValue(token); if (a) return `font-size:${a}`;
    // Color
    const color = resolveColor(token); if (color) return `color:${color}`;
    return `color:${token}`; // fallback to raw CSS value
  }

  // ── TYPOGRAPHY ────────────────────────────────────────────────────────────
  const fontWeightMap = {
    'font-thin': '100', 'font-extralight': '200', 'font-light': '300',
    'font-normal': '400', 'font-medium': '500', 'font-semibold': '600',
    'font-bold': '700', 'font-extrabold': '800', 'font-black': '900',
  };
  if (fontWeightMap[u]) return `font-weight:${fontWeightMap[u]}`;

  if (u === 'italic') return 'font-style:italic';
  if (u === 'not-italic') return 'font-style:normal';
  if (u === 'underline') return 'text-decoration:underline';
  if (u === 'line-through') return 'text-decoration:line-through';
  if (u === 'no-underline') return 'text-decoration:none';
  if (u === 'uppercase') return 'text-transform:uppercase';
  if (u === 'lowercase') return 'text-transform:lowercase';
  if (u === 'capitalize') return 'text-transform:capitalize';
  if (u === 'antialiased') return '-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale';
  if (u === 'truncate') return 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap';

  if (u.startsWith('font-')) {
    const token = u.slice(5);
    const a = extractArbitraryValue(token); if (a) return `font-family:${a}`;
    const fontMap = {
      sans: 'ui-sans-serif,system-ui,-apple-system,sans-serif',
      serif: 'ui-serif,Georgia,serif',
      mono: 'ui-monospace,SFMono-Regular,monospace'
    };
    if (fontMap[token]) return `font-family:${fontMap[token]}`;
  }

  if (u.startsWith('tracking-')) {
    const trackMap = {
      tighter: '-0.05em', tight: '-0.025em', normal: '0',
      wide: '0.025em', wider: '0.05em', widest: '0.1em'
    };
    const token = u.slice(9);
    const a = extractArbitraryValue(token); if (a) return `letter-spacing:${a}`;
    return trackMap[token] ? `letter-spacing:${trackMap[token]}` : null;
  }

  if (u.startsWith('leading-')) {
    const leadMap = {
      none: '1', tight: '1.25', snug: '1.375', normal: '1.5',
      relaxed: '1.625', loose: '2'
    };
    const token = u.slice(8);
    const a = extractArbitraryValue(token); if (a) return `line-height:${a}`;
    return leadMap[token] ? `line-height:${leadMap[token]}` : null;
  }

  // ── BORDERS ───────────────────────────────────────────────────────────────
  if (u === 'border') return 'border-width:1px;border-style:solid';
  if (u === 'border-t') return 'border-top-width:1px;border-top-style:solid';
  if (u === 'border-b') return 'border-bottom-width:1px;border-bottom-style:solid';
  if (u === 'border-l') return 'border-left-width:1px;border-left-style:solid';
  if (u === 'border-r') return 'border-right-width:1px;border-right-style:solid';
  if (u === 'border-t-0') return 'border-top-width:0';
  if (u === 'border-b-0') return 'border-bottom-width:0';
  if (u === 'border-l-0') return 'border-left-width:0';
  if (u === 'border-r-0') return 'border-right-width:0';
  if (u === 'border-b-2') return 'border-bottom-width:2px;border-bottom-style:solid';
  if (u === 'border-t-2') return 'border-top-width:2px;border-top-style:solid';
  if (u === 'border-l-2') return 'border-left-width:2px;border-left-style:solid';
  if (u === 'border-r-2') return 'border-right-width:2px;border-right-style:solid';
  if (u === 'border-none') return 'border:none';
  if (u === 'border-dashed') return 'border-style:dashed';
  if (u === 'border-dotted') return 'border-style:dotted';
  if (u === 'border-solid') return 'border-style:solid';
  if (u === 'outline-none') return 'outline:none';

  if (u.startsWith('border-')) {
    const token = u.slice(7);
    // Width
    if (/^\d+$/.test(token)) return `border-width:${token}px;border-style:solid`;
    // Color
    const a = extractArbitraryValue(token); if (a) return `border-color:${a}`;
    const color = resolveColor(token); if (color) return `border-color:${color}`;
  }

  // Rounded
  if (u.startsWith('rounded')) {
    const radMap = {
      'rounded-none': '0', 'rounded-sm': '2px', 'rounded': '4px',
      'rounded-md': '6px', 'rounded-lg': '8px', 'rounded-xl': '12px',
      'rounded-2xl': '16px', 'rounded-3xl': '24px', 'rounded-full': '9999px',
    };
    if (radMap[u]) return `border-radius:${radMap[u]}`;
    // Arbitrary: rounded-[10px], rounded-[10px_20px], rounded-[10px_20px_30px_40px]
    const token = u.slice(8);
    const a = extractArbitraryValue(token); if (a) return `border-radius:${a}`;
    const n = parseFloat(token);
    if (!isNaN(n)) return `border-radius:${n}px`;
  }

  // Order (flex order)
  if (u.startsWith('order-')) {
    const token = u.slice(5);
    const a = extractArbitraryValue(token); if (a) return `order:${a}`;
    const orderMap = { first: '-9999', last: '9999', none: '0' };
    if (orderMap[token]) return `order:${orderMap[token]}`;
    const n = parseFloat(token); if (!isNaN(n)) return `order:${n}`;
  }

  // Flex shrink
  if (u === 'shrink') return 'flex-shrink:1';
  if (u === 'shrink-0') return 'flex-shrink:0';
  if (u === 'grow') return 'flex-grow:1';
  if (u === 'grow-0') return 'flex-grow:0';

  // Text wrap
  const textWrapMap = { 'wrap': 'normal', 'nowrap': 'nowrap', 'balance': 'balance', 'pretty': 'pretty' };
  if (u === 'text-wrap') return 'text-wrap:wrap';
  if (u === 'text-nowrap') return 'text-wrap:nowrap';
  if (u === 'text-balance') return 'text-wrap:balance';
  if (u === 'text-pretty') return 'text-wrap:pretty';

  // User select
  const userSelectMap = { 'select-none': 'none', 'select-text': 'text', 'select-all': 'all', 'select-auto': 'auto' };
  if (userSelectMap[u]) return `user-select:${userSelectMap[u]}`;

  // Pointer events
  if (u === 'pointer-events-none') return 'pointer-events:none';
  if (u === 'pointer-events-auto') return 'pointer-events:auto';

  // Resize
  if (u === 'resize') return 'resize:both';
  if (u === 'resize-none') return 'resize:none';
  if (u === 'resize-x') return 'resize:horizontal';
  if (u === 'resize-y') return 'resize:vertical';

  // Aspect ratio
  if (u.startsWith('aspect-')) {
    const a = extractArbitraryValue(u.slice(7)); if (a) return `aspect-ratio:${a}`;
    const aspectMap = { auto: 'auto', square: '1/1', video: '16/9', '3/2': '3/2', '4/3': '4/3', '16/9': '16/9' };
    if (aspectMap[u.slice(7)]) return `aspect-ratio:${aspectMap[u.slice(7)]}`;
  }

  // ── EFFECTS ───────────────────────────────────────────────────────────────
  if (u.startsWith('opacity-')) {
    const token = u.slice(8);
    const a = extractArbitraryValue(token); if (a) return `opacity:${a}`;
    return `opacity:${parseFloat(token) / 100}`;
  }

  if (u.startsWith('shadow')) {
    const shadowMap = {
      'shadow-sm': '0 1px 2px 0 rgba(0,0,0,0.05)',
      'shadow': '0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px -1px rgba(0,0,0,0.1)',
      'shadow-md': '0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -2px rgba(0,0,0,0.1)',
      'shadow-lg': '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)',
      'shadow-xl': '0 20px 25px -5px rgba(0,0,0,0.1),0 8px 10px -6px rgba(0,0,0,0.1)',
      'shadow-2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',
      'shadow-none': 'none',
    };
    if (shadowMap[u]) return `box-shadow:${shadowMap[u]}`;
    const a = extractArbitraryValue(u.slice(7)); if (a) return `box-shadow:${a}`;
  }

  // ── TRANSITIONS & ANIMATIONS ──────────────────────────────────────────────
  const transMap = {
    'transition': 'transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms',
    'transition-all': 'transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms',
    'transition-colors': 'transition-property:color,background-color,border-color;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms',
    'transition-none': 'transition-property:none',
  };
  if (transMap[u]) return transMap[u];

  if (u.startsWith('duration-')) {
    const a = extractArbitraryValue(u.slice(9)); if (a) return `transition-duration:${a}`;
    return `transition-duration:${u.slice(9)}ms`;
  }
  if (u.startsWith('ease-')) {
    const easeMap = { linear: 'linear', 'in': 'cubic-bezier(0.4,0,1,1)', 'out': 'cubic-bezier(0,0,0.2,1)', 'in-out': 'cubic-bezier(0.4,0,0.2,1)' };
    const t = u.slice(5);
    if (easeMap[t]) return `transition-timing-function:${easeMap[t]}`;
  }

  // ── INTERACTIVITY ─────────────────────────────────────────────────────────
  if (u.startsWith('cursor-')) return `cursor:${u.slice(7)}`;

  // ── OVERFLOW ──────────────────────────────────────────────────────────────
  if (u === 'overflow-hidden') return 'overflow:hidden';
  if (u === 'overflow-auto') return 'overflow:auto';
  if (u === 'overflow-scroll') return 'overflow:scroll';
  if (u === 'overflow-x-hidden') return 'overflow-x:hidden';
  if (u === 'overflow-y-hidden') return 'overflow-y:hidden';
  if (u === 'overflow-x-auto') return 'overflow-x:auto';
  if (u === 'overflow-y-auto') return 'overflow-y:auto';

  // ── Z-INDEX ───────────────────────────────────────────────────────────────
  if (u.startsWith('z-')) {
    const a = extractArbitraryValue(u.slice(2)); if (a) return `z-index:${a}`;
    return `z-index:${u.slice(2)}`;
  }

  // ── OBJECT-FIT / POSITION ─────────────────────────────────────────────────
  if (u.startsWith('object-')) {
    const token = u.slice(7);
    const fitValues = new Set(['contain', 'cover', 'fill', 'none', 'scale-down']);
    const posValues = new Set(['top', 'bottom', 'left', 'right', 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']);
    if (fitValues.has(token)) return `object-fit:${token}`;
    if (posValues.has(token)) return `object-position:${token}`;
    const a = extractArbitraryValue(token); if (a) return `object-position:${a}`;
  }

  // ── BACKDROP BLUR ─────────────────────────────────────────────────────────
  if (u.startsWith('backdrop-blur-')) {
    const blurMap = { sm: '4px', '': '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '40px', '3xl': '64px' };
    const token = u.slice(14);
    const a = extractArbitraryValue(token); if (a) return `backdrop-filter:blur(${a});-webkit-backdrop-filter:blur(${a})`;
    const val = blurMap[token]; if (val) return `backdrop-filter:blur(${val});-webkit-backdrop-filter:blur(${val})`;
  }

  // ── ASPECT RATIO ──────────────────────────────────────────────────────────
  if (u.startsWith('aspect-')) {
    const a = extractArbitraryValue(u.slice(7)); if (a) return `aspect-ratio:${a}`;
    const aspectMap = { auto: 'auto', square: '1/1', video: '16/9', '3/2': '3/2', '4/3': '4/3' };
    if (aspectMap[u.slice(7)]) return `aspect-ratio:${aspectMap[u.slice(7)]}`;
  }

  return null; // Unrecognised — skip silently
}

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Parses one chai-* class into { variant, utility }.
 *
 *  "chai-p-4"             → { variant: null,    utility: "p-4" }
 *  "chai-hover:bg-blue-500" → { variant: "hover", utility: "bg-blue-500" }
 *  "chai-md:flex"         → { variant: "md",    utility: "flex" }
 */
function parseClass(className) {
  if (!className.startsWith(CLASS_PREFIX)) return null;
  const withoutPrefix = className.slice(CLASS_PREFIX.length);
  const colonIdx = withoutPrefix.indexOf(':');
  if (colonIdx !== -1) {
    return { variant: withoutPrefix.slice(0, colonIdx), utility: withoutPrefix.slice(colonIdx + 1) };
  }
  return { variant: null, utility: withoutPrefix };
}

// ─── Rule builder ─────────────────────────────────────────────────────────────

function buildAndInjectRule(originalClassName, variant, utility) {
  const declarations = resolveUtility(utility);
  if (!declarations) return;

  const sel = `.${escapeCSSSelector(originalClassName)}`;
  let rule;

  if (!variant) {
    rule = `${sel} { ${declarations} }`;
  } else if (PSEUDO_VARIANTS[variant]) {
    rule = `${sel}${PSEUDO_VARIANTS[variant]} { ${declarations} }`;
  } else if (BREAKPOINTS[variant]) {
    rule = `@media (min-width: ${BREAKPOINTS[variant]}) { ${sel} { ${declarations} } }`;
  } else if (variant === 'dark') {
    rule = `@media (prefers-color-scheme: dark) { ${sel} { ${declarations} } }`;
  } else {
    return;
  }

  injectRule(rule);
}

// ─── DOM integration ──────────────────────────────────────────────────────────

/**
 * Finds and applies all chai-* classes on a single element.
 * Classes are intentionally kept — they serve as CSS selectors.
 */
export function applyElement(element) {
  for (const cls of element.classList) {
    if (!cls.startsWith(CLASS_PREFIX)) continue;
    const parsed = parseClass(cls);
    if (parsed) buildAndInjectRule(cls, parsed.variant, parsed.utility);
  }
}

function applyAll() {
  document.querySelectorAll(`[class*="${CLASS_PREFIX}"]`).forEach(applyElement);
}

/**
 * Watches for elements added after the initial scan (SPA navigation, dynamic UIs).
 */
function watchDom() {
  const observer = new MutationObserver(mutations => {
    for (const { type, addedNodes } of mutations) {
      if (type !== 'childList') continue;
      for (const node of addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        applyElement(node);
        node.querySelectorAll(`[class*="${CLASS_PREFIX}"]`).forEach(applyElement);
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// ─── Public boot function ─────────────────────────────────────────────────────

/**
 * Boots the Chai CSS engine. Call once in your entry file.
 *
 * @example
 *   import { initChai } from 'chai-css';
 *   initChai();
 */
export function initChai() {
  createStyleSheet();

  const run = () => {
    applyAll();
    requestAnimationFrame(applyAll); // second pass catches JS-rendered content
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  watchDom();
}
