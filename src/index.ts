import { from, interval } from "./observable";
import { IObserver } from "./interfaces";
import { map, filter, take, debounceTime } from "./operators";
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



const arr$ = interval(500).pipe(
  map(a => a * 100),
  filter(a => a > 200)
);


arr$.pipe(take(5)).subscribe(new SampleObserver(print));



