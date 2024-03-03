import { IThenObservableInNotifications } from '../../../../../../../../pipes/built-in/with-notifications/then/then-observable';
import { IObservablePipe } from '../../../../../../../../pipes/type/observable-pipe.type';
import { IObservable } from '../../../../../../../../type/observable.type';
import { IFromFetchBlobObservableNotifications } from '../from-fetch-blob-observable-notifications.type';
import { responseToBlobObservable } from './response-to-blob-observable';

export function responseToBlobObservablePipe(): IObservablePipe<
  IThenObservableInNotifications<Response>,
  IFromFetchBlobObservableNotifications
> {
  return (
    subscribe: IObservable<IThenObservableInNotifications<Response>>,
  ): IObservable<IFromFetchBlobObservableNotifications> => {
    return responseToBlobObservable(subscribe);
  };
}
