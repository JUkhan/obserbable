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


interval(400).pipe(take(5)).subscribe(new SampleObserver(print));

var data = [
  { id: 1, pid: null, name: 'parent1' },
  { id: 2, pid: null, name: 'parent2' },
  { id: 3, pid: null, name: 'parent3' },
  { id: 4, pid: 2, name: 'parent2-child1' },
  { id: 5, pid: 2, name: 'parent2-child2' },
  { id: 6, pid: 5, name: 'parent5-child1' },
  { id: 7, pid: 3, name: 'parent3-child1' },
  { id: 8, pid: 6, name: 'parent6-child101' },
]
var treeData = data.filter(it => it.pid === null);

function findChildren(source: any[], tdata: any[]) {
  tdata.forEach(it => {
    it.children = source.filter(child => child.pid === it.id);
    it.children.length && findChildren(source, it.children)
  })
}

findChildren(data, treeData);
console.log(treeData)

