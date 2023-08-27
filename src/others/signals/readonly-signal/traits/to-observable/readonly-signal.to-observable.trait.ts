import { IReadonlySignalToObservableFunction } from './readonly-signal.to-observable.function-definition';

export interface IReadonlySignalToObservableTrait<GValue> {
  toObservable: IReadonlySignalToObservableFunction<GValue>;
}
