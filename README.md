# Pandora CSS

> A zero-build, utility-first CSS engine — like Tailwind, but at runtime.

No compilation. No PostCSS. No config. Just import and go.

---

## Built with Pandora CSS

This landing page is built entirely with Pandora CSS — no Tailwind, no custom CSS. Just chai-* classes. If you like what you see, you're looking at Pandora CSS in action.

---

## Quick Start

```bash
npm install pandora-css
```

```js
import { initChai } from 'pandora-css';
initChai();
```

```html
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

## Run Demo

```bash
npm install
npm run dev
```

---

## Project Structure

```
├── pandora-css/              ← npm package
│   ├── src/
│   │   ├── index.js           ← public API
│   │   ├── engine.js           ← CSS injection engine
│   │   ├── colors.js           ← Tailwind + tea palettes
│   │   └── utils.js            ← utilities
│   ├── dist/                   ← built output
│   └── package.json
│
├── index.html                  ← landing page demo
└── package.json
```

---

## Features

| Feature | **Pandora CSS** |
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

## How It Works

Pandora CSS **injects real `<style>` rules** instead of inline styles:

```
.chai-hover\:bg-blue-500:hover { background-color: #3b82f6 }
@media (min-width: 768px) { .chai-md\:flex-col { flex-direction: column } }
```

This means:
- CSS transitions animate on hover
- Pseudo-selectors work natively
- DevTools shows proper rule origins
- Classes stay on elements
- MutationObserver handles dynamically added elements

---

## License

MIT © Sourav Kumar
