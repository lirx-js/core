import {
  initSignalNode,
  ISignalNodeWithReadonly,
  SIGNAL_NODE_WITH_READONLY,
  signalAsReadonly,
  signalGet,
  signalSet,
  signalThrow,
  signalUpdate,
} from '../internal/reactive-context.private';
import { SignalError } from '../internal/signal-error.class';

import { SIGNAL } from './signal.symbol';
import { ICreateSignalOptions } from './types/create-signal-options.type';
import { IReadonlySignal } from './types/readonly-signal.type';
import { ISignalUpdateFunctionCallback } from './types/signal-update-function-callback.type';
import { ISignal } from './types/signal.type';

export function signal<GValue>(
  initialValue: GValue | SignalError = SignalError.UNSET,
  options?: ICreateSignalOptions<GValue>,
): ISignal<GValue> {
  // preventCreationIfInSignalContext();

  const node: ISignalNodeWithReadonly<GValue> = Object.create(SIGNAL_NODE_WITH_READONLY);
  initSignalNode<GValue>(node, initialValue, options?.equal);

  const signal: ISignal<GValue> = ((): GValue => signalGet<GValue>(node)) as ISignal<GValue>;
  signal[SIGNAL] = node;

  signal.set = (value: GValue): void => signalSet<GValue>(node, value);
  signal.throw = (error: unknown): void => signalThrow<GValue>(node, error);
  signal.update = (updateFunction: ISignalUpdateFunctionCallback<GValue>): void =>
    signalUpdate<GValue>(node, updateFunction);
  signal.asReadonly = (): IReadonlySignal<GValue> => signalAsReadonly<GValue>(node);

  return signal;
}
