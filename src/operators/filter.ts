import { Observable } from "../observable";
export function filter(selector: (data: any) => boolean) {
    return (source: Observable<any>) => {
        return new Observable(destination => {
            return source.subscribe({
                onNext(res) {
                    selector(res) && destination.onNext(res)
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