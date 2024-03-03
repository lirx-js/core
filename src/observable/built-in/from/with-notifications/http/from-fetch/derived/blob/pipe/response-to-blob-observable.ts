import { fulfilledObservable } from '../../../../../../../../pipes/built-in/with-notifications/then/derived/fulfilled/fulfilled-observable';
import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservable } from '../../../../../../../../type/observable.type';
import { responseToBodyObservable } from '../../body/response-to-body-observable';
import { IFromFetchBlobObservableNotifications } from '../from-fetch-blob-observable-notifications.type';
import { responseToBlob } from './response-to-blob';

export const responseToBlobObservableRaw = responseToBodyObservable<Blob>(responseToBlob);

export function responseToBlobObservable(
  subscribe: IObservable<IThenObservableInNotifications<Response>>,
): IObservable<IFromFetchBlobObservableNotifications> {
  return fulfilledObservable(subscribe, responseToBlobObservableRaw);
}
