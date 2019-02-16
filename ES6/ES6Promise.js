const promise = new Promise(function(resolve, reject) {
    // ... some code
  
    if (/* 异步操作成功 */){
      resolve(value);
    } else {
      reject(error);
    }
});

//Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数
promise.then(function(value){
      //success
    },function(error){
      //failure
});
//第二个函数可选，不一定要提供

function timeout(ms){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
    });
}
timeout(100).then((value) => {
    console.log(value);
});

let promise1 = new Promise(function(resolve, reject){
    console.log('Promise');
    resolve();
});
promise1.then(function(){
    console.log('resolved');
});
console.log('Hi!');
//Promise
//Hi!
//resolved

//异步加载图片
function loadImageAsync(url){
    return new Promise(function(resolve, reject){
        const image = new Image();
        image.onload = function(){
            resolve(image);
        };
        image.onerror = function(){
            reject(new Error('Could not load image at' + url));
        };
        image.src = url;
    });
}

//用Promise对象实现Ajax操作的例子
const getJSON = function(url){
    const promise = new Promise(function(resolve, reject){
        const handler = function(){
            if(this.readyState !== 4){
                return;
            }
            if(this.status === 200){
                resolve(this.response);
            }else{
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handler;
        client.responseType = 'json';
        client.setRequestHeader("Accept", "application/json");
        client.send();
    });
    return promise;
};
getJSON("/posts.json").then(function(json){
    console.log('Contents: ' + json);
}, function(error){
    console.log('出错了', error);
}); 

//resolve函数的参数除了正常值以外，还可以是另一个Promise实例

const p1 = new Promise(function(resolve, reject){
    setTimeout(() => reject(new Error('fail')), 3000)
})
const p2 = new Promise(function(resolve, reject){
    setTimeout(() => resolve(p1), 1000);
})
p2
.then(result => console.log(result))
.catch(error => console.log(error))
//Error: fail

getJSON("/post/1.json").then(function(post){
    return getJSON(post.commentURL);
}).then(function funcA(comments){
    console.log("resolved: ", comments);
}, function funcB(err){
    console.log("rejected: ", err);
});
//箭头函数
/*
getJSON("/post/1.json").then(
    post => getJSON(post.commentURL)
).then(
    comments => console.log("resolved: ", comments),
    err => console.log("rejected: ", err)
);
*/

//Promise.prototype.catch方法是.then(null/undefined, rejection)的别称

//catch方法捕捉三种写法
//1
const promise2 = new Promise(function(resolve, reject){
    throw new Error('test');
});
promise2.catch(function(error){
    console.log(error);
});
//Error: test
//2
const promise3 = new Promise(function(resolve, reject){
    try{
        throw new Error('test');
    }catch(e){
        reject(e);
    }
});
promise3.catch(function(error){
    console.log(error);
});
//3
const promise4 = new Promise(function(resolve, reject){
    reject(new Error('test'));
});
promise4.catch(function(error){
    console.log(error);
});


//Promise内部的错误，不会影响到Promise的外部
//通俗而言“Promise会吃掉错误”
const someAsyncThing = function(){
    return new Promise(function(resolve, reject){
        //下面一行会报错，因为x没有声明
        resolve(x + 2);
    });
};
someAsyncThing().then(function(){
    console.log('everything is great');
});
setTimeout(() => {console.log(123)}, 2000);
//Uncaught (in promise) ReferenceError: x is not defined
//123


//Promise.prototype.finally
promise
.then(result => {})
.catch(error => {})
.finally(() => {});

//finally方法的回调函数不接受参数，不依赖Promise的状态，执行结果

//Promise.all
//生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function(id){
    return getJSON('/post/' + id + ".json");
});
Promise.all(promises).then(function(posts){
    //...
}).catch(function(reason){
    //...
});

//如果作为参数的Promise实例，自己定义了catch方法，那它一旦被rejected,不会触发Promise.all()的catch()
const pro1 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(result => result)
.catch(e => e);

const pro2 = new Promise((resolve, reject) => {
    throw new Error('出错了');
})
.then(result => result)
.catch(e => e);

Promise.all([pro1, pro2])
.then(result => console.log(result))
.catch(e => console.log(e));
//["hello", Error: 出错了]

const pro3 = new Promise((resolve, reject) => {
    resolve('hello');
})
.then(result => result)

const pro4 = new Promise((resolve, reject) => {
    throw new Error('出错了');
})
.then(result => result)

Promise.all([pro3, pro4])
.then(result => console.log(result))
.catch(e => console.log(e));
//Error: 出错了

//Promise.race()
const newPromise = Promise.race([
    fetch('/resource-that-may-take-a-while'),
    new Promise((resolve, reject) => setTimeout(() => reject(new Error('request timeout')), 5000))
]);

newPromise
.then(console.log)
.catch(console.error);


//Promise.resolve() 将现有对象转为Promise对象
//Promise.resolve('foo');
//等价于
//new Promise(resolve => resolve('foo'))

//(1)参数是Promise实例
//直接返回

//(2)参数是thenable对象，指具有then方法对象
let thenable = {
    then: function(resolve, reject){
        resolve(42);
    }
};
let newPro = Promise.resolve(thenable);
newPro.then(function(value){
    console.log(value); //42
});

//(3)参数不是具有then方法的对象，或者根本不是对象
const newPro1 = Promise.resolve('hello');
newPro1.then(function(s){
    console.log(s);
});
//hello

//(4)不带有任何参数
const newPro2 = Promise.resolve();
newPro2.then(function(){
    //..
});


//立即resolve的Promise对象，实在本轮“事件循环”的结束时执行，setTimeout在下一轮“事件循环”开始时执行
setTimeout(function(){
    console.log('three');
}, 0);
Promise.resolve().then(function(){
    console.log('two');
});
console.log('one');
//one
//two
//three


//Promise.reject()
//该方法的参数，会原封不动地作为reject的理由，变成后续方法的参数
const thenable1 = {
    then(resolve, reject){
        reject('something error');
    }
};
Promise.reject(thenable1)
.catch(e => {
    console.log(e === thenable1)
})
//true
//不是reject抛出的something error,而是整个对象

//让同步函数同步执行，异步函数异步执行
//(1)async函数
const f = () => console.log('now');
(async () => f())();
console.log('next');
//now
//next
//如果f是异步的，就可以用.then
(async () => f())()
.then(/*... */)
.catch(/*...*/)

//(2)new Promise
const f1 = () => console.log('now');
(
    () => new Promise(
        resolve => resolve(f1())
    )
)();
console.log('next');
//now
//next


//(3)Promise.try()
const f2 = () => console.log('now');
Promise.try(f2);
console.log('next');
//now
//next

