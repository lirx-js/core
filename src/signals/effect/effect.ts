import {
  EFFECT_NODE,
  IEffectNode,
  initEffectNode,
  preventEffectCreationInWatcherContext,
  runEffectNode,
  stopEffectNode,
} from '../internal/reactive-context.private';

import { IEffetFunction } from './types/effet-function.type';
import { IUnsubscribeOfEffect } from './types/unsubscribe-of-effect.type';

export function effect(effectFunction: IEffetFunction): IUnsubscribeOfEffect {
  preventEffectCreationInWatcherContext();

  const node: IEffectNode = Object.create(EFFECT_NODE);
  initEffectNode(node, effectFunction);

  runEffectNode(node);

  return (): void => {
    stopEffectNode(node);
  };
}
