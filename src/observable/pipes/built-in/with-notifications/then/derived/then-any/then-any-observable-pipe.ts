import { IObservable } from '../../../../../../type/observable.type';
import { IObservablePipe } from '../../../../../type/observable-pipe.type';
import { IThenObservableInNotifications } from '../../then-observable';
import { thenAnyObservable } from './then-any-observable';
import { IThenAnyObservableCallback } from './then-any-observable-callback.type';

export function thenAnyObservablePipe<GInNextValue, GOut>(
  onThenAny: IThenAnyObservableCallback<GInNextValue, GOut>,
): IObservablePipe<IThenObservableInNotifications<GInNextValue>, GOut> {
  return (subscribe: IObservable<IThenObservableInNotifications<GInNextValue>>): IObservable<GOut> => {
    return thenAnyObservable<GInNextValue, GOut>(subscribe, onThenAny);
  };
}
