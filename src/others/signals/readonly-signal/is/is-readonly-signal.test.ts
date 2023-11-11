import { signal } from '../../signal/implementations/function/signal.function';
import { isReadonlySignal } from './is-readonly-signal';

describe('is-readonly-signal', () => {
  test('basic test', () => {
    const a = signal(1);

    expect(isReadonlySignal(a)).toBe(true);
    expect(isReadonlySignal(1)).toBe(false);
    expect(isReadonlySignal({})).toBe(false);
  });
});
