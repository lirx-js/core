import { createMulticastReplaySource } from '../../../../../../../../observer-observable-pair/build-in/source/built-in/replay-source/derived/create-multicast-replay-source';
import { IObservable } from '../../../../../../../type/observable.type';
import { IShareObservableOptions, shareObservable } from '../../share-observable';

export interface IShareObservableWithMulticastReplaySourceOptions<GValue>
  extends Omit<IShareObservableOptions<GValue>, 'getSource'> {
  maxNumberOfValues?: number;
}

export function shareObservableWithMulticastReplaySource<GValue>(
  subscribe: IObservable<GValue>,
  { maxNumberOfValues, ...options }: IShareObservableWithMulticastReplaySourceOptions<GValue> = {},
): IObservable<GValue> {
  return shareObservable<GValue>(subscribe, {
    ...options,
    createSource: () => createMulticastReplaySource<GValue>(maxNumberOfValues),
  });
}
