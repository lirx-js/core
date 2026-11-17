import {
  COMPUTED_NODE,
  computedGet,
  IComputedNode,
  initComputedNode,
} from '../internal/reactive-context.private';
import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';
import { IComputationFunction } from './types/computation-function.type';
import { ICreateComputedOptions } from './types/create-computed-options.type';

export function computed<GValue>(
  computation: IComputationFunction<GValue>,
  options?: ICreateComputedOptions<GValue>,
): IReadonlySignal<GValue> {
  const context: IComputedNode<GValue> = Object.create(COMPUTED_NODE);
  initComputedNode<GValue>(context, computation, options?.equal);

  const computed: IReadonlySignal<GValue> = ((): GValue =>
    computedGet<GValue>(context)) as IReadonlySignal<GValue>;
  computed[SIGNAL] = context;

  return computed;
}
