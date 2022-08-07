import { IObservable } from '../../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../../type/observable-pipe.type';
import {
  IShareObservableWithMulticastReplayLastSourceOptions,
  shareObservableWithMulticastReplayLastSource,
} from './share-observable-with-multicast-replay-last-source';

export function shareObservablePipeWithMulticastReplayLastSource<GValue>(
  options?: IShareObservableWithMulticastReplayLastSourceOptions<GValue>,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return shareObservableWithMulticastReplayLastSource<GValue>(subscribe, options);
  };
}
