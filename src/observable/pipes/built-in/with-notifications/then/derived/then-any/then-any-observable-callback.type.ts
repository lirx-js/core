import { IObservable } from '../../../../../../type/observable.type';

export interface IThenAnyObservableCallbackValueFulfilled<GInNextValue> {
  state: 'fulfilled';
  value: GInNextValue;
}

export interface IThenAnyObservableCallbackValueRejected {
  state: 'rejected';
  error: unknown;
}

export type IThenAnyObservableCallbackValue<GInNextValue> =
  | IThenAnyObservableCallbackValueFulfilled<GInNextValue>
  | IThenAnyObservableCallbackValueRejected;

export interface IThenAnyObservableCallback<GInNextValue, GOut> {
  (value: IThenAnyObservableCallbackValue<GInNextValue>): IObservable<GOut>;
}
