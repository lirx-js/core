import { COMPUTED_NODE, computedGet, IComputedNode } from '../internal/computed.private';
import { initReactiveNode } from '../internal/reactive-context.private';

import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { IComputationFunction } from './types/computation-function.type';
import { ICreateComputedOptions } from './types/create-computed-options.type';

export function computed<GValue>(
  computation: IComputationFunction<GValue>,
  options?: ICreateComputedOptions<GValue>,
): IReadonlySignal<GValue> {
  // preventCreationIfInSignalContext();

  const node: IComputedNode<GValue> = Object.create(COMPUTED_NODE);
  initReactiveNode<GValue>(node, computation, options?.equal);

  const computed: IReadonlySignal<GValue> = ((): GValue =>
    computedGet<GValue>(node)) as IReadonlySignal<GValue>;
  computed[SIGNAL] = node;

  if (options?.equal) {
    node.equal = options.equal;
  }

  return computed;
}
