import { merge } from '../../../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { defer } from '../../../../observable/built-in/from/without-notifications/values/defer/defer';
import { IObservable } from '../../../../observable/type/observable.type';
import { Context } from '../context.class';
import { IGenericSignalClass, SignalClass } from '../signal.class';

const SIGNALS_CONTEXT = new Context<Set<IGenericSignalClass>>(new Set<IGenericSignalClass>());

/**
 * Registers a signal in this context.
 */
export function signalGetCalled(
  signal: SignalClass<any>,
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
  return defer(() => {
    const signals: Set<IGenericSignalClass> = new Set<IGenericSignalClass>();
    SIGNALS_CONTEXT.run(signals, callback);

    return merge(
      Array.from(
        signals,
        (signal: IGenericSignalClass): IObservable<unknown> => {
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

