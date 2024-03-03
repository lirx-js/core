import { IObserver } from '../../../../../observer/type/observer.type';

export interface ISourceObservableOnUnsubscribeFunction<GValue> {
  (emit: IObserver<GValue>): boolean;
}
