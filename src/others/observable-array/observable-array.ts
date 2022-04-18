import { verifyNumberInRange } from '../../misc/errors/range-error/verify-number-in-range';
import { IObservable } from '../../observable/type/observable.type';
import { createObservableView } from '../views/observable-view/create-observable-view';
import { IObservableView } from '../views/observable-view/observable-view.type';

export interface IObservableArrayOptions {
  emitUndefinedForIndexesOutOfRangeWhenSettingData?: boolean;
}

/**
 * @experimental
 */
export class ObservableArray<GValue> implements Iterable<IObservable<GValue>> {
  protected readonly _data: IObservableView<'value', GValue>[];
  protected readonly _emitUndefinedForIndexesOutOfRangeWhenSettingData: boolean;

  constructor(
    {
      emitUndefinedForIndexesOutOfRangeWhenSettingData = true,
    }: IObservableArrayOptions = {},
  ) {
    this._data = [];
    this._emitUndefinedForIndexesOutOfRangeWhenSettingData = emitUndefinedForIndexesOutOfRangeWhenSettingData;
  }

  get length(): number {
    return this._data.length;
  }

  setData(
    data: ArrayLike<GValue>,
  ): void {
    const currentDataLength: number = this._data.length;
    const newDataLength: number = data.length;

    if (this._emitUndefinedForIndexesOutOfRangeWhenSettingData) {
      for (let i = newDataLength; i < currentDataLength; i++) {
        this._data[i].value = void 0 as any;
      }
    }

    this._data.length = newDataLength;

    for (let i = currentDataLength; i < newDataLength; i++) {
      this._data[i] = createObservableView<'value', GValue>('value');
    }

    for (let i = 0; i < newDataLength; i++) {
      this._data[i].value = data[i];
    }
  }

  getView(
    index: number,
  ): IObservableView<'value', GValue> {
    verifyNumberInRange(index, 'index', { min: 0, minIncluded: true, max: this._data.length, maxIncluded: false });
    return this._data[index];
  }

  get(
    index: number,
  ): GValue {
    return this.getView(index).value;
  }

  set(
    index: number,
    value: GValue,
  ): void {
    this.getView(index).value = value;
  }

  get$(
    index: number,
  ): IObservable<GValue> {
    return this.getView(index).value$;
  }


  * values(): Generator<GValue> {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[i].value;
    }
  }

  * values$(): Generator<IObservable<GValue>> {
    for (let i = 0; i < this._data.length; i++) {
      yield this._data[i].value$;
    }
  }

  [Symbol.iterator](): Generator<IObservable<GValue>> {
    return this.values$();
  }
}




