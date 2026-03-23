# Pandora CSS

A zero-build, utility-first CSS engine that brings the developer experience of Tailwind CSS to runtime. Write semantic class names inspired by tea nomenclature while shipping zero CSS to your users.

[![npm version](https://img.shields.io/npm/v/@sourav7534kumar/pandora-css)](https://www.npmjs.com/package/@sourav7534kumar/pandora-css)
[![License](https://img.shields.io/npm/l/@sourav7534kumar/pandora-css)](LICENSE)

## Why Pandora CSS?

Traditional CSS frameworks require build steps, configuration, and generate static stylesheets. Pandora CSS takes a different approach:

- **Zero build configuration** — Import and use immediately
- **Runtime generation** — Styles are injected dynamically when needed
- **Dynamic applications** — MutationObserver handles SPA environments seamlessly
- **Developer experience** — Familiar Tailwind-like API with tea-inspired naming

## Installation

```bash
npm install @sourav7534kumar/pandora-css
```

## Quick Start

```javascript
import { initChai } from '@sourav7534kumar/pandora-css';
initChai();
```

```html
<div class="chai-flex chai-items-center chai-gap-4 chai-p-6 chai-bg-zinc-900">
  <h1 class="chai-text-4xl chai-font-bold chai-text-white">Hello World</h1>
  <button class="chai-bg-masala-chai chai-text-white chai-px-6 chai-py-3 
               chai-rounded-full chai-hover:bg-tandoori-chai chai-transition">
    Get Started
  </button>
</div>
```

## Core Features

| Feature | Support |
|---------|---------|
| Zero build step | ✓ |
| Hover / focus / active states | ✓ |
| Responsive breakpoints | ✓ |
| Dark mode | ✓ |
| Arbitrary values | ✓ |
| Custom color palette | ✓ |
| Tailwind color system | ✓ |
| Dynamic element handling | ✓ |

### Zero Build Required

Unlike traditional CSS frameworks, Pendora CSS requires no PostCSS, no Tailwind CLI, and no build configuration. The styles are generated at runtime:

```javascript
// Before: Complex build pipeline
// npm install tailwindcss postcss autoprefixer
// npx tailwindcss init -p
// build process generates static CSS

// After: Just import
import { initChai } from '@sourav7534kumar/pandora-css';
initChai();
```

### Dynamic Applications

Pendora CSS uses MutationObserver to automatically handle dynamically added elements in SPAs:

```javascript
// No extra code needed
// Just call initChai() once at startup
import { initChai } from '@sourav7534kumar/pandora-css';
initChai();

// Pendora CSS handles the rest
// Dynamically added elements are automatically processed
```

## Class Reference

### Layout

```css
chai-flex          chai-block         chai-grid          chai-hidden
chai-flex-col      chai-flex-row      chai-flex-wrap
chai-items-center  chai-justify-between  chai-justify-center
chai-relative      chai-absolute      chai-sticky        chai-fixed
chai-overflow-hidden  chai-overflow-auto
chai-mx-auto
```

### Spacing

```css
chai-p-4   → padding: 16px      chai-px-6  → padding: 0 24px
chai-m-2   → margin: 8px        chai-mt-8  → margin-top: 32px
chai-gap-4 → gap: 16px

chai-p-[20px]   chai-mt-[1.5rem]   chai-gap-[clamp(1rem,2vw,2rem)]
```

### Colors

Full Tailwind color scale:

```css
chai-bg-blue-500     chai-text-zinc-100    chai-border-red-600
chai-bg-emerald-400  chai-text-purple-300
```

Custom tea palette (26 colors):

```css
chai-bg-masala-chai      chai-bg-darjeeling-tea   chai-bg-matcha-tea
chai-bg-tandoori-chai    chai-bg-mint-tea         chai-bg-kashmiri-chai
chai-bg-hibiscus-tea     chai-bg-black-tea
```

Arbitrary values:

```css
chai-bg-[#0c0c0c]   chai-text-[rgba(255,255,255,0.6)]
```

### Typography

```css
chai-text-xs   chai-text-sm   chai-text-base  chai-text-lg  chai-text-xl
chai-text-2xl  chai-text-3xl  chai-text-4xl   chai-text-5xl chai-text-6xl

chai-font-thin   chai-font-light  chai-font-normal   chai-font-medium
chai-font-semibold  chai-font-bold   chai-font-extrabold

chai-tracking-tight   chai-tracking-wide   chai-tracking-[0.05em]
chai-leading-relaxed  chai-leading-loose

chai-uppercase  chai-lowercase  chai-capitalize
chai-no-underline  chai-underline  chai-truncate  chai-antialiased
```

### Borders & Effects

```css
chai-border          chai-border-2      chai-border-blue-500
chai-rounded         chai-rounded-lg    chai-rounded-xl     chai-rounded-full

chai-shadow-sm   chai-shadow-md  chai-shadow-lg   chai-shadow-xl
chai-opacity-50  chai-opacity-[0.35]
chai-backdrop-blur-md
```

### Transitions

```css
chai-transition         ← all common properties
chai-transition-all     ← literally everything
chai-transition-colors  ← color changes only
chai-duration-300       chai-duration-[500ms]
chai-ease-in            chai-ease-out      chai-ease-in-out
```

## Variants

### Hover / Focus / Active

```html
<button class="chai-bg-blue-500  chai-hover:bg-blue-600  chai-active:bg-blue-700
               chai-transition   chai-text-white  chai-px-6  chai-py-3  chai-rounded-lg">
  Click Me
</button>
```

Pseudo variants:

```css
chai-hover:    chai-focus:    chai-active:    chai-visited:
chai-disabled: chai-checked:  chai-odd:       chai-even:
chai-first-child:  chai-last-child:  chai-placeholder:
```

### Responsive Breakpoints

```css
chai-sm:    (≥640px)
chai-md:    (≥768px)
chai-lg:    (≥1024px)
chai-xl:    (≥1280px)
chai-2xl:   (≥1536px)
```

```html
<div class="chai-flex-col  chai-md:flex-row  chai-gap-4">
  <!-- stacks vertically on mobile, side-by-side on md+ -->
</div>
```

### Dark Mode

```html
<div class="chai-bg-white  chai-dark:bg-zinc-900
            chai-text-black  chai-dark:text-white">
  Respects OS preference
</div>
```

## How It Works

Pendora CSS injects real `<style>` rules into the document rather than using inline styles:

```css
.chai-hover\:bg-blue-500:hover { background-color: #3b82f6 }
@media (min-width: 768px) { .chai-md\:flex-col { flex-direction: column } }
```

This approach provides several advantages:

- CSS transitions animate correctly on hover
- Pseudo-selectors like `:hover` work natively in the browser
- Browser DevTools shows proper rule origins
- Classes remain on elements (your JavaScript class checks still work)
- MutationObserver automatically handles dynamically added elements

## API Reference

### `initChai()`

Initializes the CSS engine. Call once at application startup.

```javascript
import { initChai } from '@sourav7534kumar/pandora-css';
initChai();
```

### `applyElement(element)`

Manually processes an element's chai-* classes. Use this for elements added after initialization.

```javascript
import { applyElement } from '@sourav7534kumar/pandora-css';
applyElement(document.getElementById('dynamic-content'));
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © Sourav Kumar
