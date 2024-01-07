import { SIGNAL } from './signal.symbol';

export interface IReadonlySignalSymbolTrait {
  readonly [SIGNAL]: unknown;
}
