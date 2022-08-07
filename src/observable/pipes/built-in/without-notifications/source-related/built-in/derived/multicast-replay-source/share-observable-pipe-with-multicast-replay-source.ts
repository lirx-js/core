import { IObservable } from '../../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../../type/observable-pipe.type';
import {
  IShareObservableWithMulticastReplaySourceOptions,
  shareObservableWithMulticastReplaySource,
} from './share-observable-with-multicast-replay-source';

export function shareObservablePipeWithMulticastReplaySource<GValue>(
  options?: IShareObservableWithMulticastReplaySourceOptions<GValue>,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return shareObservableWithMulticastReplaySource<GValue>(subscribe, options);
  };
}
