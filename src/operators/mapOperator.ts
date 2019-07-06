import { IObservable, IObserver, IDisposable } from "../interfaces";

class MapObservable<T> implements IObservable<T>, IObserver<T>, IDisposable {
  _destination: IObserver<T>;
  isCompleted: boolean = false;
  constructor(
    private _source: IObservable<T>,
    private _selector: (data: T) => any
  ) {}
  subscribe(observer: IObserver<T>): IDisposable {
    try {
      this._destination = observer;
      this._source.subscribe(this);
      return this;
    } catch (err) {
      this.onError(err);
    }
  }

  onNext(data: T) {
    try {
      !this.isCompleted && this._destination.onNext(this._selector(data));
    } catch (err) {
      this.onError(err);
    }
  }
  onError(error: Error) {
    this._destination.onError(error);
    this.dispose();
  }
  onComplete() {
    this.isCompleted = true;
    this._destination.onComplete();
  }
  dispose() {
    this.onComplete();
  }
}
export function map<T, R>(selector: (data: T) => R) {
  return (source: IObservable<T>) => new MapObservable(source, selector);
}
