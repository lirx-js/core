import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { ISignalUpdateFunctionCallback } from '../signal/types/signal-update-function-callback.type';
import {
  getReactiveProducerValue,
  IReactiveProducer,
  REACTIVE_PRODUCER,
  reactiveProducerGet,
  reactiveProducerSet,
} from './reactive-context.private';
import { SignalError } from './signal-error.class';

/* NODE */

export interface ISignalNode<GValue> extends IReactiveProducer<GValue> {
  readonlySignal: IReadonlySignal<GValue> | undefined;
}

export const SIGNAL_NODE: ISignalNode<unknown> = {
  ...REACTIVE_PRODUCER,
  readonlySignal: undefined,
};

/* GET */

export function signalGet<GValue>(node: ISignalNode<GValue>): GValue {
  return reactiveProducerGet<GValue>(node);
}

/* SET */

export function signalSet<GValue>(node: ISignalNode<GValue>, value: GValue): void {
  reactiveProducerSet<GValue>(node, value);
}

export function signalThrow<GValue>(node: ISignalNode<GValue>, error: unknown): void {
  reactiveProducerSet<GValue>(node, new SignalError(error));
}

export function signalUpdate<GValue>(
  node: ISignalNode<GValue>,
  updateFunction: ISignalUpdateFunctionCallback<GValue>,
): void {
  // signalSet<GValue>(node, updateFunction(node.value));
  const currentValue: GValue = getReactiveProducerValue<GValue>(node);
  let value: GValue | SignalError;

  try {
    value = updateFunction(currentValue);
  } catch (error: unknown) {
    value = new SignalError(error);
  }

  reactiveProducerSet<GValue>(node, value);
}

/* AS READONLY */

export function signalAsReadonly<GValue>(node: ISignalNode<GValue>): IReadonlySignal<GValue> {
  if (node.readonlySignal === undefined) {
    const readonlySignal: IReadonlySignal<GValue> = (): GValue => signalGet<GValue>(node);
    readonlySignal[SIGNAL] = node;
    node.readonlySignal = readonlySignal;
  }
  return node.readonlySignal;
}
