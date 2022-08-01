import { fulfilledObservable } from '../../../../../../../../pipes/built-in/with-notifications/then/derived/fulfilled/fulfilled-observable';
import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservable } from '../../../../../../../../type/observable.type';
import { responseToBodyObservable } from '../../body/response-to-body-observable';
import { IFromFetchTextObservableNotifications } from '../from-fetch-text-observable-notifications.type';
import { responseToText } from './response-to-text';

export const responseToTextObservableRaw = responseToBodyObservable<string>(responseToText);

export function responseToTextObservable(
  subscribe: IObservable<IThenObservableInNotifications<Response>>,
): IObservable<IFromFetchTextObservableNotifications> {
  return fulfilledObservable(
    subscribe,
    responseToTextObservableRaw,
  );
}
