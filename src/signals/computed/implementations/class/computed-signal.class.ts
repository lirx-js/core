import { Callable } from '@lirx/utils';
import { SignalContextError } from '../../../error/signal-context-error.class';
import { SignalThrow } from '../../../error/signal-throw.class';
import { SignalUninitializedError } from '../../../error/signal-uninitialized-error.class';
import {
  getCurrentSignalChangeListener,
  runSignalChangeContextOnce,
} from '../../../internal/signal-change-context/signal-change-context.private';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { PureSignal } from '../../../signal/implementations/class/signal.class';
import { IPureComputedSignal } from '../../computed-signal.type';
import { IComputedSignalConstructor } from '../../types/computed-signal-constructor.type';
import { IComputedSignalFunction } from '../../types/computed-signal-function.type';
import { IComputedSignalOptions } from '../../types/computed-signal-options.type';

const COMPUTED_SIGNAL_UNINITIALIZED_ERROR = new SignalThrow(
  new SignalUninitializedError(),
);

/**
 * Represents a Computed Signal as a class.
 */
export class PureComputedSignal<GValue> implements IPureComputedSignal<GValue> {
  readonly #computedFunction: IComputedSignalFunction<GValue>;

  #signal: PureSignal<GValue>;
  #outdated: boolean;
  #observed: boolean;

  constructor(
    computedFunction: IComputedSignalFunction<GValue>,
    options?: IComputedSignalOptions<GValue>,
  ) {
    this.#computedFunction = computedFunction;
    this.#signal = new PureSignal<GValue>(
      COMPUTED_SIGNAL_UNINITIALIZED_ERROR,
      options,
    );
    this.#outdated = true;
    this.#observed = false;
  }

  get [SIGNAL](): unknown {
    return true;
  }

  get(): GValue {
    if (!this.#observed) {
      this.#observed = getCurrentSignalChangeListener() !== void 0;
    }

    if (this.#outdated) {
      let newValue: GValue | SignalThrow;
      try {
        newValue = runSignalChangeContextOnce<GValue | SignalThrow>(
          (): GValue | SignalThrow => {
            return this.#computedFunction();
          },
          (): void => {
            this.#outdated = true;
            if (this.#observed) {
              this.#observed = false;
              this.get();
            }
          },
        );
      } catch (error: unknown) {
        if (error instanceof SignalContextError) {
          throw error;
        } else {
          newValue = new SignalThrow(error);
        }
      }

      this.#signal.set(newValue);
      this.#outdated = false;
    }
    return this.#signal.get();
  }
}

export const ComputedSignal = Callable<typeof PureComputedSignal, IComputedSignalConstructor>(PureComputedSignal, function(this: PureComputedSignal<any>) {
  return this.get();
});
