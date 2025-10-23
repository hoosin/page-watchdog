/**
 * Configuration options for the PageWatcher.
 */
export interface Options {
  /**
   * The interval in milliseconds at which to check for page updates.
   * @default 10000
   */
  timer?: number;
  /**
   * Determines whether to disable browser caching by appending a timestamp to the fetch URL.
   * Set to `false` to allow caching.
   * @default true
   */
  disableCache?: boolean;
}
