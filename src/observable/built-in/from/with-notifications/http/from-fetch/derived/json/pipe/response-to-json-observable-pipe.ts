import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservablePipe } from '../../../../../../../../pipes/type/observable-pipe.type';
import { IObservable } from '../../../../../../../../type/observable.type';
import { IFromFetchJSONObservableNotifications } from '../from-fetch-json-observable-notifications.type';
import { responseToJSONObservable } from './response-to-json-observable';

export function responseToJSONObservablePipe<GData>(): IObservablePipe<IThenObservableInNotifications<Response>, IFromFetchJSONObservableNotifications<GData>> {
  return (subscribe: IObservable<IThenObservableInNotifications<Response>>): IObservable<IFromFetchJSONObservableNotifications<GData>> => {
    return responseToJSONObservable<GData>(subscribe);
  };
}
