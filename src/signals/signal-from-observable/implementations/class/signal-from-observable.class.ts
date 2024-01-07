import { futureUnsubscribe } from '@lirx/unsubscribe';
import { Callable } from '@lirx/utils';
import { defaultNotificationObserver } from '../../../../misc/notifications/default-notification-observer';
import { IDefaultInNotificationsUnion } from '../../../../misc/notifications/default-notifications-union.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../observable/type/observable.type';
import { SignalThrow } from '../../../error/signal-throw.class';
import { SignalUninitializedError } from '../../../error/signal-uninitialized-error.class';

import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { PureSignal } from '../../../signal/implementations/class/signal.class';
import { IPureSignalFromObservable } from '../../signal-from-observable.type';
import { ISignalFromObservableConstructor } from '../../types/signal-from-observable-constructor.type';
import {
  ISignalFromNotificationsObservableOptions,
  ISignalFromObservableMode,
  ISignalFromObservableOptions,
  ISignalFromValueObservableOptions,
} from '../../types/signal-from-observable-options.type';

const SIGNAL_FROM_OBSERVABLE_UNINITIALIZED_ERROR = new SignalThrow(
  new SignalUninitializedError(),
);

/**
 * Represents a Signal from an Observable as a class.
 */
export class PureSignalFromObservable<GValue> implements IPureSignalFromObservable<GValue> {
  readonly #mode: ISignalFromObservableMode;
  readonly #value$: IObservable<GValue> | IObservable<IDefaultInNotificationsUnion<GValue>>;
  readonly #signal: PureSignal<GValue>;
  #active: boolean;
  #unsubscribe!: IUnsubscribeOfObservable;
  readonly #unsubscribeOnError: boolean;

  constructor(
    value$: IObservable<GValue>,
    options?: ISignalFromValueObservableOptions<GValue>,
  );
  constructor(
    value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
    options: ISignalFromNotificationsObservableOptions<GValue>,
  );
  constructor(
    value$: IObservable<GValue> | IObservable<IDefaultInNotificationsUnion<GValue>>,
    {
      mode = 'value',
      // @ts-ignore
      unsubscribeOnError = true,
    }: ISignalFromObservableOptions<GValue> = {},
  ) {
    this.#mode = mode;
    this.#value$ = value$;
    this.#signal = new PureSignal<GValue>(
      SIGNAL_FROM_OBSERVABLE_UNINITIALIZED_ERROR,
    );
    this.#active = false;
    this.#unsubscribeOnError = unsubscribeOnError;

    this.activate();
  }

  get [SIGNAL](): unknown {
    return true;
  }

  get(): GValue {
    return this.#signal.get();
  }

  isActive(): boolean {
    return this.#active;
  }

  activate(
    active: boolean = true,
  ): void {
    if (active !== this.#active) {
      this.#active = active;
      if (active) {
        if (this.#mode === 'value') {
          this.#unsubscribe = (this.#value$ as IObservable<GValue>)((value: GValue): void => {
            this.#signal.set(value);
          });
        } else {
          this.#unsubscribe = futureUnsubscribe((
            unsubscribe: IUnsubscribeOfObservable,
          ): IUnsubscribeOfObservable => {
            return (this.#value$ as IObservable<IDefaultInNotificationsUnion<GValue>>)(
              defaultNotificationObserver<GValue>(
                /* next */(value: GValue): void => {
                  this.#signal.set(value);
                },
                /* complete */(): void => {
                  unsubscribe();
                },
                /* error */(error: unknown): void => {
                  if (this.#unsubscribeOnError) {
                    unsubscribe();
                  }
                  this.#signal.throw(error);
                },
              ),
            );
          });
        }
      } else {
        this.#unsubscribe();
      }
    }
  };
}

export const SignalFromObservable = Callable<typeof PureSignalFromObservable, ISignalFromObservableConstructor>(PureSignalFromObservable, function(this: PureSignalFromObservable<any>) {
  return this.get();
});


