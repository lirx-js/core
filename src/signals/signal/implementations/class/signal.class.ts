import { Callable, EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction } from '@lirx/utils';
import { SignalContextError } from '../../../error/signal-context-error.class';
import { SignalThrow } from '../../../error/signal-throw.class';
import {
  getCurrentSignalChangeListener,
  ISignalChangeListener,
} from '../../../internal/signal-change-context/signal-change-context.private';
import { SIGNAL } from '../../../readonly-signal/traits/symbol/signal.symbol';
import { IPureSignal } from '../../signal.type';
import { ISignalUpdateFunctionCallback } from '../../traits/update/signal.update.function-definition';
import { ISignalConstructor } from '../../types/signal-constructor.type';
import { ISignalOptions } from '../../types/signal-options.type';

/**
 * The Signal class.
 */
export class PureSignal<GValue> implements IPureSignal<GValue> {

  /**
   * Returns a thrown Signal.
   */
  static throw<GValue>(
    error: any,
  ): PureSignal<GValue> {
    return new PureSignal<GValue>(new SignalThrow(error));
  }

  readonly #equal: IEqualFunction<GValue>;

  #value: GValue | SignalThrow;
  #signalChangeListeners: ISignalChangeListener[];
  #dispatching: boolean;

  constructor(
    initialValue: GValue | SignalThrow,
    {
      equal = EQUAL_FUNCTION_STRICT_EQUAL,
    }: ISignalOptions<GValue> = {},
  ) {
    this.#equal = equal;

    this.#value = initialValue;
    this.#signalChangeListeners = [];
    this.#dispatching = false;
  }

  get [SIGNAL](): unknown {
    return true;
  }

  #addCurrentListener(): void {
    const currentSignalChangeListener: ISignalChangeListener | undefined = getCurrentSignalChangeListener();
    if (currentSignalChangeListener !== void 0) {
      this.#signalChangeListeners.push(currentSignalChangeListener);
    }
  }

  #notifiesListeners(): void {
    const signalChangeListeners: ISignalChangeListener[] = this.#signalChangeListeners;
    this.#signalChangeListeners = [];
    for (let i = 0, l = signalChangeListeners.length; i < l; i++) {
      signalChangeListeners[i]();
    }
  }

  #getValue(): GValue {
    if (this.#value instanceof SignalThrow) {
      throw this.#value.error;
    } else {
      return this.#value;
    }
  }

  /**
   * Returns the signal's value, or throws if the signal is into an "error" state.
   *
   * - if run into a signal's context, it notifies this context that the signal has been used.
   */
  get(): GValue {
    this.#addCurrentListener();
    return this.#getValue();
  }

  /**
   * Sets a new value for this signal.
   *
   * - checks that the current signal's value and the new value differ, before this value is actually set.
   * - if run into a signal's context, it ensures that this signals is not already dispatching into another context (loop detection).
   */
  set(
    value: GValue | SignalThrow,
  ): void {
    if (this.#dispatching) {
      throw new SignalContextError(`The signal is already dispatching a value.`);
    } else {
      if (
        (value instanceof SignalThrow)
        || (this.#value instanceof SignalThrow)
        || !this.#equal(value, this.#value)
      ) {
        this.#dispatching = true;
        this.#value = value;
        this.#notifiesListeners();
        this.#dispatching = false;
      }
    }
  }

  update(
    updateFunction: ISignalUpdateFunctionCallback<GValue>,
  ): void {
    const value: GValue = this.get();
    let newValue: GValue | SignalThrow;
    try {
      newValue = updateFunction(value);
    } catch (error: unknown) {
      if (error instanceof SignalContextError) {
        throw error;
      } else {
        newValue = new SignalThrow(error);
      }
    }
    this.set(newValue);
  }

  /**
   * Sets the signal into an "error" state.
   *
   * - if run into a signal's context, it ensures that writing is allowed.
   */
  throw(
    error: any,
  ): void {
    this.set(new SignalThrow(error));
  }
}

export const Signal = Callable<typeof PureSignal, ISignalConstructor>(PureSignal, function(this: PureSignal<any>) {
  return this.get();
});


