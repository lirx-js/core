import { fulfilledObservable } from '../../../../../../../../pipes/built-in/with-notifications/then/derived/fulfilled/fulfilled-observable';
import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservable } from '../../../../../../../../type/observable.type';
import { responseToBodyObservable } from '../../body/response-to-body-observable';
import { IFromFetchJSONObservableNotifications } from '../from-fetch-json-observable-notifications.type';
import { responseToJSON } from './response-to-json';

export function responseToJSONObservable<GData>(
  subscribe: IObservable<IThenObservableInNotifications<Response>>,
): IObservable<IFromFetchJSONObservableNotifications<GData>> {
  return fulfilledObservable(
    subscribe,
    responseToBodyObservable<GData>(responseToJSON),
  );
}
