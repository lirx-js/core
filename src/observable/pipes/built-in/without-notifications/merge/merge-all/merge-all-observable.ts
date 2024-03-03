import { IObserver } from '../../../../../../observer/type/observer.type';
import { IHigherOrderObservable } from '../../../../../type/derived/higher-order-observable.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function mergeAllObservable<GValue>(
  subscribe: IHigherOrderObservable<GValue>,
  maxNumberOfSubscriptions: number = Number.POSITIVE_INFINITY,
): IObservable<GValue> {
  maxNumberOfSubscriptions = Math.max(0, maxNumberOfSubscriptions);
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let running: boolean = true;
    const childrenUnsubscribeFunctions: IUnsubscribeOfObservable[] = [];
    const unsubscribe = subscribe((childSubscribe: IObservable<GValue>): void => {
      childrenUnsubscribeFunctions.push(childSubscribe(emit));
      if (childrenUnsubscribeFunctions.length > maxNumberOfSubscriptions) {
        (childrenUnsubscribeFunctions.shift() as IUnsubscribeOfObservable)();
      }
    });
    return (): void => {
      if (running) {
        running = false;
        unsubscribe();
        for (let i = 0, l = childrenUnsubscribeFunctions.length; i < l; i++) {
          childrenUnsubscribeFunctions[i]();
        }
      }
    };
  };
}
