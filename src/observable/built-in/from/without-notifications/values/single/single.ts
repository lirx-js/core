import { noop } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function single<GValue>(value: GValue): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    emit(value);
    return noop;
  };
}
