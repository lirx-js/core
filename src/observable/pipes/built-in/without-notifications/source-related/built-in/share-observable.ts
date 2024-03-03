import { createMulticastSource } from '../../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IObservable } from '../../../../../type/observable.type';
import { sourceObservable } from '../source-observable';
import { ISourceObservableOptions } from '../source-observable-options.type';
import { IShareObservablePipeCreateSource } from './share-observable-pipe-create-source.type';

export interface IShareObservableOptions<GValue>
  extends Omit<ISourceObservableOptions<GValue>, 'createSource' | 'onSubscribe' | 'onUnsubscribe'> {
  createSource?: IShareObservablePipeCreateSource<GValue>;
}

export function shareObservable<GValue>(
  subscribe: IObservable<GValue>,
  { createSource = createMulticastSource, ...options }: IShareObservableOptions<GValue> = {},
): IObservable<GValue> {
  let observersCount: number = 0;

  return sourceObservable<GValue>(subscribe, {
    createSource,
    onSubscribe: (): boolean => {
      observersCount++;
      return observersCount === 1;
    },
    onUnsubscribe: (): boolean => {
      observersCount--;
      return observersCount === 0;
    },
    ...options,
  });
}
