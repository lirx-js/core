import { isSignal } from '../../signal/is/is-signal';
import { propertySignal } from './property-signal';

describe('propertySignal', () => {
  globalThis.requestIdleCallback ??= (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => {
    return setTimeout(callback, 0);
  };

  globalThis.cancelIdleCallback ??= (handle: number) => {
    return clearTimeout(handle as any);
  };

  const sleep = (t: number) => {
    return new Promise((_) => setTimeout(_, t));
  };

  it('should be a signal', () => {
    const obj: any = { a: 1 };

    const a = propertySignal(obj, 'a');

    expect(a()).toBe(1);
    expect(isSignal(a)).toBe(true);
  });

  it('should work with simple property', async () => {
    const obj: any = { a: 1 };

    const a = propertySignal(obj, 'a');

    expect(a()).toBe(1);

    obj.a = 2;
    await sleep(20);
    expect(a()).toBe(2);

    a.set(3);
    expect(obj.a).toBe(3);
    expect(a()).toBe(3);
  });

  it('should work with getter property', async () => {
    const obj: any = {
      get a(): number {
        return this.a1;
      },
      a1: 0,
    };

    const a = propertySignal(obj, 'a');

    expect(a()).toBe(0);

    obj.a1 = 2;
    await sleep(20);
    expect(a()).toBe(2);

    expect(() => a.set(3)).toThrow();
  });
});
