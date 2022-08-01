import { fulfilledObservable } from '../../../../../../../../pipes/built-in/with-notifications/then/derived/fulfilled/fulfilled-observable';
import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservable } from '../../../../../../../../type/observable.type';
import { responseToBodyObservable } from '../../body/response-to-body-observable';
import { IFromFetchArrayBufferObservableNotifications } from '../from-fetch-array-buffer-observable-notifications.type';
import { responseToArrayBuffer } from './response-to-array-buffer';

export const responseToArrayBufferObservableRaw = responseToBodyObservable<ArrayBuffer>(responseToArrayBuffer);

export function responseToArrayBufferObservable(
  subscribe: IObservable<IThenObservableInNotifications<Response>>,
): IObservable<IFromFetchArrayBufferObservableNotifications> {
  return fulfilledObservable(
    subscribe,
    responseToArrayBufferObservableRaw,
  );
}
