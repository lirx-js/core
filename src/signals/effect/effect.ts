import { createMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { runSignalChangeContextOnce } from '../internal/signal-change-context/signal-change-context.private';
import { IEffetFunction } from './types/effet-function.type';
import { IUnsubscribeOfEffect } from './types/unsubscribe-of-effect.type';

export function effect(
  effectFunction: IEffetFunction,
): IUnsubscribeOfEffect {
  let cleanUpSource: IMulticastSource<void>;
  let running: boolean = true;

  const unsubscribeOfEffect = (): void => {
    if (running) {
      running = false;
      cleanUpSource.emit();
    }
  };

  const loop = (): void => {
    runSignalChangeContextOnce(
      (): void => {
        cleanUpSource = createMulticastSource<void>();
        effectFunction(cleanUpSource.subscribe);
      },
      (): void => {
        if (running) {
          cleanUpSource.emit();
        }
        queueMicrotask((): void => {
          if (running) {
            loop();
          }
        });
      },
    );
  };

  loop();

  return unsubscribeOfEffect;
}
