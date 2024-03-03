import { IObservable } from '../../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../../type/observable-pipe.type';
import { toNumberObservable } from './to-number-observable';

export function toNumberObservablePipe<GValue>(): IObservablePipe<GValue, number> {
  return (subscribe: IObservable<GValue>): IObservable<number> => {
    return toNumberObservable<GValue>(subscribe);
  };
}
