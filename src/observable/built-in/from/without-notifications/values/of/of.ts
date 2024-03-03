import { IObservable } from '../../../../../type/observable.type';
import { fromArray } from '../../iterable/from-array/from-array';

export function of<GValue>(...values: readonly GValue[]): IObservable<GValue> {
  return fromArray<GValue>(values);
}
