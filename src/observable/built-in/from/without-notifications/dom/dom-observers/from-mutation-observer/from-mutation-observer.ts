import { createDOMObserverSimpleObservableFactory } from '../shared/create-dom-observer-simple-observable-factory';
import { IDOMObserverFactoryCallback } from '../shared/dom-observer.type';

export const fromMutationObserver = createDOMObserverSimpleObservableFactory((callback: IDOMObserverFactoryCallback<MutationRecord>): MutationObserver => {
  return new MutationObserver(callback);
});


