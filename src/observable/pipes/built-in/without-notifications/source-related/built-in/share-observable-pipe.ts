import { IObservable } from '../../../../../type/observable.type';
import { IObservablePipe } from '../../../../type/observable-pipe.type';
import { IShareObservableOptions, shareObservable } from './share-observable';

// https://rxjs-dev.firebaseapp.com/guide/subject
// https://rxjs-dev.firebaseapp.com/api/operators/refCount
// https://rxjs-dev.firebaseapp.com/api/operators/share
// https://rxjs-dev.firebaseapp.com/api/operators/multicast
// https://rxjs-dev.firebaseapp.com/api/operators/publish

/*
share <=> multicast(() => new Subject()), refCount())
share <=> pipe(publish(), refCount())

 */

export function shareObservablePipe<GValue>(
  options?: IShareObservableOptions<GValue>,
): IObservablePipe<GValue, GValue> {
  return (subscribe: IObservable<GValue>): IObservable<GValue> => {
    return shareObservable<GValue>(subscribe, options);
  };
}
