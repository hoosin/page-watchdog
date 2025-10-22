/**
 * A class that handles repeated execution of a callback at a set interval.
 */
export class Poller {
  private timerId: number | null = null;

  /**
   * Starts the polling process.
   * If polling is already active, it will be stopped and restarted.
   * @param callback The function to execute at each interval.
   * @param interval The interval in milliseconds.
   */
  start(callback: () => void, interval: number): void {
    if (this.timerId) {
      this.stop();
    }
    // Using window.setInterval for browser compatibility.
    this.timerId = window.setInterval(callback, interval);
  }

  /**
   * Stops the polling process.
   */
  stop(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
