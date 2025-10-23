import PageWatcher from './index';
import { fetchEndpoint } from './core/fetcher';
import { areScriptsChanged } from './core/comparer';

// Mock the fetcher module
jest.mock('./core/fetcher');

// Tell Jest to use fake timers
jest.useFakeTimers();

// Type assertion for the mocked function
const mockedFetchEndpoint = fetchEndpoint as jest.Mock;

// Mock the comparer module to control its behavior in tests
jest.mock('./core/comparer', () => ({
  areScriptsChanged: jest.fn(),
}));

// Type assertion for the mocked function
const mockedAreScriptsChanged = areScriptsChanged as jest.Mock;

describe('PageWatcher', () => {
  const initialHtml = '<html><script src="a.js"></script></html>';
  const updatedHtml = '<html><script src="a.js"></script><script src="b.js"></script></html>';

  let consoleErrorSpy: jest.SpyInstance;

  // Clear all mocks and timers before each test
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    // Spy on console.error and suppress its output during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Explicitly reset and set default for fetchEndpoint for each test
    mockedFetchEndpoint.mockReset();
    mockedFetchEndpoint.mockResolvedValue(initialHtml); // Default resolved value

    // Explicitly reset and set default for comparer for each test
    mockedAreScriptsChanged.mockReset();
    mockedAreScriptsChanged.mockImplementation(() => false); // Default return value
  });

  // Restore original console.error after each test
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('create', () => {
    it('should create and initialize a watcher successfully', async () => {
      mockedFetchEndpoint.mockResolvedValueOnce(initialHtml); // Override default for this specific call

      const watcher = await PageWatcher.create();
      expect(watcher).toBeInstanceOf(PageWatcher);
      expect(mockedFetchEndpoint).toHaveBeenCalledTimes(1);
      expect(mockedAreScriptsChanged).toHaveBeenCalledTimes(0); // Not called during init
      expect(consoleErrorSpy).not.toHaveBeenCalled(); // No error expected
    });

    it('should throw an error if initialization fails', async () => {
      const initError = new Error('Network Failed');
      mockedFetchEndpoint.mockRejectedValueOnce(initError); // Override default for this specific call

      await expect(PageWatcher.create()).rejects.toThrow('Network Failed');
      expect(mockedFetchEndpoint).toHaveBeenCalledTimes(1);
      expect(mockedAreScriptsChanged).toHaveBeenCalledTimes(0); // Not called during init
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1); // Error expected
      expect(consoleErrorSpy).toHaveBeenCalledWith('Page Watchdog initialization failed:', initError);
    });
  });

  describe('polling and events', () => {
    it('should emit `unchanged` if scripts have not changed', async () => {
      mockedFetchEndpoint.mockResolvedValueOnce(initialHtml); // For init
      mockedFetchEndpoint.mockResolvedValueOnce(initialHtml); // For poll
      mockedAreScriptsChanged.mockReturnValue(false); // Mock comparer to return false for poll

      const watcher = await PageWatcher.create({ timer: 5000 });

      const unchangedListener = jest.fn();
      watcher.on('unchanged', unchangedListener);

      // Advance time to trigger the first poll
      jest.advanceTimersByTime(5000);

      // The promise from checkForUpdates needs to resolve
      await Promise.resolve();

      expect(mockedFetchEndpoint).toHaveBeenCalledTimes(2); // 1 for init, 1 for poll
      expect(mockedAreScriptsChanged).toHaveBeenCalledTimes(1); // Only called once during poll
      expect(unchangedListener).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled(); // No error expected
    });

    it('should emit `changed` if scripts have changed', async () => {
      // Initial state
      mockedFetchEndpoint.mockResolvedValueOnce(initialHtml); // For init
      // areScriptsChanged is not called during init
      const watcher = await PageWatcher.create({ timer: 5000 });

      const changedListener = jest.fn();
      watcher.on('changed', changedListener);

      // Set up the next poll to return different HTML and comparer to return true
      mockedFetchEndpoint.mockResolvedValueOnce(updatedHtml);
      mockedAreScriptsChanged.mockReturnValueOnce(true); // For poll

      jest.advanceTimersByTime(5000);
      await Promise.resolve(); // Wait for async operations in checkForUpdates

      expect(mockedFetchEndpoint).toHaveBeenCalledTimes(2);
      expect(mockedAreScriptsChanged).toHaveBeenCalledTimes(1); // Only called once during poll
      expect(changedListener).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).not.toHaveBeenCalled(); // No error expected
    });

    it('should emit `error` if polling fails', async () => {
      mockedFetchEndpoint.mockResolvedValueOnce(initialHtml); // For init
      const pollError = new Error('Server Down');
      mockedFetchEndpoint.mockRejectedValueOnce(pollError); // For poll

      const watcher = await PageWatcher.create({ timer: 5000 });

      const errorListener = jest.fn();
      watcher.on('error', errorListener);

      jest.advanceTimersByTime(5000);
      await Promise.resolve();

      expect(mockedFetchEndpoint).toHaveBeenCalledTimes(2);
      expect(mockedAreScriptsChanged).toHaveBeenCalledTimes(0); // Correct: Not called if fetch fails before it
      expect(errorListener).toHaveBeenCalledTimes(1);
      expect(errorListener).toHaveBeenCalledWith(pollError);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1); // Error expected
      expect(consoleErrorSpy).toHaveBeenCalledWith('Page Watchdog failed to check for updates:', pollError);
    });
  });

  describe('stop', () => {
    it('should stop polling after stop() is called', async () => {
      mockedFetchEndpoint.mockResolvedValueOnce(initialHtml); // For init
      const watcher = await PageWatcher.create({ timer: 5000 });

      const unchangedListener = jest.fn();
      watcher.on('unchanged', unchangedListener);

      watcher.stop();

      // Advance time well beyond the interval
      jest.advanceTimersByTime(10000);

      // The listener should not have been called because polling was stopped
      expect(unchangedListener).not.toHaveBeenCalled();
      expect(mockedFetchEndpoint).toHaveBeenCalledTimes(1);
      expect(mockedAreScriptsChanged).toHaveBeenCalledTimes(0); // Not called at all if polling stopped before first check
      expect(consoleErrorSpy).not.toHaveBeenCalled(); // No error expected
    });
  });
});
