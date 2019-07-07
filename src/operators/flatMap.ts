import { Observable } from "../observable";
export function flatMap(selector: (data: any) => Observable<any>) {
    return (source: Observable<any>) => {
        return new Observable(destination => {
            destination.hasInnerObservable = true;
            return source.subscribe({
                onNext(res) {
                    selector(res).subscribe(destination);
                },
                onError(err) {
                    destination.onError(err);
                },
                onComplete() {
                    destination.onComplete();
                }
            });

        })
    }
}