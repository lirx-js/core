import { ISource } from '../../../../../observer-observable-pair/build-in/source/type/source.type';
import { IObserver } from '../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../type/observable.type';
import { ISourceObservableOptions } from './source-observable-options.type';

export function sourceObservable<GValue>(
  subscribe: IObservable<GValue>,
  {
    getSource,
    subscribePoint = 1,
    unsubscribePoint = (subscribePoint - 1),
  }: ISourceObservableOptions<GValue>,
): IObservable<GValue> {
  let unsubscribe: IUnsubscribeOfObservable;
  let observersCounts: number = 0;
  const source: ISource<GValue> = getSource();
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let running: boolean = true;
    observersCounts++;
    const unsubscribeSource: IUnsubscribeOfObservable = source.subscribe(emit);
    if (observersCounts === subscribePoint) {
      unsubscribe = subscribe((value: GValue): void => {
        source.emit(value);
      });
    }
    return (): void => {
      if (running) {
        running = false;
        unsubscribeSource();
        observersCounts--;
        if (observersCounts === unsubscribePoint) {
          unsubscribe();
        }
      }
    };
  };
}
