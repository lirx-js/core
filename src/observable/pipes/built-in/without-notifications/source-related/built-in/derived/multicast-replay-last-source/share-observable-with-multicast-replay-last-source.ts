import {
  createMulticastReplayLastSource,
} from '../../../../../../../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';
import { IObservable } from '../../../../../../../type/observable.type';
import { IShareObservableOptions, shareObservable } from '../../share-observable';

export interface IShareObservableWithMulticastReplayLastSourceOptions<GValue> extends Omit<IShareObservableOptions<GValue>, 'getSource'> {
}

export function shareObservableWithMulticastReplayLastSource<GValue>(
  subscribe: IObservable<GValue>,
  options?: IShareObservableWithMulticastReplayLastSourceOptions<GValue>,
): IObservable<GValue> {
  return shareObservable<GValue>(subscribe, {
    ...options,
    createSource: createMulticastReplayLastSource,
  });
}
