import { Callable } from '@lirx/utils';
import {
  ISignalToObservableOptions,
  ISignalToValueObservableOptions,
  ISignalToNotificationsObservableOptions,
} from '../../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../observable/type/observable.type';
import { IPureSignalFromObservable } from '../../signal-from-observable.type';
import { PureSignal } from '../../../signal/implementations/class/signal.class';
import { ISignalFromObservableConstructor } from '../../types/signal-from-observable-constructor.type';
import {
  ISignalFromObservableOptions,
  ISignalFromValueObservableOptions,
  ISignalFromNotificationsObservableOptions,
  ISignalFromObservableMode,
} from '../../types/signal-from-observable-options.type';
import { ISignalNotifications } from '../../../signal/types/signal-notifications.type';
import { IDefaultInNotificationsUnion } from '../../../../../misc/notifications/default-notifications-union.type';
import { futureUnsubscribe } from '@lirx/unsubscribe';
import { defaultNotificationObserver } from '../../../../../misc/notifications/default-notification-observer';
import { SignalUninitializedError } from '../../../error/signal-uninitialized-error.class';

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
    this.#signal = PureSignal.throw<GValue>(new SignalUninitializedError(`Provided Observable did not emit any value.`));
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

  toObservable(
    options?: ISignalToValueObservableOptions<GValue>,
  ): IObservable<GValue>;
  toObservable(
    options: ISignalToNotificationsObservableOptions,
  ): IObservable<ISignalNotifications<GValue>>;
  toObservable(
    options?: ISignalToObservableOptions<GValue>,
  ): IObservable<GValue> | IObservable<ISignalNotifications<GValue>> {
    return this.#signal.toObservable(options as any);
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


