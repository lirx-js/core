import { createTimeout, IAbortTimer } from '@lirx/utils';
import { IObserver } from '../../../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../../../type/observable.type';

export function bufferTimeObservable<GValue>(
  subscribe: IObservable<GValue>,
  duration: number,
): IObservable<GValue[]> {
  return (emit: IObserver<GValue[]>): IUnsubscribeOfObservable => {
    let currentBuffer: GValue[] = [];
    let abortTimeout: IAbortTimer | null = null;

    const unsubscribe: IUnsubscribeOfObservable = subscribe((value: GValue): void => {
      currentBuffer.push(value);
      if (abortTimeout === null) {
        abortTimeout = createTimeout(() => {
          abortTimeout = null;
          const buffer: GValue[] = currentBuffer;
          currentBuffer = [];
          emit(buffer);
        }, duration);
      }
    });

    return (): void => {
      unsubscribe();
      if (abortTimeout !== null) {
        abortTimeout();
      }
    };
  };
}
