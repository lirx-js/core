import { DeepWritable } from '../../misc/types/writable.type';

export interface IWritableSignalMutateFunction<GValue> {
  (
    value: DeepWritable<GValue>,
  ): void;
}
