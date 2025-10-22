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

  it('should call the callback after the specified interval', () => {
    poller.start(callback, 1000);

    // Fast-forward time by 1000 ms
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the callback multiple times for each interval', () => {
    poller.start(callback, 1000);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(4);
  });

  it('should stop calling the callback after stop() is called', () => {
    poller.start(callback, 1000);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    poller.stop();

    // Fast-forward time again
    jest.advanceTimersByTime(5000);

    // The callback should not have been called again
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset the timer if start() is called again', () => {
    // Start with a 1s interval
    poller.start(callback, 1000);

    // Immediately restart with a 5s interval
    const newCallback = jest.fn();
    poller.start(newCallback, 5000);

    // Advance time by 1s
    jest.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled(); // The old callback should not be called
    expect(newCallback).not.toHaveBeenCalled(); // The new one shouldn't be called yet

    // Advance time by another 4s (total 5s)
    jest.advanceTimersByTime(4000);
    expect(newCallback).toHaveBeenCalledTimes(1);
  });
});
