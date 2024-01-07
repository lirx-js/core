import { signal } from './implementations/function/signal.function';
import { thrownSignal } from './implementations/function/thrown-signal.function';

describe('signal', () => {
  it('should have correct value', () => {
    const a = signal(1);
    expect(a()).toBe(1);
  });

  it('should be errored', () => {
    const error = new Error('Custom error');
    const a = thrownSignal(error);
    expect(() => a()).toThrow(error);
  });
});
