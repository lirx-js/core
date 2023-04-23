import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

/**
 * @deprecated use debugObservable instead
 */
export function logStateObservable<GValue>(
  subscribe: IObservable<GValue>,
  name: string,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    console.log(`${name} -> subscribe`);
    const unsubscribe: IUnsubscribeOfObservable = subscribe(emit);
    return (): void => {
      console.log(`${name} -> unsubscribe`);
      unsubscribe();
    };
  };
}
