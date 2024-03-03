import { IObservable } from '../../../../../../../type/observable.type';
import { mapObservable } from '../../map-observable';

export function toStringObservable<GValue>(subscribe: IObservable<GValue>): IObservable<string> {
  return mapObservable<GValue, string>(subscribe, String);
}
