import { from } from "./observer";
import { IObserver } from "./interfaces";
import { map } from "./operators";
const app = document.getElementById("app");
function print(message: string) {
  app.innerHTML += message;
}
print("<h3>Home made Rxjs</he>");

class SampleObserver<T> implements IObserver<T> {
  constructor(private print: (message: any) => void) { }
  onNext(data: T) {
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

from([1, 2, 3, 4, 5, 6, 7])
  .pipe(
    map<number, string>(data => {
      if (data > 3) throw Error("not gonna happened after this");
      return `${data * 2}`;
    }),
    map(a => {
      return a + "-1";
    }),
    map(a => {
      return a + "-2";
    })
  )
  .subscribe(new SampleObserver(print));

