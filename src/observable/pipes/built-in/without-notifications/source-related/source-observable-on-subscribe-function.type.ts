import { IObserver } from '../../../../../observer/type/observer.type';

export interface ISourceObservableOnSubscribeFunction<GValue> {
  (
    emit: IObserver<GValue>,
  ): boolean;
}
