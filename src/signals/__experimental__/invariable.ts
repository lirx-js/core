import {
  initSignalNode,
  ISignalNode,
  readSignalNode,
  SIGNAL_NODE,
} from '../internal/reactive-context.private';
import { SignalError } from '../internal/signal-error.class';
import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';

/**
 * Generates a signal whose value is static.
 * @experimental
 */
export function invariable<GValue>(value: GValue | SignalError): IReadonlySignal<GValue> {
  const node: ISignalNode<GValue> = Object.create(SIGNAL_NODE);
  initSignalNode<GValue>(node, value, undefined);

  const signal: IReadonlySignal<GValue> = ((): GValue =>
    readSignalNode<GValue>(node)) as IReadonlySignal<GValue>;
  signal[SIGNAL] = node;

  return signal;
}
