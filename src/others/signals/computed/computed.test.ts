import { signal } from '../signal/signal';
import { ISignal } from '../signal/signal.type';
import { computed } from './computed';

describe('computed', () => {
  test('basic test', () => {
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

  test('test glitch-free 1', () => {
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


  test('test glitch-free 2', () => {
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

  test('test glitch-free 3', () => {
    const seconds = signal(0);
    expect(seconds()).toBe(0);

    const t: ISignal<number> = computed<number>(() => seconds() > 0 ? (t() + 1) : 0);
    expect(t()).toBe(0);

    seconds.set(1);
    expect(t()).toBe(1);

    seconds.set(2);
    expect(t()).toBe(2);

    seconds.set(1);
    expect(t()).toBe(3);
  });

  test('test non writable', () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = computed(() => {
      expect(() =>  a.set(5)).toThrow();
      return a();
    });

    expect(b()).toBe(1);
  });

  test('test recursive', () => {
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

});
