import { computed } from '../computed/computed';
import { signal } from '../signal/signal';
import { effect } from './effect';
import { IOnCleanUpFunction } from './types/effet-function.type';

describe('effect', (): void => {
  const sleep = (t: number) => {
    return new Promise((_) => setTimeout(_, t));
  };

  describe('errors', (): void => {
    it('should prevent nested effects', (): void => {
      let count: number = 0;
      effect((): void => {
        count++;
        expect(() => effect(() => {})).toThrow();
      });
      expect(count).toBe(1);
    });

    it('should prevent effects in computed', (): void => {
      let count: number = 0;
      const a = computed((): number => {
        count++;
        expect(() => effect(() => {})).toThrow();
        return 2;
      });
      expect(a()).toBe(2);
      expect(count).toBe(1);
    });
  });

  describe('for writable signal', (): void => {
    it('should be called immediately', (): void => {
      let count: number = 0;
      const a = signal(1);
      expect(a()).toBe(1);

      effect((): void => {
        count++;
        expect(a()).toBe(1);
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
          _a = value;
          a.set(value);
        };

        const get = (): void => {
          expect(a()).toBe(_a);
        };

        let _a: number;
        const a = signal(0);
        set(0);
        get();

        effect((onCleanUp: IOnCleanUpFunction): void => {
          effectCount++;
          get();

          if (effectCount === 1) {
            expect(setCount).toBe(1);
            onCleanUp((): void => {
              cleanUpCount++;
            });
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

      const a = signal(1);
      expect(a()).toBe(1);

      const unsubscribe = effect((): void => {
        effectCount++;
        expect(a()).toBe(1);
        expect(effectCount).toBe(1);
      });

      unsubscribe();

      a.set(2);
      expect(a()).toBe(2);
      await sleep(10);
      expect(effectCount).toBe(1);
    });
  });

  // describe('for computed signal', (): void => {
  //   it('should be called immediately', (): Promise<void> => {
  //     return new Promise<void>((resolve: () => void): void => {
  //       const a = signal(1);
  //       expect(a()).toBe(1);
  //
  //       const b = computed(() => a() + 1);
  //       expect(b()).toBe(2);
  //
  //       effect((): void => {
  //         expect(b()).toBe(2);
  //         resolve();
  //       });
  //     });
  //   });
  //
  //   it('should be called when a computed signal change', (): Promise<void> => {
  //     return new Promise<void>((resolve: () => void): void => {
  //       let setCount: number = 0;
  //       let effectCount: number = 0;
  //       let cleanUpCount: number = 0;
  //
  //       const set = (value: number): void => {
  //         setCount++;
  //         _a = value;
  //         a.set(value);
  //       };
  //
  //       const get = (): void => {
  //         // expect(a()).toBe(_a);
  //         expect(b()).toBe(_a + 1);
  //       };
  //
  //       let _a: number;
  //       const a = signal(0);
  //       const b = computed(() => a() + 1);
  //
  //       set(0);
  //       get();
  //
  //       effect((onCleanUp: IOnCleanUpFunction): void => {
  //         effectCount++;
  //         get();
  //
  //         if (effectCount === 1) {
  //           expect(setCount).toBe(1);
  //           onCleanUp((): void => {
  //             cleanUpCount++;
  //           });
  //         } else if (effectCount === 2) {
  //           expect(setCount).toBe(3);
  //           expect(cleanUpCount).toBe(1);
  //           resolve();
  //         }
  //       });
  //
  //       expect(effectCount).toBe(1);
  //       set(2);
  //       set(3);
  //       expect(effectCount).toBe(1);
  //     });
  //   });
  // });
  //
  // it('should accept a mix of writable and computed signals', async () => {
  //   const a = signal(1);
  //   expect(a()).toBe(1);
  //
  //   const b = signal(2);
  //   expect(b()).toBe(2);
  //
  //   const c = computed(() => a() + b());
  //   expect(c()).toBe(3);
  //
  //   let _c = c();
  //
  //   effect((): void => {
  //     expect(a() + b()).toBe(_c);
  //     expect(a() + b()).toBe(c());
  //   });
  //
  //   await sleep(10);
  //
  //   a.set(3);
  //   expect(c()).toBe(5);
  //   _c = 5;
  //
  //   await sleep(10);
  //
  //   b.set(1);
  //   expect(c()).toBe(4);
  //   _c = 4;
  //
  //   await sleep(10);
  // });
  //
  // it("should be called only once is computed value doesn't change", (): Promise<void> => {
  //   return new Promise<void>((resolve: () => void, reject: (reason: any) => void): void => {
  //     const a = signal(1);
  //     expect(a()).toBe(1);
  //
  //     const b = computed(() => a() > 0);
  //     expect(b()).toBe(true);
  //
  //     let count: number = -1;
  //
  //     effect((): void => {
  //       count++;
  //       if (count === 0) {
  //         expect(b()).toBe(true);
  //         queueMicrotask(() => {
  //           a.set(2);
  //         });
  //         setTimeout(() => {
  //           resolve();
  //         }, 200);
  //       } else if (count === 1) {
  //         expect(b()).toBe(true);
  //         reject('Should not be called again');
  //       }
  //     });
  //   });
  // });
});
