import { Emitter, Listener } from './emitter';

describe('Emitter', () => {
  // Define a type for our test events
  type TestEvents = {
    'eventA': string;
    'eventB': number;
    'eventC': { id: number; name: string };
    'noPayload': void;
  };

  let emitter: Emitter<TestEvents>;

  beforeEach(() => {
    emitter = new Emitter<TestEvents>();
  });

  it('should register and emit a simple event with payload', () => {
    const listener = jest.fn();
    emitter.on('eventA', listener);
    emitter.emit('eventA', 'test-payload');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('test-payload');
  });

  it('should register and emit an event with a number payload', () => {
    const listener = jest.fn();
    emitter.on('eventB', listener);
    emitter.emit('eventB', 123);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(123);
  });

  it('should register and emit an event with an object payload', () => {
    const listener = jest.fn();
    const payload = { id: 1, name: 'test' };
    emitter.on('eventC', listener);
    emitter.emit('eventC', payload);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(payload);
  });

  it('should register and emit an event with no payload', () => {
    const listener = jest.fn();
    emitter.on('noPayload', listener);
    emitter.emit('noPayload', undefined);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(undefined);
  });

  it('should call multiple listeners for the same event', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();
    emitter.on('eventA', listener1);
    emitter.on('eventA', listener2);
    emitter.emit('eventA', 'multiple');
    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener1).toHaveBeenCalledWith('multiple');
    expect(listener2).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledWith('multiple');
  });

  it('should not call listeners for other events', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    emitter.on('eventA', listenerA);
    emitter.on('eventB', listenerB);
    emitter.emit('eventA', 'only-A');
    expect(listenerA).toHaveBeenCalledTimes(1);
    expect(listenerA).toHaveBeenCalledWith('only-A');
    expect(listenerB).not.toHaveBeenCalled();
  });

  it('should handle emitting an event with no registered listeners gracefully', () => {
    expect(() => emitter.emit('eventA', 'no-listeners')).not.toThrow();
  });
});
