import {
  EQUAL_FUNCTION_STRICT_EQUAL,
  getDistinctPreviousValueFromDistinctInitialValueOptions,
  IDistinctOptions,
  IUninitializedToken, UNINITIALIZED_TOKEN,
} from '@lirx/utils';
import { IMapFunction } from '../../../../../../observer/pipes/built-in/map/map-function.type';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IObservable, IUnsubscribeOfObservable } from '../../../../../type/observable.type';

export function mapDistinctObservable<GIn, GOut>(
  subscribe: IObservable<GIn>,
  mapFunction: IMapFunction<GIn, GOut>,
  {
    equal = EQUAL_FUNCTION_STRICT_EQUAL,
    ...options
  }: IDistinctOptions<GOut> = {},
): IObservable<GOut> {
  return (emit: IObserver<GOut>): IUnsubscribeOfObservable => {
    let previousValue: GOut | IUninitializedToken = getDistinctPreviousValueFromDistinctInitialValueOptions<GOut>(options);
    return subscribe((value: GIn): void => {
      // INFO should support a running variable because the `mapFunction` could call `unsubscribe` ?
      const _value: GOut = mapFunction(value);
      if (
        (previousValue === UNINITIALIZED_TOKEN)
        || !equal(_value, previousValue)
      ) {
        previousValue = _value;
        emit(_value);
      }
    });
  };
}
