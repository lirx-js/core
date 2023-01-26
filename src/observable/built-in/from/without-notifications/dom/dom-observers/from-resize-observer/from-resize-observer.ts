import { createDOMObserverObservableFactory } from '../shared/create-dom-observer-observable-factory';
import { IDOMObserverFactoryCallback } from '../shared/dom-observer.type';

export const fromResizeObserver = createDOMObserverObservableFactory((callback: IDOMObserverFactoryCallback<ResizeObserverEntry>): ResizeObserver => {
  return new ResizeObserver(callback);
});



