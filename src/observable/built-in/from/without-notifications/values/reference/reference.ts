import { noop } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export interface IGetReferenceValue<GValue> {
  (): GValue;
}

export function reference<GValue>(getValue: IGetReferenceValue<GValue>): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    emit(getValue());
    return noop;
  };
}
