let s = Symbol();
typeof s; //"symbol"

let s1 = Symbol('foo'); //字符串参数为描述值
let s2 = Symbol('bar');
s1; //Symbol(foo);
s2; //Symbol(bar);
s1.toString(); //"Symbol(foo)"
s2.toString(); //"Symbol(bar)"

const obj = {
    toString(){
        return 'abc';
    }
};
const sym = Symbol(obj);
sym; //Symbol(abc)

let sym1 = Symbol('foo');
let sym2 = Symbol('foo');
sym1 === sym2; //false

//Symbol值不能与其他类型的值进行运算，会报错

//但是
let sym3 = Symbol('My symbol');
String(sym3); //'Symbol(My symbol)'
sym3.toString(); //'Symbol(My Symbol)'
Boolean(sym3); //true
!sym3; //false
//不能转为数值

//作为属性名
let mySymbol = Symbol();
//第一种写法
let a1 = {};
a[mySymbol] = 'Hello!';
//2
let a2 = {
    [mySymbol]: 'Hello!'
};
//3
let a3 = {};
Object.defineProperty(a, mySymbol, {value: 'Hello!'});
//均得到
a1[mySymbol]; //"Hello!"

//Symbol值作为属性名的时候，不能用点运算符,会导致如下
const myNewSymbol = Symbol();
const a = {};
a.myNewSymbol = "Hello";
a[myNewSymbol]; //undefined
a['myNewSymbol']; //"Hello"

//在对象内部使用Symbol值定义属性时，必须放在方括号
let newSymbol = Symbol();
let obj1 = {
    [newSymbol]: function(arg){
        //...
    }
    //增强写法
    //[newSymbol](arg) { ... }
};
obj1[newSymbol](123);

//消除魔术字符串
const shapeType = {
    triangle: Symbol()
};
function getArea(shape, options){
    let area = 0;
    switch(shape){
        case shapeType.triangle: 
            area = .5 * options.width * options.height;
            break;
    }
    return area;
}
getArea(shapeType.triangle, {width: 100, height: 100});

//属性名遍历
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'Hello';
obj[b] = 'World';
const objectSymbols = Object.getOwnPropertySymbols(obj);
objectSymbols //[Symbol(a), Symbol(b)]

const obj = {};
let foo = Symbol("foo");
Object.defineProperty(obj, foo, {
    value: "foobar",
});
for(let i in obj){
    console.log(i); //无输出
}
Object.getOwnPropertyNames(obj);
//[]
Object.getOwnPropertySymbols(obj);
//[Symbol(foo)]

let obj = {
    [Symbol('my_key')]: 1,
    enum: 2,
    nonEnum: 3
};
Reflect.ownKeys(obj);
//["enum", "nonEnum", Symbol(my_keys)]

let size = Symbol('size');
class Collection{
    constructor(){
        this[size] = 0;
    }
    add(item){
        this[this[size]] = item;
        this[size]++;
    }
    static sizeof(instance){
        return instance[size];
    }
}
let x = new Collection();
Collection.sizeof(x) //0
x.add('foo');
Collection.sizeof(x) //1
//Object.keys()和Object.getOwnPropertyNames()无法获取Symbol值
Object.keys(x); //['0']
Object.getOwnPropertyNames(x); //['0']
Object.getOwnPropertySymbols(x); //[Symbol(size)]

let newSym1 = Symbol.for('foo');
let newSym2 = Symbol.for('foo');
newSym1 === newSym2; //true

Symbol.for('bar') === Symbol.for('bar'); //true   登记机制（全局环境），会检查给的的key是否存在
Symbol('bar') === Symbol('bar'); //false  没有登记机制

Symbol.keyFor(newSym1); //"foo"
//Symbol.keyFor()返回一个已登记的Symbol类型值得key

iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);
iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo');
//true

//数组默认可以展开
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e'); //['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] //undefiend

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e'); //['a', 'b', ['c', 'd'], 'e']

//类似数组默认不能展开
let obj2 = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj2, 'e'); //['a', 'b', obj2, 'e']
obj2[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj2, 'e'); //['a', 'b', 'c', 'd', 'e']

//Symbol.isConcatSpreadable属性也可以定义在类里面
class A1 extends Array{
    constructor(args){
        super(args);
        this[Symbol.isConcatSpreadable] = true;
    }
}
class A2 extends Array{
    constructor(args){
        super(args);
    }
    get [Symbol.isConcatSpreadable](){
        return false;
    }
}
let aa1 = new A1();
aa1[0] = 3;
aa1[1] = 4;
let aa2 = new A2();
aa2[0] = 5;
aa2[1] = 6;
[1, 2].concat(aa1).concat(aa2);
//[1, 2, 3, 4, [5, 6]]

class MyArray extends Array{
    static get [Symbol.species]() { return Array; }
}
const arra = new MyArray();
const arrb = arra.map(x => x);
arra instanceof MyArray //false
arrb instanceof Array //true


//如下代码中，T2定义了Symbol.species属性，T1没有
//T1创建衍生对象时(then方法)，调用的是自身的构造方法
//T2调用的是Promise的构造方法
class T1 extends Promise{
}
class T2 extends Promise{
    static get [Symbol.species](){
        return Promise;
    }
}
new T1(r => r()).then(v => v) instanceof T1 //true
new T2(r => r()).then(v => v) instanceof T2 //false

//Symbol.match
//该属性，指向一个函数，当执行str.match(myObjext)时，
//如果该属性存在，会调用它，返回该方法的返回值
String.prototype.match(regexp)
//等同于
regexp[Symbol.match](this)
class MyMatcher{
    [Symbol.match](string){
        return 'hello world'.indexOf(string);
    }
}
'e'.match(new MyMatcher()); // 1

//Symbol.replace
String.prototype.replace(searchValue, replaceValue);
//dengtongyu
searchValue[Symbol.replace](this, replaceValue);

const x ={};
x[Symbol.replace] = (...s) => console.log(s);
'Hello'.replace(x, 'World'); //["Hello", "World"]

//