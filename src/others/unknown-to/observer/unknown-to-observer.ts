import { isNullish } from '@lirx/utils';
import { IObserverObservablePair } from '../../../observer-observable-pair/type/observer-observable-pair.type';
import { IObserver } from '../../../observer/type/observer.type';
import { isSignal } from '../../../signals/signal/is/is-signal';
import { ISignal } from '../../../signals/signal/signal.type';
import { isMaybeObserver } from './is-maybe-observer';

// export type IUnknownToObserverValue<GInput> =
//   GInput extends IWritableSignal<infer GValue>
//     ? GValue
//     : (
//       GInput extends IObserverObservablePair<infer GValue, any>
//         ? GValue
//         : (
//           GInput extends IObserver<infer GValue>
//             ? GValue
//             : never
//           )
//       );

export type IUnknownToObserver<GInput> =
  GInput extends ISignal<infer GValue>
    ? IObserver<GValue>
    : (
      GInput extends IObserverObservablePair<infer GValue, any>
        ? IObserver<GValue>
        : (
          GInput extends IObserver<any>
            ? GInput
            : never
          )
      );

export function unknownToObserver<GInput>(
  input: GInput,
): IUnknownToObserver<GInput> {
  if (isSignal(input)) {
    return ((value: unknown): void => {
      input.set(value);
    }) as IUnknownToObserver<GInput>;
  } else if (!isNullish(input) && isMaybeObserver((input as any).emit)) {
    return (input as any).emit;
  } else if (isMaybeObserver(input)) {
    return input as IUnknownToObserver<GInput>;
  } else {
    throw new Error(`Unable to convert: ${input} to an Observer`);
  }
}
