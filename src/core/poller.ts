/**
 * A class that handles repeated execution of an async callback at a set interval.
 * Uses recursive setTimeout to ensure the previous callback completes before scheduling the next.
 */
export class Poller {
  private timerId: number | null = null;

  /**
   * Starts the polling process.
   * If polling is already active, it will be stopped and restarted.
   * @param callback The function to execute at each interval. Can be async.
   * @param interval The interval in milliseconds.
   */
  start(callback: () => void | Promise<void>, interval: number): void {
    if (this.timerId) {
      this.stop();
    }

    const tick = () => {
      this.timerId = window.setTimeout(async () => {
        await callback();
        // Only schedule the next tick if polling hasn't been stopped during the callback.
        if (this.timerId !== null) {
          tick();
        }
      }, interval);
    };

    tick();
  }

  /**
   * Stops the polling process.
   */
  stop(): void {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
