import { createMicrotask, IAbortTimer } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function debounceMicrotaskObservable<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let abortMicrotask: IAbortTimer | null = null;

    const unsubscribe: IUnsubscribeOfObservable = subscribe((value: GValue): void => {
      if (abortMicrotask !== null) {
        abortMicrotask();
      }
      abortMicrotask = createMicrotask((): void => {
        abortMicrotask = null;
        emit(value);
      });
    });

    return (): void => {
      unsubscribe();
      if (abortMicrotask !== null) {
        abortMicrotask();
      }
    };
  };
}
