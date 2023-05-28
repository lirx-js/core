import { ISignalWriteMode } from '../misc/types/signal-write-mode.type';

export interface IEffectOptions {
  signalWriteMode?: ISignalWriteMode; // (default: 'forbid')
}
