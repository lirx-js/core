import { IKeyValueTuple } from '../../types/key-value.type';

/**
 * @deprecated
 */
export type IKeyValueIterable<GKey, GValue> = Iterable<IKeyValueTuple<GKey, GValue>>;

/**
 * @deprecated
 */
export type IKeyValueIterableLike<GKey, GValue> = object | IKeyValueIterable<GKey, GValue>;
