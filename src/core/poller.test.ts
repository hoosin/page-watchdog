import { Poller } from './poller';

// Tell Jest to use fake timers
jest.useFakeTimers();

describe('Poller', () => {
  let poller: Poller;
  let callback: jest.Mock;

  beforeEach(() => {
    poller = new Poller();
    callback = jest.fn();
  });

  afterEach(() => {
    poller.stop();
    // Restore real timers
    jest.clearAllTimers();
  });

  it('should not call the callback immediately after starting', () => {
    poller.start(callback, 1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback after the specified interval', async () => {
    poller.start(callback, 1000);

    await jest.advanceTimersByTimeAsync(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the callback multiple times for each interval', async () => {
    poller.start(callback, 1000);

    await jest.advanceTimersByTimeAsync(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(2000);
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it('should stop calling the callback after stop() is called', async () => {
    poller.start(callback, 1000);

    await jest.advanceTimersByTimeAsync(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    poller.stop();

    // Fast-forward time again
    await jest.advanceTimersByTimeAsync(5000);

    // The callback should not have been called again
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer if start() is called again', async () => {
    // Start with a 1s interval
    poller.start(callback, 1000);

    // Immediately restart with a 5s interval
    const newCallback = jest.fn();
    poller.start(newCallback, 5000);

    // Advance time by 1s
    await jest.advanceTimersByTimeAsync(1000);
    expect(callback).not.toHaveBeenCalled(); // The old callback should not be called
    expect(newCallback).not.toHaveBeenCalled(); // The new one shouldn't be called yet

    // Advance time by another 4s (total 5s)
    await jest.advanceTimersByTimeAsync(4000);
    expect(newCallback).toHaveBeenCalledTimes(1);
  });

  it('should wait for async callback to complete before scheduling next tick', async () => {
    let resolveCallback: () => void;
    const asyncCallback = jest.fn(() => new Promise<void>(resolve => {
      resolveCallback = resolve;
    }));

    poller.start(asyncCallback, 1000);

    // Trigger first tick
    await jest.advanceTimersByTimeAsync(1000);
    expect(asyncCallback).toHaveBeenCalledTimes(1);

    // Advance time while callback is still pending - should NOT schedule another
    await jest.advanceTimersByTimeAsync(2000);
    expect(asyncCallback).toHaveBeenCalledTimes(1);

    // Resolve the pending callback
    resolveCallback!();
    await Promise.resolve();

    // Now the next tick should be scheduled
    await jest.advanceTimersByTimeAsync(1000);
    expect(asyncCallback).toHaveBeenCalledTimes(2);
  });
});
