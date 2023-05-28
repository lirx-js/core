import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function distinctObservable<GValue>(
  subscribe: IObservable<GValue>,
  previousValue?: GValue,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    return subscribe((value: GValue): void => {
      if (value !== previousValue) {
        previousValue = value;
        emit(value);
      }
    });
  };
}

// /**
//  * @see distinctObserverPipe
//  */
// export function distinctObservable<GValue>(
//   subscribe: IObservable<GValue>,
// ): IObservable<GValue> {
//   return transformObservableWithObserverPipe<GValue, GValue>(subscribe, distinctObserverPipe<GValue>());
// }
