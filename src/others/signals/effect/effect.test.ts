import { computed } from '../computed/computed';
import { signal } from '../signal/signal';
import { effect } from './effect';

describe('effect', () => {
  const sleep = (t: number) => {
    return new Promise(_ => setTimeout(_, t));
  };

  test('basic test', async () => {
    const a = signal(1);
    expect(a()).toBe(1);

    const b = signal(2);
    expect(b()).toBe(2);

    const c = computed(() => a() + b());
    expect(c()).toBe(3);

    let _c = c();

    effect(() => {
      expect(a() + b()).toBe(_c);
      expect(a() + b()).toBe(c());
    });

    await sleep(10);

    a.set(3);
    expect(c()).toBe(5);
    _c = 5;

    await sleep(10);


    b.set(1);
    expect(c()).toBe(4);
    _c = 4;

    await sleep(10);
  });

  test('writable signals', async () => {
    const counter = signal(0);
    expect(counter()).toBe(0);

    const isBig = signal(false);
    expect(isBig()).toBe(false);

    effect(() => {
      if (counter() > 5) {
        isBig.set(true);
      } else {
        isBig.set(false);
      }
    }, { signalWriteMode: 'allow' });

    counter.set(6);
    expect(counter()).toBe(6);
    await sleep(10);
    expect(isBig()).toBe(true);
  });

  test('effect loop', async () => {
    const counter = signal(0);
    expect(counter()).toBe(0);

    effect(() => {
      counter.set(counter() + 1);
    }, { signalWriteMode: 'allow' });

    await sleep(10);
    expect(counter()).toBe(1);

    await sleep(10);
    expect(counter()).toBe(1);
  });

  test('effect loop 2', async () => {
    const counter = signal(0);
    expect(counter()).toBe(0);

    effect(() => {
      if (counter() < 10) {
        counter.set(counter() + 1);
      }
    }, { signalWriteMode: 'queue' });

    await sleep(10);
    expect(counter()).toBe(10);
  });
});
