import { createTimeout } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function timeout(duration: number): IObservable<void>;
export function timeout<GValue>(duration: number, getValue?: () => GValue): IObservable<GValue>;
export function timeout<GValue>(
  duration: number,
  getValue?: () => GValue,
): IObservable<GValue | void> {
  return (emit: IObserver<GValue | void>): IUnsubscribeOfObservable => {
    return createTimeout(getValue === void 0 ? emit : (): void => emit(getValue()), duration);
  };
}
