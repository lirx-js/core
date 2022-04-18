import {
  createMulticastReplayLastSource,
} from '../../../../../../../observer-observable-pair/build-in/source/built-in/replay-last-source/derived/create-multicast-replay-last-source';
import { IObservable } from '../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../type/observable-pipe.type';
import { IShareObservableOptions, shareObservable } from '../share-observable';
import { shareObservablePipe } from '../share-observable-pipe';

export interface IShareObservableWithMulticastReplayLastSourceOptions<GValue> extends Omit<IShareObservableOptions<GValue>, 'getSource'> {
}

export function shareRL$$$<GValue>(
  options?: IShareObservableWithMulticastReplayLastSourceOptions<GValue>,
): IObservablePipe<GValue, GValue> {
  return shareObservablePipe<GValue>({
    ...options,
    getSource: createMulticastReplayLastSource,
  });
}

export function shareRL$$<GValue>(
  subscribe: IObservable<GValue>,
  options?: IShareObservableWithMulticastReplayLastSourceOptions<GValue>,
): IObservable<GValue> {
  return shareObservable<GValue>(subscribe, {
    ...options,
    getSource: createMulticastReplayLastSource,
  });
}
