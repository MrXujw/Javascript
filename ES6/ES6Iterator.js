var it = makeIterator(['a', 'b']);
it.next() //{value: "a", done: false}
it.next() //{value: "b", done: false}
it.next() //{value: undefined, done: true}

function makeIterator(array){
    var nextIndex = 0;
    return {
        next: function(){
            return nextIndex < array.length ? 
            {value: array[nextIndex++], done: false} : 
            {value: undefined, done: true}; //done: false和value: undefined可以省略
        }
    };
}

//ES6规定，默认的Iterator接口部署在数据结构的Symbol.iterator属性
const obj = {
    [Symbol.iterator]: function(){
        return {
            next: function(){
                return {
                    value: 1,
                    done: true
                };
            }
        };
    }
};

//原生具备Iterator接口的数据结构有
//Array,Map,Set,String,TypeArray,函数的arguments对象,NodeList对象
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();
iter.next() //{value: 'a', done: false}
iter.next() //{value: 'b', done: false}
iter.next() //{value: 'c', done: false}
iter.next() //{value: undefined, done: true}
//调用iterator属性，就得到遍历器对象

class RangeIterator{
    constructor(start, stop){
        this.value = start;
        this.stop = stop;
    }
    [Symbol.iterator](){return this;}
    next(){
        var value = this.value;
        if(value < this.stop){
            this.value++;
            return {done: false, value: value};
        }
        return {done: true, value: undefined};
    }
}
function range(start, stop){
    return new RangeIterator(start, stop);
}
for(var value of range(0, 3)){
    console.log(value); //0, 1, 2
}

function Obj(value){
    this.value = value;
    this.next = null;
}
Obj.prototype[Symbol.iterator] = function(){
    var iterator = {next: next};
    var current = this;
    function next(){
        if(current){
            var value = current.value;
            current = current.next;
            return {done: false, value: value};
        }else{
            return {done: true};
        }
    }
    return iterator;
}
var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);
one.next = two;
two.next = three;
for(var i of one){
    console.log(i); //1, 2, 3
}

//调用Iterator接口的场合
//(1)解构赋值,对数组和Set结构进行解构赋值时，会默认调用Symbol.iterator
let set = new Set().add('a').add('b').add('c');
let [x, y] = set;
//x='a', y='b'

let [first, ...rest] = set;
//first='a', rest=['b', 'c'];

//(2)扩展运算符
var str = 'hello';
[...str] //['h','e','l','l','o']

let arr = ['b','c'];
['a', ...arr, 'd'];
//['a', 'b', 'c', 'd']

//(3)yield*
let generator = function* (){
    yield 1;
    yield* [2, 3, 4];
    yield 5;
};
var iterator = generator();

iterator.next() //{value: 1, done: false}
iterator.next() //{value: 2, done: false}
iterator.next() //{value: 3, done: false}
iterator.next() //{value: 4, done: false}
iterator.next() //{value: 5, done: false}
iterator.next() //{value: undefined, done: true}

//(4)其他场合
//任意接受数组作为参数的场合

//字符串的Iterator
//可以覆盖原生的Symbol.iterator，达到修改遍历器行为的目的
var str = new String('hi');
[...str] //["h", "i"]

str[Symbol.iterator] = function() {
    return {
        next: function(){
            if(this._first){
                this._first = false;
                return {value: "bye", done: false};
            }else{
                return {done: true};
            }
        },
        _first: true
    };
};
[...str] //["bye"]
str //"hi"


//Iterator接口与Generator函数
let myIterator = {
    [Symbol.iterator]: function* (){
        yield 1;
        yield 2;
        yield 3;
    }
}
//[...myIterator] //[1, 2, 3]
//或者使用下面的简洁写法
let obj1 = {
    * [Symbol.iterator](){
        yield 'hello';
        yield 'world';
    }
};
for(let i of obj1){
    console.log(i)
}
//"hello"
//"world"


//遍历器对象的return(),throw()
//return()的使用场合时，如果for...of循环提前退出（通常因为出错，或者break）
//就会调用return
function readLinesSync(file){
    return {
        [Symbol.iterator](){
            return {
                next(){
                    return {done: fasle};
                },
                return(){
                    file.close();
                    return {done: true};
                }
            };
        },
    };
}

//下面两种情况都会触发return
//(1)
for(let line of readLinesSync(fileName)){
    console.log(line);
    break;
}
//(2)
for(let line of readLinesSync(fileName)){
    console.log(line);
    throw new Error();
}


const arr1 = ['red', 'green', 'blue'];
for(let v of arr1){
    console.log(v);  //red green blue
}

const obj1 = {};
obj1[Symbol.iterator] = arr1[Symbol.iterator].bind(arr1);
for(let v of obj1){
    console.log(v); //red green blue
}

