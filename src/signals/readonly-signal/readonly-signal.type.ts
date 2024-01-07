import { IReadonlySignalGetFunction } from './traits/get/readonly-signal.get.function-definition';
import { IReadonlySignalGetTrait } from './traits/get/readonly-signal.get.trait';
import { IReadonlySignalSymbolTrait } from './traits/symbol/readonly-signal.symbol.trait';

export interface IPureReadonlySignal<GValue> extends //
  IReadonlySignalGetTrait<GValue>,
  IReadonlySignalSymbolTrait
  //
{

}

export type IGenericPureReadonlySignal = IPureReadonlySignal<any>;

export interface IReadonlySignal<GValue> extends IPureReadonlySignal<GValue>, //
  IReadonlySignalGetFunction<GValue>
  //
{

}

export type IGenericReadonlySignal = IReadonlySignal<any>;
