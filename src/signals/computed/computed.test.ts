import { IReadonlySignal } from '../readonly-signal/readonly-signal.type';
import { signal } from '../signal/implementations/function/signal.function';
import { computed } from './implementations/function/computed.function';

describe('computed', () => {
  it('should return correct updated value', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = signal(2);
    expect(b()).toBe(2);

    const c = computed(() => a() + b());
    expect(c()).toBe(3);

    a.set(3);
    expect(c()).toBe(5);

    b.set(1);
    expect(c()).toBe(4);
  });

  it('should be able to be nested', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = computed(() => a() + 1);
    expect(b()).toBe(2);

    const c = computed(() => b() + 1);
    expect(c()).toBe(3);

    a.set(3);
    expect(b()).toBe(4);
    expect(c()).toBe(5);
  });

  it('should handle interdependent signals - greater than', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = computed(() => a() + 1);
    expect(b()).toBe(2);

    const c = computed(() => b() > a());
    expect(c()).toBe(true);

    a.set(2);
    expect(c()).toBe(true);
    expect(b()).toBe(3);
  });

  it('should handle interdependent signals - odd and even', async () => {
    const counter = signal(0);
    expect(counter()).toBe(0);

    const isEven = computed(() => counter() % 2 === 0);
    expect(isEven()).toBe(true);

    const message = computed(() => `${counter()} is ${isEven() ? 'even' : 'odd'}`);
    expect(message()).toBe('0 is even');

    counter.set(1);
    expect(message()).toBe('1 is odd');

    counter.set(2);
    expect(message()).toBe('2 is even');
  });

  it('should throw if self referenced (loop)', () => {
    const seconds = signal(0);
    expect(seconds()).toBe(0);

    const t: IReadonlySignal<number> = computed<number>(() => seconds() > 0 ? (t() + 1) : 0);
    expect(t()).toBe(0);

    seconds.set(1);
    expect(() => t()).toThrow();
  });

  it('may read and write the same signal in the computed function', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = computed(() => {
      a.set(10);
      return a() + 1;
    });
    expect(b()).toBe(11);

    a.set(5);
    expect(b()).toBe(11);
  });

  it('should accept on-the-fly nested computed signal', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = computed(() => {
      return computed(() => a())();
    });

    expect(b()).toBe(1);

    a.set(2);
    expect(a()).toBe(2);
    expect(b()).toBe(2);
  });

  //   // const mockFn = jest.fn();
  //   //
  //   // message.toObservable({
  //   //   emitCurrentValue: true,
  //   //   debounce: true,
  //   // })(mockFn);
  //   //
  //   // counter.set(1);
  //   // counter.set(2);
  //   // counter.set(1);
  //   // counter.set(2);
  //   // expect(message()).toBe('2 is even');
  //   // await Promise.resolve();
  //   // expect(mockFn).toHaveBeenCalledTimes(1);
  //   // expect(mockFn).toHaveBeenCalledWith('2 is even');
});
