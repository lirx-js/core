import { IReadonlyEventTarget } from '../../../../../../../misc/event-listener/types/readonly-event-target.type';
import { filterObservable } from '../../../../../../pipes/built-in/without-notifications/observer-pipe-related/filter/filter-observable';
import { IObservable } from '../../../../../../type/observable.type';
import { fromEventTarget } from '../from-event-target';


export function fromSelfEventTarget<GType extends string, GEvent extends Event>(
  target: IReadonlyEventTarget<Record<GType, GEvent>>,
  type: GType,
  options?: boolean | AddEventListenerOptions,
): IObservable<GEvent> {
  return filterObservable(
    fromEventTarget<GType, GEvent>(
      target,
      type,
      options,
    ),
    (event: GEvent): boolean => {
      return event.target === target;
    },
  );
}
