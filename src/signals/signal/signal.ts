import { reactiveNodeInit } from '../internal/reactive-node.private';
import { isInSignalContext } from '../internal/signal-change-context/signal-change-context.private';
import {
  ISignalNode,
  SIGNAL_NODE,
  signalAsReadonly,
  signalGet,
  signalSet,
  signalUpdate,
} from '../internal/signal.private';
import { SIGNAL } from './signal.symbol';
import { ICreateSignalOptions } from './types/create-signal-options.type';
import { IReadonlySignal } from './types/readonly-signal.type';
import { ISignalUpdateFunctionCallback } from './types/signal-update-function-callback.type';
import { ISignal } from './types/signal.type';

export function signal<GValue>(
  initialValue: GValue,
  options?: ICreateSignalOptions<GValue>,
): ISignal<GValue> {
  if (isInSignalContext()) {
    throw new Error('Cannot create a signal is this context.');
  }

  const node: ISignalNode<GValue> = Object.create(SIGNAL_NODE);
  reactiveNodeInit(node);
  node.value = initialValue;

  const signal: ISignal<GValue> = ((): GValue => signalGet(node)) as ISignal<GValue>;
  signal[SIGNAL] = node;

  if (options?.equal) {
    node.equal = options.equal;
  }

  signal.set = (value: GValue): void => signalSet(node, value);
  signal.update = (updateFunction: ISignalUpdateFunctionCallback<GValue>): void =>
    signalUpdate<GValue>(node, updateFunction);
  signal.asReadonly = (): IReadonlySignal<GValue> => signalAsReadonly<GValue>(node);

  return signal;
}
