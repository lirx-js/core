import {
  initWatchNode,
  initWatchNodeWatching,
  ISignalNode,
  IWatchNode,
  preventWatchCreationInWatcherContext,
  stopWatchNode,
  WATCH_NODE,
} from '../internal/reactive-context.private';
import { SIGNAL } from '../signal/signal.symbol';
import { IReadonlySignal } from '../signal/types/readonly-signal.type';

import { IUnsubscribeOfWatch } from './types/unsubscribe-of-watch.type';
import { IWatchFunction } from './types/watch-function.type';

export function watch<GValue>(
  signal: IReadonlySignal<GValue>,
  watchFunction: IWatchFunction<GValue>,
): IUnsubscribeOfWatch {
  preventWatchCreationInWatcherContext();

  const node: IWatchNode<GValue> = Object.create(WATCH_NODE);
  initWatchNode<GValue>(node, signal[SIGNAL] as ISignalNode<GValue>, watchFunction);
  initWatchNodeWatching<GValue>(node);

  return (): void => {
    stopWatchNode<GValue>(node);
  };
}
