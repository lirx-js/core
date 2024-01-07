import { mapObservable } from '../../../../../pipes/built-in/without-notifications/observer-pipe-related/map/map-observable';
import { IGenericObservable, IObservable } from '../../../../../type/observable.type';
import { combineLatest } from './combine-latest';

export type IRecordOfObservables = {
  [index: string]: IGenericObservable;
};

export type InferCombineLatestObjectValue<GObject extends IRecordOfObservables> = {
  [GKey in keyof GObject]: GObject[GKey] extends IObservable<infer GValue>
    ? GValue
    : never;
};

export function combineLatestObject<GObject extends IRecordOfObservables>(
  obj: GObject,
): IObservable<InferCombineLatestObjectValue<GObject>> {
  const entries: [string, IGenericObservable][] = Object.entries(obj);

  return mapObservable(
    combineLatest(entries.map(([, value]) => value)),
    (values: readonly any[]): InferCombineLatestObjectValue<GObject> => {
      return Object.fromEntries(
        entries.map(([key], index: number): [string, any] => {
          return [
            key,
            values[index],
          ];
        }),
      ) as InferCombineLatestObjectValue<GObject>;
    },
  );
}
