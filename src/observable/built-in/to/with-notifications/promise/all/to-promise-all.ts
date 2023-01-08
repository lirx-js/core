import { isAbortSignal } from '../../../../../../misc/abortable/is/is-abort-signal';
import { createAbortError, createEventListener, IRemoveEventListener, toTypedEventTarget } from '@lirx/utils';
import { IDefaultInNotificationsUnion } from '../../../../../../misc/notifications/default-notifications-union.type';
import {
  notificationsToValuesObservable,
} from '../../../../../pipes/built-in/with-notifications/others/notifications-to-values/notifications-to-values-observable';
import { IObservable } from '../../../../../type/observable.type';
import { IObservableToPromiseOptions } from '../../../without-notifications/promise/to-promise';

export type IObservableToPromiseNotifications<GValue> = IDefaultInNotificationsUnion<GValue>;

export interface IObservableToPromiseAllOptions extends IObservableToPromiseOptions {
  maxNumberOfValues?: number; // (default: Infinity)
}

export function toPromiseAll<GValue>(
  subscribe: IObservable<IObservableToPromiseNotifications<GValue>>,
  options?: IObservableToPromiseAllOptions,
): Promise<GValue[]> {
  return new Promise<GValue[]>((
    resolve: (value: GValue[]) => void,
    reject: (reason: any) => void,
  ): void => {
    let removeAbortEventListener: IRemoveEventListener;
    if ((options !== void 0) && isAbortSignal(options.signal)) {
      const signal: AbortSignal = options.signal;
      if (signal.aborted) {
        return reject(createAbortError({ signal }));
      } else {
        removeAbortEventListener = createEventListener<'abort', Event>(
          toTypedEventTarget(signal),
          'abort',
          (): void => {
            _reject(createAbortError({ signal }));
          });
      }
    }

    const end = (): void => {
      if (removeAbortEventListener !== void 0) {
        removeAbortEventListener();
      }
    };

    const _resolve = (values: GValue[]): void => {
      end();
      resolve(values);
    };

    const _reject = (error: any): void => {
      end();
      reject(error);
    };

    const _subscribe: IObservable<GValue[]> = notificationsToValuesObservable<GValue>(
      subscribe,
      _reject,
      options?.maxNumberOfValues,
    );

    _subscribe(_resolve);
  });
}

