import { createMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/create-multicast-source';
import { IMulticastSource } from '../../observer-observable-pair/build-in/source/built-in/multicast-source/multicast-source.type';
import { IEffetFunction } from '../effect/types/effet-function.type';
import {
  IGenericReactiveNode,
  IReactiveConsumer,
  REACTIVE_CONSUMER,
  runInReactiveConsumerContext,
  updateReactiveNode,
} from './reactive-context.private';

/* CONSTANTS */

const EFFECT_CONTEXT_STATE_IDLE = 0;
const EFFECT_CONTEXT_STATE_UPDATING = 1;
const EFFECT_CONTEXT_STATE_STOPPED = 2;

type IEffectContextState =
  | typeof EFFECT_CONTEXT_STATE_IDLE
  | typeof EFFECT_CONTEXT_STATE_UPDATING
  | typeof EFFECT_CONTEXT_STATE_STOPPED;

/* TYPES */

export interface IEffectContext extends IReactiveConsumer<IEffectContext> {
  effectFunction: IEffetFunction;
  state: IEffectContextState;
  cleanUpSource: IMulticastSource<void>;
}

/* INIT */

export const EFFECT_CONTEXT: IEffectContext = {
  ...REACTIVE_CONSUMER,
  effectFunction: undefined as any,
  state: EFFECT_CONTEXT_STATE_UPDATING,
  cleanUpSource: undefined as any,
  maybeOutDated: effectContextMaybeOutdated,
  outdated: effectContextOutdated,
};

/* FUNCTIONS */

export function effectContextMaybeOutdated(
  context: IEffectContext,
  node: IGenericReactiveNode,
): void {
  if (context.state !== EFFECT_CONTEXT_STATE_STOPPED) {
    updateReactiveNode(node);
    // queueMicrotask((): void => {
    //   if (context.state !== EFFECT_CONTEXT_STATE_STOPPED) {
    //     updateReactiveNode(node);
    //   }
    // });
  }
}

export function effectContextOutdated(context: IEffectContext): void {
  if (context.state === EFFECT_CONTEXT_STATE_IDLE) {
    context.state = EFFECT_CONTEXT_STATE_UPDATING;
    context.cleanUpSource.emit();
    queueMicrotask((): void => {
      if (context.state !== EFFECT_CONTEXT_STATE_STOPPED) {
        effectContextRunInContext(context);
      }
    });
  }
}

export function effectContextRunInContext(context: IEffectContext): void {
  runInReactiveConsumerContext(context, (): void => {
    effectContextRun(context);
  });
}

export function effectContextRun(context: IEffectContext): void {
  context.cleanUpSource = createMulticastSource<void>();
  context.effectFunction(context.cleanUpSource.subscribe);
  context.state = EFFECT_CONTEXT_STATE_IDLE;
}

export function effectContextStop(context: IEffectContext): void {
  if (context.state !== EFFECT_CONTEXT_STATE_STOPPED) {
    context.state = EFFECT_CONTEXT_STATE_STOPPED;
    context.cleanUpSource.emit();
    // TODO unbound producers
  }
}
