import { IObservable } from '../../../../../observable/type/observable.type';
import { ISignalFromObservable } from '../../signal-from-observable.type';
import { ISignalFromObservableOptions } from '../../types/signal-from-observable-options.type';
import { SignalFromObservable } from '../class/signal-from-observable.class';

export function toSignal<GValue>(
  value$: IObservable<GValue>,
): ISignalFromObservable<GValue>;
export function toSignal<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<GValue>,
  options: ISignalFromObservableOptions<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;
export function toSignal<GValue>(
  value$: IObservable<GValue>,
  options?: ISignalFromObservableOptions<any>,
): ISignalFromObservable<GValue> {
  return new SignalFromObservable<GValue>(
    value$,
    options,
  );
}
