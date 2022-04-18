import {
  createMulticastSource,
} from '../../../../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IObservable } from '../../../../../type/observable.type';
import { sourceObservable } from '../source-observable';
import { ISourceObservableOptions } from '../source-observable-options.type';
import { IShareObservablePipeGetMultiCastSource } from './share-observable-pipe-get-multi-cast-source.type';

export interface IShareObservableOptions<GValue> extends Omit<ISourceObservableOptions<GValue>, 'getSource'> {
  getSource?: IShareObservablePipeGetMultiCastSource<GValue>;
}

export function shareObservable<GValue>(
  subscribe: IObservable<GValue>,
  {
    getSource = createMulticastSource,
    ...options
  }: IShareObservableOptions<GValue> = {},
): IObservable<GValue> {
  return sourceObservable<GValue>(subscribe, {
    getSource,
    ...options,
  });
}

