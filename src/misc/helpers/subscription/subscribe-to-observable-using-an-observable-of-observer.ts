import { IObservable, IUnsubscribeOfObservable } from '../../../observable/type/observable.type';
import { IObserver } from '../../../observer/type/observer.type';

export function subscribeToObservableUsingAnObservableOfObserver<GValue>(
  observable: IObservable<GValue>,
  observableOfObserver: IObservable<IObserver<GValue>>,
): IUnsubscribeOfObservable {
  let running: boolean = true;
  let _unsubscribeOfObservable: IUnsubscribeOfObservable | undefined;

  const unsubscribeOfObservable: IUnsubscribeOfObservable = (): void => {
    if (_unsubscribeOfObservable !== void 0) {
      _unsubscribeOfObservable();
    }
  };

  const unsubscribeOfObservableOfObserver: IUnsubscribeOfObservable = observableOfObserver((observer: IObserver<GValue>): void => {
    unsubscribeOfObservable();
    _unsubscribeOfObservable = observable(observer);
  });

  return (): void => {
    if (running) {
      running = false;
      unsubscribeOfObservable();
      unsubscribeOfObservableOfObserver();
    }
  };
}
