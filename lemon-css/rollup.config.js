import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

const plugins = [
  resolve({ browser: true }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser({ compress: { passes: 2 }, mangle: true }));
}

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/lemon-css.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/lemon-css.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/lemon-css.umd.js',
        format: 'umd',
        name: 'PandoraCSS',
        sourcemap: true,
        globals: {},
      },
    ],
    plugins,
    external: [],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/lemon-css.min.js',
      format: 'iife',
      name: 'PandoraCSS',
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true }),
      terser({ compress: { passes: 3 }, mangle: true }),
    ],
  },
];
