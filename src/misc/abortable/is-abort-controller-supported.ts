import { getGlobalThis } from '@lirx/utils';

export function isAbortControllerSupported(): boolean {
  return('AbortController' in getGlobalThis());
}
