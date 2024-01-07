import { isNullish } from '@lirx/utils';
import { single } from '../../../observable/built-in/from/without-notifications/values/single/single';
import { IObservable } from '../../../observable/type/observable.type';
import { IObserverObservablePair } from '../../../observer-observable-pair/type/observer-observable-pair.type';
import { isReadonlySignal } from '../../../signals/readonly-signal/is/is-readonly-signal';
import { IReadonlySignal } from '../../../signals/readonly-signal/readonly-signal.type';
import { fromSignal } from '../../../signals/signal-to-observable/without-notifications/from-signal';
import { IUnknownToObservableMode } from '../unknown-to-observable-mode.type';
import { isMaybeObservable } from './is-maybe-observable';

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

export function unknownToObservable<GInput>(
  input: GInput,
): IUnknownToObservable<GInput, 'not-undefined'>;
export function unknownToObservable<GInput, GMode extends IUnknownToObservableMode>(
  input: GInput,
  mode: GMode,
): IUnknownToObservable<GInput, GMode>;
export function unknownToObservable<GInput, GMode extends IUnknownToObservableMode>(
  input: GInput,
  mode: GMode = 'not-undefined' as GMode,
): IUnknownToObservable<GInput, GMode> {
  if (isReadonlySignal(input)) {
    return fromSignal(input) as IUnknownToObservable<GInput, GMode>;
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
): IUnknownToObservableStrict<GInput> {
  return unknownToObservable<GInput, 'strict'>(
    input,
    'strict',
  );
}

/* NOT UNDEFINED */

export type IUnknownToObservableNotUndefined<GInput> = IUnknownToObservable<GInput, 'not-undefined'>;

export function unknownToObservableNotUndefined<GInput>(
  input: GInput,
): IUnknownToObservableNotUndefined<GInput> {
  return unknownToObservable<GInput, 'not-undefined'>(
    input,
    'not-undefined',
  );
}

/* STRICT */

export type IUnknownToObservableAny<GInput> = IUnknownToObservable<GInput, 'any'>;

export function unknownToObservableAny<GInput>(
  input: GInput,
): IUnknownToObservableAny<GInput> {
  return unknownToObservable<GInput, 'any'>(
    input,
    'any',
  );
}
