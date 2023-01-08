import { createAbortError } from '@lirx/utils';

export const DEFAULT_ABORTED_THROW_FUNCTION = (signal?: AbortSignal): never => {
  throw createAbortError({ signal });
};
