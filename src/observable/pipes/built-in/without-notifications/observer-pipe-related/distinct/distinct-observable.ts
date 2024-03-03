import {
  EQUAL_FUNCTION_STRICT_EQUAL,
  getDistinctPreviousValueFromDistinctInitialValueOptions,
  IDistinctOptions,
  IUninitializedToken,
  UNINITIALIZED_TOKEN,
} from '@lirx/utils';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function distinctObservable<GValue>(
  subscribe: IObservable<GValue>,
  { equal = EQUAL_FUNCTION_STRICT_EQUAL, ...options }: IDistinctOptions<GValue> = {},
): IObservable<GValue> {
  return (emit: IObserver<GValue>): IUnsubscribeOfObservable => {
    let previousValue: GValue | IUninitializedToken =
      getDistinctPreviousValueFromDistinctInitialValueOptions<GValue>(options);
    return subscribe((value: GValue): void => {
      if (previousValue === UNINITIALIZED_TOKEN || !equal(value, previousValue)) {
        previousValue = value;
        emit(value);
      }
    });
  };
}

// /**
//  * @see distinctObserverPipe
//  */
// export function distinctObservable<GValue>(
//   subscribe: IObservable<GValue>,
// ): IObservable<GValue> {
//   return transformObservableWithObserverPipe<GValue, GValue>(subscribe, distinctObserverPipe<GValue>());
// }
