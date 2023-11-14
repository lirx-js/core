import { signal } from '../implementations/function/signal.function';
import { isSignal } from './is-signal';

describe('is-signal', () => {
  test('basic test', () => {
    const a = signal(1);

    expect(isSignal(a)).toBe(true);
    // expect(isSignal(a.asReadonly())).toBe(false);
    expect(isSignal(1)).toBe(false);
    expect(isSignal({})).toBe(false);
  });
});
