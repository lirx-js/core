import { IObservable } from '../../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../../type/observable-pipe.type';
import { toBooleanObservable } from './to-boolean-observable';

export function toBooleanObservablePipe<GValue>(): IObservablePipe<GValue, boolean> {
  return (subscribe: IObservable<GValue>): IObservable<boolean> => {
    return toBooleanObservable<GValue>(subscribe);
  };
}

