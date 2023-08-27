import { EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction, Callable, getCallableInstanceThis, Writable } from '@lirx/utils';
import { ISignalToObservableOptions } from '../../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { getSignalWriteMode } from '../../../internal/allow-signal-writes/allow-signal-writes-context.private';
import { signalGetCalled } from '../../../internal/register-signal/signal-get-called.private';
import { IPureSignal } from '../../signal.type';
import { ISignalOptions } from '../../types/signal-options.type';
import { IReadonlySignal } from '../../../readonly-signal/readonly-signal.type';
import { ISignalConstructor } from '../../types/signal-constructor.type';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { IObservable } from '../../../../../observable/type/observable.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { IMulticastSource } from '../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import {
  createMulticastSource,
} from '../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import {
  debounceMicrotaskObservable,
} from '../../../../../observable/pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import { merge } from '../../../../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { reference } from '../../../../../observable/built-in/from/without-notifications/values/reference/reference';
import { ISignalUpdateFunctionCallback } from '../../traits/update/signal.update.function-definition';
import { ISignalMutateFunctionCallback } from '../../traits/mutate/signal.mutate.function-definition';

export class PureSignal<GValue> implements IPureSignal<GValue> {
  #value: GValue;
  readonly #value$: IObservable<GValue>;
  readonly #$value: IObserver<GValue>;
  readonly #equal: IEqualFunction<GValue>;

  constructor(
    initialValue: GValue,
    {
      equal = EQUAL_FUNCTION_STRICT_EQUAL,
    }: ISignalOptions<GValue> = {},
  ) {
    this.#value = initialValue;
    const source: IMulticastSource<GValue> = createMulticastSource<GValue>();
    this.#value$ = source.subscribe;
    this.#$value = source.emit;
    this.#equal = equal;

  }

  get [SIGNAL](): unknown {
    return true;
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

  update(
    updateFunction: ISignalUpdateFunctionCallback<GValue>,
  ): void {
    return this.set(
      updateFunction(this.get()),
    );
  }

  mutate(
    mutateFunction: ISignalMutateFunctionCallback<GValue>,
  ): void {
    const value: GValue = this.get();
    mutateFunction(value as Writable<GValue>);
    this.set(value, true);
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

  asReadonly(): IReadonlySignal<GValue> {
    return getCallableInstanceThis(this) as IReadonlySignal<GValue>;
  }
}

export const Signal = Callable<typeof PureSignal, ISignalConstructor>(PureSignal, function(this: PureSignal<any>) {
  return this.get();
});


