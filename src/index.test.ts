import PageWatcher from './index';
import { getHtml } from './core/fetcher';

// Mock the fetcher module
jest.mock('./core/fetcher');

// Tell Jest to use fake timers
jest.useFakeTimers();

// Type assertion for the mocked function
const mockedGetHtml = getHtml as jest.Mock;

describe('PageWatcher', () => {
  const initialHtml = '<html><script src="a.js"></script></html>';
  const updatedHtml = '<html><script src="a.js"></script><script src="b.js"></script></html>';
  const errorHtml = 'Error: Not Found';

  // Clear all mocks and timers before each test
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('create', () => {
    it('should create and initialize a watcher successfully', async () => {
      mockedGetHtml.mockResolvedValue(initialHtml);

      const watcher = await PageWatcher.create();
      expect(watcher).toBeInstanceOf(PageWatcher);
      expect(mockedGetHtml).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if initialization fails', async () => {
      const initError = new Error('Network Failed');
      mockedGetHtml.mockRejectedValue(initError);

      // We expect the promise to be rejected
      await expect(PageWatcher.create()).rejects.toThrow('Network Failed');
      expect(mockedGetHtml).toHaveBeenCalledTimes(1);
    });
  });

  describe('polling and events', () => {
    it('should emit `no-update` if scripts have not changed', async () => {
      mockedGetHtml.mockResolvedValue(initialHtml);
      const watcher = await PageWatcher.create({ timer: 5000 });

      const noUpdateListener = jest.fn();
      watcher.on('no-update', noUpdateListener);

      // Advance time to trigger the first poll
      jest.advanceTimersByTime(5000);

      // The promise from checkForUpdates needs to resolve
      await Promise.resolve();

      expect(mockedGetHtml).toHaveBeenCalledTimes(2); // 1 for init, 1 for poll
      expect(noUpdateListener).toHaveBeenCalledTimes(1);
    });

    it('should emit `update` if scripts have changed', async () => {
      // Initial state
      mockedGetHtml.mockResolvedValueOnce(initialHtml);
      const watcher = await PageWatcher.create({ timer: 5000 });

      const updateListener = jest.fn();
      watcher.on('update', updateListener);

      // Set up the next poll to return different HTML
      mockedGetHtml.mockResolvedValueOnce(updatedHtml);

      jest.advanceTimersByTime(5000);
      await Promise.resolve(); // Wait for async operations in checkForUpdates

      expect(mockedGetHtml).toHaveBeenCalledTimes(2);
      expect(updateListener).toHaveBeenCalledTimes(1);
    });

    it('should emit `error` if polling fails', async () => {
      mockedGetHtml.mockResolvedValue(initialHtml);
      const watcher = await PageWatcher.create({ timer: 5000 });

      const errorListener = jest.fn();
      watcher.on('error', errorListener);

      const pollError = new Error('Server Down');
      mockedGetHtml.mockRejectedValue(pollError);

      jest.advanceTimersByTime(5000);
      await Promise.resolve();

      expect(mockedGetHtml).toHaveBeenCalledTimes(2);
      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(pollError);
    });
  });

  describe('stop', () => {
    it('should stop polling after stop() is called', async () => {
      mockedGetHtml.mockResolvedValue(initialHtml);
      const watcher = await PageWatcher.create({ timer: 5000 });

      const noUpdateListener = jest.fn();
      watcher.on('no-update', noUpdateListener);

      watcher.stop();

      // Advance time well beyond the interval
      jest.advanceTimersByTime(10000);

      // The listener should not have been called because polling was stopped
      expect(noUpdateListener).not.toHaveBeenCalled();
      // getHtml should only have been called once during init
      expect(mockedGetHtml).toHaveBeenCalledTimes(1);
    });
  });
});
