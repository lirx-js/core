import { PureSignal } from '../../signal/implementations/class/signal.class';
import { IComputedSignalFunction } from '../types/computed-singal-function.type';
import { IComputedSignalOptions } from '../types/computed-signal-options.type';
import { runSignalWriteModeContext } from '../../internal/allow-signal-writes/allow-signal-writes-context.private';
import { observeSignalChangesInContext } from '../../internal/register-signal/signal-get-called.private';
import { ISignalToObservableOptions } from '../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { Callable } from '@lirx/utils';
import { IPureComputedSignal } from '../computed-signal.type';
import { IComputedSignalConstructor } from '../types/computed-signal-constructor.type';
import { SIGNAL } from '../../readonly-signal/traits/symbol/signal.symbol';
import { IObservable, IUnsubscribeOfObservable } from '../../../../observable/type/observable.type';
import { IObserver } from '../../../../observer/type/observer.type';

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
        this.#signal.set(
          runSignalWriteModeContext('forbid', computedFunction),
        );
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

  toObservable = (
    {
      emitCurrentValue = true,
      ...options
    }: ISignalToObservableOptions = {},
  ): IObservable<GValue> => {
    const subscribe: IObservable<GValue> = this.#signal.toObservable({
      ...options,
      emitCurrentValue,
    });
    return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
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
