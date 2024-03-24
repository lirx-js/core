import {
  EFFECT_CONTEXT,
  effectContextRunInContext,
  effectContextStop,
  IEffectContext,
} from '../internal/effect.private';
import {
  initReactiveConsumer,
  preventEffectCreationInConsumerContext,
} from '../internal/reactive-context.private';
import { IEffetFunction } from './types/effet-function.type';
import { IUnsubscribeOfEffect } from './types/unsubscribe-of-effect.type';

let inEffect: boolean = false;

export function effect(effectFunction: IEffetFunction): IUnsubscribeOfEffect {
  preventEffectCreationInConsumerContext();

  if (inEffect) {
    throw new Error('Detected nested effects.');
  } else {
    inEffect = true;
    try {
      const context: IEffectContext = Object.create(EFFECT_CONTEXT);
      initReactiveConsumer(context);
      context.effectFunction = effectFunction;

      effectContextRunInContext(context);

      return (): void => {
        effectContextStop(context);
      };
    } finally {
      inEffect = false;
    }
  }
}
