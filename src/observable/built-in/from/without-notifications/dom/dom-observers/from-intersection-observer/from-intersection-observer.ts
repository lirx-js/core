import { createDOMObserverObservableFactory } from '../shared/create-dom-observer-observable-factory';
import { IDOMObserverFactoryCallback } from '../shared/dom-observer.type';

export const fromIntersectionObserver = createDOMObserverObservableFactory((callback: IDOMObserverFactoryCallback<IntersectionObserverEntry>): IntersectionObserver => {
  return new IntersectionObserver(callback);
});

