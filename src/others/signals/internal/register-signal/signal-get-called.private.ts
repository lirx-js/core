import { IGenericPureReadonlySignal } from '../../readonly-signal/readonly-signal.type';
import { Context } from '../context.class.private';
import { IObservable } from '../../../../observable/type/observable.type';
import { defer } from '../../../../observable/built-in/from/without-notifications/values/defer/defer';
import { merge } from '../../../../observable/built-in/from/without-notifications/many-observables/merge/merge';

const SIGNALS_CONTEXT = new Context<Set<IGenericPureReadonlySignal>>(new Set<IGenericPureReadonlySignal>());

/**
 * Registers a signal in this context.
 */
export function signalGetCalled(
  signal: IGenericPureReadonlySignal,
): void {
  SIGNALS_CONTEXT.get().add(signal);
}

/**
 * Creates an Observables which on subscription:
 * observes the signals used, and when one of them changes
 */
export function observeSignalChangesInContext(
  callback: () => void,
): IObservable<unknown> {
  return defer((): IObservable<unknown> => {
    const signals: Set<IGenericPureReadonlySignal> = new Set<IGenericPureReadonlySignal>();
    SIGNALS_CONTEXT.run(signals, callback);

    return merge(
      Array.from(
        signals,
        (signal: IGenericPureReadonlySignal): IObservable<unknown> => {
          return signal.toObservable({
            emitCurrentValue: false,
            debounce: false,
          });
        },
      ),
    );
  });
}

/**
 * Runs a context in which signals are not observed.
 */
export function runOutsideSignalChangesContext<GReturn>(
  callback: () => GReturn,
): GReturn {
  return SIGNALS_CONTEXT.run<GReturn>(new Set(), callback);
}

