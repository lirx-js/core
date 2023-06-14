import { DeepWritable } from '@lirx/utils';

export interface IWritableSignalMutateFunction<GValue> {
  (
    value: DeepWritable<GValue>,
  ): void;
}
