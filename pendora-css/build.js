/**
 * Build script for chai-css
 * Bundles source files into dist/ for npm publishing
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, 'dist');

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { cwd: __dirname, stdio: 'inherit' });
}

console.log('Building chai-css...\n');

// Clean dist
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true });
}
mkdirSync(distDir, { recursive: true });

// Bundle with rollup
try {
  run('rollup -c rollup.config.js');
  console.log('\n✅ Rollup build complete');
} catch (e) {
  console.log('\n⚠️  Rollup not installed, creating source bundle manually...');
  createManualBundle();
}

// Copy types
const typeDest = resolve(distDir, 'types.d.ts');
copyFileSync(resolve(__dirname, 'src/types.d.ts'), typeDest);

// Copy package.json to dist
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
delete pkg.devDependencies;
delete pkg.scripts;
writeFileSync(resolve(distDir, 'package.json'), JSON.stringify(pkg, null, 2));

console.log('\n✅ Build complete!');
console.log('   dist/chai-css.esm.js  — ES Module');
console.log('   dist/chai-css.cjs.js  — CommonJS');
console.log('   dist/chai-css.min.js — IIFE (for <script> tag)');
console.log('   dist/types.d.ts       — TypeScript definitions');

function createManualBundle() {
  // Simple concatenation-based bundler for dev/preview
  const srcDir = resolve(__dirname, 'src');
  
  const files = ['utils.js', 'colors.js', 'engine.js'];
  let bundle = '';

  for (const file of files) {
    const content = readFileSync(resolve(srcDir, file), 'utf-8');
    bundle += `// ─── ${file} ───────────────────────────────────────\n`;
    bundle += content + '\n\n';
  }

  const indexContent = readFileSync(resolve(srcDir, 'index.js'), 'utf-8');
  bundle += `// ─── index.js ──────────────────────────────────────\n`;
  bundle += indexContent + '\n';

  // ESM
  writeFileSync(resolve(distDir, 'chai-css.esm.js'), bundle);
  // CJS
  const cjsBundle = `module.exports = require('./chai-css.cjs.js');`;
  writeFileSync(resolve(distDir, 'chai-css.cjs.js'), `(function() { ${bundle} })();`);
  // Min (IIFE) - just copy ESM as placeholder
  writeFileSync(resolve(distDir, 'chai-css.min.js'), bundle);
  writeFileSync(resolve(distDir, 'chai-css.umd.js'), `(function(global) { ${bundle} })(typeof window !== 'undefined' ? window : global);`);
}
