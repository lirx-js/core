import {
  createAbortError,
  createEventListener,
  INullish,
  IRemoveEventListener,
  isNullish,
  toTypedEventTarget,
} from '@lirx/utils';
import { notificationsToLastValueObservable } from '../../../../../pipes/built-in/with-notifications/others/notifications-to-values/derived/notifications-to-last-value/notifications-to-last-value-observable';
import { IObservable } from '../../../../../type/observable.type';
import { IObservableToPromiseOptions } from '../../../without-notifications/promise/to-promise';
import { IObservableToPromiseNotifications } from '../all/to-promise-all';

export type IObservableToPromiseLastOptions = IObservableToPromiseOptions;

export function toPromiseLast<GValue>(
  subscribe: IObservable<IObservableToPromiseNotifications<GValue>>,
  options?: IObservableToPromiseLastOptions,
): Promise<GValue> {
  return new Promise<GValue>(
    (resolve: (value: GValue) => void, reject: (reason: any) => void): void => {
      let removeAbortEventListener: IRemoveEventListener;
      const signal: AbortSignal | INullish = options?.signal;

      if (!isNullish(signal)) {
        if (signal.aborted) {
          return reject(createAbortError({ signal }));
        } else {
          removeAbortEventListener = createEventListener<'abort', Event>(
            toTypedEventTarget(signal),
            'abort',
            (): void => {
              _reject(createAbortError({ signal }));
            },
          );
        }
      }

      const end = (): void => {
        if (removeAbortEventListener !== void 0) {
          removeAbortEventListener();
        }
      };

      const _resolve = (value: GValue): void => {
        end();
        resolve(value);
      };

      const _reject = (error: any): void => {
        end();
        reject(error);
      };

      const _subscribe: IObservable<GValue> = notificationsToLastValueObservable<GValue>(
        subscribe,
        _reject,
      );

      _subscribe(_resolve);
    },
  );
}
