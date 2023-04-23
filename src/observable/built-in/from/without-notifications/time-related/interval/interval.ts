import { createInterval } from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

/**
 * Creates an Observable that emits no value (void) every specified interval of time.
 */
export function interval(
  period: number,
): IObservable<void> {
  return (emit: IObserver<void>): IUnsubscribeOfObservable => {
    return createInterval(emit, period);
  };
}
