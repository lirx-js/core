import { IReadonlySignalToObservableFunction } from './readonly-signal.to-observable.function-definition';

export interface IReadonlySignalToObservableTrait<GValue> {
  readonly toObservable: IReadonlySignalToObservableFunction<GValue>;
}
