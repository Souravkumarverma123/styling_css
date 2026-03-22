# ☕ Chai CSS

> A zero-build, utility-first CSS engine — like Tailwind, but at runtime.

No compilation. No PostCSS. No config. Just import and go.

```bash
npm install chai-css
```

---

## Why Chai CSS? (vs ChaiTail)

| Feature | ChaiTail | **Chai CSS** |
|---|---|---|
| Hover / focus / active | ❌ inline styles | ✅ `chai-hover:bg-blue-500` |
| Responsive breakpoints | ❌ | ✅ `chai-md:flex-col` |
| Dark mode | ❌ | ✅ `chai-dark:text-white` |
| Arbitrary values | ❌ | ✅ `chai-p-[20px]` |
| Tea color palette | ✅ | ✅ (expanded to 26 teas) |
| Full Tailwind colors | ❌ | ✅ 242 named shades |
| Dynamic elements / SPA | ❌ (class deleted!) | ✅ MutationObserver |
| CSS transitions on hover | ❌ | ✅ |

---

## Quick Start

```js
// main.js
import { initChai } from 'chai-css';
initChai();
```

```html
<!-- index.html -->
<div class="chai-flex chai-items-center chai-gap-4 chai-p-6 chai-rounded-xl chai-bg-zinc-900">

  <h1 class="chai-text-4xl chai-font-bold chai-text-white chai-tracking-tight">
    Hello Chai!
  </h1>

  <button class="chai-bg-masala-chai chai-text-white chai-px-6 chai-py-3
                 chai-rounded-full chai-font-semibold chai-transition
                 chai-hover:bg-tandoori-chai chai-cursor-pointer">
    Brew It
  </button>

</div>
```

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

### Spacing (× 4px scale, like Tailwind)

```
chai-p-4   → padding: 16px      chai-px-6  → padding: 0 24px
chai-m-2   → margin: 8px        chai-mt-8  → margin-top: 32px
chai-gap-4 → gap: 16px

# Arbitrary values:
chai-p-[20px]   chai-mt-[1.5rem]   chai-gap-[clamp(1rem,2vw,2rem)]
```

### Sizing

```
chai-w-full   chai-h-screen   chai-min-h-screen
chai-max-w-xl chai-max-w-[1320px]   chai-w-[400px]
```

### Typography

```
chai-text-xs   chai-text-sm   chai-text-base  chai-text-lg  chai-text-xl
chai-text-2xl  chai-text-3xl  chai-text-4xl   chai-text-5xl chai-text-6xl
chai-text-[clamp(1rem,4vw,3rem)]   ← arbitrary font sizes!

chai-font-thin   chai-font-light  chai-font-normal   chai-font-medium
chai-font-semibold  chai-font-bold   chai-font-extrabold

chai-tracking-tight   chai-tracking-wide   chai-tracking-[0.05em]
chai-leading-relaxed  chai-leading-loose   chai-leading-[1.8]

chai-uppercase  chai-lowercase  chai-capitalize
chai-no-underline  chai-underline  chai-truncate  chai-antialiased
```

### Colors

All Tailwind color scales are supported:

```
chai-bg-blue-500     chai-text-zinc-100    chai-border-red-600
chai-bg-emerald-400  chai-text-purple-300
```

**Plus 26 unique tea colors:**

```
chai-bg-masala-chai      chai-text-darjeeling-tea   chai-bg-matcha-tea
chai-text-tandoori-chai  chai-bg-irani-chai         chai-text-rooibos-tea
chai-bg-mint-tea         chai-text-kashmiri-chai    chai-bg-hibiscus-tea
... and more!
```

Arbitrary hex colors:

```
chai-bg-[#0c0c0c]   chai-text-[rgba(255,255,255,0.6)]   chai-border-[#e54d2e]
```

### Borders & Rounding

```
chai-border          chai-border-2      chai-border-blue-500
chai-border-t        chai-border-b      chai-border-none
chai-rounded         chai-rounded-lg    chai-rounded-xl     chai-rounded-full
chai-rounded-[12px]
```

### Effects

```
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

All pseudo variants:
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

## Grid

```html
<!-- 3-column grid, 2 on md, 1 on mobile -->
<div class="chai-grid  chai-grid-cols-1  chai-md:grid-cols-2  chai-lg:grid-cols-3  chai-gap-6">
  <div class="chai-col-span-2">Wide card</div>
  <div>Normal card</div>
</div>
```

---

## How It Works

Instead of inline styles (like ChaiTail), Chai CSS **injects real `<style>` rules**:

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

## Project Structure

```
chai-css/
├── src/
│   ├── index.js     ← public API (initChai, applyElement)
│   ├── engine.js    ← core CSS injection engine
│   ├── colors.js    ← Tailwind + tea color palettes
│   └── utils.js     ← escapeCSSSelector, extractArbitraryValue
└── package.json
```

---

## License

MIT © Sourav Kumar
