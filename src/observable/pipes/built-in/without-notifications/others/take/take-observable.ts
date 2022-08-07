import { empty } from '../../../../../built-in/from/without-notifications/values/empty/empty';
import { IObservable } from '../../../../../type/observable.type';
import { takeWhileObservable } from '../take-while/take-while-observable';

export function takeObservable<GValue>(
  subscribe: IObservable<GValue>,
  count: number,
): IObservable<GValue> {
  if (count <= 0) {
    return empty();
  } else {
    return takeWhileObservable<GValue>(subscribe, (_, index: number): boolean => {
      return (index < count);
    });
  }
}
