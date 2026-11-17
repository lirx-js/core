import { IUnsubscribe } from '@lirx/unsubscribe';
import { idle } from '../../../observable/built-in/from/without-notifications/time-related/idle/idle';
import { IObservable } from '../../../observable/type/observable.type';
import { computed } from '../../computed/computed';
import { signal } from '../../signal/signal';
import { SIGNAL } from '../../signal/signal.symbol';
import { ICreateSignalOptions } from '../../signal/types/create-signal-options.type';
import { IReadonlySignal } from '../../signal/types/readonly-signal.type';
import { ISignalUpdateFunctionCallback } from '../../signal/types/signal-update-function-callback.type';
import { ISignal } from '../../signal/types/signal.type';
import { untracked } from '../../untracked/untracked';

export interface ICreatePoolingSignalOptions<GValue> extends ICreateSignalOptions<GValue> {
  readonly read: () => GValue;
  readonly write: (value: GValue) => boolean;
  readonly scheduler?: IObservable<any>;
}

export interface IPoolingSignal<GValue> extends ISignal<GValue> {}

export function poolingSignal<GValue>({
  read,
  write,
  scheduler = idle(),
  ...options
}: ICreatePoolingSignalOptions<GValue>): IPoolingSignal<GValue> {
  const _read = (): GValue => {
    return untracked(read);
  };

  const _write = (value: GValue): void => {
    return untracked((): void => {
      if (write(value)) {
        valueSignal.set(read());
      }
    });
  };

  let unsubscribe: IUnsubscribe | undefined;

  const valueSignal: ISignal<GValue> = signal<GValue>(_read(), options);

  const computedSignal: IReadonlySignal<GValue> = computed<GValue>((): GValue => {
    if (unsubscribe !== undefined) {
      unsubscribe();
    }

    unsubscribe = scheduler((): void => {
      valueSignal.set(_read());
    });

    return valueSignal();
  }, options);

  const propertySignal: IPoolingSignal<GValue> = ((): GValue =>
    computedSignal()) as IPoolingSignal<GValue>;
  propertySignal[SIGNAL] = computedSignal[SIGNAL];

  propertySignal.set = _write;

  propertySignal.throw = (): void => {
    throw new Error('Cannot throw this signal.');
  };

  propertySignal.update = (updateFunction: ISignalUpdateFunctionCallback<GValue>): void => {
    return propertySignal.set(updateFunction(read()));
  };

  propertySignal.asReadonly = (): IReadonlySignal<GValue> => computedSignal;

  return propertySignal;
}
