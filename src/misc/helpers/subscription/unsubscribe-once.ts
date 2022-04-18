import { IUnsubscribe } from '../../../observable/type/observable.type';
import { noop } from '../noop';

export function unsubscribeOnce(
  unsubscribe: IUnsubscribe,
): IUnsubscribe {
  return (): void => {
    unsubscribe();
    unsubscribe = noop;
  };
}

