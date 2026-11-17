import { computed } from '../computed/computed';
import { SignalError } from '../internal/signal-error.class';
import { signal } from '../signal/signal';
import { IWatchCleanUpFunction } from './types/watch-clean-up-function.type';
import { watch } from './watch';

describe('watch', (): void => {
  const sleep = (t: number) => {
    return new Promise((_) => setTimeout(_, t));
  };

  describe('errors', (): void => {
    it('should prevent watch in computed', (): void => {
      let count: number = 0;
      const a = computed((): number => {
        count++;
        expect(() => watch(signal(2), () => {})).toThrow();
        return 2;
      });
      expect(a()).toBe(2);
      expect(count).toBe(1);
    });
  });

  describe('for writable signal', (): void => {
    it('should be called immediately', (): void => {
      let count: number = 0;
      const signalA = signal(1);
      expect(signalA()).toBe(1);

      watch(signalA, (): void => {
        count++;
        expect(signalA()).toBe(1);
      });
      expect(count).toBe(1);
    });

    it('should be called when a writable signal change', (): Promise<void> => {
      return new Promise<void>((resolve: () => void): void => {
        let setCount: number = 0;
        let effectCount: number = 0;
        let cleanUpCount: number = 0;

        const set = (value: number): void => {
          setCount++;
          signalAValue = value;
          signalA.set(value);
        };

        let signalAValue!: number;
        const signalA = signal(0);
        set(0);
        expect(signalA()).toBe(0);

        watch(signalA, (a: number | SignalError): IWatchCleanUpFunction | void => {
          effectCount++;
          expect(a).toBe(signalAValue);
          expect(signalA()).toBe(signalAValue);

          if (effectCount === 1) {
            expect(setCount).toBe(1);
            return (): void => {
              cleanUpCount++;
            };
          } else if (effectCount === 2) {
            expect(setCount).toBe(3);
            expect(cleanUpCount).toBe(1);
            resolve();
          }
        });

        expect(effectCount).toBe(1);
        set(2);
        set(3);
        expect(effectCount).toBe(1);
      });
    });

    it('should be unsubscribable', async (): Promise<void> => {
      let effectCount: number = 0;

      const signalA = signal(1);
      expect(signalA()).toBe(1);

      const unsubscribe = watch(signalA, (): void => {
        effectCount++;
        expect(signalA()).toBe(1);
        expect(effectCount).toBe(1);
      });

      unsubscribe();

      signalA.set(2);
      expect(signalA()).toBe(2);
      await sleep(10);
      expect(effectCount).toBe(1);
    });
  });

  describe('for computed signal', (): void => {
    it('should be called immediately', (): Promise<void> => {
      return new Promise<void>((resolve: () => void): void => {
        const a = signal(1);
        expect(a()).toBe(1);

        const b = computed(() => a() + 1);
        expect(b()).toBe(2);

        watch(b, (_b: number | SignalError): void => {
          expect(_b).toBe(2);
          resolve();
        });
      });
    });

    it('should be called when a computed signal change', (): Promise<void> => {
      return new Promise<void>((resolve: () => void): void => {
        let setCount: number = 0;
        let effectCount: number = 0;
        let cleanUpCount: number = 0;

        const set = (value: number): void => {
          setCount++;
          signalAValue = value;
          signalA.set(value);
        };

        let signalAValue!: number;
        const signalA = signal(0);
        const signalB = computed(() => signalA() + 1);

        set(0);
        expect(signalA()).toBe(0);
        expect(signalB()).toBe(1);

        watch(signalB, (b: number | SignalError): IWatchCleanUpFunction | void => {
          effectCount++;
          expect(b).toBe(signalAValue + 1);
          expect(signalA()).toBe(signalAValue);
          expect(signalB()).toBe(signalAValue + 1);

          if (effectCount === 1) {
            expect(setCount).toBe(1);
            return (): void => {
              cleanUpCount++;
            };
          } else if (effectCount === 2) {
            expect(setCount).toBe(3);
            expect(cleanUpCount).toBe(1);
            resolve();
          }
        });

        expect(effectCount).toBe(1);
        set(2);
        set(3);
        expect(effectCount).toBe(1);
      });
    });
  });

  it("should be called only once is computed value doesn't change", (): Promise<void> => {
    return new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
      const signalA = signal(1);
      expect(signalA()).toBe(1);

      const signalB = computed(() => signalA() > 0);
      expect(signalB()).toBe(true);

      let count: number = -1;

      watch(signalB, (b: boolean | SignalError): void => {
        count++;
        if (count === 0) {
          expect(b).toBe(true);
          expect(signalB()).toBe(true);
          queueMicrotask(() => {
            signalA.set(2);
          });
          setTimeout(() => {
            resolve();
          }, 200);
        } else if (count === 1) {
          reject('Should not be called again');
        }
      });
    });
  });

  it('should run just once if a signal returns to its initial value', () => {
    return new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
      let count: number = -1;

      const signalA = signal(1);
      expect(signalA()).toBe(1);

      watch(signalA, (a: number | SignalError) => {
        count++;
        if (count === 0) {
          expect(a).toBe(1);
          expect(signalA()).toBe(1);
          queueMicrotask(() => {
            signalA.set(2);
            signalA.set(1);

            setTimeout(() => {
              signalA.set(3);
            }, 10);
          });
        } else if (count === 1) {
          expect(a).toBe(3);
          expect(signalA()).toBe(3);
          resolve();
        }
      });
    });
  });
});
