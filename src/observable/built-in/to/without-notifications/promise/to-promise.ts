import { isAbortSignal } from '../../../../../misc/abortable/is/is-abort-signal';
import { createAbortError, createEventListener, IRemoveEventListener, toTypedEventTarget } from '@lirx/utils';
import { futureUnsubscribe } from '../../../../../misc/helpers/subscription/future-unsubscribe';
import { IObservable, IUnsubscribe } from '../../../../type/observable.type';

export interface IObservableToPromiseOptions {
  signal?: AbortSignal;
}

export function toPromise<GValue>(
  subscribe: IObservable<GValue>,
  options?: IObservableToPromiseOptions,
): Promise<GValue> {
  return new Promise<GValue>((
    resolve: (value: GValue) => void,
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
            removeAbortEventListener();
            unsubscribe();
            reject(createAbortError({ signal }));
          });
      }
    }

    const unsubscribe: IUnsubscribe = futureUnsubscribe((
      unsubscribe: IUnsubscribe,
    ): IUnsubscribe => {
      return subscribe((value: GValue): void => {
        if (removeAbortEventListener !== void 0) {
          removeAbortEventListener();
        }
        unsubscribe();
        resolve(value);
      });
    });
  });
}

