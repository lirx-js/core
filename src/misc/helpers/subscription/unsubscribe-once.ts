import { noop } from '@lirx/utils';
import { IUnsubscribe } from '../../../observable/type/observable.type';

export function unsubscribeOnce(
  unsubscribe: IUnsubscribe,
): IUnsubscribe {
  return (): void => {
    unsubscribe();
    unsubscribe = noop;
  };
}

