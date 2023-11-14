import { isNullish } from '@lirx/utils';
import { IObservable } from '../../../observable/type/observable.type';
import { IObserverObservablePair } from '../../../observer-observable-pair/type/observer-observable-pair.type';
import { isMaybeObservable } from './is-maybe-observable';
import { single } from '../../../observable/built-in/from/without-notifications/values/single/single';
import { IUnknownToObservableMode } from '../unknown-to-observable-mode.type';
import { IReadonlySignal } from '../../signals/readonly-signal/readonly-signal.type';
import { ISignalToValueObservableOptions } from '../../signals/readonly-signal/traits/to-observable/signal-to-observable-options.type';
import { isReadonlySignal } from '../../signals/readonly-signal/is/is-readonly-signal';

// export type IUnknownToObservableValue<GInput, GMode extends IUnknownToObservableMode> =
//   GInput extends ISignal<infer GValue>
//     ? GValue
//     : (
//       GInput extends IObserverObservablePair<any, infer GValue>
//         ? GValue
//         : (
//           GInput extends IObservable<infer GValue>
//             ? GValue
//             : (
//               GMode extends 'strict'
//                 ? never
//                 : GInput
//               )
//           )
//       );

export type IUnknownToObservable<GInput, GMode extends IUnknownToObservableMode> =
  GInput extends IReadonlySignal<infer GValue>
    ? IObservable<GValue>
    : (
      GInput extends IObserverObservablePair<any, infer GValue>
        ? IObservable<GValue>
        : (
          GInput extends IObservable<any>
            ? GInput
            : (
              GMode extends 'strict'
                ? never
                : IObservable<GInput>
              )
          )
      );

export type IUnknownToObservableOptions = ISignalToValueObservableOptions<any>;

export function unknownToObservable<GInput>(
  input: GInput,
): IUnknownToObservable<GInput, 'not-undefined'>;
export function unknownToObservable<GInput, GMode extends IUnknownToObservableMode>(
  input: GInput,
  mode: GMode,
  options?: IUnknownToObservableOptions,
): IUnknownToObservable<GInput, GMode>;
export function unknownToObservable<GInput, GMode extends IUnknownToObservableMode>(
  input: GInput,
  mode: GMode = 'not-undefined' as GMode,
  options?: IUnknownToObservableOptions,
): IUnknownToObservable<GInput, GMode> {
  if (isReadonlySignal(input)) {
    return input.toObservable(options) as IUnknownToObservable<GInput, GMode>;
  } else if (!isNullish(input) && isMaybeObservable((input as any).subscribe)) {
    return (input as any).subscribe;
  } else if (isMaybeObservable(input)) {
    return input as IUnknownToObservable<GInput, GMode>;
  } else {
    switch (mode) {
      case 'strict':
        throw new Error(`Unable to convert: ${input} to an Observable`);
      case 'not-undefined':
        if (input === void 0) {
          throw new Error(`Undefined cannot be converted to an Observable`);
        } else {
          return single(input) as IUnknownToObservable<GInput, GMode>;
        }
      case 'any':
        return single(input) as IUnknownToObservable<GInput, GMode>;
      default:
        throw new Error(`Invalid mode: "${mode}"`);
    }
  }
}

/* STRICT */

export type IUnknownToObservableStrict<GInput> = IUnknownToObservable<GInput, 'strict'>;

export function unknownToObservableStrict<GInput>(
  input: GInput,
  options?: IUnknownToObservableOptions,
): IUnknownToObservableStrict<GInput> {
  return unknownToObservable<GInput, 'strict'>(
    input,
    'strict',
    options,
  );
}

/* NOT UNDEFINED */

export type IUnknownToObservableNotUndefined<GInput> = IUnknownToObservable<GInput, 'not-undefined'>;

export function unknownToObservableNotUndefined<GInput>(
  input: GInput,
  options?: IUnknownToObservableOptions,
): IUnknownToObservableNotUndefined<GInput> {
  return unknownToObservable<GInput, 'not-undefined'>(
    input,
    'not-undefined',
    options,
  );
}

/* STRICT */

export type IUnknownToObservableAny<GInput> = IUnknownToObservable<GInput, 'any'>;

export function unknownToObservableAny<GInput>(
  input: GInput,
  options?: IUnknownToObservableOptions,
): IUnknownToObservableAny<GInput> {
  return unknownToObservable<GInput, 'any'>(
    input,
    'any',
    options,
  );
}
