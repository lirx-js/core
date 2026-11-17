export type IObjectValueFromPropertyKey<
  GObject extends object,
  GPropertyKey extends PropertyKey,
> = GPropertyKey extends keyof GObject ? GObject[GPropertyKey] : unknown;
