
function range({ start = 0, end, step = 1 }) {
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    if (start <= end) {
                        const obj = { value: start, done: false }
                        start += step
                        return obj
                    }
                    return { done: true }
                }
            }

        }
    }
}

function map(selector) {
    return (source) => {
        return new Observable(destination => {
            return source.subscribe({
                next(res) {
                    destination.next(selector(res))
                },
                complete() {
                    destination.complete && destination.complete();
                }
            })

        })
    }
}
function filter(selector) {
    return (source) => {
        return new Observable(destination => {
            return source.subscribe({
                next(res) {

                    selector(res) && destination.next(res)
                },
                complete() {
                    destination.complete();
                }
            })

        })
    }
}
function take(limit) {
    return (source) => {
        return new Observable(destination => {
            let count = 0;
            return source.subscribe({
                next(val) {
                    if (count < limit) {
                        count++;
                        destination.next(val)
                    } else {
                        destination.isDone = true;
                        destination.unsubscribe();
                    }
                },
                complete() {
                    destination.complete();
                }
            })
        });
    }
}
function debounceTime(millisecond) {
    return (source) => {
        let tid;
        return new Observable(destination => {
            return source.subscribe({
                next(val) {
                    if (tid) clearTimeout(tid);
                    tid = setTimeout(() => {
                        destination.next(val);
                    }, millisecond);

                },
                complete() {
                    destination.complete && destination.complete();
                }
            })

        })
    }
}

class Observable {
    constructor(subscribe) {
        this.__subscribe = subscribe;
        this.isUnsubscribe = false;
    }
    subscribe(observer) {
        const next = observer.next;
        const complete = observer.complete || function () { };
        observer.isDone = false;
        observer.next = function (val) {
            !observer.isDone && next(val)
        }
        observer.complete = function () {
            observer.isDone = true;
            complete()
        }
        let subscription;
        observer.unsubscribe = function () {
            observer.isDone = false;
            return typeof subscription === 'function' ? subscription() : subscription;
        }
        subscription = this.__subscribe(observer);
        this.observer = observer;
        return observer.unsubscribe;
    }

    pipe(...operators) {
        return operators.reduce((source, operator) => operator(source), this);
    }
    static of(...args) {
        return new Observable(observer => {
            args.forEach(observer.next);
            observer.complete();
            return 1010
        })
    }
    static interval(millisecond) {
        return new Observable(destination => {
            let i = 1, tid = setInterval(() => {
                destination.next(i++);
            }, millisecond);
            return () => clearInterval(tid);
        });

    }
}
class Subject extends Observable {
    constructor() {
        super(observer => observer.complete);

    }
    next(val) {
        this.observer && this.observer.next(val)
    }
    complete() {
        this.observer && this.observer.complete();
    }
}

Observable.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).pipe(
    map(v => v * 3),
    take(5)
).subscribe({
    next(val) {
        console.log(val)
    }
});

var subs = Observable.interval(100).pipe(
    take(5)
).subscribe({
    next(val) { console.log(val) }
});


var sub = new Subject();

sub.next('10000---22222')

sub.pipe(debounceTime(500)).subscribe({
    next(val) { console.log(val) },
    complete() { console.log('sub-complete...') }
});

sub.next('sub1-val')
sub.next('sub1-val-2')
//sub.complete();
sub.next('end')
