import { createImmediate, IAbortTimer } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function debounceImmediateObservable<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let abortTimeout: IAbortTimer | null = null;

    const unsubscribe: IUnsubscribeOfObservable = subscribe((value: GValue): void => {
      if (abortTimeout !== null) {
        abortTimeout();
      }
      abortTimeout = createImmediate((): void => {
        abortTimeout = null;
        emit(value);
      });
    });

    return (): void => {
      unsubscribe();
      if (abortTimeout !== null) {
        abortTimeout();
      }
    };
  };
}
