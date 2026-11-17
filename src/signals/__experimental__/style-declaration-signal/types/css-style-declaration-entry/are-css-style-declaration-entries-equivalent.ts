import { ICSSStyleDeclarationEntry } from './css-style-declaration-entry.type';

export function areCSSStyleDeclarationEntriesEquivalent(
  a: ICSSStyleDeclarationEntry,
  b: ICSSStyleDeclarationEntry,
): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
