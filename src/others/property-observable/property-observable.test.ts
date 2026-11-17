import { propertyObservable } from './property-observable';

describe('propertyObservable', () => {
  globalThis.requestIdleCallback ??= (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => {
    return setTimeout(callback, 0);
  };

  const sleep = (t: number) => {
    return new Promise((_) => setTimeout(_, t));
  };

  it.todo('test with basic property');

  it.todo('test with getter property');

  it('allow multiple observables', () => {
    const obj: any = { a: 1 };

    const mockFn0 = jest.fn();
    const mockFn1 = jest.fn();

    const a0$ = propertyObservable(obj, 'a');
    const a1$ = propertyObservable(obj, 'a');

    const unsub0 = a0$(mockFn0);
    const unsub1 = a1$(mockFn1);

    expect(mockFn0).toHaveBeenCalledWith(1);
    expect(mockFn1).toHaveBeenCalledWith(1);

    obj.a = 2;
    expect(mockFn0).toHaveBeenCalledWith(2);
    expect(mockFn1).toHaveBeenCalledWith(2);

    unsub0();
    unsub1();
    obj.a = 3;
    expect(mockFn0).toHaveBeenCalledTimes(2);
    expect(mockFn1).toHaveBeenCalledTimes(2);
  });

  it('allow multiple observers', () => {
    const obj: any = { a: 1 };

    const mockFn0 = jest.fn();
    const mockFn1 = jest.fn();

    const a$ = propertyObservable(obj, 'a');

    const unsub0 = a$(mockFn0);
    const unsub1 = a$(mockFn1);

    expect(mockFn0).toHaveBeenCalledWith(1);
    expect(mockFn1).toHaveBeenCalledWith(1);

    obj.a = 2;
    expect(mockFn0).toHaveBeenCalledWith(2);
    expect(mockFn1).toHaveBeenCalledWith(2);

    unsub0();
    unsub1();
    obj.a = 3;
    expect(mockFn0).toHaveBeenCalledTimes(2);
    expect(mockFn1).toHaveBeenCalledTimes(2);
  });
});
