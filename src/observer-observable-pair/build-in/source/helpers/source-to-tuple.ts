import { IObserverObservableTuple } from '../../../type/observer-observable-tuple.type';
import { ISource } from '../type/source.type';

export function sourceToTuple<GValue>({
  emit,
  subscribe,
}: ISource<GValue>): IObserverObservableTuple<GValue> {
  return [emit, subscribe];
}
