import {
  getCurrentSignalChangeListener,
  ISignalChangeListener,
} from './signal-change-context/signal-change-context.private';

export interface IReactiveNode {
  signalChangeListeners: ISignalChangeListener[];
}

export const REACTIVE_NODE: IReactiveNode = {
  signalChangeListeners: undefined as any,
};

export function reactiveNodeInit(node: IReactiveNode): void {
  node.signalChangeListeners = [];
}

export function reactiveNodeAddSignalChangeListener(node: IReactiveNode): void {
  const currentSignalChangeListener: ISignalChangeListener | undefined =
    getCurrentSignalChangeListener();
  if (currentSignalChangeListener !== undefined) {
    node.signalChangeListeners.push(currentSignalChangeListener);
  }
}

export function reactiveNodeDispatchSignalChangeListeners(node: IReactiveNode): void {
  let index: number = node.signalChangeListeners.length;
  if (index > 0) {
    const signalChangeListeners: readonly ISignalChangeListener[] = node.signalChangeListeners;
    node.signalChangeListeners = [];
    while (--index >= 0) {
      signalChangeListeners[index]!();
    }
  }
}
