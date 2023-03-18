import { createAnimationFrame, IAbortTimer } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function debounceFrameObservable<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let abortAnimationFrame: IAbortTimer | null = null;

    const unsubscribe: IUnsubscribeOfObservable = subscribe((value: GValue): void => {
      if (abortAnimationFrame !== null) {
        abortAnimationFrame();
      }
      abortAnimationFrame = createAnimationFrame((): void => {
        abortAnimationFrame = null;
        emit(value);
      });
    });

    return (): void => {
      unsubscribe();
      if (abortAnimationFrame !== null) {
        abortAnimationFrame();
      }
    };
  };
}
