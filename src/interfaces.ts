export interface IObserver<T> {
  onNext(data: T): void;
  onError(error: Error): void;
  onComplete(): void;
}
export interface IDisposable {
  dispose(): void;
}
export interface IObservable<T> {
  subscribe(observe: IObserver<T>): IDisposable;
  pipe?(...operators): IObservable<T>;
  isCompleted: boolean;
}
