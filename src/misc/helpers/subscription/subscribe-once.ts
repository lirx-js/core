import { futureUnsubscribe } from '@lirx/unsubscribe';
import { IObservable, IUnsubscribeOfObservable } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';

export function subscribeOnce<GValue>(
  subscribe: IObservable<GValue>,
  emit: IObserver<GValue>,
): IUnsubscribeOfObservable {
  return futureUnsubscribe((unsubscribe: IUnsubscribeOfObservable): IUnsubscribeOfObservable => {
    return subscribe((value: GValue): void => {
      unsubscribe();
      emit(value);
    });
  });

  // return subscribeWithUnsubscribeArgument<GValue>(subscribe, (value: GValue, unsubscribe: IUnsubscribe): void => {
  //   unsubscribe();
  //   emit(value);
  // });
}
