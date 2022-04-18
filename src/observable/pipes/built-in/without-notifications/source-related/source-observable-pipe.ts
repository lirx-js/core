import { IObservable } from '../../../../type/observable.type';
import { IObservablePipe } from '../../../type/observable-pipe.type';
import { sourceObservable } from './source-observable';
import { ISourceObservableOptions } from './source-observable-options.type';

export function sourceObservablePipe<GValue>(
  options: ISourceObservableOptions<GValue>,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return sourceObservable<GValue>(subscribe, options);
  };
}
