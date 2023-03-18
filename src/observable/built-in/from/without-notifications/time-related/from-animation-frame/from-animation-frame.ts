import { createAnimationFrame, createAnimationFrameLoop } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function fromAnimationFrame(): IObservable<void> {
  return (emit: IObserver<void>): IUnsubscribeOfObservable => {
    return createAnimationFrameLoop(emit);
  };
}

export function fromSingleAnimationFrame(): IObservable<void> {
  return (emit: IObserver<void>): IUnsubscribeOfObservable => {
    return createAnimationFrame(emit);
  };
}
