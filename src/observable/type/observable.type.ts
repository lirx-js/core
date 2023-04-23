import { IUnsubscribe } from '@lirx/utils';
import { IObserver } from '../../observer/type/observer.type';

export interface IObservable<GValue> {
  (emit: IObserver<GValue>): IUnsubscribeOfObservable;
}

export type IUnsubscribeOfObservable = IUnsubscribe;

/* derived */

export type IGenericObservable = IObservable<any>;

export type IInferObservableGValue<GObservable extends IGenericObservable> =
  GObservable extends IObservable<infer GValue>
    ? GValue
    : never;

