import { IObservable, IObserver, IDisposable } from "./interfaces";
import { BaseObservable } from "./baseObserver";

export class Observable<T> extends BaseObservable<T> implements IObservable<T> {
  constructor(private subsciptionCallback: (observer: IObserver<T>) => void) {
    super();
  }
  subscribe(observer: IObserver<T>): IDisposable {
    this.subsciptionCallback(observer);
    return this;
  }
  dispose() {}
}

class FromObservable<T> extends BaseObservable<T> implements IObservable<T> {
  private _source: IObserver<T>;
  constructor(private data: T[]) {
    super();
  }
  subscribe(observer: IObserver<T>): IDisposable {
    this._source = observer;
    try {
      for (let index = 0; index < this.data.length; index++) {
        if (!this.isCompleted) {
          observer.onNext(this.data[index]);
        }
      }
      return this;
    } catch (err) {
      observer.onError(err);
    } finally {
      this.dispose();
    }
  }
  dispose() {
    this.isCompleted = true;
    //this._source.onComplete();
  }
}

export function from<T>(data: T[]): IObservable<T> {
  return new FromObservable<T>(data);
}
