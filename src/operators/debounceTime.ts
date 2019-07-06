import { Observable } from '../observable'
export function debounceTime(millisecond: number) {
    return (source: Observable<any>) => {
        let tid;
        return new Observable(destination => {
            return source.subscribe({
                onNext(val) {
                    if (tid) clearTimeout(tid);
                    tid = setTimeout(() => {
                        destination.onNext(val);
                    }, millisecond);

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