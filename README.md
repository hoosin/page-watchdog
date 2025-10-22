[English](./README.md) | [简体中文](./README.zh-CN.md)

# Page Watchdog

A simple, modern, and type-safe library to watch for page script updates.

## Features

- 🚀 Zero dependencies
- 🛡️ Fully type-safe API
- ✨ Modern `async/await` architecture
- 📦 Lightweight and simple

## Installation

```bash
npm install page-watchdog
```

## Usage

The recommended way to use Page Watchdog is with a top-level `async` context.

```typescript
import { PageWatcher } from 'page-watchdog';

async function initializeWatcher() {
  try {
    const watcher = await PageWatcher.create({ timer: 5000 });

    watcher.on('update', () => {
      console.log('Page has new scripts! Reloading...');
      // Example: Force a reload to get the new content
      window.location.reload();
    });

    watcher.on('no-update', () => {
      console.log('No updates found during this check.');
    });

    watcher.on('error', (err) => {
      // The `err` parameter is automatically typed as `Error`
      console.error('Watcher encountered an error:', err.message);
      // You might want to stop the watcher if a persistent error occurs
      watcher.stop();
    });

    console.log('Page Watchdog is now active.');

  } catch (e) {
    console.error('Failed to initialize Page Watchdog:', e);
  }
}

initializeWatcher();
```

## API

### `PageWatcher.create(options?)`

Creates and initializes a new `PageWatcher` instance. This is an `async` method and must be awaited.

- `options`: An optional configuration object.
  - `timer` (number): The interval in milliseconds to check for updates. Defaults to `10000` (10 seconds).

### `watcher.on(event, listener)`

Listens for events.

- `event`: The event to listen for. Can be:
  - `'update'`: Fired when a change in script tags is detected.
  - `'no-update'`: Fired when no changes are detected.
  - `'error'`: Fired when an error occurs during initialization or polling. The listener receives an `Error` object.

### `watcher.stop()`

Stops the watcher from polling for updates. Call this to clean up when the watcher is no longer needed.
