import { signal } from '../signal';
import { isSignal } from './is-signal';

describe('is-signal', () => {
  it('is a signal', () => {
    const a = signal(1);
    expect(isSignal(a)).toBe(true);
  });

  it('is not a signal', () => {
    expect(isSignal(1)).toBe(false);
    expect(isSignal({})).toBe(false);
  });
});
