import { EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction } from '@lirx/utils';
import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { ISignalUpdateFunctionCallback } from '../signal/types/signal-update-function-callback.type';
import {
  IReactiveNode,
  REACTIVE_NODE,
  reactiveNodeAddSignalChangeListener,
  reactiveNodeDispatchSignalChangeListeners,
} from './reactive-node.private';
import { isInSignalContext } from './signal-change-context/signal-change-context.private';

export interface ISignalNode<GValue> extends IReactiveNode {
  equal: IEqualFunction<GValue>;
  value: GValue;
  readonlySignal: IReadonlySignal<GValue> | undefined;
}

export const SIGNAL_NODE: ISignalNode<unknown> = {
  ...REACTIVE_NODE,
  equal: EQUAL_FUNCTION_STRICT_EQUAL,
  value: undefined,
  readonlySignal: undefined,
};

export function signalGet<GValue>(node: ISignalNode<GValue>): GValue {
  reactiveNodeAddSignalChangeListener(node);
  return node.value;
}

export function signalSet<GValue>(node: ISignalNode<GValue>, value: GValue): void {
  if (isInSignalContext()) {
    throw new Error('The signal cannot be written is this context.');
  }

  signalSetNoCheck<GValue>(node, value);
}

export function signalSetNoCheck<GValue>(node: ISignalNode<GValue>, value: GValue): void {
  if (!node.equal(value, node.value)) {
    node.value = value;
    reactiveNodeDispatchSignalChangeListeners(node);
  }
}

export function signalUpdate<GValue>(
  node: ISignalNode<GValue>,
  updateFunction: ISignalUpdateFunctionCallback<GValue>,
): void {
  signalSet<GValue>(node, updateFunction(node.value));
}

export function signalAsReadonly<GValue>(node: ISignalNode<GValue>): IReadonlySignal<GValue> {
  if (node.readonlySignal === undefined) {
    const readonlySignal: IReadonlySignal<GValue> = (): GValue => signalGet(node);
    readonlySignal[SIGNAL] = node;
    node.readonlySignal = readonlySignal;
  }
  return node.readonlySignal;
}
