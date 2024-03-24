import { signal } from '../signal/signal';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { computed } from './computed';

describe('computed', () => {
  describe('base', () => {
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

    it('should support concurrent updates', () => {
      const a = signal(1);
      expect(a()).toBe(1);

      const b = computed(() => a() + a());
      expect(b()).toBe(2);

      a.set(2);
      expect(b()).toBe(4);
    });

    it('should support errors', () => {
      const a = signal(1);
      expect(a()).toBe(1);

      const b = computed(() => {
        if (a() > 1) {
          throw new Error();
        } else {
          return a();
        }
      });
      expect(b()).toBe(1);

      a.set(2);
      expect(() => b()).toThrow();

      a.set(0);
      expect(b()).toBe(0);
    });
  });

  describe('errors', (): void => {
    it('should throw if self referenced (loop)', () => {
      const seconds = signal(0);
      expect(seconds()).toBe(0);

      const t: IReadonlySignal<number> = computed<number>(() => (seconds() > 0 ? t() + 1 : 0));
      expect(t()).toBe(0);

      seconds.set(1);
      expect(() => t()).toThrow();
    });

    it('should throw if a write is done in the computed function', () => {
      const a = signal(1);
      expect(a()).toBe(1);

      const b = computed(() => {
        a.set(10);
        return a() + 1;
      });
      expect(() => b()).toThrow();
    });

    // it('should throw if a signal is created in the computed function', () => {
    //   const a = signal(1);
    //   expect(a()).toBe(1);
    //
    //   const b = computed(() => {
    //     return signal(4)();
    //   });
    //
    //   expect(() => b()).toThrow();
    //
    //   const c = computed(() => {
    //     return computed(() => a())();
    //   });
    //
    //   expect(() => c()).toThrow();
    // });
  });

  describe('interdependent signals', () => {
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
  });

  describe('on-the-fly signals', () => {
    it('should handle interdependent signals - greater than', () => {
      let count1: number = 0;
      let count2: number = 0;

      const a = signal(1);
      expect(a()).toBe(1);

      const b = computed((): boolean => {
        count1++;
        return computed((): boolean => {
          count2++;
          return a() > 10;
        })();
      });
      expect(count1).toBe(0);
      expect(count2).toBe(0);
      expect(b()).toBe(false);
      expect(count1).toBe(1);
      expect(count2).toBe(1);

      a.set(2);
      a.set(3);
      expect(b()).toBe(false);
      expect(count1).toBe(1);
      expect(count2).toBe(2);

      a.set(20);
      expect(b()).toBe(true);
      expect(count1).toBe(2);
      expect(count2).toBe(4);
    });
  });

  describe('optimizations', (): void => {
    it('should run just once when multiple signals changed in the computed function', () => {
      let count: number = 0;

      const a = signal(1);
      expect(a()).toBe(1);

      const b = signal(2);
      expect(b()).toBe(2);

      const c = computed(() => {
        count++;
        return a() + b();
      });
      expect(count).toBe(0);
      expect(c()).toBe(3);
      expect(count).toBe(1);

      a.set(3);
      b.set(1);
      expect(c()).toBe(4);
      expect(count).toBe(2);
    });

    it('should run just once when multiple interdependent signals changed in the computed function', () => {
      let count: number = 0;

      const counter = signal(0);

      const isEven = computed(() => counter() % 2 === 0);

      const message = computed(() => {
        count++;
        return `${counter()} is ${isEven() ? 'even' : 'odd'}`;
      });

      expect(count).toBe(0);
      expect(message()).toBe('0 is even');
      expect(count).toBe(1);

      counter.set(1);
      expect(message()).toBe('1 is odd');
      expect(count).toBe(2);

      counter.set(2);
      expect(message()).toBe('2 is even');
      expect(count).toBe(3);
    });

    it('should run just once when having nested computed signals', () => {
      let count: number = 0;

      const a = signal(1);
      expect(a()).toBe(1);

      const b = computed(() => a() > 10);
      expect(b()).toBe(false);

      const c = computed(() => {
        count++;
        return b();
      });
      expect(count).toBe(0);
      expect(c()).toBe(false);
      expect(count).toBe(1);

      a.set(3);
      a.set(4);
      expect(c()).toBe(false);
      expect(count).toBe(1);

      a.set(20);
      expect(c()).toBe(true);
      expect(count).toBe(2);
    });
  });
});
