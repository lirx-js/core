import { merge } from '../../../observable/built-in/from/without-notifications/many-observables/merge/merge';
import { IObservable } from '../../../observable/type/observable.type';
import { runAllowSignalWritesContext } from './allow-signal-writes';
import { runRegisterSignalFunctionContext } from './register-signal-function';
import { IGenericSuperSignal } from './super-signal.class';

let IS_IN_SIGNAL_CONTEXT: boolean = false;

export function runIsInSignalContext<GReturn>(
  contextFunction: () => GReturn,
  isInSignalContext: boolean,
): GReturn {
  const currentIsInSignalContext: boolean = IS_IN_SIGNAL_CONTEXT;
  IS_IN_SIGNAL_CONTEXT = isInSignalContext;
  try {
    return contextFunction();
  } finally {
    IS_IN_SIGNAL_CONTEXT = currentIsInSignalContext;
  }
}

/* GLOBAL CONTEXT USED BY A SIGNAL */

export interface ISignalContextFunction {
  (): void;
}

export interface IRunSignalContextOptions {
  allowSignalWrites: boolean;
  throwIfChildSignalContext: boolean;
}

export function runSignalContext(
  signalContextFunction: ISignalContextFunction,
  {
    allowSignalWrites,
    throwIfChildSignalContext,
  }: IRunSignalContextOptions,
): Set<IGenericSuperSignal> {
  if (IS_IN_SIGNAL_CONTEXT && throwIfChildSignalContext) {
    throw new Error(`Already in a signal context`);
  }

  return runIsInSignalContext((): Set<IGenericSuperSignal> => {
    const signals: Set<IGenericSuperSignal> = new Set<IGenericSuperSignal>();

    runRegisterSignalFunctionContext(
      (): void => {
        runAllowSignalWritesContext(signalContextFunction, allowSignalWrites);
      },
      (signal: IGenericSuperSignal): void => {
        signals.add(signal);
      },
    );

    return signals;
  }, true);
}

export function runSignalContextAndObserveChanges(
  signalContextFunction: ISignalContextFunction,
  options: IRunSignalContextOptions,
): IObservable<unknown> {
  return merge(
    Array.from(
      runSignalContext(signalContextFunction, options),
      (signal: IGenericSuperSignal): IObservable<unknown> => {
        return signal.toObservable({
          emitCurrentValue: false,
          debounce: false,
        });
      },
    ),
  );
}
