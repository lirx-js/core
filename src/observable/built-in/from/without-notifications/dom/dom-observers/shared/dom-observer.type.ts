export interface IDOMObserverSimple<GOptions> {
  observe(target: Element, options?: GOptions): void;

  disconnect(): void;
}

export interface IDOMObserver<GOptions> extends IDOMObserverSimple<GOptions> {
  unobserve(target: Element): void;
}

export interface IDOMObserverEntry {
  readonly target: Node;
}

export interface IDOMObserverFactoryCallback<GEntry extends IDOMObserverEntry> {
  (entries: ReadonlyArray<GEntry>): void;
}

export interface IDOMObserverSimpleFactory<GOptions, GEntry extends IDOMObserverEntry> {
  (callback: IDOMObserverFactoryCallback<GEntry>): IDOMObserverSimple<GOptions>;
}

export interface IDOMObserverFactory<GOptions, GEntry extends IDOMObserverEntry> {
  (callback: IDOMObserverFactoryCallback<GEntry>): IDOMObserver<GOptions>;
}
