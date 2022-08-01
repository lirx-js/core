<h1 align="center">LiRX/core - The fastest Reactive Programming framework</h1>

<p align="center">
  <img src="assets/lirx-core-logo.png" alt="lirx-core-logo" width="120px" height="120px"/>
  <br>
  <i><strong>@lirx/core</strong> is an extremely performant framework to master asynchronous data streams using Observables and Observers.</i>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@lirx/core">
    <img src="https://img.shields.io/npm/v/@lirx/core.svg" alt="npm package" />
  </a>
  <img src="https://img.shields.io/npm/dm/@lirx/core.svg" alt="downloads" />
  <img src="https://img.shields.io/npm/l/@lirx/core.svg" alt="licence" />
  <img src="https://img.shields.io/npm/types/@lirx/core.svg" alt="type" />
</p>

<hr>

`@lirx/core` (pronounced `lyrics`) is simply the [fastest and smallest](./src/documentation/performances.md) javascript library for `Reactive Programming`,
providing different tools to generate, consume, and pipe Observables and Observers.

If *Reactive Programming* does not tell you much or is a new concept to you, you may [take a look at this tutorial](./src/documentation/tutorial/01-introduction.md).
In a few words, if you deal frequently with async programming like *events*, *timeouts*, *promises* or *streams* (ex: front-end development),
then `@lirx/core` is the perfect candidate for you.


*Example: emulate double click*

```js
const subscribe = pipe$$(fromEventTarget(window, 'click'), [
  bufferTime$$$(500),
  filter$$$((events: PointerEvent[]) => events.length === 2),
  map$$$((events: PointerEvent[]) => events[events.length - 1]),
]);

subscribe((event: PointerEvent) => {
  console.log('double click', event);
});
```

[Click here to see the live demo](https://stackblitz.com/edit/typescript-sfkssg?devtoolsheight=33&file=index.ts)

Give it a try, and you'll love it !


## 📖 Table of content

- [Introduction](./src/documentation/tutorial/01-introduction.md)
- [Installation](./src/documentation/tutorial/02-installation.md)
- [Your first Observable](./src/documentation/tutorial/03-your-first-observable.md)
- [Using the built-in Observables](./src/documentation/tutorial/04-using-the-built-in-observables.md)
- [Emitting values using sources](./src/documentation/tutorial/05-sources.md)
- [Shortcuts](./src/documentation/tutorial/06-shortcuts.md)
- [Practical example](./src/documentation/tutorial/07-practical-example/07-practical-example.md)
- [Notifications replace RxJS events](./src/documentation/tutorial/08-notifications.md)
- [Migrating from rxjs](./src/documentation/tutorial/09-migrating-from-rxjs.md)
- [Migrating from Promise](./src/documentation/tutorial/10-migrating-from-promise.md)
- [Should I use Observables ?](./src/documentation/tutorial/11-should-i-use-observables.md)


- [CHANGELOG](./src/documentation/changelogs/CHANGELOG.md)


## 📦 Installation

```bash
yarn add @lirx/core
# or
npm install @lirx/core --save
```

[Click here to read the installation manual](src/documentation/tutorial/02-installation.md)


## 📕 Documentation

- [Observable](src/observable/type/observable.md)
- [Observer](src/observer/type/observer.md)
- [ObservablePipe](src/observable/pipes/type/observable-pipe.md) (ak: Pipeable Operator)
- [pipeObservable](src/observable/helpers/piping/pipe-observable/pipe-observable.md) (ak: Observable.pipe)
- [pipeObservablePipes](src/observable/helpers/piping/pipe-observable-pipes/pipe-observable-pipes.md) (ak: pipe function)
- [Notification](src/misc/notifications/notifications.md) (ak: *next*, *complete* and *error*)
- [MulticastSource](src/observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.md) (ak: Subject)
- [ReplayLastSource](src/observer-observable-pair/build-in/source/built-in/replay-last-source/replay-last-source.md) (ak: BehaviorSubject)
- [Subscription](src/misc/subscription/subscription.md) (kind of: Subscription)

Most of public functions or interfaces have their own documentation into a `.md` file in their respective directories.

## Ecosystem

<p>
  <a href="https://github.com/lirx-js/core">
    <img src="assets/lirx-core-logo.png" alt="lirx-core-logo" width="50px" height="50px"/>
  </a>
  <a href="https://github.com/lirx-js/dom">
    <img src="assets/lirx-dom-logo.png" alt="lirx-dom-logo" width="50px" height="50px"/>
  </a>
  <a href="https://github.com/lirx-js/router">
    <img src="assets/lirx-router-logo.png" alt="lirx-router-logo" width="50px" height="50px"/>
  </a>
  <a href="https://github.com/lirx-js/i18n">
    <img src="assets/lirx-i18n-logo.png" alt="lirx-i18n-logo" width="50px" height="50px"/>
  </a>
  <a href="https://github.com/lirx-js/store">
    <img src="assets/lirx-store-logo.png" alt="lirx-store-logo" width="50px" height="50px"/>
  </a>
</p>

## Differences with RxJS:

- no classes: this choice allows blazing fast performances and very small bundle size. Indeed, creating a class with
  the `new` keyword is slow, and method names can't be mangled (minimized), where function calls are really well
  optimized by javascript engines. However, it has a minor cost: chaining operators or method calls are done through
  functions, which is a little less elegant (in terms of code readability).

- no `next`, `complete` and `error`: instead this lib uses [notifications](src/misc/notifications/notifications.md).
  In reality, not all *Observables* require to emit a final state. For example, the RxJS `interval`
  never reaches a `complete` state. It just sends numbers. Moreover, some *Observables* may want to emit more
  than this 3 *events*: we may imagine an XHR Observable which emits an `upload-progress` and `download-progress` *events*.

- some concepts / operators / methods may have a different behaviour or name.
  Take care to read the documentation before any hasty use.
  
