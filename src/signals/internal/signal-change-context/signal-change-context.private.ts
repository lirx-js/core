import { Context } from '../context.class.private';

/*-------*/

export type ISignalChangeListener = () => void;

const SIGNAL_CHANGE_CONTEXT = new Context<ISignalChangeListener | undefined>(void 0);

export function getCurrentSignalChangeListener(): ISignalChangeListener | undefined {
  return SIGNAL_CHANGE_CONTEXT.get();
}

export function runSignalChangeContextOnce<GReturn>(
  callback: () => GReturn,
  onChange: ISignalChangeListener,
): GReturn {
  let running: boolean = true;
  return SIGNAL_CHANGE_CONTEXT.run((): void => {
    if (running) {
      running = false;
      onChange();
    }
  }, callback);
}

export function runSignalChangeContext<GReturn>(
  callback: () => GReturn,
  onChange: ISignalChangeListener,
): GReturn {
  return SIGNAL_CHANGE_CONTEXT.run(onChange, callback);
}

/**
 * Runs a context in which signals are not observed.
 */
export function runOutsideSignalChangeContext<GReturn>(
  callback: () => GReturn,
): GReturn {
  return SIGNAL_CHANGE_CONTEXT.run<GReturn>(void 0, callback);
}

/*-------*/

// const SIGNALS_CONTEXT = new Context<Set<IGenericPureReadonlySignal>>(new Set<IGenericPureReadonlySignal>());
//
// /**
//  * Registers a signal in this context.
//  */
// export function signalGetCalled(
//   signal: IGenericPureReadonlySignal,
// ): void {
//   SIGNALS_CONTEXT.get().add(signal);
// }
//
// const options: ISignalToNotificationsObservableOptions = {
//   emitCurrentValue: false,
//   debounce: false,
//   distinct: true,
//   mode: 'notification',
// };
//
// /**
//  * This function runs `callback` and observes all signals in this context.
//  * When one of the signal changes, it calls `onChange`, and then stops observing all these signals.
//  */
// export function runSignalContextAndObserveNextChange(
//   callback: () => void,
//   onChange: () => void,
// ): IUnsubscribe {
//   const signals: Set<IGenericPureReadonlySignal> = new Set<IGenericPureReadonlySignal>();
//   SIGNALS_CONTEXT.run(signals, callback);
//
//   const unsubscriptions: IUnsubscribe[] = [];
//
//   const _onChange = (): void => {
//     unsubscribe();
//     onChange();
//   };
//
//   const iterator: Iterator<IGenericPureReadonlySignal> = signals.values();
//   let result: IteratorResult<IGenericPureReadonlySignal>;
//   while (!(result = iterator.next()).done) {
//     unsubscriptions.push(
//       result.value.toObservable(options)(_onChange)
//     );
//   }
//
//   let running: boolean = true;
//
//   const unsubscribe = (): void => {
//     if (running) {
//       running = false;
//       for (let i = 0, l = unsubscriptions.length; i < l; i++) {
//         unsubscriptions[i]();
//       }
//       unsubscriptions.length = 0;
//     }
//   };
//
//   return unsubscribe;
// }
//
// /**
//  * Runs a context in which signals are not observed.
//  */
// export function runOutsideSignalChangesContext<GReturn>(
//   callback: () => GReturn,
// ): GReturn {
//   return SIGNALS_CONTEXT.run<GReturn>(new Set(), callback);
// }
//
