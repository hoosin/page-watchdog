export class Poller {
  private timerId: number | null = null;

  start(callback: () => void, interval: number): void {
    if (this.timerId) {
      this.stop();
    }
    this.timerId = window.setInterval(callback, interval);
  }

  stop(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
