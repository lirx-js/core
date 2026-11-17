export type ICSSStyleDeclarationProperties = {
  [GKey in Extract<keyof CSSStyleDeclaration, string> as CSSStyleDeclaration[GKey] extends string
    ? GKey
    : never]: CSSStyleDeclaration[GKey];
};
