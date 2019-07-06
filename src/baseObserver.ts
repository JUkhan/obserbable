import { IObservable, IDisposable } from "./interfaces";
export class BaseObservable<T> implements IObservable<T>, IDisposable {
  subscribe(observer: any): IDisposable {
    return this;
  }
  isCompleted: boolean = false;
  pipe(...operators): BaseObservable<T> {
    return operators.reduce((source, operator) => operator(source), this);
  }
  dispose() {}
}
