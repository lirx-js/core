import { IObservable } from '../../../../../../observable/type/observable.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { ICreateReplayLastSourceInitialValue } from '../create-replay-last-source';
import { createMulticastReplayLastSource } from './create-multicast-replay-last-source';

export type ILetTuple<GValue> = [
  emit: IObserver<GValue>,
  subscribe: IObservable<GValue>,
  getValue: () => GValue,
];

export function let$$<GValue>(
  ...initialValue: ICreateReplayLastSourceInitialValue<GValue>
): ILetTuple<GValue> {
  const { emit, subscribe, getValue } = createMulticastReplayLastSource<GValue>(...initialValue);
  return [emit, subscribe, getValue];
}
