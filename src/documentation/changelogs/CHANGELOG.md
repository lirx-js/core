
## 1.0.0 (unreleased)

### What's new ?

#### takeUntilObservable

New pipe which emits the values emitted by the source Observable until another Observable emits a value.

- [takeUntilObservablePipe](../../observable/pipes/built-in/without-notifications/others/take-until/take-until-observable-pipe.md)


#### fromFetchText and fromFetchStream

Creates Observables around a *fetch request*, and map the result as text or stream of bytes

- [fromFetchText](../../observable/built-in/from/with-notifications/http/from-fetch/derived/text/from-fetch-text.ts)
- [fromFetchStream](../../observable/built-in/from/with-notifications/http/from-fetch/derived/stream/from-fetch-stream.ts)


#### anyWithNotifications

Creates an Observable which mimics the behaviour of `Promise.any`.

#### createLogObserver / $log

Creates an Observer which logs in the console the received values.

#### switchAllObservablePipe and switchMapObservablePipe

Add `switchAll` and `switchMap` shortcuts to match with the RxJS equivalent functions.

- [mergeAllSingleObservablePipe/switchAllObservablePipe](../../observable/pipes/built-in/without-notifications/merge/merge-all/derived/merge-all-single/merge-all-single-observable-pipe.md)
- [mergeMapSingleObservablePipe/switchMapObservablePipe](../../observable/pipes/built-in/without-notifications/merge/merge-map/derived/merge-map-single/merge-map-single-observable-pipe.md)


#### others

- add `defaultNotificationObserver`
- add `open` and `close` Notifications
- add `fromSingleAnimationFrame`
- add `fromSelfEventTarget`
- add `thenAnyObservablePipe`


### Breaking changes

#### asyncUnsubscribe

Remove `asyncUnsubscribe` and replace it with `futureUnsubscribe` for better accuracy.


#### ICustomError

When creating an `ICustomError`, everything is now provided as options.

#### reactiveFunction

Most of the time, when using `reactiveFunction`, you'll usually update its observable in batch,
and would prefer to have a `reactiveFunction` that emit only once and only if the value changed.
This is the purpose of [optimizedReactiveFunction](../../observable/built-in/from/without-notifications/many-observables/reactive-function/alternatives/optimized-reactive-function.md).

- `distinctReactiveFunction` has been removed
- the shortcut `function$$` is now attributed to `optimizedReactiveFunction`
- the shortcut for `reactiveFunction` is now `functionI$$` (previously it was `function$$`)


#### createReplayLastSource

The definition of the function changes: previously you had to pass an object, or nothing to do the distinction
between an initialized or uninitialized `IReplayLastSource`. We did it, to handle more accurately the case
where you want to initialize the Source with `undefined` instead of having an uninitialized one.
However, we've seen that it isn't really user-friendly, so we changed the function definition to `...initialValue: [] | [GValue]`.
So, now, if you omit the value, the Source is uninitialized, and if you provide one, it is initialized with this value (including `undefined`).

This change impacts too: `createUnicastReplayLastSource` (new definition), `createMulticastReplayLastSource` (new definition) and `letU$$` (removed)

#### createReplayLastSource

The `sourceObservablePipe` has a new definition:

```ts
// from
function sourceObservablePipe<GValue>(
  getSource: ISourceObservablePipeGetSource<GValue>,
): IObservablePipe<GValue, GValue>

// to
function sourceObservablePipe<GValue>(
  options: ISourceObservableOptions<GValue>,
): IObservablePipe<GValue, GValue>
```

Instead of providing a function as first argument, you have to provide now an abject with a `getSource` property.
This has been done to allow more options to be defined when creating such an Observable.

This change impacts too: all the functions similar to this one.


### Experimental - (could change in the future, use only as POC)

- add `IOStream`
- add `IObservableView`

---

`rx-js-light` is now `@lirx/core` 🎉🥳

This implies:

- a dedicated organization for npmjs `@lirx` and a new one for github `lirx-js`
every tools related under `@lirx` will, belong to these organizations (`rx-dom` => `@lirx/dom`, `rx-i18n` => `@lirx/i18n`, etc...)
- the next versions will start from 1.0.0 

---

## 2.2.0 (2022-02-09)

### What's new ?

#### the documentation has been improved

- add sequential diagrams for many Observables and pipes
- add `ofWithNotifications` doc
- add `ReplaySource` doc
- add `Should I use Observables ?` doc

#### others

- improve `fromAsyncIterator`: when unsubscribed, the method `return` is called on the iterator.
it allows `try { ... yield ... } finally { ... }` to enter into the `finally` as expected .

- add `findObservablePipe`

- add `raceWithNotifications`


## 2.1.0 (2021-12-26)

### What's new ?

- improved documentation: update tutorial and many functions' documentation.

- `conditionalObservable` now only subscribes/unsubscribes on **distinct** values received from its `condition`

- add `emptyWithNotifications`

- add `singleWithNotifications`

- add `forkJoin`

- add many shortcuts for Observables emitting Notifications => ends with `N`

- add `thenObservablePipe` and its derivatives to pipe Notifications

- add `ReplaySource`

- add `debounceMicrotaskObservablePipe`

- add `toAsyncIterable`

- add `fromFetchJSON`

- add `takeObservablePipe`

- add `firstObservablePipe`


