import { IObserver } from "./interfaces";

export class Observable<T> {
  private observer: IObserver<T>
  private dispose: () => void
  constructor(private subsciptionCallback: (observer: IObserver<T>) => () => void) {

  }
  subscribe(observer: IObserver<T>): () => void {
    try {
      observer['isDone'] = false;
      this.observer = observer;
      this.dispose = this.subsciptionCallback(this as any);
      return this.dispose;
    } catch (err) {
      this.onError(err);
    }
  }
  pipe(...operators): Observable<T> {
    return operators.reduce((source, operator) => operator(source), this);
  }
  private onNext(data) {
    !this.observer['isDone'] && this.observer.onNext(data)
  }
  private onComplete() {
    if (this.observer['isDone']) return;
    this.observer['isDone'] = true;
    this.observer.onComplete();
    typeof this.dispose === 'function' && this.dispose();
  }
  private onError(err) {
    this.observer.onError(err);
    this.onComplete();
  }
}

export function of(...args) {
  return new Observable(observer => {
    args.forEach(data => observer.onNext(data));
    observer.onComplete();
    return () => {
      observer.onComplete();
    }
  })
}
export function from(dataList: any[]) {
  return new Observable(observer => {
    dataList.forEach(data => observer.onNext(data));
    observer.onComplete();
    return () => {
      observer.onComplete();
    }
  })
}
export function interval(millisecond: number) {
  return new Observable(observer => {
    let i = 1, tid = setInterval(() => {
      observer.onNext(i++);
    }, millisecond);
    return () => {
      clearInterval(tid);
      observer.onComplete();
    }
  });
}