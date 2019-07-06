import { Observable } from "../observable";

export function take(limit: number) {
    return (source: Observable<any>) => {
        return new Observable(destination => {
            let count = 0;
            return source.subscribe({
                onNext(val) {
                    if (count < limit) {
                        count++;
                        destination.onNext(val)
                    } else {
                        destination.onComplete();
                    }
                },
                onError(err) {
                    destination.onError(err);
                },
                onComplete() {
                    destination.onComplete();
                }
            })
        });
    }
}