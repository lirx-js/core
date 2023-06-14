import { IObservable } from '../../../observable/type/observable.type';
import { ISignalToObservableOptions } from './signal-to-observable-options.type';
import { SIGNAL } from './signal.symbol';

export interface ISignal<GValue> {
  (): GValue;

  /**
   * Converts the Signal to an Observable.
   */
  toObservable(
    options?: ISignalToObservableOptions,
  ): IObservable<GValue>;

  [SIGNAL]: unknown;
}

export type IGenericSignal = ISignal<any>;

