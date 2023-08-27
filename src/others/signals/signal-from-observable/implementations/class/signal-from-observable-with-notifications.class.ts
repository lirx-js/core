import { Callable, UNINITIALIZED_TOKEN } from '@lirx/utils';
import { ISignalToObservableOptions } from '../../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../observable/type/observable.type';
import { IPureSignalFromObservable } from '../../signal-from-observable.type';
import { PureSignal } from '../../../signal/implementations/class/signal.class';
import { ISignalFromObservableOptions } from '../../types/signal-from-observable-options.type';
import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';
import { defaultNotificationObserver } from '../../../../../misc/notifications/default-notification-observer';
import { ISignalFromObservableWithNotificationConstructor } from '../../types/signal-from-observable-with-notifications-constructor.type';
import { futureUnsubscribe } from '@lirx/unsubscribe';

export class PureSignalFromObservableWithNotifications<GValue> implements IPureSignalFromObservable<GValue> {
  readonly #value$: IObservable<IDefaultInNotificationsUnion<GValue>>;
  readonly #signal: PureSignal<GValue>;
  #active: boolean;
  #unsubscribe!: IUnsubscribeOfObservable;
  #awaitingValue: boolean;
  #errored: boolean;
  #error!: unknown;

  constructor(
    value$: IObservable<IDefaultInNotificationsUnion<GValue>>,
    {
      initialValue = UNINITIALIZED_TOKEN as GValue,
    }: ISignalFromObservableOptions<GValue> = {},
  ) {
    this.#value$ = value$;
    this.#signal = new PureSignal<GValue>(
      (initialValue === UNINITIALIZED_TOKEN)
        ? (void 0 as GValue)
        : initialValue,
    );
    this.#active = false;
    this.#awaitingValue = true;
    this.#errored = false;

    this.activate();

    if (
      (initialValue === UNINITIALIZED_TOKEN)
      && this.#awaitingValue
    ) {
      this.#unsubscribe();
      throw new Error(`Provided Observable is not sync`);
    }
  }

  get [SIGNAL](): unknown {
    return true;
  }

  get(): GValue {
    if (this.#errored) {
      throw this.#error;
    } else {
      return this.#signal.get();
    }
  }

  toObservable(
    options?: ISignalToObservableOptions,
  ): IObservable<GValue> {
    return this.#signal.toObservable(options);
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
        this.#unsubscribe = futureUnsubscribe((
          unsubscribe: IUnsubscribeOfObservable,
        ): IUnsubscribeOfObservable => {
          return this.#value$(
            defaultNotificationObserver<GValue>(
              /* next */(value: GValue): void => {
                if (this.#awaitingValue) {
                  this.#awaitingValue = false;
                }
                this.#signal.set(value);
              },
              /* complete */(): void => {
                unsubscribe();
              },
              /* error */(error: unknown): void => {
                unsubscribe();
                this.#errored = true;
                this.#error = error;
              },
            ),
          );
        });
      } else {
        this.#unsubscribe();
      }
    }
  };
}

export const SignalFromObservableWithNotifications = Callable<typeof PureSignalFromObservableWithNotifications, ISignalFromObservableWithNotificationConstructor>(PureSignalFromObservableWithNotifications, function(this: PureSignalFromObservableWithNotifications<any>) {
  return this.get();
});


