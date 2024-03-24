import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';

/**
 * Generates a signal whose value is static.
 * @experimental
 */
export function invariable<GValue>(value: GValue): IReadonlySignal<GValue> {
  const signal: IReadonlySignal<GValue> = ((): GValue => value) as IReadonlySignal<GValue>;
  signal[SIGNAL] = null;
  return signal;
}
