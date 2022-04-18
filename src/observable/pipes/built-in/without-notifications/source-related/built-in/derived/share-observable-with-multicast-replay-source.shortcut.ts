import {
  createMulticastReplaySource,
} from '../../../../../../../observer-observable-pair/build-in/source/built-in/replay-source/derived/create-multicast-replay-source';
import { IObservable } from '../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../type/observable-pipe.type';
import { IShareObservableOptions, shareObservable } from '../share-observable';
import { shareObservablePipe } from '../share-observable-pipe';

export interface IShareObservableWithMulticastReplaySourceOptions<GValue> extends Omit<IShareObservableOptions<GValue>, 'getSource'> {
  maxNumberOfValues?: number;
}

export function shareR$$$<GValue>(
  {
    maxNumberOfValues,
    ...options
  }: IShareObservableWithMulticastReplaySourceOptions<GValue> = {},
): IObservablePipe<GValue, GValue> {
  return shareObservablePipe<GValue>({
    ...options,
    getSource: () => createMulticastReplaySource<GValue>(maxNumberOfValues),
  });
}

export function shareR$$<GValue>(
  subscribe: IObservable<GValue>,
  {
    maxNumberOfValues,
    ...options
  }: IShareObservableWithMulticastReplaySourceOptions<GValue> = {},
): IObservable<GValue> {
  return shareObservable<GValue>(subscribe, {
    ...options,
    getSource: () => createMulticastReplaySource<GValue>(maxNumberOfValues),
  });
}
