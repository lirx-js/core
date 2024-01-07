import { IUnsubscribe } from '@lirx/unsubscribe';
import { createTimeout, IAbortTimer } from '@lirx/utils';
import { IObserverWithCleanUp } from '../../../../type/observer-with-clean-up.type';
import { IObserver } from '../../../../type/observer.type';

/**
 * @deprecated
 * @experimental
 * BAD because the timer cannot be cancelled
 */
export function debounceTimeObserver<GValue>(
  emit: IObserver<GValue>,
  duration: number,
): IObserverWithCleanUp<GValue> {
  let abortTimeout: IAbortTimer | null = null;

  const end = (): void => {
    if (abortTimeout !== null) {
      abortTimeout();
    }
  };

  return (value: GValue): IUnsubscribe => {
    end();

    abortTimeout = createTimeout((): void => {
      abortTimeout = null;
      emit(value);
    }, duration);

    return end;
  };
}
