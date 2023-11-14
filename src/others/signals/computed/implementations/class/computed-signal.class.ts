import { PureSignal } from '../../../signal/implementations/class/signal.class';
import { IComputedSignalFunction } from '../../types/computed-singal-function.type';
import { IComputedSignalOptions } from '../../types/computed-signal-options.type';
import { runSignalWriteModeContext } from '../../../internal/allow-signal-writes/allow-signal-writes-context.private';
import { observeSignalChangesInContext } from '../../../internal/register-signal/signal-get-called.private';
import {
  ISignalToObservableOptions,
  ISignalToValueObservableOptions,
  ISignalToNotificationsObservableOptions,
} from '../../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { Callable } from '@lirx/utils';
import { IPureComputedSignal } from '../../computed-signal.type';
import { IComputedSignalConstructor } from '../../types/computed-signal-constructor.type';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../observable/type/observable.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { SignalContextError } from '../../../error/signal-context-error.class';
import { ISignalNotifications } from '../../../signal/types/signal-notifications.type';

export class PureComputedSignal<GValue> implements IPureComputedSignal<GValue> {
  readonly #signal: PureSignal<GValue>;
  #requiresUpdate: boolean;
  readonly #signalsChange$: IObservable<unknown>;
  #unsubscribeOfSignals!: IUnsubscribeOfObservable;

  constructor(
    computedFunction: IComputedSignalFunction<GValue>,
    options?: IComputedSignalOptions<GValue>,
  ) {
    this.#signal = new PureSignal<GValue>(void 0 as GValue, options);
    this.#requiresUpdate = true;
    this.#signalsChange$ = observeSignalChangesInContext((): void => {
      runSignalWriteModeContext('allow', (): void => {
        let value!: GValue;
        let errored: boolean = false;
        let error!: unknown;

        try {
          value = runSignalWriteModeContext('forbid', computedFunction);
        } catch (_error: unknown) {
          if (_error instanceof SignalContextError) {
            throw _error;
          } else {
            errored = true;
            error = _error;
          }
        }

        if (errored) {
          this.#signal.throw(error);
        } else {
          this.#signal.set(value);
        }
      });
    });
  }

  get [SIGNAL](): unknown {
    return true;
  }

  get(): GValue {
    if (this.#requiresUpdate) {
      this.#requiresUpdate = false;
      this.#update();
    }
    return this.#signal.get();
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
      ...options
    }: ISignalToObservableOptions<GValue> = {},
  ): IObservable<GValue | ISignalNotifications<GValue>> {
    const subscribe: IObservable<GValue | ISignalNotifications<GValue>> = this.#signal.toObservable({
      ...options,
      emitCurrentValue,
    } as any);
    return (emit: IObserver<GValue | ISignalNotifications<GValue>>): IUnsubscribeOfObservable => {
      if (emitCurrentValue && this.#requiresUpdate) {
        this.#requiresUpdate = false;
        this.#update();
      }
      return subscribe(emit);
    };
  };

  #update(): void {
    this.#unsubscribeOfSignals = this.#signalsChange$((): void => {
      this.#unsubscribeOfSignals();
      this.#update();
    });
  }
}

export const ComputedSignal = Callable<typeof PureComputedSignal, IComputedSignalConstructor>(PureComputedSignal, function(this: PureComputedSignal<any>) {
  return this.get();
});
