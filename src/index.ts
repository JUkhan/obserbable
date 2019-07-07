import { from, interval, of, fromPromise } from "./observable";
import { IObserver } from "./interfaces";
import { map, filter, take, debounceTime, flatMap } from "./operators";
const app = document.getElementById("app");
function print(message: any) {
  app.innerHTML += message;
}
print("<h3>Home made Rxjs</he>");

class SampleObserver implements IObserver<any> {
  constructor(private print: (message: any) => void) { }
  onNext(data: any) {
    this.print(`<p>data: ${data}</p>`);
    //throw Error('opps!')
  }
  onError(error: Error) {
    this.print(`<p style="color:red"> ${error}</P>`);
  }
  onComplete() {
    this.print(`<p>completed</P>`);
  }
}

function getPromiseData(data: any): Promise<any> {
  return new Promise((accept, deny) => {
    setTimeout(() => {
      accept(data);
    }, data * 100);
  })
}

const arr$ = of(1, 2, 3, [4, 5, 6], 7, [8, 9, 10]).pipe(
  flatMap(data => Array.isArray(data) ? from(data) : fromPromise(getPromiseData(data))),
  map(a => a * 100),

  //filter(a => a > 200)
);


arr$.subscribe(new SampleObserver(print));



