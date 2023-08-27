import { Callable, UNINITIALIZED_TOKEN } from '@lirx/utils';
import { ISignalToObservableOptions } from '../../../readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../observable/type/observable.type';
import { IPureSignalFromObservable } from '../../signal-from-observable.type';
import { PureSignal } from '../../../signal/implementations/class/signal.class';
import { ISignalFromObservableConstructor } from '../../types/signal-from-observable-constructor.type';
import { ISignalFromObservableOptions } from '../../types/signal-from-observable-options.type';

export class PureSignalFromObservable<GValue> implements IPureSignalFromObservable<GValue> {
  readonly #value$: IObservable<GValue>;
  readonly #signal: PureSignal<GValue>;
  #active: boolean;
  #unsubscribe!: IUnsubscribeOfObservable;
  #awaitingValue: boolean;

  constructor(
    value$: IObservable<GValue>,
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
    return this.#signal.get();
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
        this.#unsubscribe = this.#value$((value: GValue): void => {
          if (this.#awaitingValue) {
            this.#awaitingValue = false;
          }
          this.#signal.set(value);
        });
      } else {
        this.#unsubscribe();
      }
    }
  };
}

export const SignalFromObservable = Callable<typeof PureSignalFromObservable, ISignalFromObservableConstructor>(PureSignalFromObservable, function(this: PureSignalFromObservable<any>) {
  return this.get();
});


