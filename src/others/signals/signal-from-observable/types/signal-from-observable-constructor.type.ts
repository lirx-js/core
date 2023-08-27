import { IObservable } from '../../../../observable/type/observable.type';
import { ISignalFromObservable } from '../signal-from-observable.type';
import { ISignalFromObservableOptions } from './signal-from-observable-options.type';

export interface ISignalFromObservableConstructor {
  new<GValue>(
    value$: IObservable<GValue>,
    options?: ISignalFromObservableOptions<GValue>,
  ): ISignalFromObservable<GValue>;
}
