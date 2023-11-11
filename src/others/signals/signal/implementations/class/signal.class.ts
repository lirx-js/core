import { EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction, Callable } from '@lirx/utils';
import {
  ISignalToObservableOptions,
  ISignalToValueObservableOptions,
  ISignalToNotificationsObservableOptions, DEFAULT_SIGNAL_TO_VALUE_OBSERVABLE_ON_ERROR_FUNCTION,
} from '../../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { getSignalWriteMode } from '../../../internal/allow-signal-writes/allow-signal-writes-context.private';
import { signalGetCalled } from '../../../internal/register-signal/signal-get-called.private';
import { IPureSignal } from '../../signal.type';
import { ISignalOptions } from '../../types/signal-options.type';
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
import { createNextNotification } from '../../../../../misc/notifications/built-in/next/create-next-notification';
import { createErrorNotification } from '../../../../../misc/notifications/built-in/error/create-error-notification';
import { ISignalNotifications } from '../../types/signal-notifications.type';
import { SignalContextError } from '../../../error/signal-context-error.class';
import { SignalThrow } from '../../../error/signal-throw.class';
import { mapObservable } from '../../../../../observable/pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import {
  mapFilterObservable,
} from '../../../../../observable/pipes/built-in/without-notifications/observer-pipe-related/map-filter/map-filter-observable';
import { IMapFilterMapFunctionReturn } from '../../../../../observer/pipes/built-in/map-filter/map-filter-map-function.type';

export class PureSignal<GValue> implements IPureSignal<GValue> {

  static throw<GValue>(
    error: any,
  ): PureSignal<GValue> {
    return new PureSignal<GValue>(new SignalThrow(error));
  }

  #value: ISignalNotifications<GValue>;
  readonly #value$: IObservable<ISignalNotifications<GValue>>;
  readonly #$value: IObserver<ISignalNotifications<GValue>>;
  readonly #equal: IEqualFunction<GValue>;

  constructor(
    initialValue: GValue | SignalThrow,
    {
      equal = EQUAL_FUNCTION_STRICT_EQUAL,
    }: ISignalOptions<GValue> = {},
  ) {
    this.#value = (initialValue instanceof SignalThrow)
      ? createErrorNotification(initialValue)
      : createNextNotification(initialValue);

    const valueSource: IMulticastSource<ISignalNotifications<GValue>> = createMulticastSource<ISignalNotifications<GValue>>();
    this.#value$ = valueSource.subscribe;
    this.#$value = valueSource.emit;
    this.#equal = equal;
  }

  get [SIGNAL](): unknown {
    return true;
  }

  #setValue(
    value: ISignalNotifications<GValue>,
  ): void {
    this.#value = value;
    this.#$value(value);
  }

  get(): GValue {
    signalGetCalled(this);
    if (this.#value.name === 'next') {
      return this.#value.value;
    } else {
      throw this.#value.value;
    }
  }

  set(
    value: GValue,
    force: boolean = false,
  ): void {
    switch (getSignalWriteMode()) {
      case 'allow':
        if (
          force
          || (this.#value.name === 'error')
          || !this.#equal(value, this.#value.value)
        ) {
          this.#setValue(createNextNotification(value));
        }
        break;
      case 'forbid':
        throw new SignalContextError(`The signal cannot be updated in this context.`);
      case 'queue':
        queueMicrotask((): void => this.set(value, force));
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

  mutate<GMutableValue extends GValue>(
    mutateFunction: ISignalMutateFunctionCallback<GMutableValue>,
  ): void {
    const value: GValue = this.get();
    mutateFunction(value as GMutableValue);
    this.set(value, true);
  }

  throw(
    error: any,
  ): void {
    switch (getSignalWriteMode()) {
      case 'allow':
        this.#setValue(createErrorNotification(error));
        break;
      case 'forbid':
        throw new SignalContextError(`The signal cannot be updated in this context.`);
      case 'queue':
        queueMicrotask((): void => this.throw(error));
        break;
    }
  }

  toObservable(
    options?: ISignalToValueObservableOptions<GValue>,
  ): IObservable<GValue>;
  toObservable(
    options: ISignalToNotificationsObservableOptions,
  ): IObservable<ISignalNotifications<GValue>>;
  toObservable(
    {
      emitCurrentValue = true,
      debounce = true,
      mode = 'value',
      // @ts-ignore
      onError = DEFAULT_SIGNAL_TO_VALUE_OBSERVABLE_ON_ERROR_FUNCTION,
    }: ISignalToObservableOptions<GValue> = {},
  ): IObservable<GValue> | IObservable<ISignalNotifications<GValue>> {
    if (mode === 'notification') {
      const value$: IObservable<ISignalNotifications<GValue>> = debounce
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
    } else {
      // return mapObservable(
      //   this.toObservable({
      //     emitCurrentValue,
      //     debounce,
      //     mode: 'notification',
      //   }),
      //   (notification: ISignalNotifications<GValue>): GValue => {
      //     if (notification.name === 'next') {
      //       return notification.value;
      //     } else {
      //       throw notification.value;
      //     }
      //   },
      // );

      return mapFilterObservable(
        this.toObservable({
          emitCurrentValue,
          debounce,
          mode: 'notification',
        }),
        (notification: ISignalNotifications<GValue>): IMapFilterMapFunctionReturn<GValue> => {
          return (notification.name === 'next')
            ? notification.value
            : onError(notification.value);
        },
      );
    }
  }
}

export const Signal = Callable<typeof PureSignal, ISignalConstructor>(PureSignal, function(this: PureSignal<any>) {
  return this.get();
});


