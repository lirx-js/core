import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservablePipe } from '../../../../../../../../pipes/type/observable-pipe.type';
import { IObservable } from '../../../../../../../../type/observable.type';
import { IFromFetchArrayBufferObservableNotifications } from '../from-fetch-array-buffer-observable-notifications.type';
import { responseToArrayBufferObservable } from './response-to-array-buffer-observable';

export function responseToArrayBufferObservablePipe(): IObservablePipe<IThenObservableInNotifications<Response>, IFromFetchArrayBufferObservableNotifications> {
  return (subscribe: IObservable<IThenObservableInNotifications<Response>>): IObservable<IFromFetchArrayBufferObservableNotifications> => {
    return responseToArrayBufferObservable(subscribe);
  };
}
