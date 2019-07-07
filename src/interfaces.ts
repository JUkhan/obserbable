export interface IObserver<T> {
  onNext(data: T): void;
  onError?(error: Error): void;
  onComplete?(): void;
  [key: string]: any
}
