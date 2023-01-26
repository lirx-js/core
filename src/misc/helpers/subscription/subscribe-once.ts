import { IObservable, IUnsubscribe } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';
import { futureUnsubscribe } from './future-unsubscribe';

export function subscribeOnce<GValue>(
  subscribe: IObservable<GValue>,
  emit: IObserver<GValue>,
): IUnsubscribe {
  return futureUnsubscribe((unsubscribe: IUnsubscribe): IUnsubscribe => {
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

