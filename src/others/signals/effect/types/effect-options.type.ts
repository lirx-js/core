import { ISignalWriteMode } from '../../signal/types/signal-write-mode.type';

export interface IEffectOptions {
  signalWriteMode?: ISignalWriteMode; // (default: 'forbid')
}
