import { IUnsubscribe } from '@lirx/utils';
import {
  debounceMicrotaskObservable,
} from '../../../observable/pipes/built-in/without-notifications/time-related/debounce-microtask/debounce-microtask-observable';
import { IObservable, IUnsubscribeOfObservable } from '../../../observable/type/observable.type';
import { createMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { runSignalWriteModeContext } from '../internal/allow-signal-writes/allow-signal-writes-context';
import { observeSignalChangesInContext } from '../internal/register-signal/signal-get-called';
import { IEffectOptions } from './effect-options.type';
import { IEffetFunction } from './effet-function.type';

export function effect(
  effectFunction: IEffetFunction,
  {
    signalWriteMode = 'forbid',
  }: IEffectOptions = {},
): IUnsubscribe {
  // TODO prevent effect in effect
  let unsubscribeOfSignals: IUnsubscribeOfObservable;
  let cleanUpSource: IMulticastSource<void>;

  const signalsChange$: IObservable<unknown> = debounceMicrotaskObservable(
    observeSignalChangesInContext((): void => {
      if (cleanUpSource !== void 0) {
        cleanUpSource.emit();
      }
      cleanUpSource = createMulticastSource<void>();

      runSignalWriteModeContext(signalWriteMode, (): void => {
        effectFunction(cleanUpSource.subscribe);
      });
    }),
  );

  const update = (): void => {
    unsubscribeOfSignals = signalsChange$((): void => {
      unsubscribeOfSignals();
      update();
    });
  };

  update();

  return (): void => {
    unsubscribeOfSignals();
  };
}
