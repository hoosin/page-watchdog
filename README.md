[English](./README.md) | [简体中文](./README.zh-CN.md)

# Page Watchdog

A simple, modern, and type-safe library to watch for page script updates.

## Features

- 🚀 **Zero Dependencies**: Pure native implementation, no external libraries required.
- 🛡️ **Fully Type-Safe**: Complete TypeScript support for a superior developer experience.
- ✨ **Modern Architecture**: Built with `async/await` for clean, readable asynchronous code.
- 📦 **Lightweight & Simple**: Minimal footprint with an intuitive, easy-to-use API.

## Installation

Install the package from npm:

```bash
npm install page-watchdog
```

## Usage

### With a Bundler (like Vite or Webpack)

The recommended way to use Page Watchdog is by importing it into your project.

```typescript
import PageWatcher from 'page-watchdog';

async function initializeWatcher() {
  try {
    const watcher = await PageWatcher.create({ timer: 5000 });

    watcher.on('changed', () => {
      console.log('Page has new scripts! Reloading...');
      window.location.reload();
    });

    // ... other event listeners

  } catch (e) {
    console.error('Failed to initialize Page Watchdog:', e);
  }
}

initializeWatcher();
```

### In the Browser (via CDN)

You can also use Page Watchdog directly in the browser by including it from a CDN like jsDelivr.

```html
<script src="https://cdn.jsdelivr.net/npm/page-watchdog@latest/dist/page-watchdog.umd.min.js"></script>
<script>
  (async () => {
    try {
      // The watcher is available on the global window.PageWatcher object
      const watcher = await window.PageWatcher.create({ timer: 5000 });

      watcher.on('changed', () => {
        console.log('Page has new scripts! Reloading...');
        window.location.reload();
      });

      console.log('Page Watchdog is now active.');

    } catch (e) {
      console.error('Failed to initialize Page Watchdog:', e);
    }
  })();
</script>
```

## API Reference

### `PageWatcher.create(options?)`

Asynchronously creates and initializes a new `PageWatcher` instance. This method returns a `Promise` that resolves with the watcher instance.

- `options` (optional): A configuration object.
  - `timer` (number): The interval in milliseconds to check for updates. **Default**: `10000`.
  - `disableCache` (boolean): Determines whether to disable browser caching for page fetches. By default, a timestamp is added to each fetch request to prevent caching. Set this to `false` to allow the browser to cache responses. **Default**: `true`.

### `watcher.on(event, listener)`

Listens for events.

- `event`: The event to listen for:
  - `'changed'`: Fired when a change in script tags is detected.
  - `'unchanged'`: Fired when no changes are detected during a check.
  - `'error'`: Fired when an error occurs. The listener receives an `Error` object.

### `watcher.stop()`

Stops the watcher from polling for updates. Call this to clean up resources when the watcher is no longer needed.
