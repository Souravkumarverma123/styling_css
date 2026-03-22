# ☕ Pendora CSS

> A zero-build, utility-first CSS engine — like Tailwind, but at runtime.

No compilation. No PostCSS. No config. Just import and go.

```bash
npm install pendora-css
```

---

## Built with Pendora CSS

This landing page you're viewing? Built entirely with Pendora CSS. No Tailwind, no custom CSS — just chai-* classes. It's the best proof that Pendora CSS is production-ready.

---

## Quick Start

```js
import { initChai } from 'pendora-css';
initChai();
```

```html
<div class="chai-flex chai-items-center chai-gap-4 chai-p-6 chai-bg-zinc-900">

  <h1 class="chai-text-4xl chai-font-bold chai-text-white">Hello Chai!</h1>

  <button class="chai-bg-masala-chai chai-text-white chai-px-6 chai-py-3
                 chai-rounded-full chai-hover:bg-tandoori-chai chai-transition">
    Brew It
  </button>

</div>
```

---

## Features

| Feature | **Chai CSS** |
|---|---|
| Zero build step | ✅ |
| Hover / focus / active | ✅ `chai-hover:bg-blue-500` |
| Responsive breakpoints | ✅ `chai-md:flex-col` |
| Dark mode | ✅ `chai-dark:text-white` |
| Arbitrary values | ✅ `chai-p-[20px]` |
| Tea color palette | ✅ 26 unique colors |
| Tailwind colors | ✅ 242 named shades |
| SPA / Dynamic elements | ✅ MutationObserver |

---

## Class Reference

### Layout

```
chai-flex          chai-block         chai-grid          chai-hidden
chai-flex-col      chai-flex-row      chai-flex-wrap
chai-items-center  chai-justify-between  chai-justify-center
chai-relative      chai-absolute      chai-sticky        chai-fixed
chai-overflow-hidden  chai-overflow-auto
chai-mx-auto
```

### Spacing

```
chai-p-4   → padding: 16px      chai-px-6  → padding: 0 24px
chai-m-2   → margin: 8px        chai-mt-8  → margin-top: 32px
chai-gap-4 → gap: 16px

chai-p-[20px]   chai-mt-[1.5rem]   chai-gap-[clamp(1rem,2vw,2rem)]
```

### Colors

All Tailwind color scales:
```
chai-bg-blue-500     chai-text-zinc-100    chai-border-red-600
chai-bg-emerald-400  chai-text-purple-300
```

26 unique tea colors:
```
chai-bg-masala-chai      chai-bg-darjeeling-tea   chai-bg-matcha-tea
chai-bg-tandoori-chai    chai-bg-mint-tea         chai-bg-kashmiri-chai
chai-bg-hibiscus-tea     chai-bg-black-tea        ...and more!
```

Arbitrary hex:
```
chai-bg-[#0c0c0c]   chai-text-[rgba(255,255,255,0.6)]
```

### Typography

```
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

```
chai-border          chai-border-2      chai-border-blue-500
chai-rounded         chai-rounded-lg    chai-rounded-xl     chai-rounded-full

chai-shadow-sm   chai-shadow-md  chai-shadow-lg   chai-shadow-xl
chai-opacity-50  chai-opacity-[0.35]
chai-backdrop-blur-md
```

### Transitions

```
chai-transition         ← all common properties
chai-transition-all     ← literally everything
chai-transition-colors  ← color changes only
chai-duration-300       chai-duration-[500ms]
chai-ease-in            chai-ease-out      chai-ease-in-out
```

---

## Variants

### Hover / Focus / Active

```html
<button class="chai-bg-blue-500  chai-hover:bg-blue-600  chai-active:bg-blue-700
               chai-transition   chai-text-white  chai-px-6  chai-py-3  chai-rounded-lg">
  Click Me
</button>
```

Pseudo variants:
```
chai-hover:    chai-focus:    chai-active:    chai-visited:
chai-disabled: chai-checked:  chai-odd:       chai-even:
chai-first-child:  chai-last-child:  chai-placeholder:
```

### Responsive Breakpoints (mobile-first)

```
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

---

## How It Works

Chai CSS **injects real `<style>` rules** instead of inline styles:

```
.chai-hover\:bg-blue-500:hover { background-color: #3b82f6 }
@media (min-width: 768px) { .chai-md\:flex-col { flex-direction: column } }
```

This means:
- ✅ CSS transitions animate on hover
- ✅ Pseudo-selectors like `:hover` work natively
- ✅ Browser DevTools shows proper rule origins
- ✅ Classes stay on elements (your JS class-checks still work)
- ✅ MutationObserver automatically handles dynamically added elements

---

## API

### `initChai()`

Boot the engine. Call once at startup.

```js
import { initChai } from 'pendora-css';
initChai();
```

### `applyElement(element)`

Manually process an element's chai-* classes.

```js
import { applyElement } from 'chai-css';
applyElement(document.getElementById('dynamic-content'));
```

---

## License

MIT © Sourav Kumar
