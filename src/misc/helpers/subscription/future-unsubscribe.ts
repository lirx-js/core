import { noop } from '@lirx/utils';
import { IUnsubscribe } from '../../../observable/type/observable.type';

export interface IRunning {
  (): boolean;
}

export interface IFutureUnsubscribeFunction {
  (
    unsubscribe: IUnsubscribe,
    running: IRunning,
  ): IUnsubscribe;
}

export function futureUnsubscribe(
  callback: IFutureUnsubscribeFunction,
): IUnsubscribe {
  let unsubscribe: IUnsubscribe;
  let mustUnsubscribe: boolean = false;
  let running: boolean = true;

  const _unsubscribeOnce: IUnsubscribe = (): void => {
    running = false;
    unsubscribe();
    unsubscribe = noop;
  };

  unsubscribe = callback(
    (): void => {
      if (unsubscribe === void 0) {
        mustUnsubscribe = true;
        running = false;
      } else {
        _unsubscribeOnce();
      }
    },
    (): boolean => {
      return running;
    },
  );

  if (mustUnsubscribe) {
    unsubscribe();
    return noop;
  } else {
    return _unsubscribeOnce;
  }
}
