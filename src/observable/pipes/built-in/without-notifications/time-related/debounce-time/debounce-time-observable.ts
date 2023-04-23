import { createTimeout, IAbortTimer } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function debounceTimeObservable<GValue>(
  subscribe: IObservable<GValue>,
  duration: number,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let abortTimeout: IAbortTimer | null = null;

    const unsubscribe: IUnsubscribeOfObservable = subscribe((value: GValue): void => {
      if (abortTimeout !== null) {
        abortTimeout();
      }
      abortTimeout = createTimeout((): void => {
        abortTimeout = null;
        emit(value);
      }, duration);
    });

    return (): void => {
      unsubscribe();
      if (abortTimeout !== null) {
        abortTimeout();
      }
    };
  };
}
