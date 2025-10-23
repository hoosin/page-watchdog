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
      exports: 'auto',
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
      name,
      sourcemap: true,
      exports: 'auto',
    },
    // UMD Minified
    {
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      name,
      sourcemap: true,
      plugins: [terser({ keep_classnames: true })],
      exports: 'auto',
    },
  ],
  plugins: [
    typescript({ tsconfig: './tsconfig.json', declarationDir: './dist/types' }),
    nodeResolve({ browser: true }),
  ],
};
