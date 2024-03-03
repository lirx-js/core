import {
  COMPUTED_SIGNAL_NODE,
  computedGet,
  IComputedSignalNode,
} from '../internal/computed.private';
import { reactiveNodeInit } from '../internal/reactive-node.private';
import { isInSignalContext } from '../internal/signal-change-context/signal-change-context.private';
import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { IComputationFunction } from './types/computation-function.type';
import { ICreateComputedOptions } from './types/create-computed-options.type';

export function computed<GValue>(
  computation: IComputationFunction<GValue>,
  options?: ICreateComputedOptions<GValue>,
): IReadonlySignal<GValue> {
  if (isInSignalContext()) {
    throw new Error('Cannot create a signal is this context.');
  }

  const node: IComputedSignalNode<GValue> = Object.create(COMPUTED_SIGNAL_NODE);
  reactiveNodeInit(node);
  node.computation = computation;

  const computed: IReadonlySignal<GValue> = ((): GValue =>
    computedGet(node)) as IReadonlySignal<GValue>;
  computed[SIGNAL] = node;

  if (options?.equal) {
    node.equal = options.equal;
  }

  return computed;
}
