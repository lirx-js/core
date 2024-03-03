import { IObservable } from '../../../../../../../type/observable.type';
import { mapObservable } from '../../map-observable';

export function toNumberObservable<GValue>(subscribe: IObservable<GValue>): IObservable<number> {
  return mapObservable<GValue, number>(subscribe, Number);
}
