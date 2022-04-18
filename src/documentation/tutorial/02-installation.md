# Installation

```bash
yarn add @lirx/core
# or
npm install @lirx/core --save
```

Then you can import and use it:

```ts
import { of, pipe$$, map$$$ } from '@lirx/core';

const subscribe = pipe$$(of(1, 2, 3), [
  map$$$(value => `-> ${value}`),
]);
```

This library supports:

- **common-js** (require): transpiled as es5, with .cjs extension, useful for old nodejs versions
- **module** (esm import): transpiled as esnext, with .mjs extension (requires node resolution for external packages)

The library is ready to go and does not require transpiling nor bundling. **However** it has been optimized for three-shacking,
so you should use a bundler like rollup or webpack.

For rapid testing, [you can immediately play with @lirx/core on stackblitz](https://stackblitz.com/edit/typescript-5ksaqe?file=index.ts)

As a CDN, you can use [skypack](https://www.skypack.dev/):
[https://cdn.skypack.dev/@lirx/core](https://cdn.skypack.dev/@lirx/core)


---

## Table of content

- [Introduction](./01-introduction.md)
- [Installation](./02-installation.md)
- [Your first Observable](./03-your-first-observable.md)
- [Using the built-in Observables](./04-using-the-built-in-observables.md)
- [Emitting values using sources](./05-sources.md)
- [Shortcuts](./06-shortcuts.md)
- [Practical example](./07-practical-example/07-practical-example.md)
- [Notifications replace RxJS events](./08-notifications.md)
- [Migrating from rxjs](./09-migrating-from-rxjs.md)
- [Migrating from Promise](./10-migrating-from-promise.md)
- [Should I use Observables ?](./11-should-i-use-observables.md)
