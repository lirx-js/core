import { EQUAL_FUNCTION_NON_PRIMITIVES_ALWAYS_FALSE, IEqualFunction } from '@lirx/utils';
import { merge } from '../../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { reference } from '../../../observable/built-in/from/without-notifications/values/reference/reference';
import {
  debounceMicrotaskObservable,
} from '../../../observable/pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import { IObservable } from '../../../observable/type/observable.type';
import { createMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { IObserver } from '../../../observer/type/observer.type';
import { ISignalOptions } from '../signal/signal-options.type';
import { ISignalToObservableOptions } from '../signal/signal-to-observable-options.type';
import { getSignalWriteMode } from './allow-signal-writes/allow-signal-writes-context';
import { signalGetCalled } from './register-signal/signal-get-called';

/* INTERNAL SIGNAL CLASS */

export class SignalClass<GValue> {
  #value: GValue;
  readonly #value$: IObservable<GValue>;
  readonly #$value: IObserver<GValue>;
  readonly #equal: IEqualFunction<GValue>;

  constructor(
    initialValue: GValue,
    {
      equal = EQUAL_FUNCTION_NON_PRIMITIVES_ALWAYS_FALSE,
    }: ISignalOptions<GValue> = {},
  ) {
    this.#value = initialValue;
    const source: IMulticastSource<GValue> = createMulticastSource<GValue>();
    this.#value$ = source.subscribe;
    this.#$value = source.emit;
    this.#equal = equal;
  }

  get(): GValue {
    signalGetCalled(this);
    return this.#value;
  }

  set(
    value: GValue,
    force: boolean = false,
  ): void {
    switch (getSignalWriteMode()) {
      case 'allow':
        if (
          force
          || !this.#equal(value, this.#value)
        ) {
          this.#value = value;
          this.#$value(value);
        }
        break;
      case 'forbid':
        throw new Error(`The signal cannot be updated in this context.`);
      case 'queue':
        queueMicrotask(() => this.set(value, force));
        break;
    }
  }

  toObservable(
    {
      emitCurrentValue = true,
      debounce = true,
    }: ISignalToObservableOptions = {},
  ): IObservable<GValue> {
    const value$: IObservable<GValue> = debounce
      ? debounceMicrotaskObservable(this.#value$)
      : this.#value$;

    if (emitCurrentValue) {
      return merge([
        reference(() => this.#value),
        value$,
      ]);
    } else {
      return value$;
    }
  }
}

export type IGenericSignalClass = SignalClass<any>;
