import { Observable } from "../observable";

export function map(selector: (data: any) => any) {
  return (source: Observable<any>) => {
    return new Observable(destination => {
      return source.subscribe({
        onNext(res) {
          destination.onNext(selector(res))
        },
        onError(err) {
          destination.onError(err);
        },
        onComplete() {
          destination.onComplete();
        }
      })

    })
  }
}