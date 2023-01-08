import { createNetworkErrorFromResponse } from '@lirx/utils';
import { fulfilledObservable } from '../../../../../../../../pipes/built-in/with-notifications/then/derived/fulfilled/fulfilled-observable';
import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservable } from '../../../../../../../../type/observable.type';
import { throwError } from '../../../../../others/throw-error/throw-error';
import { fromReadableStream } from '../../../../../readable-stream/w3c/from-readable-stream/from-readable-stream';
import { IFromFetchStreamObservableNotifications } from '../from-fetch-stream-observable-notifications.type';

export function responseToStreamObservable(
  subscribe: IObservable<IThenObservableInNotifications<Response>>,
): IObservable<IFromFetchStreamObservableNotifications> {
  return fulfilledObservable(
    subscribe,
    (response: Response): IObservable<IFromFetchStreamObservableNotifications> => {
      if (response.ok) {
        if (response.body === null) {
          return throwError(new Error(`Response's body is null`));
        } else {
          return fromReadableStream<Uint8Array>(response.body);
        }
      } else {
        return throwError(createNetworkErrorFromResponse(response));
      }
    },
  );
}
