import { noop } from '@lirx/utils';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';

export function empty<GValue = any>(): IObservable<GValue> {
  return (): IUnsubscribe => {
    return noop;
  };
}
