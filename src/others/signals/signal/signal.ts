import { IObservable } from '../../../observable/type/observable.type';
import { SuperSignal } from '../internal/super-signal.class';
import { DeepWritable, Writable } from '../misc/types/writable.type';
import { ISignalOptions } from './signal-options.type';
import { ISignalToObservableOptions } from './signal-to-observable-options.type';
import { SIGNAL } from './signal.symbol';
import { ISignal } from './signal.type';
import { IWritableSignalMutateFunction } from './writable/writable-signal-mutate-function.type';
import { IWritableSignalUpdateFunction } from './writable/writable-signal-update-function.type';
import { IWritableSignal } from './writable/writable-signal.type';

export function signal<GValue>(
  initialValue: GValue,
  options?: ISignalOptions<GValue>,
): IWritableSignal<GValue> {
  const _signal = new SuperSignal<GValue>(initialValue, options);

  const newSignal: IWritableSignal<GValue> = ((): GValue => {
    return _signal.get();
  }) as IWritableSignal<GValue>;

  newSignal.toObservable = (
    options?: ISignalToObservableOptions,
  ): IObservable<GValue> => {
    return _signal.toObservable(options);
  };

  newSignal.set = (
    value: GValue,
    force?: boolean,
  ): void => {
    return _signal.set(value, force);
  };

  newSignal.update = (
    updateFunction: IWritableSignalUpdateFunction<GValue>
  ): void => {
    _signal.set(updateFunction(_signal.get()));
  };

  newSignal.mutate = (
    mutateFunction: IWritableSignalMutateFunction<GValue>,
  ): void => {
    const value: GValue = _signal.get();
    mutateFunction(value as DeepWritable<GValue>);
    _signal.set(value, true);
  };

  newSignal.asReadonly = (): ISignal<GValue> => {
    const newSignal: ISignal<GValue> = ((): GValue => {
      return _signal.get();
    }) as ISignal<GValue>;

    newSignal.toObservable = (
      options?: ISignalToObservableOptions,
    ): IObservable<GValue> => {
      return _signal.toObservable(options);
    };

    newSignal[SIGNAL] = void 0;

    return newSignal;
  };

  newSignal[SIGNAL] = void 0;

  return newSignal;
}
