import { IObservable } from '../../../../../../../../type/observable.type';
import { optimizedReactiveFunction } from '../../../alternatives/optimized-reactive-function';
import { IReactiveFunctionObservables } from '../../../reactive-function';

export function reactiveOrMany(
  ...observables: IReactiveFunctionObservables<typeof orMany>
): IObservable<ReturnType<typeof orMany>> {
  return optimizedReactiveFunction(
    observables,
    orMany,
  );
}

// export function reactiveOrMany(
//   observables: IReactiveFunctionObservables<typeof orMany>,
//   distinct: boolean = true,
// ): IObservable<ReturnType<typeof orMany>> {
//   return reactiveFunction(
//     orMany,
//     observables,
//     distinct,
//   );
// }

function orMany(...values: boolean[]): boolean {
  for (let i = 0, l = values.length; i < l; i++) {
    if (values[i]) {
      return true;
    }
  }
  return false;
}

