import { IObservable } from '../../../../../../../type/observable.type';
import { mapObservable } from '../../map-observable';

export function toBooleanObservable<GValue>(subscribe: IObservable<GValue>): IObservable<boolean> {
  return mapObservable<GValue, boolean>(subscribe, Boolean);
}
