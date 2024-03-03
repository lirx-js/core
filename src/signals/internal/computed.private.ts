import { EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction } from '@lirx/utils';
import { IComputationFunction } from '../computed/types/computation-function.type';
import {
  IReactiveNode,
  REACTIVE_NODE,
  reactiveNodeAddSignalChangeListener,
  reactiveNodeDispatchSignalChangeListeners,
} from './reactive-node.private';
import { runSignalChangeContext } from './signal-change-context/signal-change-context.private';

export interface IComputedSignalNode<GValue> extends IReactiveNode {
  equal: IEqualFunction<GValue>;
  value: GValue;
  outdated: boolean;
  error: unknown;
  computation: IComputationFunction<GValue>;
}

export const UNSET: any = Symbol('UNSET');
export const COMPUTING: any = Symbol('COMPUTING');
export const ERRORED: any = Symbol('ERRORED');

export const COMPUTED_SIGNAL_NODE: IComputedSignalNode<unknown> = {
  ...REACTIVE_NODE,
  equal: EQUAL_FUNCTION_STRICT_EQUAL,
  value: UNSET,
  error: undefined,
  outdated: true,
  computation: undefined as any,
};

export function computedChange<GValue>(node: IComputedSignalNode<GValue>): void {
  node.outdated = true;
  reactiveNodeDispatchSignalChangeListeners(node);
}

export function computedGet<GValue>(node: IComputedSignalNode<GValue>): GValue {
  if (node.outdated) {
    if (node.value === COMPUTING) {
      throw new Error('Detected cycle in computations.');
    } else {
      const oldValue = node.value;
      node.value = COMPUTING;

      let newValue: GValue;
      try {
        newValue = runSignalChangeContext<GValue>(node.computation, (): void =>
          computedChange(node),
        );
      } catch (error: unknown) {
        newValue = ERRORED;
        node.error = error;
      }

      node.outdated = false;

      if (
        oldValue !== UNSET &&
        oldValue !== ERRORED &&
        newValue !== ERRORED &&
        node.equal(oldValue, newValue)
      ) {
        // same value => no changes
        node.value = oldValue;
      } else {
        node.value = newValue;
        reactiveNodeDispatchSignalChangeListeners(node);
      }
    }
  }

  reactiveNodeAddSignalChangeListener(node);

  if (node.value === ERRORED) {
    throw node.error;
  }

  return node.value;
}
