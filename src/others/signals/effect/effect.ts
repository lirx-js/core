import { IUnsubscribe } from '@lirx/utils';
import {
  debounceMicrotaskObservable,
} from '../../../observable/pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import { IObservable, IUnsubscribeOfObservable } from '../../../observable/type/observable.type';
import { createMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { runSignalContextAndObserveChanges } from '../internal/run-signal-context';
import { IEffectOptions } from './effect-options.type';
import { IEffetFunction } from './effet-function.type';

export function effect(
  effectFunction: IEffetFunction,
  {
    allowSignalWrites = false,
  }: IEffectOptions = {},
): IUnsubscribe {
  let unsubscribeOfSignals: IUnsubscribeOfObservable;
  let cleanUpSource: IMulticastSource<void>;

  const update = (): void => {
    if (cleanUpSource !== void 0) {
      cleanUpSource.emit();
    }
    cleanUpSource = createMulticastSource<void>();

    const signalsChange$: IObservable<unknown> = runSignalContextAndObserveChanges(
      (): void => {
        effectFunction(cleanUpSource.subscribe);
      },
      {
        allowSignalWrites,
        throwIfChildSignalContext: true,
      },
    );

    unsubscribeOfSignals = debounceMicrotaskObservable(signalsChange$)((): void => {
      unsubscribeOfSignals();
      update();
    });
  };

  update();

  return (): void => {
    unsubscribeOfSignals();
  };
}
