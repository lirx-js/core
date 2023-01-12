import { createEventListener, IRemoveEventListener, noop, toTypedEventTarget, INullish, isNullish } from '@lirx/utils';
import { STATIC_COMPLETE_NOTIFICATION } from '../../../../../../misc/notifications/built-in/complete/complete-notification.constant';
import { createErrorNotification } from '../../../../../../misc/notifications/built-in/error/create-error-notification';
import { createAbortErrorNotification } from '../../../../../../misc/notifications/built-in/error/derived/create-abort-error-notification';
import { createNextNotification } from '../../../../../../misc/notifications/built-in/next/create-next-notification';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribe } from '../../../../../type/observable.type';
import {
  IFromPromiseFactoryCreatePromiseFunction,
  IFromPromiseFactoryObservableNotifications,
  IFromPromiseFactoryObservableOptions,
} from './from-promise-factory-observable-notifications.type';

/**
 * Creates an Observable from a promise factory function
 * This function is called immediately with an AbortSignal which should be used to abort any async job if the Observable is unsubscribed.
 * INFO: you may provide yourself an AbortSignal in the 'options'.
 *  - if this one is already aborted, the Observable emits an 'abort' notification, and 'createPromise' is never called
 *  - else, the 'signal' arguments of 'createPromise' is directly linked with the provided one.
 */
export function fromPromiseFactory<GValue>(
  createPromise: IFromPromiseFactoryCreatePromiseFunction<GValue>,
  options?: IFromPromiseFactoryObservableOptions,
): IObservable<IFromPromiseFactoryObservableNotifications<GValue>> {
  type GNotificationsUnion = IFromPromiseFactoryObservableNotifications<GValue>;

  const signal: AbortSignal | INullish = options?.signal;

  return (emit: IObserver<GNotificationsUnion>): IUnsubscribe => {
    if (signal?.aborted) {
      emit(createAbortErrorNotification({ signal }));
      return noop;
    } else {
      let running: boolean = true;

      const abortController: AbortController = new AbortController();

      const end = (): void => {
        running = false;
        if (removeAbortEventListener !== void 0) {
          removeAbortEventListener();
        }
      };

      const next = (value: GValue): void => {
        if (running) {
          emit(createNextNotification<GValue>(value));
        }
      };

      const complete = (): void => {
        if (running) {
          end();
          emit(STATIC_COMPLETE_NOTIFICATION);
        }
      };

      const error = (error: any): void => {
        if (running) {
          end();
          emit(createErrorNotification<any>(error));
        }
      };

      const abort = (): void => {
        if (running) {
          end();
          emit(createAbortErrorNotification({ signal: signal as AbortSignal }));
        }
      };

      let removeAbortEventListener: IRemoveEventListener;

      if (!isNullish(signal)) {
        removeAbortEventListener = createEventListener<'abort', Event>(
          toTypedEventTarget(signal),
          'abort',
          (): void => {
            abort();
            abortController.abort();
          },
        );
      }

      createPromise(abortController.signal)
        .then(
          (value: GValue): void => {
            next(value);
            complete();
          },
          error,
        );

      return (): void => {
        if (running) {
          end();
          abortController.abort();
        }
      };
    }
  };
}
