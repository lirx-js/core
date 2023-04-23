import { merge } from '../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { reference } from '../../observable/built-in/from/without-notifications/values/reference/reference';
import {
  debounceMicrotaskObservable
} from '../../observable/pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import { IObservable, IUnsubscribeOfObservable } from '../../observable/type/observable.type';
import { createMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { IObserver } from '../../observer/type/observer.type';

// https://en.wikipedia.org/wiki/Reactive_programming
// RFC https://github.com/angular/angular/discussions/49685

/** SIGNAL **/

/* TYPES */

export interface IEqualFunction<GValue> {
  (
    a: GValue,
    b: GValue,
  ): boolean;
}

export const DEFAULT_SIGNAL_EQUAL_FUNCTION: IEqualFunction<unknown> = (
  a: unknown,
  b: unknown,
): boolean => {
  const typeA = typeof a;
  const typeB = typeof a;
  if (typeA === typeB) {
    if (typeA === 'object') {
      return (a === null) && (b === null);
    } else {
      return a === b;
    }
  } else {
    return false;
  }
};

export interface ISignalOptions<GValue> {
  equal?: IEqualFunction<GValue>;
}

export interface ISignalToObservableOptions {
  emitCurrentValue?: boolean;
}

/* GLOBAL CONTEXT USED BY A SIGNAL */

interface IRegisterSignal<GValue> {
  (
    signal: SuperSignal<GValue>,
  ): void;
}

type IRegisterSignalOrUndefined = IRegisterSignal<any> | undefined;

let REGISTER_SIGNAL: IRegisterSignalOrUndefined = void 0;
let ALLOW_SIGNAL_WRITES: boolean = false;
let IS_IN_EFFECT_CONTEXT: boolean = false;

/* INTERNAL SIGNAL CLASS */

export class SuperSignal<GValue> {
  #value: GValue;
  #value$: IObservable<GValue>;
  #$value: IObserver<GValue>;
  #equal: IEqualFunction<GValue>;

  constructor(
    initialValue: GValue,
    {
      equal = DEFAULT_SIGNAL_EQUAL_FUNCTION,
    }: ISignalOptions<GValue> = {},
  ) {
    this.#value = initialValue;
    const source: IMulticastSource<GValue> = createMulticastSource<GValue>();
    this.#value$ = source.subscribe;
    this.#$value = source.emit;
    this.#equal = equal;
  }

  get(): GValue {
    if (REGISTER_SIGNAL !== void 0) {
      REGISTER_SIGNAL(this);
    }
    return this.#value;
  }

  set(
    value: GValue,
    force: boolean = false,
  ): void {
    if (
      (REGISTER_SIGNAL === void 0)
      || ALLOW_SIGNAL_WRITES
    ) {
      if (
        force
        || !this.#equal(value, this.#value)
      ) {
        this.#value = value;
        this.#$value(value);
      }
    } else {
      throw new Error(`Values cannot be updated in an effect context`);
    }
  }

  toObservable(
    {
      emitCurrentValue = true,
    }: ISignalToObservableOptions = {},
  ): IObservable<GValue> {
    if (emitCurrentValue) {
      return merge([
        reference(() => this.#value),
        debounceMicrotaskObservable(this.#value$),
      ]);
    } else {
      return debounceMicrotaskObservable(this.#value$);
    }
  }
}

export type IGenericSuperSignal = SuperSignal<any>;

/* PUBLIC INTERFACE */

export interface ISignal<GValue> {
  (): GValue;

  toObservable(
    options?: ISignalToObservableOptions,
  ): IObservable<GValue>;
}

export type IGenericSignal = ISignal<any>;

export interface IWritableSignal<GValue> extends ISignal<GValue> {
  set(value: GValue): void;

  update(updateFn: (value: GValue) => GValue): void;

  mutate(mutatorFn: (value: GValue) => void): void;

  asReadonly(): ISignal<GValue>;
}

/* PUBLIC IMPLEMENTATION */

export function signal<GValue>(
  initialValue: GValue,
  options?: ISignalOptions<GValue>,
): IWritableSignal<GValue> {
  const _signal = new SuperSignal<GValue>(initialValue, options);

  const newSignal = (): GValue => {
    return _signal.get();
  };

  newSignal.toObservable = (
    options?: ISignalToObservableOptions,
  ): IObservable<GValue> => {
    return _signal.toObservable(options);
  };

  newSignal.set = (
    value: GValue,
    force?: boolean,
  ): void => {
    return _signal.set(value, force);
  };

  newSignal.update = (
    updateFn: (value: GValue) => GValue,
  ): void => {
    _signal.set(updateFn(_signal.get()));
  };

  newSignal.mutate = (
    mutatorFn: (value: GValue) => void,
  ): void => {
    const value: GValue = _signal.get();
    mutatorFn(value);
    _signal.set(value, true);
  };

  newSignal.asReadonly = (): ISignal<GValue> => {
    const newSignal = (): GValue => {
      return _signal.get();
    };

    newSignal.toObservable = (
      options?: ISignalToObservableOptions,
    ): IObservable<GValue> => {
      return _signal.toObservable(options);
    };

    return newSignal;
  };

  return newSignal;
}

/** CONTEXT **/

interface ISignalContextFunction {
  (): void;
}

export declare interface IRunSignalContextOptions {
  allowSignalWrites?: boolean;
}

function runSignalContext(
  signalContextFunction: ISignalContextFunction,
  {
    allowSignalWrites = false,
  }: ICreateEffectOptions = {},
): Set<IGenericSuperSignal> {
  const signals: Set<IGenericSuperSignal> = new Set<IGenericSuperSignal>();

  const parentRegisterSignal: IRegisterSignalOrUndefined = REGISTER_SIGNAL;
  const parentAllowSignalWrites: boolean = ALLOW_SIGNAL_WRITES;

  REGISTER_SIGNAL = (
    signal: IGenericSuperSignal,
  ): void => {
    signals.add(signal);
  };

  ALLOW_SIGNAL_WRITES = allowSignalWrites;

  try {
    signalContextFunction();
    return signals;
  } finally {
    REGISTER_SIGNAL = parentRegisterSignal;
    ALLOW_SIGNAL_WRITES = parentAllowSignalWrites;
  }
}

/** EFFECT **/

export type IOnCleanUpFunction = IObservable<void>;

export interface IEffetFunction {
  (
    onCleanUp: IOnCleanUpFunction,
  ): void;
}

export type ICreateEffectOptions = IRunSignalContextOptions;

export function effect(
  effectFunction: IEffetFunction,
  options?: ICreateEffectOptions,
): IUnsubscribeOfObservable {
  let unsubscribeOfSignals: IUnsubscribeOfObservable;
  let cleanUpSource: IMulticastSource<void>;

  const update = (): void => {
    if (cleanUpSource !== void 0) {
      cleanUpSource.emit();
    }
    cleanUpSource = createMulticastSource<void>();

    const signals: Set<IGenericSuperSignal> = runSignalContext(
      (): void => {
        if (IS_IN_EFFECT_CONTEXT) {
          throw new Error(`Already in an effect`);
        } else {
          IS_IN_EFFECT_CONTEXT = true;
          try {
            effectFunction(cleanUpSource.subscribe);
          } finally {
            IS_IN_EFFECT_CONTEXT = false;
          }
        }
      },
      options,
    );

    const signalsChange$: IObservable<any> = merge(
      Array.from(signals, (signal: IGenericSuperSignal): IObservable<any> => {
        return signal.toObservable({ emitCurrentValue: false });
      }),
    );

    unsubscribeOfSignals = debounceMicrotaskObservable(signalsChange$)((): void => {
      unsubscribeOfSignals();
      update();
    });
  };

  update();

  return (): void => {
    unsubscribeOfSignals();
  };
}

/** COMPUTED **/

export interface IComputedFunction<GValue> {
  (): GValue;
}

export function computed<GValue>(
  computedFunction: IComputedFunction<GValue>,
): ISignal<GValue> {
  const _signal = new SuperSignal<GValue>(void 0 as GValue);

  let unsubscribeOfSignals: IUnsubscribeOfObservable;
  let requiresUpdate: boolean = true;

  const update = (): void => {
    const signals: Set<IGenericSuperSignal> = runSignalContext(
      (): void => {
        _signal.set(computedFunction());
      },
      { allowSignalWrites: true },
    );

    const signalsChange$: IObservable<any> = merge(
      Array.from(signals, (signal: IGenericSuperSignal): IObservable<any> => {
        return signal.toObservable({ emitCurrentValue: false });
      }),
    );

    unsubscribeOfSignals = signalsChange$((): void => {
      unsubscribeOfSignals();
      update();
    });
  };

  const newSignal = (): GValue => {
    if (requiresUpdate) {
      requiresUpdate = false;
      update();
    }
    return _signal.get();
  };

  newSignal.toObservable = (
    {
      emitCurrentValue = true,
      ...options
    }: ISignalToObservableOptions = {},
  ): IObservable<GValue> => {
    if (emitCurrentValue && requiresUpdate) {
      requiresUpdate = false;
      update();
    }
    return _signal.toObservable({
      ...options,
      emitCurrentValue,
    });
  };

  return newSignal;
}

/** OBSERVABLE TO SIGNAL **/

export interface IToSignalOptionsWithInitialValue<GValue> {
  initialValue?: GValue;
  requireSync?: false;
}

export interface IToSignalOptionsWithRequireSync {
  requireSync: true;
}

export type IToSignalOptions<GValue> =
  | IToSignalOptionsWithInitialValue<GValue>
  | IToSignalOptionsWithRequireSync
  ;

export interface ISignalFromObservable<GValue> extends ISignal<GValue> {
  isDestroyed(): boolean;

  destroy: IUnsubscribeOfObservable;
}

export function toSignal<GValue>(
  value$: IObservable<GValue>,
  options: IToSignalOptions<GValue> = {},
): ISignalFromObservable<GValue> {
  const _signal = new SuperSignal<GValue>((options as IToSignalOptionsWithInitialValue<GValue>).initialValue as GValue);
  let isDestroyed: boolean = false;
  let awaitingValue: boolean = true;

  const throwIfDestroyed = (): void => {
    if (isDestroyed) {
      throw new Error(`Signal is destroyed`);
    }
  };

  const newSignal = (): GValue => {
    throwIfDestroyed();
    return _signal.get();
  };

  newSignal.toObservable = (
    options?: ISignalToObservableOptions,
  ): IObservable<GValue> => {
    throwIfDestroyed();
    return _signal.toObservable(options);
  };

  newSignal.isDestroyed = (): boolean => {
    return isDestroyed;
  };

  newSignal.destroy = (): void => {
    if (!isDestroyed) {
      isDestroyed = true;
      unsubscribe();
    }
  };

  const unsubscribe = value$((value: GValue): void => {
    if (awaitingValue) {
      awaitingValue = false;
    }
    _signal.set(value);
  });

  if (options.requireSync && awaitingValue) {
    unsubscribe();
    throw new Error(`Provided Observable is not sync`);
  }

  return newSignal;
}
