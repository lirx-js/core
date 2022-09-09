import { IObservable } from '../../../../../type/observable.type';
import { IObservablePipe } from '../../../../type/observable-pipe.type';
import { debugObservable } from './debug-observable';

export function debugObservablePipe<GValue>(
  name: string,
  color?: string,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return debugObservable<GValue>(subscribe, name, color);
  };
}

