function* gen(x){
    var y = yield x + 2;
    return y;
}
var g = gen(1);
g.next(); //{value: 3, done: false}
g.next(); //{value: undefined, done: true}

//异步任务的封装
var fetch = require('node-fetch');

function* gen1(){
    var url = 'http://api.github.com/users/github';
    var result = yield fetch(url);
    console.log(result.bio);
}
//执行
var g1 = gen1();
var result = g1.next();
result.value.then(function(data){
    return data.json();
}).then(function(data){
    g1.next(data);
});

//thunk函数，编译器的“传名调用”实现，即将参数放到一个临时函数之中，这个函数就是thunk函数
var thunk = function(){
    return x + 5;
};
function f(thunk){
    return thunk() * 2;
}

//正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

//Thunk版本的readFile（单参数版本）
var Thunk = function(fileName){
    return function(callback){
        return fs.readFile(fileName, callback);
    };
};
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

//ES5转换器版本
/*
var Thunk = function(fn){
    return function(){
        var args = Array.prototype.slice.call(arguments);
        return function(callback){
            args.push(callback);
            return fn.apply(this, args);
        }
    };
};
*/
//ES6版本
const Thunk = function(fn){
    return function(...args){
        return function(callback){
            return fn.call(this, ...args, callback);
        }
    };
};

//eg
function f(a, cb){
    cb(a);
}
const ft = Thunk(f);
ft(1)(console.log); //1


