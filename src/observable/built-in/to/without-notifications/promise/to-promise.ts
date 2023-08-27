import { createAbortError, createEventListener, INullish, IRemoveEventListener, isNullish, toTypedEventTarget } from '@lirx/utils';
import { IObservable, IUnsubscribeOfObservable } from '../../../../type/observable.type';
import { futureUnsubscribe } from '@lirx/unsubscribe';

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
    const signal: AbortSignal | INullish = options?.signal;

    if (!isNullish(signal)) {
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

    const unsubscribe: IUnsubscribeOfObservable = futureUnsubscribe((
      unsubscribe: IUnsubscribeOfObservable,
    ): IUnsubscribeOfObservable => {
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

