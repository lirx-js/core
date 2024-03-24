import { computed } from '../computed/computed';
import { IComputationFunction } from '../computed/types/computation-function.type';
import { ICreateComputedOptions } from '../computed/types/create-computed-options.type';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';

/**
 * Generates a signal from a higher order signal.
 * @experimental
 */
export function unroll<GValue>(
  signal: IReadonlySignal<IReadonlySignal<GValue>>,
): IReadonlySignal<GValue> {
  return computed((): GValue => {
    return signal()();
  });
}

/**
 * Generates a higher order signal.
 * @experimental
 */
export function unrolled<GValue>(
  computation: IComputationFunction<IReadonlySignal<GValue>>,
  options?: ICreateComputedOptions<IReadonlySignal<GValue>>,
): IReadonlySignal<GValue> {
  return unroll<GValue>(computed(computation, options));
}
