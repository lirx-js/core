import { IReactiveNode, REACTIVE_NODE, reactiveNodeGet } from './reactive-context.private';

export interface IComputedNode<GValue> extends IReactiveNode<GValue> {}

export const COMPUTED_NODE: IComputedNode<any> = REACTIVE_NODE;

export function computedGet<GValue>(node: IComputedNode<GValue>): GValue {
  return reactiveNodeGet<GValue>(node);
}
