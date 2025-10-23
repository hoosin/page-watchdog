import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

// Use a compatible way to import JSON
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

// Convert package name (kebab-case) to PascalCase for the UMD global variable
const name = pkg.name
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

export default {
  input: 'src/index.ts',
  output: [
    // CommonJS (for Node)
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    // ES Module (for modern bundlers)
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    // UMD (for browsers)
    {
      file: pkg.browser,
      format: 'umd',
      name, // The global variable name, e.g., PageWatcher
      sourcemap: true,
    },
    // UMD Minified
    {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name,
      sourcemap: true,
      plugins: [terser()], // Minify the output
    },
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
  ],
};
