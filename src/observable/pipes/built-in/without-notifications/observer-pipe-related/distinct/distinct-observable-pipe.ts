import { IDistinctOptions } from '@lirx/utils';
import { IObservable } from '../../../../../type/observable.type';
import { IObservablePipe } from '../../../../type/observable-pipe.type';
import { distinctObservable } from './distinct-observable';

export function distinctObservablePipe<GValue>(
  options?: IDistinctOptions<GValue>,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return distinctObservable<GValue>(subscribe, options);
  };
}

