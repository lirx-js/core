import { IObservable, IUnsubscribeOfObservable } from '../../../../observable/type/observable.type';
import { SuperSignal } from '../../internal/super-signal.class';
import { ISignalToObservableOptions } from '../../signal/signal-to-observable-options.type';
import { SIGNAL } from '../../signal/signal.symbol';
import { ISignalFromObservable } from './signal-from-observable.type';
import { IToSignalOptions } from './to-signal-options.type';

// export function toSignal<GValue>(
//   value$: IObservable<GValue>,
// ): ISignalFromObservable<GValue | undefined>;
// export function toSignal<GValue, GInitialValue extends (GValue | null | undefined)>(
//   value$: IObservable<GValue>,
//   options: IToSignalOptionsWithInitialValue<GInitialValue>,
// ): ISignalFromObservable<GValue | GInitialValue>;
// export function toSignal<GValue>(
//   value$: IObservable<GValue>,
//   options: IToSignalOptionsWithRequireSync,
// ): ISignalFromObservable<GValue>;
// export function toSignal<GValue>(
//   value$: IObservable<GValue>,
//   options: any = {},
// ): ISignalFromObservable<GValue> {
//
// }

export function toSignal<GValue>(
  value$: IObservable<GValue>,
): ISignalFromObservable<GValue>;
export function toSignal<GValue, GInitialValue extends (GValue | null | undefined)>(
  value$: IObservable<GValue>,
  options: IToSignalOptions<GInitialValue>,
): ISignalFromObservable<GValue | GInitialValue>;
export function toSignal<GValue>(
  value$: IObservable<GValue>,
  options?: IToSignalOptions<any>,
): ISignalFromObservable<GValue> {
  const _signal = new SuperSignal<GValue>(
    (options === void 0)
      ? (void 0 as GValue)
      : options.initialValue,
  );

  let _active: boolean = false;
  let _unsubscribe: IUnsubscribeOfObservable;
  let _awaitingValue: boolean = true;

  const newSignal: ISignalFromObservable<GValue> = ((): GValue => {
    return _signal.get();
  }) as ISignalFromObservable<GValue>;

  newSignal.toObservable = (
    options?: ISignalToObservableOptions,
  ): IObservable<GValue> => {
    return _signal.toObservable(options);
  };

  newSignal.isActive = (): boolean => {
    return _active;
  };

  newSignal.activate = (
    active: boolean = true,
  ): ISignalFromObservable<GValue> => {
    if (active !== _active) {
      _active = active;
      if (active) {
        _unsubscribe = value$((value: GValue): void => {
          if (_awaitingValue) {
            _awaitingValue = false;
          }
          _signal.set(value);
        });
      } else {
        _unsubscribe();
      }
    }

    return newSignal;
  };

  newSignal[SIGNAL] = void 0;

  newSignal.activate();

  if (
    (options === void 0)
    && _awaitingValue
  ) {
    _unsubscribe!();
    throw new Error(`Provided Observable is not sync`);
  }

  return newSignal;
}
