import { propertyObserver } from './property-observer';

describe('propertyObserver', () => {
  globalThis.requestIdleCallback ??= (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => {
    return setTimeout(callback, 0);
  };

  const sleep = (t: number) => {
    return new Promise((_) => setTimeout(_, t));
  };

  describe.skip('Reflection', () => {
    describe('Reflect.get', () => {
      it('inexisting property', () => {
        const a = Reflect.get({}, 'a', {
          a: 2,
        });

        expect(a).toBe(undefined);

        const b = Reflect.get({}, 'a', {
          get a() {
            expect(true).toBe(false);
            return 2;
          },
        });

        expect(b).toBe(undefined);
      });

      it('base property', () => {
        const a = Reflect.get(
          {
            a: 1,
          },
          'a',
          {
            a: 2,
          },
        );

        expect(a).toBe(1);
      });

      it('inherited property', () => {
        const a = Reflect.get(
          Object.create({
            a: 1,
          }),
          'a',
          {
            a: 2,
          },
        );

        expect(a).toBe(1);
      });

      it('getter property', () => {
        const a = Reflect.get(
          {
            get a(): number {
              expect(this.a).toBe(2);
              return 1;
            },
          },
          'a',
          {
            a: 2,
          },
        );

        expect(a).toBe(1);
      });

      it('setter property', () => {
        const a = Reflect.get(
          {
            set a(value: number) {
              expect(true).toBe(false);
            },
          },
          'a',
          {
            a: 2,
          },
        );

        expect(a).toBe(undefined);
      });
    });

    describe('Reflect.set', () => {
      it('inexisting property', () => {
        const obj: any = {};
        const receiver: any = {
          a: 2,
        };

        Reflect.set(obj, 'a', 1, receiver);

        expect(obj.a).toBe(undefined);
        expect(receiver.a).toBe(1);
      });

      it('base property', () => {
        const obj: any = { a: 0 };
        const receiver: any = {
          a: 2,
        };

        Reflect.set(obj, 'a', 1, receiver);

        expect(obj.a).toBe(0);
        expect(receiver.a).toBe(1);
      });

      it('inherited property', () => {
        const proto = {
          a: 0,
        };

        const obj: any = Object.create(proto);

        Reflect.set(obj, 'a', 1);

        expect(proto.a).toBe(0);
        expect(obj.a).toBe(1);
      });

      it('inherited property with receiver', () => {
        const obj: any = Object.create({
          a: 0,
        });

        const receiver: any = {
          a: 2,
        };

        Reflect.set(obj, 'a', 1, receiver);

        expect(obj.a).toBe(0);
        expect(receiver.a).toBe(1);
      });

      it('getter property', () => {
        const obj: any = Object.create({
          get a(): number {
            return 0;
          },
        });

        const receiver: any = {
          a: 2,
        };

        Reflect.set(obj, 'a', 1, receiver);

        expect(obj.a).toBe(0);
        expect(receiver.a).toBe(2);
      });

      it('setter property', () => {
        const mockFn = jest.fn();

        const obj: any = Object.create({
          set a(value: number) {
            mockFn(value);
            expect((this as any).a).toBe(2);
            expect(value).toBe(1);
          },
        });

        const receiver: any = {
          a: 2,
        };

        Reflect.set(obj, 'a', 1, receiver);

        expect(mockFn).toHaveBeenCalledWith(1);
      });
    });
  });

  it('should prevent double observers', () => {
    const obj: any = {};

    const mockFn = jest.fn();

    propertyObserver(obj, 'a', mockFn);
    expect(() => propertyObserver(obj, 'a', mockFn)).toThrow();
  });

  it('should work with inexisting property', () => {
    const obj: any = {};
    expect(obj.a).toBe(undefined);

    const mockFn = jest.fn();

    propertyObserver(obj, 'a', mockFn);

    expect(mockFn).toHaveBeenCalledTimes(0);

    obj.a = 5;
    expect(mockFn).toHaveBeenCalledWith(undefined, 5);
    expect(obj.a).toBe(5);
    expect(Reflect.get(obj, 'a')).toBe(5);
    expect(Reflect.get(obj, 'a', { a: 1 })).toBe(5);

    obj.a = 1;
    expect(mockFn).toHaveBeenCalledWith(5, 1);
    expect(obj.a).toBe(1);

    Reflect.set(obj, 'a', 2);
    expect(mockFn).toHaveBeenCalledWith(1, 2);
    expect(obj.a).toBe(2);

    const receiver = { a: 10 };
    Reflect.set(obj, 'a', 3, receiver);
    expect(mockFn).toHaveBeenCalledWith(1, 2);
    expect(obj.a).toBe(2);
    expect(receiver.a).toBe(3);
  });

  it('should work with existing property', () => {
    const obj: any = { a: 5 };
    expect(obj.a).toBe(5);

    const mockFn = jest.fn();

    propertyObserver(obj, 'a', mockFn);

    expect(mockFn).toHaveBeenCalledWith(undefined, 5);

    obj.a = 1;
    expect(mockFn).toHaveBeenCalledWith(5, 1);
    expect(obj.a).toBe(1);
  });

  it('should work with a property inherited from a prototype', () => {
    const obj: any = Object.create({ a: 5 });
    expect(obj.a).toBe(5);

    const mockFn = jest.fn();

    propertyObserver(obj, 'a', mockFn);

    expect(mockFn).toHaveBeenCalledWith(undefined, 5);

    obj.a = 1;
    expect(mockFn).toHaveBeenCalledWith(5, 1);
    expect(obj.a).toBe(1);
  });

  it('should work with pure getter', async () => {
    const obj: any = {
      get a(): number {
        return this.a1;
      },
      a1: 0,
    };

    expect(obj.a).toBe(0);
    expect(obj.a1).toBe(0);

    const mockFn = jest.fn();

    propertyObserver(obj, 'a', mockFn);

    expect(mockFn).toHaveBeenCalledTimes(0);

    expect(() => (obj.a = 5)).toThrow();
    expect(mockFn).toHaveBeenCalledTimes(0);

    await sleep(20);
    expect(mockFn).toHaveBeenCalledWith(undefined, 0);

    obj.a1 = 1;
    await sleep(20);
    expect(mockFn).toHaveBeenCalledWith(0, 1);
    expect(obj.a).toBe(1);
    expect(obj.a1).toBe(1);

    Reflect.set(obj, 'a', 2);
    expect(obj.a).toBe(1);
    expect(obj.a1).toBe(1);
  });

  it.skip('should work with pure setter', () => {
    const obj: any = {
      set a(input: number) {
        this.a1 = input;
      },
      a1: undefined as number | undefined,
    };

    expect(obj.a).toBe(undefined);
    expect(obj.a1).toBe(undefined);

    const mockFn = jest.fn();

    propertyObserver(obj, 'a', mockFn);

    expect(mockFn).toHaveBeenCalledTimes(0);

    obj.a = 5;
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(obj.a1).toBe(5);

    obj.a = 1;
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(obj.a1).toBe(1);

    Reflect.set(obj, 'a', 2);
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(obj.a1).toBe(2);

    const receiver = { a: 10 };
    Reflect.set(obj, 'a', 3, receiver);
    expect(mockFn).toHaveBeenCalledTimes(0);
    expect(obj.a1).toBe(2);
    expect((receiver as any).a1).toBe(3);
  });
});
