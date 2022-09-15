import { IObserver } from '../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../observable/type/observable.type';
import { ISubscription } from './subscription.type';

/**
 * @deprecated
 */
export function createSubscription<GValue>(
  subscribe: IObservable<GValue>,
  emit: IObserver<GValue>,
): ISubscription<GValue> {

  let unsubscribe: IUnsubscribe | null = null;

  const isActivated = (): boolean => {
    return unsubscribe !== null;
  };

  const activate = (): ISubscription<GValue> => {
    if (unsubscribe === null) {
      unsubscribe = subscribe(emit);
    }
    return subscription;
  };

  const deactivate = (): ISubscription<GValue> => {
    if (unsubscribe !== null) {
      unsubscribe();
      unsubscribe = null;
    }
    return subscription;
  };

  const toggle = (
    _activate: boolean = !isActivated(),
  ): ISubscription<GValue> => {
    if (_activate) {
      return activate();
    } else {
      return deactivate();
    }
  };

  const subscription: ISubscription<GValue> = {
    subscribe,
    emit,
    isActivated,
    activate,
    deactivate,
    toggle,
  };

  return subscription;
}
