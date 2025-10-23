/**
 * A generic listener function that receives a payload.
 * @template P The type of the payload.
 */
export type Listener<P = void> = (payload: P) => void;

/**
 * A map of event keys to their listener functions.
 */
type ListenerMap<T extends Record<string, any>> = {
  [K in keyof T]: Listener<T[K]>[];
};

/**
 * A simple, generic, and type-safe event emitter class.
 * @template T A map of event names to their payload types.
 */
export class Emitter<T extends Record<string, any>> {
  private dispatch: Partial<ListenerMap<T>> = {};

  /**
   * Registers a listener for a given event key.
   * Provides type-safe payloads to the listener.
   * @param key The event key to listen for.
   * @param fn The listener function to execute.
   * @returns The Emitter instance for chaining.
   */
  on<K extends keyof T>(key: K, fn: Listener<T[K]>): this {
    const listeners = this.dispatch[key] || [];
    listeners.push(fn);
    this.dispatch[key] = listeners;
    return this;
  }

  /**
   * Emits an event to all registered listeners for a given key.
   * Ensures the payload matches the type defined for the event key.
   * @param key The event key to emit.
   * @param payload The payload to pass to the listeners.
   */
  emit<K extends keyof T>(key: K, payload: T[K]): void {
    const listeners = this.dispatch[key];
    if (listeners && listeners.length > 0) {
      listeners.forEach(listener => listener(payload));
    }
  }
}
