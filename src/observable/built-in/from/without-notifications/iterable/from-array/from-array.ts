import { noop } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function fromArray<GValue>(
  array: ArrayLike<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    for (let i = 0, l = array.length; i < l; i++) {
      emit(array[i]);
    }
    return noop;
  };
}
