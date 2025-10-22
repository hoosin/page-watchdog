import { haveScriptsChanged } from './core/comparer';
import { Emitter } from './core/emitter';
import { getHtml } from './core/fetcher';
import { parseScripts } from './core/parser';
import { Poller } from './core/poller';
import type { Options } from './types';

/**
 * Defines the events and their corresponding payload types for the PageWatcher.
 */
type PageWatcherEvents = {
  update: void; // Emitted when a script change is detected.
  'no-update': void; // Emitted when no change is detected.
  error: Error; // Emitted when an error occurs during fetching or initialization.
};

/**
 * A helper function to ensure the caught value is a proper Error instance.
 * @param value The value caught in a catch block.
 * @returns An Error instance.
 */
function ensureError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  return new Error(`An unknown error occurred: ${String(value)}`);
}

/**
 * The main class for watching page script changes.
 * It periodically fetches the page, compares the script tags,
 * and emits events based on whether changes are detected.
 *
 * @example
 * ```typescript
 * import { PageWatcher } from 'page-watchdog';
 *
 * try {
 *   const watcher = await PageWatcher.create({ timer: 5000 });
 *
 *   watcher.on('update', () => {
 *     console.log('Page has new scripts! Reloading...');
 *     window.location.reload();
 *   });
 *
 *   watcher.on('error', (err) => {
 *     // `err` is automatically typed as `Error`
 *     console.error('Watcher encountered an error:', err.message);
 *   });
 *
 * } catch (e) {
 *   console.error('Failed to initialize PageWatcher:', e);
 * }
 * ```
 */
export class PageWatcher extends Emitter<PageWatcherEvents> {
  private oldScripts: string[] = [];
  private poller: Poller;

  /**
   * The constructor is private to enforce initialization via the async `create` method.
   * @param options The configuration options.
   */
  private constructor(private options: Options = {}) {
    super();
    this.poller = new Poller();
  }

  /**
   * Performs the initial fetch and setup.
   * This is called internally by the `create` method.
   */
  private async init(): Promise<void> {
    try {
      const html = await getHtml();
      this.oldScripts = parseScripts(html);
      this.startPolling();
    } catch (error) {
      const safeError = ensureError(error);
      console.error('Page Watchdog initialization failed:', safeError);
      this.emit('error', safeError);
      // Re-throw the error to fail the `create` promise
      throw safeError;
    }
  }

  /**
   * Creates and initializes a new PageWatcher instance.
   * This is the recommended way to create a PageWatcher.
   * @param options Configuration options for the watcher.
   * @returns A promise that resolves with a fully initialized PageWatcher instance.
   */
  public static async create(options: Options = {}): Promise<PageWatcher> {
    const watcher = new PageWatcher(options);
    await watcher.init();
    return watcher;
  }

  /**
   * Starts the polling mechanism.
   */
  private startPolling(): void {
    this.poller.start(() => this.checkForUpdates(), this.options.timer || 10000);
  }

  /**
   * Fetches the latest page content, compares scripts, and emits events.
   */
  private async checkForUpdates(): Promise<void> {
    try {
      const html = await getHtml();
      const newScripts = parseScripts(html);

      if (haveScriptsChanged(this.oldScripts, newScripts)) {
        this.oldScripts = newScripts;
        this.emit('update', undefined);
      } else {
        this.emit('no-update', undefined);
      }
    } catch (error) {
      const safeError = ensureError(error);
      console.error('Page Watchdog failed to check for updates:', safeError);
      this.emit('error', safeError);
    }
  }

  /**
   * Stops the polling for updates.
   * Call this to clean up the watcher when it's no longer needed.
   */
  stop(): void {
    this.poller.stop();
  }
}

// Export the main class and types for library users
export type { Options };
