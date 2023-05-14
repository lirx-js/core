import { merge } from '../../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { reference } from '../../../observable/built-in/from/without-notifications/values/reference/reference';
import {
  debounceMicrotaskObservable,
} from '../../../observable/pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import { IObservable } from '../../../observable/type/observable.type';
import { createMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { IObserver } from '../../../observer/type/observer.type';
import { DEFAULT_SIGNAL_EQUAL_FUNCTION } from '../misc/equal-function/default-signal-equal-function.constant';
import { IEqualFunction } from '../misc/equal-function/equal-function.type';
import { ISignalOptions } from '../signal/signal-options.type';
import { ISignalToObservableOptions } from '../signal/signal-to-observable-options.type';
import { isSignalWritesAllowed } from './allow-signal-writes';
import { callOptionalRegisterSignalFunction } from './register-signal-function';

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
    callOptionalRegisterSignalFunction<GValue>(this);
    return this.#value;
  }

  set(
    value: GValue,
    force: boolean = false,
  ): void {
    if (isSignalWritesAllowed()) {
      if (
        force
        || !this.#equal(value, this.#value)
      ) {
        this.#value = value;
        this.#$value(value);
      }
    } else {
      throw new Error(`The signal cannot be updated in this context.`);
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

export type IGenericSuperSignal = SuperSignal<any>;
