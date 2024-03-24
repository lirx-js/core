import { EQUAL_FUNCTION_STRICT_EQUAL, IEqualFunction } from '@lirx/utils';
import { SignalError } from './signal-error.class';

/** PRODUCER **/

/* TYPES */

export interface IReactiveProducer<GValue> {
  equal: IEqualFunction<GValue>;
  value: GValue | SignalError;
  consumers: Set<IGenericReactiveConsumer>; // list if nodes consuming this node
}

export type IGenericReactiveProducer = IReactiveProducer<any>;

/* INIT */

export const REACTIVE_PRODUCER: IReactiveProducer<unknown> = {
  equal: EQUAL_FUNCTION_STRICT_EQUAL,
  value: undefined,
  consumers: undefined as any,
};

export function initReactiveProducer<GValue>(
  producer: IReactiveProducer<GValue>,
  value: GValue | SignalError,
  equal: IEqualFunction<GValue> | undefined,
): void {
  if (equal) {
    producer.equal = equal;
  }

  producer.value = value;
  producer.consumers = new Set<IGenericReactiveConsumer>();
}

/* FUNCTIONS */

export function getReactiveProducerValue<GValue>(producer: IReactiveProducer<GValue>): GValue {
  if (producer.value instanceof SignalError) {
    throw producer.value.error;
  }

  return producer.value;
}

export function reactiveProducerGet<GValue>(producer: IReactiveProducer<GValue>): GValue {
  consumeReactiveProducer(producer);
  return getReactiveProducerValue<GValue>(producer);
}

export function reactiveProducerSet<GValue>(
  producer: IReactiveProducer<GValue>,
  value: GValue | SignalError,
): void {
  preventSignalWriteInConsumerContext();
  setAndNotifyReactiveProducerValue<GValue>(producer, value);
}

export function setReactiveProducerValue<GValue>(
  producer: IReactiveProducer<GValue>,
  value: GValue | SignalError,
): boolean {
  if (
    producer.value instanceof SignalError ||
    value instanceof SignalError ||
    !producer.equal(value, producer.value)
  ) {
    producer.value = value;
    return true;
  } else {
    return false;
  }
}

export function setAndNotifyReactiveProducerValue<GValue>(
  producer: IReactiveProducer<GValue>,
  value: GValue | SignalError,
): void {
  if (setReactiveProducerValue(producer, value)) {
    markReactiveProducerConsumerAsOutdated(producer);
  }
}

export function markReactiveNodeConsumersAsMaybeOutdated(node: IGenericReactiveNode): void {
  node.consumers.forEach((consumer: IGenericReactiveConsumer): void => {
    consumer.maybeOutDated(consumer, node);
  });
}

export function markReactiveProducerConsumerAsOutdated(producer: IGenericReactiveProducer): void {
  producer.consumers.forEach((consumer: IGenericReactiveConsumer): void => {
    consumer.outdated(consumer);
  });
}

/** CONSUMER **/

/* TYPES */

export interface IReactiveConsumer<GSelf extends IReactiveConsumer<GSelf>> {
  producers: Set<IGenericReactiveProducer>; // list if nodes "producing" this node
  maybeOutDated: (consumer: GSelf, node: IGenericReactiveNode) => void;
  outdated: (consumer: GSelf) => void;
}

export type IGenericReactiveConsumer = IReactiveConsumer<any>;
export type IOptionalGenericReactiveConsumer = IGenericReactiveConsumer | undefined;

/* INIT */

export const REACTIVE_CONSUMER: IGenericReactiveConsumer = {
  producers: undefined as any,
  maybeOutDated: undefined as any,
  outdated: undefined as any,
};

export function initReactiveConsumer(consumer: IGenericReactiveConsumer): void {
  consumer.producers = new Set<IGenericReactiveProducer>();
}

/** SHARED **/

/* CURRENT */

let currentConsumer: IOptionalGenericReactiveConsumer = undefined;

export function runInReactiveConsumerContext<GReturn>(
  consumer: IOptionalGenericReactiveConsumer,
  callback: () => GReturn,
): GReturn {
  const previousObserver: IOptionalGenericReactiveConsumer = currentConsumer;
  currentConsumer = consumer;
  try {
    return callback();
  } finally {
    currentConsumer = previousObserver;
  }
}

export function consumeReactiveProducer(producer: IReactiveProducer<any>): void {
  if (currentConsumer !== undefined) {
    bindReactiveConsumerWithReactiveProducer(currentConsumer, producer);
  }
}

export function preventSignalWriteInConsumerContext(): void {
  if (currentConsumer !== undefined) {
    throw new Error('The signal cannot be written is this context.');
  }
}

export function preventEffectCreationInConsumerContext(): void {
  if (currentConsumer !== undefined) {
    throw new Error('Cannot create an effect this context.');
  }
}

/* FUNCTIONS */

export function bindReactiveConsumerWithReactiveProducer(
  consumer: IGenericReactiveConsumer,
  producer: IGenericReactiveProducer,
): void {
  if (!producer.consumers.has(consumer)) {
    consumer.producers.add(producer);
    producer.consumers.add(consumer);
  }
}

export function unbindReactiveConsumerWithReactiveProducer(
  consumer: IReactiveConsumer<any>,
  producer: IReactiveProducer<any>,
): void {
  console.assert(consumer.producers.has(producer));
  console.assert(producer.consumers.has(consumer));

  consumer.producers.delete(producer);
  producer.consumers.delete(consumer);
}

/** REACTIVE NODE **/

/* CONSTANTS */

const REACTIVE_NODE_STATE_FRESH = 0;
const REACTIVE_NODE_STATE_MAYBE_OUTDATED = 1;
const REACTIVE_NODE_STATE_OUTDATED = 2;
const REACTIVE_NODE_STATE_COMPUTING = 3;

type IReactiveNodeState =
  | typeof REACTIVE_NODE_STATE_FRESH
  | typeof REACTIVE_NODE_STATE_MAYBE_OUTDATED
  | typeof REACTIVE_NODE_STATE_OUTDATED
  | typeof REACTIVE_NODE_STATE_COMPUTING;

/* TYPES */

export interface IReactiveNodeComputationFunction<GValue> {
  (): GValue;
}

export interface IReactiveNode<GValue>
  extends IReactiveConsumer<IReactiveNode<GValue>>,
    IReactiveProducer<GValue> {
  computation: IReactiveNodeComputationFunction<GValue>;
  state: IReactiveNodeState;
  maybeOutdatedProducers: IGenericReactiveNode[];
}

export type IGenericReactiveNode = IReactiveNode<any>;

/* INIT */

export const REACTIVE_NODE: IGenericReactiveNode = {
  ...REACTIVE_PRODUCER,
  ...REACTIVE_CONSUMER,
  computation: undefined as any,
  state: REACTIVE_NODE_STATE_OUTDATED,
  maybeOutdatedProducers: undefined as any,
  maybeOutDated: reactiveNodeMaybeOutdated,
  outdated: reactiveNodeOutdated,
};

export function initReactiveNode<GValue>(
  node: IReactiveNode<GValue>,
  computation: IReactiveNodeComputationFunction<GValue>,
  equal: IEqualFunction<GValue> | undefined,
): void {
  initReactiveConsumer(node);
  initReactiveProducer<GValue>(node, SignalError.UNSET, equal);
  node.computation = computation;
  node.maybeOutdatedProducers = [];
}

/* FUNCTIONS */

export function reactiveNodeMaybeOutdated(
  node: IGenericReactiveNode,
  producer: IGenericReactiveNode,
): void {
  const _markReactiveNodeConsumersAsMaybeOutdated: boolean =
    node.state === REACTIVE_NODE_STATE_FRESH;

  node.state = REACTIVE_NODE_STATE_MAYBE_OUTDATED;
  node.maybeOutdatedProducers.push(producer);

  if (_markReactiveNodeConsumersAsMaybeOutdated) {
    markReactiveNodeConsumersAsMaybeOutdated(node);
  }
}

export function reactiveNodeOutdated(node: IGenericReactiveNode): void {
  const _markReactiveNodeConsumersAsMayHaveChanged: boolean =
    node.state === REACTIVE_NODE_STATE_FRESH;

  node.state = REACTIVE_NODE_STATE_OUTDATED;
  node.maybeOutdatedProducers = [];

  node.producers.forEach((producer: IGenericReactiveProducer): void => {
    unbindReactiveConsumerWithReactiveProducer(node, producer);
  });

  if (_markReactiveNodeConsumersAsMayHaveChanged) {
    markReactiveNodeConsumersAsMaybeOutdated(node);
  }
}

export function runReactiveNodeComputation<GValue>(node: IReactiveNode<GValue>): void {
  console.assert(node.producers.size === 0);
  console.assert(node.maybeOutdatedProducers.length === 0);

  node.state = REACTIVE_NODE_STATE_COMPUTING;

  let newValue: GValue | SignalError;
  try {
    newValue = runInReactiveConsumerContext<GValue>(node, node.computation);
  } catch (error: unknown) {
    newValue = new SignalError(error);
  }

  node.state = REACTIVE_NODE_STATE_FRESH;
  setAndNotifyReactiveProducerValue<GValue>(node, newValue);
}

export function updateReactiveNode(node: IGenericReactiveNode): void {
  if (node.state === REACTIVE_NODE_STATE_COMPUTING) {
    throw new Error('Detected cycle in computations.');
  } else if (node.state === REACTIVE_NODE_STATE_MAYBE_OUTDATED) {
    if (node.maybeOutdatedProducers.length === 0) {
      node.state = REACTIVE_NODE_STATE_FRESH;
    } else {
      updateReactiveNode(node.maybeOutdatedProducers.pop()!);
      updateReactiveNode(node);
    }
  } else if (node.state === REACTIVE_NODE_STATE_OUTDATED) {
    runReactiveNodeComputation(node);
  }
}

/**
 * @public
 */
export function reactiveNodeGet<GValue>(node: IReactiveNode<GValue>): GValue {
  updateReactiveNode(node);
  return reactiveProducerGet<GValue>(node);
}
