import { SuperSignal } from './super-signal.class';

export interface IRegisterSignalFunction<GValue> {
  (
    signal: SuperSignal<GValue>,
  ): void;
}

export type IRegisterSignalFunctionOrUndefined = IRegisterSignalFunction<any> | undefined;

let REGISTER_SIGNAL_FUNCTION: IRegisterSignalFunctionOrUndefined = void 0;

export function callOptionalRegisterSignalFunction<GValue>(
  signal: SuperSignal<GValue>,
): void {
  if (REGISTER_SIGNAL_FUNCTION !== void 0) {
    REGISTER_SIGNAL_FUNCTION(signal);
  }
}

export function runRegisterSignalFunctionContext<GReturn>(
  contextFunction: () => GReturn,
  registerSignalFunction: IRegisterSignalFunctionOrUndefined,
): GReturn {
  const currentRegisterSignalFunction: IRegisterSignalFunctionOrUndefined = REGISTER_SIGNAL_FUNCTION;
  REGISTER_SIGNAL_FUNCTION = registerSignalFunction;
  try {
    return contextFunction();
  } finally {
    REGISTER_SIGNAL_FUNCTION = currentRegisterSignalFunction;
  }
}
