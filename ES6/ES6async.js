//async函数就是Generator函数的语法糖
const fs = require('fs');
const readFile = function(fileName){
    return new Promise(function(resolve, reject){
        fs.readFile(fileName, function(error, data){
            if(error) return reject(error);
            resolve(data);
        });
    });
};

const gen = function* (){
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};

//写成async函数，就是下面这样
const asyncReadFile = async function(){
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
};


function timeout(ms){
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
async function asyncPrint(value, ms){
    await timeout(ms);
    console.log(value);
}
asyncPrint('hello world', 3000);


//函数声明
async function foo(){}
//函数表达式
const foo1 = async function(){};
//对象的方法
let obj = { async foo2(){} };
obj.foo2().then();
//class的方法
class Storage{
    constructor(){
        this.cachePromise = caches.open('avatars');
    }
    async getAvatar(name){
        const cache = await this.cachePromise;
        return cache.match(`/avatars/${name}.jpg`);
    }
}
const storage = new Storage();
storage.getAvatar('jake').then();
//箭头函数
const foo3 = async () => {};

//语法，返回Promise对象
async function f(){
    return 'hello world';
}
f().then(v => console.log(v))
//"hello world"

async function f1(){
    throw new Error('here is an error');
}
f1().then(
    v => console.log(v),
    e => console.log(e)
)
//here is an error

//async函数返回的Promise对象，必须等到内部所有await命令
//后的Promise对象执行完，才会发生状态改变，除非return或throw

//async命令后不是Promise对象的话，直接返回对应的值
//后面是thenable对象（即定义then方法的对象），等同于Promise
class Sleep{
    constructor(timeout){
        this.timeout = timeout;
    }
    then(resolve, reject){
        const startTime = Date.now();
        setTimeout(
            () => resolve(Date.now() - startTime),
            this.timeout
        );
    }
}
(async () => {
    const actualTime = await new Sleep(1000);
    console.log(actualTime);
})();

//下面的await操作成功，使用就会break语句退出循环，
//如果失败，就会被catch语句捕捉，然后进入下一轮循环
const superagent = require('superagent');
const NUM_RETRIES = 3;
async function test(){
    let i;
    for(i = 0; i < NUM_RETRIES; ++i){
        try{
            await superagent.get('http://google.com/this-throws-an-error');
            break;
        }catch(err){}
    }
    console.log(i); //3
}
test();

//如果希望多个请求并发执行，可以使用Promise.all
async function dbFuc(db){
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));
    let result = await Promise.all(promises);
    console.log(results);
}
//或者使用下面的写法

async function dbFuc1(db){
    let docs = [{}, {}, {}];
    let promises = docs.map((doc) => db.post(doc));
    let results = [];
    for(let promise of promises){
        results.push(await promise);
    }
    console.log(results);
}

//async函数的实现原理，就是将生成器函数和自动执行器，
//包装在一个函数里
async function fn(args){
    //...
}
//等同于
function fn1(args){
    return spawn(function* () {
        //...spawn函数就是自动执行器
    });
}

//假定某个DOM元素上面，部署了一系列的动画，前一个动画结束
//，才能开始后一个。如果当中有一个动画出错，就不再往下执行，
//返回上一个成功执行的动画的返回值。
//(1)Promise
function chainAnimationsPromise(elem, animations){
    //变量ret用来保存上一个动画的返回值
    let ret = null;

    //新建一个空的Promise
    let p = Promise.resolve();

    //使用then方法，添加所有动画
    for(let anim of animations){
        p = p.then(function(val){
            ret = val;
            return anim(elem);
        });
    }
    //返回一个部署了错误捕捉机制的Promise
    return p.catch(function(e){
        /**忽略错误。继续执行 */
    }).then(function(){
        return ret;
    })
}

//(2)Generator写法
function chainAnimationsGenerator(elem, animations){
    return spawn(function* (){
        let ret = null;
        try{
            for(let anim of animations){
                ret = yield anim(elem);
            }
        }catch(e){
            /**忽略错误。继续执行 */
        }
        return ret;
    });
}B

//(3)async函数
async function chainAnimationsAsync(elem, animations){
    let ret = null;
    try{
        for(let anim of animations){
            ret = await anim(elem);
        }
    }catch(e){
        /**忽略执行，继续执行 */
    }
    return ret;
}


function logInOrder(urls){
    //远程读取所有URL
    const textPromises = urls.map(url => {
        return fetch(url).then(response => response.text());
    });
    //按次序输出
    textPromises.reduce((chain, textPromises) => {
        return chain.then(() => textPromises)
        .then(text => console.log(text));
    }, Promise.resolve());
}
//用async函数实现
async function logInOrder1(urls){
    for(const url of urls){
        const response = await fetch(url);
        console.log(await response.text());
    }
}

//并发发出远程请求的async函数实现
async function logInOrder2(urls){
    //并发读取远程URL
    const textPromises = urls.map(async url => {
        const response = await fetch(url);
        return response.text();
    });
    //按次序输出
    for(const textPromise of textPromises){
        console.log(await textPromise);
    }
}


//异步遍历器的例子
const asyncIterable = createAsyncIterable(['a', 'b']);
const asyncIterator = asyncIterable[Symbol.asyncIterable]();

asyncIterator
.next()
.then(iterResult1 => {
    console.log(iterResult1); //{value: 'a', done: false}
    return asyncIterator.next();
})
.then(iterResult2 => {
    console.log(iterResult2); //{value: 'b', done: false}
    return asyncIterator.next();
})
.then(iterResult3 => {
    console.log(iterResult3); //{value: undefined, done: true}
});

async function f(){
    const asyncIterable = createAsyncIterable(['a', 'b']);
    const asyncIterator = asyncIterable[Symbol.asyncIterator]();
    console.log(await asyncIterator.next());
    //{ value: 'a', done: false }
    console.log(await asyncIterator.next());
    //{ value: 'b', done: false}
    console.log(await asyncIterator.next());
    //{ value: undefined, done: true}
}

//for await...of,用于遍历异步的Iterator接口
async function f1(){
    for await (const x of createAsyncIterable(['a', 'b'])){
        console.log(x);
    }
}
// a
// b

(async function(){
    for await (const x of createRejectingIterable()){
        console.log(x);
    }
})();
//a
//b

//异步Generator函数
//其实就是async函数与Generator函数的结合
async function* generator(){
    yield 'hello';
}
const genObj = generator();
genObj.next().then(x => console.log(x));
//{ value: 'hello', done: false }

//异步遍历器
async function* map(iterable, func){  //iterable是一个可遍历对象，func是一个回调函数
    const iter = iterable[Symbol.asyncIterator]();
    while(true){
        const {value, done} = await iter.next();
        if(done) break;
        yield func(value);
    }
}

async function* readLines(path){
    let file = await fileOpen(path);
    try{
        while(!file.EOF){
            yield await file.readlien();
        }
    }finally{
        await file.close();
    }
}
//用法
(async function () {
    for await (const line of readLines(filePath)) {
      console.log(line);
    }
})()


function fetchRandom(){
    const url = 'http://www.random.org/decimal-fractions/'
        + '?num=1&dec=10&col=1&format=plain&rnd=new';
    return fetch(url);
}
async function* asyncGenerator(){
    console.log('Start');
    const result = await fetchRandom(); // (A)
    yield 'Result: ' + await result.text(); //(B)
    console.log('Done');
}

const ag = asyncGenerator();
ag.next().then(({value, done}) => {
    console.log(value);
})

//(A)(B)类似下面的代码
return new Promise((resolve, reject) => {
    fetchRandom()
    .then(result => result.text())
    .then(result => {
        resolve({
            value: 'Result: ' + result,
            done: false,
        });
    });
});


//Generator执行器
async function takeAsync(asyncIterable, count = Infinity){
    const result = [];
    const iterator = asyncIterable[Symbol.asyncIterator]();
    while(result.length < count){
        const {value, done} = await iterator.next();
        if(done) break;
        result.push(value);
    }
    return result;
}