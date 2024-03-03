import { IObservable } from '../../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../../type/observable-pipe.type';
import { toStringObservable } from './to-string-observable';

export function toStringObservablePipe<GValue>(): IObservablePipe<GValue, string> {
  return (subscribe: IObservable<GValue>): IObservable<string> => {
    return toStringObservable<GValue>(subscribe);
  };
}
