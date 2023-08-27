import { ISignalToObservableOptions } from './signal-to-observable-options.type';
import { IObservable } from '../../../../../observable/type/observable.type';

export interface IReadonlySignalToObservableFunction<GValue> {
  (
    options?: ISignalToObservableOptions,
  ): IObservable<GValue>;
}
