import {
  EQUAL_FUNCTION_STRICT_EQUAL,
  getDistinctPreviousValueFromDistinctInitialValueOptions,
  IDistinctOptions,
  IUninitializedToken, UNINITIALIZED_TOKEN,
} from '@lirx/utils';
import { IObserver } from '../../../type/observer.type';

/**
 * Returns an Observer that emits all items emitted by the source Observer that are distinct by comparison from previous values
 */
export function distinctObserver<GValue>(
  emit: IObserver<GValue>,
  {
    equal = EQUAL_FUNCTION_STRICT_EQUAL,
    ...options
  }: IDistinctOptions<GValue> = {},
): IObserver<GValue> {
  let previousValue: GValue | IUninitializedToken = getDistinctPreviousValueFromDistinctInitialValueOptions<GValue>(options);
  return (value: GValue): void => {
    if (
      (previousValue === UNINITIALIZED_TOKEN)
      || !equal(value, previousValue)
    ) {
      previousValue = value;
      emit(value);
    }
  };
}


