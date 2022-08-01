import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservablePipe } from '../../../../../../../../pipes/type/observable-pipe.type';
import { IObservable } from '../../../../../../../../type/observable.type';
import { IFromFetchStreamObservableNotifications } from '../from-fetch-stream-observable-notifications.type';
import { responseToStreamObservable } from './response-to-stream-observable';

export function responseToStreamObservablePipe(): IObservablePipe<IThenObservableInNotifications<Response>, IFromFetchStreamObservableNotifications> {
  return (subscribe: IObservable<IThenObservableInNotifications<Response>>): IObservable<IFromFetchStreamObservableNotifications> => {
    return responseToStreamObservable(subscribe);
  };
}
