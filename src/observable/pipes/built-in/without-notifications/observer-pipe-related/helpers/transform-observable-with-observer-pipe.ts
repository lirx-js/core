import { IObserverPipe } from '../../../../../../observer/pipes/type/observer-pipe.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function transformObservableWithObserverPipe<GIn, GOut>(
  subscribe: IObservable<GIn>,
  observerPipe: IObserverPipe<GIn, GOut>,
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribeOfObservable => {
    return subscribe(observerPipe(emit));
  };
}
