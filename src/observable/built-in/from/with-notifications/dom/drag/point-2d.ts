export interface IPoint2D {
  readonly x: number;
  readonly y: number;
}

export function createPoint2D(x: number, y: number): IPoint2D {
  return { x, y };
}
