import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

// Use a compatible way to import JSON
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const name = 'PageWatcher';

export default {
  input: 'src/index.ts',
  output: [
    // CommonJS (for Node)
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'default', // Since we now have a default export
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
      name, // The global variable name
      sourcemap: true,
      exports: 'default', // Use the default export as the global
    },
    // UMD Minified
    {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name,
      sourcemap: true,
      plugins: [terser()], // Minify the output
      exports: 'default', // Use the default export as the global
    },
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    nodeResolve(),
  ],
};
