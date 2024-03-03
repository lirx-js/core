import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function bufferObservable<GValue>(
  subscribe: IObservable<GValue>,
  closingObservable: IObservable<any>,
): IObservable<GValue[]> {
  return (emit: IObserver<GValue[]>): IUnsubscribeOfObservable => {
    let currentBuffer: GValue[] = [];

    const unsubscribeOfClosingObservable: IUnsubscribeOfObservable = closingObservable((): void => {
      const buffer: GValue[] = currentBuffer;
      currentBuffer = [];
      emit(buffer);
    });

    const unsubscribeOfSourceObservable: IUnsubscribeOfObservable = subscribe(
      (value: GValue): void => {
        currentBuffer.push(value);
      },
    );

    return (): void => {
      unsubscribeOfClosingObservable();
      unsubscribeOfSourceObservable();
    };
  };
}
