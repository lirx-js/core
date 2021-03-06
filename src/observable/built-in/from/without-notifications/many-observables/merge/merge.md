## merge

```ts
function merge<GObservables extends readonly IGenericObservable[]>(
  observables: GObservables,
): IObservable<IMergeObservablesValues<GObservables>>
```

Creates an output Observable which concurrently emits all values from every given input Observable.

### Diagram

[![](https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5cbnBhcnRpY2lwYW50IEEgYXMgb2JzZXJ2YWJsZXNbMF1cbnBhcnRpY2lwYW50IEIgYXMgb2JzZXJ2YWJsZXNbMV1cbnBhcnRpY2lwYW50IG1lcmdlIGFzIG1lcmdlKG9ic2VydmFibGVzKVxucGFydGljaXBhbnQgT1VUXG5cbkItPj5tZXJnZTogYjFcbm1lcmdlLT4-T1VUOiBiMVxuQS0-Pm1lcmdlOiBhMVxubWVyZ2UtPj5PVVQ6IGExXG5BLT4-bWVyZ2U6IGEyXG5tZXJnZS0-Pk9VVDogYTFcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0IiwidGhlbWVWYXJpYWJsZXMiOnsiYmFja2dyb3VuZCI6IndoaXRlIiwicHJpbWFyeUNvbG9yIjoiI0VDRUNGRiIsInNlY29uZGFyeUNvbG9yIjoiI2ZmZmZkZSIsInRlcnRpYXJ5Q29sb3IiOiJoc2woODAsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsInByaW1hcnlCb3JkZXJDb2xvciI6ImhzbCgyNDAsIDYwJSwgODYuMjc0NTA5ODAzOSUpIiwic2Vjb25kYXJ5Qm9yZGVyQ29sb3IiOiJoc2woNjAsIDYwJSwgODMuNTI5NDExNzY0NyUpIiwidGVydGlhcnlCb3JkZXJDb2xvciI6ImhzbCg4MCwgNjAlLCA4Ni4yNzQ1MDk4MDM5JSkiLCJwcmltYXJ5VGV4dENvbG9yIjoiIzEzMTMwMCIsInNlY29uZGFyeVRleHRDb2xvciI6IiMwMDAwMjEiLCJ0ZXJ0aWFyeVRleHRDb2xvciI6InJnYig5LjUwMDAwMDAwMDEsIDkuNTAwMDAwMDAwMSwgOS41MDAwMDAwMDAxKSIsImxpbmVDb2xvciI6IiMzMzMzMzMiLCJ0ZXh0Q29sb3IiOiIjMzMzIiwibWFpbkJrZyI6IiNFQ0VDMDAiLCJzZWNvbmRCa2ciOiIjZmZmZmRlIiwiYm9yZGVyMSI6IiM5MzcwREIiLCJib3JkZXIyIjoiI2FhYWEzMyIsImFycm93aGVhZENvbG9yIjoiIzMzMzMzMyIsImZvbnRGYW1pbHkiOiJcInRyZWJ1Y2hldCBtc1wiLCB2ZXJkYW5hLCBhcmlhbCIsImZvbnRTaXplIjoiMTZweCIsImxhYmVsQmFja2dyb3VuZCI6IiNlOGU4ZTgiLCJub2RlQmtnIjoiI0VDRUNGRiIsIm5vZGVCb3JkZXIiOiIjOTM3MERCIiwiY2x1c3RlckJrZyI6IiNmZmZmZGUiLCJjbHVzdGVyQm9yZGVyIjoiI2FhYWEzMyIsImRlZmF1bHRMaW5rQ29sb3IiOiIjMzMzMzMzIiwidGl0bGVDb2xvciI6IiMzMzMiLCJlZGdlTGFiZWxCYWNrZ3JvdW5kIjoiI2U4ZThlOCIsImFjdG9yQm9yZGVyIjoiaHNsKDI1OS42MjYxNjgyMjQzLCA1OS43NzY1MzYzMTI4JSwgODcuOTAxOTYwNzg0MyUpIiwiYWN0b3JCa2ciOiIjRUNFQ0ZGIiwiYWN0b3JUZXh0Q29sb3IiOiJibGFjayIsImFjdG9yTGluZUNvbG9yIjoiZ3JleSIsInNpZ25hbENvbG9yIjoiIzMzMyIsInNpZ25hbFRleHRDb2xvciI6IiMzMzMiLCJsYWJlbEJveEJrZ0NvbG9yIjoiI0VDRUNGRiIsImxhYmVsQm94Qm9yZGVyQ29sb3IiOiJoc2woMjU5LjYyNjE2ODIyNDMsIDU5Ljc3NjUzNjMxMjglLCA4Ny45MDE5NjA3ODQzJSkiLCJsYWJlbFRleHRDb2xvciI6ImJsYWNrIiwibG9vcFRleHRDb2xvciI6ImJsYWNrIiwibm90ZUJvcmRlckNvbG9yIjoiI2FhYWEzMyIsIm5vdGVCa2dDb2xvciI6IiNmZmY1YWQiLCJub3RlVGV4dENvbG9yIjoiYmxhY2siLCJhY3RpdmF0aW9uQm9yZGVyQ29sb3IiOiIjNjY2IiwiYWN0aXZhdGlvbkJrZ0NvbG9yIjoiI2Y0ZjRmNCIsInNlcXVlbmNlTnVtYmVyQ29sb3IiOiJ3aGl0ZSIsInNlY3Rpb25Ca2dDb2xvciI6InJnYmEoMTAyLCAxMDIsIDI1NSwgMC40OSkiLCJhbHRTZWN0aW9uQmtnQ29sb3IiOiJ3aGl0ZSIsInNlY3Rpb25Ca2dDb2xvcjIiOiIjZmZmNDAwIiwidGFza0JvcmRlckNvbG9yIjoiIzUzNGZiYyIsInRhc2tCa2dDb2xvciI6IiM4YTkwZGQiLCJ0YXNrVGV4dExpZ2h0Q29sb3IiOiJ3aGl0ZSIsInRhc2tUZXh0Q29sb3IiOiJ3aGl0ZSIsInRhc2tUZXh0RGFya0NvbG9yIjoiYmxhY2siLCJ0YXNrVGV4dE91dHNpZGVDb2xvciI6ImJsYWNrIiwidGFza1RleHRDbGlja2FibGVDb2xvciI6IiMwMDMxNjMiLCJhY3RpdmVUYXNrQm9yZGVyQ29sb3IiOiIjNTM0ZmJjIiwiYWN0aXZlVGFza0JrZ0NvbG9yIjoiI2JmYzdmZiIsImdyaWRDb2xvciI6ImxpZ2h0Z3JleSIsImRvbmVUYXNrQmtnQ29sb3IiOiJsaWdodGdyZXkiLCJkb25lVGFza0JvcmRlckNvbG9yIjoiZ3JleSIsImNyaXRCb3JkZXJDb2xvciI6IiNmZjg4ODgiLCJjcml0QmtnQ29sb3IiOiJyZWQiLCJ0b2RheUxpbmVDb2xvciI6InJlZCIsImxhYmVsQ29sb3IiOiJibGFjayIsImVycm9yQmtnQ29sb3IiOiIjNTUyMjIyIiwiZXJyb3JUZXh0Q29sb3IiOiIjNTUyMjIyIiwiY2xhc3NUZXh0IjoiIzEzMTMwMCIsImZpbGxUeXBlMCI6IiNFQ0VDRkYiLCJmaWxsVHlwZTEiOiIjZmZmZmRlIiwiZmlsbFR5cGUyIjoiaHNsKDMwNCwgMTAwJSwgOTYuMjc0NTA5ODAzOSUpIiwiZmlsbFR5cGUzIjoiaHNsKDEyNCwgMTAwJSwgOTMuNTI5NDExNzY0NyUpIiwiZmlsbFR5cGU0IjoiaHNsKDE3NiwgMTAwJSwgOTYuMjc0NTA5ODAzOSUpIiwiZmlsbFR5cGU1IjoiaHNsKC00LCAxMDAlLCA5My41Mjk0MTE3NjQ3JSkiLCJmaWxsVHlwZTYiOiJoc2woOCwgMTAwJSwgOTYuMjc0NTA5ODAzOSUpIiwiZmlsbFR5cGU3IjoiaHNsKDE4OCwgMTAwJSwgOTMuNTI5NDExNzY0NyUpIn19LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5cbnBhcnRpY2lwYW50IEEgYXMgb2JzZXJ2YWJsZXNbMF1cbnBhcnRpY2lwYW50IEIgYXMgb2JzZXJ2YWJsZXNbMV1cbnBhcnRpY2lwYW50IG1lcmdlIGFzIG1lcmdlKG9ic2VydmFibGVzKVxucGFydGljaXBhbnQgT1VUXG5cbkItPj5tZXJnZTogYjFcbm1lcmdlLT4-T1VUOiBiMVxuQS0-Pm1lcmdlOiBhMVxubWVyZ2UtPj5PVVQ6IGExXG5BLT4-bWVyZ2U6IGEyXG5tZXJnZS0-Pk9VVDogYTFcbiIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkZWZhdWx0XCIsXG4gIFwidGhlbWVWYXJpYWJsZXNcIjoge1xuICAgIFwiYmFja2dyb3VuZFwiOiBcIndoaXRlXCIsXG4gICAgXCJwcmltYXJ5Q29sb3JcIjogXCIjRUNFQ0ZGXCIsXG4gICAgXCJzZWNvbmRhcnlDb2xvclwiOiBcIiNmZmZmZGVcIixcbiAgICBcInRlcnRpYXJ5Q29sb3JcIjogXCJoc2woODAsIDEwMCUsIDk2LjI3NDUwOTgwMzklKVwiLFxuICAgIFwicHJpbWFyeUJvcmRlckNvbG9yXCI6IFwiaHNsKDI0MCwgNjAlLCA4Ni4yNzQ1MDk4MDM5JSlcIixcbiAgICBcInNlY29uZGFyeUJvcmRlckNvbG9yXCI6IFwiaHNsKDYwLCA2MCUsIDgzLjUyOTQxMTc2NDclKVwiLFxuICAgIFwidGVydGlhcnlCb3JkZXJDb2xvclwiOiBcImhzbCg4MCwgNjAlLCA4Ni4yNzQ1MDk4MDM5JSlcIixcbiAgICBcInByaW1hcnlUZXh0Q29sb3JcIjogXCIjMTMxMzAwXCIsXG4gICAgXCJzZWNvbmRhcnlUZXh0Q29sb3JcIjogXCIjMDAwMDIxXCIsXG4gICAgXCJ0ZXJ0aWFyeVRleHRDb2xvclwiOiBcInJnYig5LjUwMDAwMDAwMDEsIDkuNTAwMDAwMDAwMSwgOS41MDAwMDAwMDAxKVwiLFxuICAgIFwibGluZUNvbG9yXCI6IFwiIzMzMzMzM1wiLFxuICAgIFwidGV4dENvbG9yXCI6IFwiIzMzM1wiLFxuICAgIFwibWFpbkJrZ1wiOiBcIiNFQ0VDMDBcIixcbiAgICBcInNlY29uZEJrZ1wiOiBcIiNmZmZmZGVcIixcbiAgICBcImJvcmRlcjFcIjogXCIjOTM3MERCXCIsXG4gICAgXCJib3JkZXIyXCI6IFwiI2FhYWEzM1wiLFxuICAgIFwiYXJyb3doZWFkQ29sb3JcIjogXCIjMzMzMzMzXCIsXG4gICAgXCJmb250RmFtaWx5XCI6IFwiXFxcInRyZWJ1Y2hldCBtc1xcXCIsIHZlcmRhbmEsIGFyaWFsXCIsXG4gICAgXCJmb250U2l6ZVwiOiBcIjE2cHhcIixcbiAgICBcImxhYmVsQmFja2dyb3VuZFwiOiBcIiNlOGU4ZThcIixcbiAgICBcIm5vZGVCa2dcIjogXCIjRUNFQ0ZGXCIsXG4gICAgXCJub2RlQm9yZGVyXCI6IFwiIzkzNzBEQlwiLFxuICAgIFwiY2x1c3RlckJrZ1wiOiBcIiNmZmZmZGVcIixcbiAgICBcImNsdXN0ZXJCb3JkZXJcIjogXCIjYWFhYTMzXCIsXG4gICAgXCJkZWZhdWx0TGlua0NvbG9yXCI6IFwiIzMzMzMzM1wiLFxuICAgIFwidGl0bGVDb2xvclwiOiBcIiMzMzNcIixcbiAgICBcImVkZ2VMYWJlbEJhY2tncm91bmRcIjogXCIjZThlOGU4XCIsXG4gICAgXCJhY3RvckJvcmRlclwiOiBcImhzbCgyNTkuNjI2MTY4MjI0MywgNTkuNzc2NTM2MzEyOCUsIDg3LjkwMTk2MDc4NDMlKVwiLFxuICAgIFwiYWN0b3JCa2dcIjogXCIjRUNFQ0ZGXCIsXG4gICAgXCJhY3RvclRleHRDb2xvclwiOiBcImJsYWNrXCIsXG4gICAgXCJhY3RvckxpbmVDb2xvclwiOiBcImdyZXlcIixcbiAgICBcInNpZ25hbENvbG9yXCI6IFwiIzMzM1wiLFxuICAgIFwic2lnbmFsVGV4dENvbG9yXCI6IFwiIzMzM1wiLFxuICAgIFwibGFiZWxCb3hCa2dDb2xvclwiOiBcIiNFQ0VDRkZcIixcbiAgICBcImxhYmVsQm94Qm9yZGVyQ29sb3JcIjogXCJoc2woMjU5LjYyNjE2ODIyNDMsIDU5Ljc3NjUzNjMxMjglLCA4Ny45MDE5NjA3ODQzJSlcIixcbiAgICBcImxhYmVsVGV4dENvbG9yXCI6IFwiYmxhY2tcIixcbiAgICBcImxvb3BUZXh0Q29sb3JcIjogXCJibGFja1wiLFxuICAgIFwibm90ZUJvcmRlckNvbG9yXCI6IFwiI2FhYWEzM1wiLFxuICAgIFwibm90ZUJrZ0NvbG9yXCI6IFwiI2ZmZjVhZFwiLFxuICAgIFwibm90ZVRleHRDb2xvclwiOiBcImJsYWNrXCIsXG4gICAgXCJhY3RpdmF0aW9uQm9yZGVyQ29sb3JcIjogXCIjNjY2XCIsXG4gICAgXCJhY3RpdmF0aW9uQmtnQ29sb3JcIjogXCIjZjRmNGY0XCIsXG4gICAgXCJzZXF1ZW5jZU51bWJlckNvbG9yXCI6IFwid2hpdGVcIixcbiAgICBcInNlY3Rpb25Ca2dDb2xvclwiOiBcInJnYmEoMTAyLCAxMDIsIDI1NSwgMC40OSlcIixcbiAgICBcImFsdFNlY3Rpb25Ca2dDb2xvclwiOiBcIndoaXRlXCIsXG4gICAgXCJzZWN0aW9uQmtnQ29sb3IyXCI6IFwiI2ZmZjQwMFwiLFxuICAgIFwidGFza0JvcmRlckNvbG9yXCI6IFwiIzUzNGZiY1wiLFxuICAgIFwidGFza0JrZ0NvbG9yXCI6IFwiIzhhOTBkZFwiLFxuICAgIFwidGFza1RleHRMaWdodENvbG9yXCI6IFwid2hpdGVcIixcbiAgICBcInRhc2tUZXh0Q29sb3JcIjogXCJ3aGl0ZVwiLFxuICAgIFwidGFza1RleHREYXJrQ29sb3JcIjogXCJibGFja1wiLFxuICAgIFwidGFza1RleHRPdXRzaWRlQ29sb3JcIjogXCJibGFja1wiLFxuICAgIFwidGFza1RleHRDbGlja2FibGVDb2xvclwiOiBcIiMwMDMxNjNcIixcbiAgICBcImFjdGl2ZVRhc2tCb3JkZXJDb2xvclwiOiBcIiM1MzRmYmNcIixcbiAgICBcImFjdGl2ZVRhc2tCa2dDb2xvclwiOiBcIiNiZmM3ZmZcIixcbiAgICBcImdyaWRDb2xvclwiOiBcImxpZ2h0Z3JleVwiLFxuICAgIFwiZG9uZVRhc2tCa2dDb2xvclwiOiBcImxpZ2h0Z3JleVwiLFxuICAgIFwiZG9uZVRhc2tCb3JkZXJDb2xvclwiOiBcImdyZXlcIixcbiAgICBcImNyaXRCb3JkZXJDb2xvclwiOiBcIiNmZjg4ODhcIixcbiAgICBcImNyaXRCa2dDb2xvclwiOiBcInJlZFwiLFxuICAgIFwidG9kYXlMaW5lQ29sb3JcIjogXCJyZWRcIixcbiAgICBcImxhYmVsQ29sb3JcIjogXCJibGFja1wiLFxuICAgIFwiZXJyb3JCa2dDb2xvclwiOiBcIiM1NTIyMjJcIixcbiAgICBcImVycm9yVGV4dENvbG9yXCI6IFwiIzU1MjIyMlwiLFxuICAgIFwiY2xhc3NUZXh0XCI6IFwiIzEzMTMwMFwiLFxuICAgIFwiZmlsbFR5cGUwXCI6IFwiI0VDRUNGRlwiLFxuICAgIFwiZmlsbFR5cGUxXCI6IFwiI2ZmZmZkZVwiLFxuICAgIFwiZmlsbFR5cGUyXCI6IFwiaHNsKDMwNCwgMTAwJSwgOTYuMjc0NTA5ODAzOSUpXCIsXG4gICAgXCJmaWxsVHlwZTNcIjogXCJoc2woMTI0LCAxMDAlLCA5My41Mjk0MTE3NjQ3JSlcIixcbiAgICBcImZpbGxUeXBlNFwiOiBcImhzbCgxNzYsIDEwMCUsIDk2LjI3NDUwOTgwMzklKVwiLFxuICAgIFwiZmlsbFR5cGU1XCI6IFwiaHNsKC00LCAxMDAlLCA5My41Mjk0MTE3NjQ3JSlcIixcbiAgICBcImZpbGxUeXBlNlwiOiBcImhzbCg4LCAxMDAlLCA5Ni4yNzQ1MDk4MDM5JSlcIixcbiAgICBcImZpbGxUeXBlN1wiOiBcImhzbCgxODgsIDEwMCUsIDkzLjUyOTQxMTc2NDclKVwiXG4gIH1cbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)

### Examples

#### Example 1

```ts

// observable with generates 0, 1, 2, 3,... every 500ms
let i: number = 0;
const obs1 = pipeObservable(interval(500), [
  mapObservablePipe<void, number>(() => i++),
]);

// observable with generates 'a', 'b', 'c',... every 550ms
let j: number = 97;
const obs2 = pipeObservable(interval(550), [
  mapObservablePipe<void, string>(() => String.fromCharCode(j++)),
]);

const subscribe = merge([obs1, obs2]);

let startTime: number = Date.now();
subscribe((result) => {
  console.log(`${ (Date.now() - startTime).toString(10) }ms`, result);
})
```

Output:

```text
500ms: 0
550ms: 'a'

1000ms: 1
1100ms: 'b'

1500ms: 2
1650ms: 'c'

...
```
