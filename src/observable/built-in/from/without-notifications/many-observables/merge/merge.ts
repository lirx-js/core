import { TupleTypes } from '../../../../../../misc/types/tuple-types';
import { IObserver } from '../../../../../../observer/type/observer.type';
import { IGenericObservable, IObservable, IUnsubscribe } from '../../../../../type/observable.type';

export type IMergeObservablesValues<GObservables extends readonly IGenericObservable[]> = TupleTypes<{
  [GKey in keyof GObservables]: GObservables[GKey] extends IObservable<infer GValue>
    ? GValue
    : never;
}>;

/**
 * Creates an Observable which concurrently emits all values from every given input Observables.
 */
export function merge<GObservables extends readonly IGenericObservable[]>(
  observables: GObservables,
): IObservable<IMergeObservablesValues<GObservables>> {
  type GValue = IMergeObservablesValues<GObservables>;
  return (emit: IObserver<GValue>): IUnsubscribe => {
    const unsubscribe: IUnsubscribe[] = observables
      .map((subscribe: IGenericObservable): IUnsubscribe => {
        return subscribe(emit);
      });
    return (): void => {
      for (let i = 0, l = unsubscribe.length; i < l; i++) {
        unsubscribe[i]();
      }
    };
  };
}

/*

merge([A, B, ...I])(OUT);

GRAPH:

https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG5cbnBhcnRpY2lwYW50IEEgYXMgb2JzZXJ2YWJsZXNbMF1cbnBhcnRpY2lwYW50IEIgYXMgb2JzZXJ2YWJsZXNbMV1cbnBhcnRpY2lwYW50IEkgYXMgLi4ub2JzZXJ2YWJsZXNbMiwuLi5dXG5wYXJ0aWNpcGFudCBPVVRcblxuTm90ZSBvdmVyIEEsSTogbWVyZ2Uob2JzZXJ2YWJsZXMpXG5cbkItLT4-T1VUOiBiMVxuQS0tPj5PVVQ6IGExXG5BLS0-Pk9VVDogYTJcbkktLT4-T1VUOiBpMVxuIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRlZmF1bHRcIixcbiAgXCJ0aGVtZVZhcmlhYmxlc1wiOiB7XG4gICAgXCJiYWNrZ3JvdW5kXCI6IFwid2hpdGVcIixcbiAgICBcInByaW1hcnlDb2xvclwiOiBcIiNFQ0VDRkZcIixcbiAgICBcInNlY29uZGFyeUNvbG9yXCI6IFwiI2ZmZmZkZVwiLFxuICAgIFwidGVydGlhcnlDb2xvclwiOiBcImhzbCg4MCwgMTAwJSwgOTYuMjc0NTA5ODAzOSUpXCIsXG4gICAgXCJwcmltYXJ5Qm9yZGVyQ29sb3JcIjogXCJoc2woMjQwLCA2MCUsIDg2LjI3NDUwOTgwMzklKVwiLFxuICAgIFwic2Vjb25kYXJ5Qm9yZGVyQ29sb3JcIjogXCJoc2woNjAsIDYwJSwgODMuNTI5NDExNzY0NyUpXCIsXG4gICAgXCJ0ZXJ0aWFyeUJvcmRlckNvbG9yXCI6IFwiaHNsKDgwLCA2MCUsIDg2LjI3NDUwOTgwMzklKVwiLFxuICAgIFwicHJpbWFyeVRleHRDb2xvclwiOiBcIiMxMzEzMDBcIixcbiAgICBcInNlY29uZGFyeVRleHRDb2xvclwiOiBcIiMwMDAwMjFcIixcbiAgICBcInRlcnRpYXJ5VGV4dENvbG9yXCI6IFwicmdiKDkuNTAwMDAwMDAwMSwgOS41MDAwMDAwMDAxLCA5LjUwMDAwMDAwMDEpXCIsXG4gICAgXCJsaW5lQ29sb3JcIjogXCIjMzMzMzMzXCIsXG4gICAgXCJ0ZXh0Q29sb3JcIjogXCIjMzMzXCIsXG4gICAgXCJtYWluQmtnXCI6IFwiI0VDRUMwMFwiLFxuICAgIFwic2Vjb25kQmtnXCI6IFwiI2ZmZmZkZVwiLFxuICAgIFwiYm9yZGVyMVwiOiBcIiM5MzcwREJcIixcbiAgICBcImJvcmRlcjJcIjogXCIjYWFhYTMzXCIsXG4gICAgXCJhcnJvd2hlYWRDb2xvclwiOiBcIiMzMzMzMzNcIixcbiAgICBcImZvbnRGYW1pbHlcIjogXCJcXFwidHJlYnVjaGV0IG1zXFxcIiwgdmVyZGFuYSwgYXJpYWxcIixcbiAgICBcImZvbnRTaXplXCI6IFwiMTZweFwiLFxuICAgIFwibGFiZWxCYWNrZ3JvdW5kXCI6IFwiI2U4ZThlOFwiLFxuICAgIFwibm9kZUJrZ1wiOiBcIiNFQ0VDRkZcIixcbiAgICBcIm5vZGVCb3JkZXJcIjogXCIjOTM3MERCXCIsXG4gICAgXCJjbHVzdGVyQmtnXCI6IFwiI2ZmZmZkZVwiLFxuICAgIFwiY2x1c3RlckJvcmRlclwiOiBcIiNhYWFhMzNcIixcbiAgICBcImRlZmF1bHRMaW5rQ29sb3JcIjogXCIjMzMzMzMzXCIsXG4gICAgXCJ0aXRsZUNvbG9yXCI6IFwiIzMzM1wiLFxuICAgIFwiZWRnZUxhYmVsQmFja2dyb3VuZFwiOiBcIiNlOGU4ZThcIixcbiAgICBcImFjdG9yQm9yZGVyXCI6IFwiaHNsKDI1OS42MjYxNjgyMjQzLCA1OS43NzY1MzYzMTI4JSwgODcuOTAxOTYwNzg0MyUpXCIsXG4gICAgXCJhY3RvckJrZ1wiOiBcIiNFQ0VDRkZcIixcbiAgICBcImFjdG9yVGV4dENvbG9yXCI6IFwiYmxhY2tcIixcbiAgICBcImFjdG9yTGluZUNvbG9yXCI6IFwiZ3JleVwiLFxuICAgIFwic2lnbmFsQ29sb3JcIjogXCIjMzMzXCIsXG4gICAgXCJzaWduYWxUZXh0Q29sb3JcIjogXCIjMzMzXCIsXG4gICAgXCJsYWJlbEJveEJrZ0NvbG9yXCI6IFwiI0VDRUNGRlwiLFxuICAgIFwibGFiZWxCb3hCb3JkZXJDb2xvclwiOiBcImhzbCgyNTkuNjI2MTY4MjI0MywgNTkuNzc2NTM2MzEyOCUsIDg3LjkwMTk2MDc4NDMlKVwiLFxuICAgIFwibGFiZWxUZXh0Q29sb3JcIjogXCJibGFja1wiLFxuICAgIFwibG9vcFRleHRDb2xvclwiOiBcImJsYWNrXCIsXG4gICAgXCJub3RlQm9yZGVyQ29sb3JcIjogXCIjYWFhYTMzXCIsXG4gICAgXCJub3RlQmtnQ29sb3JcIjogXCIjZmZmNWFkXCIsXG4gICAgXCJub3RlVGV4dENvbG9yXCI6IFwiYmxhY2tcIixcbiAgICBcImFjdGl2YXRpb25Cb3JkZXJDb2xvclwiOiBcIiM2NjZcIixcbiAgICBcImFjdGl2YXRpb25Ca2dDb2xvclwiOiBcIiNmNGY0ZjRcIixcbiAgICBcInNlcXVlbmNlTnVtYmVyQ29sb3JcIjogXCJ3aGl0ZVwiLFxuICAgIFwic2VjdGlvbkJrZ0NvbG9yXCI6IFwicmdiYSgxMDIsIDEwMiwgMjU1LCAwLjQ5KVwiLFxuICAgIFwiYWx0U2VjdGlvbkJrZ0NvbG9yXCI6IFwid2hpdGVcIixcbiAgICBcInNlY3Rpb25Ca2dDb2xvcjJcIjogXCIjZmZmNDAwXCIsXG4gICAgXCJ0YXNrQm9yZGVyQ29sb3JcIjogXCIjNTM0ZmJjXCIsXG4gICAgXCJ0YXNrQmtnQ29sb3JcIjogXCIjOGE5MGRkXCIsXG4gICAgXCJ0YXNrVGV4dExpZ2h0Q29sb3JcIjogXCJ3aGl0ZVwiLFxuICAgIFwidGFza1RleHRDb2xvclwiOiBcIndoaXRlXCIsXG4gICAgXCJ0YXNrVGV4dERhcmtDb2xvclwiOiBcImJsYWNrXCIsXG4gICAgXCJ0YXNrVGV4dE91dHNpZGVDb2xvclwiOiBcImJsYWNrXCIsXG4gICAgXCJ0YXNrVGV4dENsaWNrYWJsZUNvbG9yXCI6IFwiIzAwMzE2M1wiLFxuICAgIFwiYWN0aXZlVGFza0JvcmRlckNvbG9yXCI6IFwiIzUzNGZiY1wiLFxuICAgIFwiYWN0aXZlVGFza0JrZ0NvbG9yXCI6IFwiI2JmYzdmZlwiLFxuICAgIFwiZ3JpZENvbG9yXCI6IFwibGlnaHRncmV5XCIsXG4gICAgXCJkb25lVGFza0JrZ0NvbG9yXCI6IFwibGlnaHRncmV5XCIsXG4gICAgXCJkb25lVGFza0JvcmRlckNvbG9yXCI6IFwiZ3JleVwiLFxuICAgIFwiY3JpdEJvcmRlckNvbG9yXCI6IFwiI2ZmODg4OFwiLFxuICAgIFwiY3JpdEJrZ0NvbG9yXCI6IFwicmVkXCIsXG4gICAgXCJ0b2RheUxpbmVDb2xvclwiOiBcInJlZFwiLFxuICAgIFwibGFiZWxDb2xvclwiOiBcImJsYWNrXCIsXG4gICAgXCJlcnJvckJrZ0NvbG9yXCI6IFwiIzU1MjIyMlwiLFxuICAgIFwiZXJyb3JUZXh0Q29sb3JcIjogXCIjNTUyMjIyXCIsXG4gICAgXCJjbGFzc1RleHRcIjogXCIjMTMxMzAwXCIsXG4gICAgXCJmaWxsVHlwZTBcIjogXCIjRUNFQ0ZGXCIsXG4gICAgXCJmaWxsVHlwZTFcIjogXCIjZmZmZmRlXCIsXG4gICAgXCJmaWxsVHlwZTJcIjogXCJoc2woMzA0LCAxMDAlLCA5Ni4yNzQ1MDk4MDM5JSlcIixcbiAgICBcImZpbGxUeXBlM1wiOiBcImhzbCgxMjQsIDEwMCUsIDkzLjUyOTQxMTc2NDclKVwiLFxuICAgIFwiZmlsbFR5cGU0XCI6IFwiaHNsKDE3NiwgMTAwJSwgOTYuMjc0NTA5ODAzOSUpXCIsXG4gICAgXCJmaWxsVHlwZTVcIjogXCJoc2woLTQsIDEwMCUsIDkzLjUyOTQxMTc2NDclKVwiLFxuICAgIFwiZmlsbFR5cGU2XCI6IFwiaHNsKDgsIDEwMCUsIDk2LjI3NDUwOTgwMzklKVwiLFxuICAgIFwiZmlsbFR5cGU3XCI6IFwiaHNsKDE4OCwgMTAwJSwgOTMuNTI5NDExNzY0NyUpXCJcbiAgfVxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0

sequenceDiagram

participant A as observables[0]
participant B as observables[1]
participant I as ...observables[2,...]
participant OUT

Note over A,I: merge(observables)

B-->>OUT: b1
A-->>OUT: a1
A-->>OUT: a2
I-->>OUT: i1

 */
