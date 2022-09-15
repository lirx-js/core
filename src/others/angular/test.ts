import { single } from '../../observable/built-in/from/without-notifications/values/single/single';

export interface NgZone {
  run(fn: (...args: any[]) => any): any;

  runOutsideAngular(fn: (...args: any[]) => any): any;
}

export function createAngularPipeLine(
  ngZone: NgZone,
  component: any,
): any {
  ngZone.runOutsideAngular(() => {

    const obs1$ = single('a');
    const obs2$ = single('b');

    const unsubscribe = obs1$((value: string) => {
      ngZone.run(() => {
        component.a = value;
      });
    });

    component.onDestroy = unsubscribe();
  });
}

// https://angular.io/api/core/ChangeDetectorRef
// https://angular.io/api/core/ChangeDetectionStrategy
