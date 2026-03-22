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
        file: 'dist/chai-css.esm.js',
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/chai-css.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/chai-css.umd.js',
        format: 'umd',
        name: 'ChaiCSS',
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
      file: 'dist/chai-css.min.js',
      format: 'iife',
      name: 'ChaiCSS',
      sourcemap: true,
    },
    plugins: [
      resolve({ browser: true }),
      terser({ compress: { passes: 3 }, mangle: true }),
    ],
  },
];
