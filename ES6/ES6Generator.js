function* helloWorldGenerator(){
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWorldGenerator();

function f(){
    console.log('执行了');
}
var generator = f();
setTimeout(function(){
    generator.next();
}, 2000);

var arr = [1, [[2, 3], 4], [5, 6]];
var flat = function* (a){
    var length = a.length;
    for(var i = 0; i < length; i++){
        var item = a[i];
        if(typeof item !== 'number'){
            yield* flat(item);
        }else{
            yield item;
        }
    }
};
for(var f of flat(arr)){
    console.log(f);
}
//1, 2, 3, 4, 5, 6

//yield表达式如果用在另一个表达式之中，必须放在圆括号里
function* demo(){
    //console.log('Hello' + yield); //SyntaxError
    //console.log('Hello' + yield 123);//SyntaxError
    console.log('Hello' + (yield)); //OK
    console.log('Hello' + (yield 123)); //OK
}

//yield表达式作为函数参数或者放在赋值表达式右边，可以不加括号
function* demo(){
    foo(yield 'a', yield 'b'); //OK
    let input = yield; //ok
}


//与Iterator
var myIterator = {};
myIterator[Symbol.iterator] = function* (){
    yield 1;
    yield 2;
    yield 3;
};
[...myIterator]; //[1, 2, 3]

//next方法的参数
function* f(){
    for(var i = 0; true; i++){
        var reset = yield i;
        if(reset){i = -1}
    }
}
var g = f();
g.next(); //{value: 0, done: false}
g.next(); //{value: 1, done: false}
g.next(true); //{value: 0, done: false}

function* foo(x){
    var y = 2 * (yield (x + 1));
    var z = yield(y / 3);
    return (x + y + z);
}
var a = foo(5);
a.next(); // Object{value:6, done:false}
a.next(); //Object{value:NaN, done:false}
a.next(); //Object{value:NaN, done:true}

var b = foo(5);
b.next(); //Object{value:6, done:false} //x + 1 = 6
b.next(12); //Object{value:8, done:false} //将上一次yield表达式设为12，所以y为24
b.next(13); //Object{value:42, done:true} //将上一次yield表达式设为13，所以z为13

function* dataConsumer(){
    console.log('Started');
    console.log(`1. ${yield}`);
    console.log(`2. ${yield}`);
    return 'result';
}
let genObj = dataConsumer();
genObj.next();
//Started
genObj.next('a');
//1. a
genObj.next('b');
//2. b

//如果想要第一次调用next方法，就可以输入值，可以在Generator函数外再包一层
function wrapper(generatorFunction){
    return function(...args){
        let generatorObject = generatorFunction(...args);
        generatorObject.next();
        return generatorObject;
    };
}
const wrapped = wrapper(function* (){
    console.log(`First input: ${yield}`);
    return 'DONE';
});
wrapped().next('hello!');
//First input: hello!

//一旦next的方法返回对象的done为true，for...of循环就会中止，会包含该返回对象
function* foo(){
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
    return 6;
}
for(let v of foo()){
    console.log(v);
};
//1 2 3 4 5

//Generator.prototype.throw()
var g = function* (){
    try{
        yield;
    }catch(e){
        console.log('内部捕获', e);
    }
};
var i = g();
i.next();
try{
    i.throw('a');
    i.throw('b');
}catch(e){
    console.log('外部捕获', e);
}
//内部捕获 a
//外部捕获 b


//throw()方法被捕获以后，会附带下一条yield表达式，会执行一次next
var gen = function* gen(){
    try{
        yield console.log('a');
    }catch(e){
        //...
    }
    yield console.log('b');
    yield console.log('c');
}
var g1 = gen();
g1.next() //a
g1.throw(); //b
g1.next() //c

//throw命令与generator.prototype.throw()方法无关

//next(),throw(),return()的共同点
//他们的作用都是让Generator函数恢复执行，并且使用不同的语句替换yield表达式
//next()是将yield表达式替换成一个值
const gen1 = function* (x, y){
    let result = yield x + y;
    return result;
};
const gen11 = gen1(1, 2);
gen11.next(); //Object{value: 3, done: false}
gen11.next(1); //Object{value: 1, done: true}

//throw()是将yield表达式替换成一个throw语句
gen11.throw(new Error('出错了')); //Uncaught Error: 出错了

//return()是将yield表达式替换成一个return语句
gen11.return(2); //Object{value: 2, done: true}


//yield*表达式，如果在Generator函数内部，调用另外一个Generator函数
function* foo(){
    yield 'a';
    yield 'b';
}

function* bar(){
    yield 'x';
    yield* foo();
    yield 'y';
}
for(let v of bar()){
    console.log(v);
}
//等同于
function* bar1(){
    yield 'x';
    yield 'a';
    yield 'b';
    yield 'y';
}
//等同于
function* bar2(){
    yield 'x';
    for(let v of foo()){
        yield v;
    }
    yield 'y';
}
for(let v of bar()){
    console.log(v);
}
//"x"
//"a"
//"b"
//"y"

function* inner(){
    yield 'hello!';
}
function* outer1(){
    yield 'open';
    yield inner();
    yield 'close';
}
var newGen = outer1();
newGen.next().value; //"open"
newGen.next().value; //返回一个遍历器对象
newGen.next().value; //"close"

function* outer2(){
    yield 'open';
    yield* inner();
    yield 'close';
}
var newGen1 = outer2();
newGen1.next().value //"open"
newGen1.next().value //"hello!"
newGen1.next().value //"close"


//Generator的this 
//要Generator函数返回一个正常的对象实例，既可以使用next()，有可以获得正常的this，可以这样
function* F(){
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
}
var f = F.call(F.prototype);
/*用 F.prototype代替obj
var obj = {};
var f = F.call(obj);
*/
f.next(); //Object{value: 2, done: false}
f.next(); //Object{value: 3, done: false}
f.next(); //Object{value: undefined, done: true}
obj.a; //1
obj.b; //2
obj.c; //3

//改成构造函数
function F1(){
    return F.call(F.prototype);
}
var f1 = new F1();


//Generator与状态机
var clock = function* (){
    while(true){
        console.log('Tick!');
        yield;
        console.log('Tock!');
        yield;
    }
};
//dengtongyu
/*
var ticking = true;
var clock = function(){
    if(ticking)
        console.log('Tick!');
    else   
        console.log('Tock!');
    ticking = !ticking;
}
*/

