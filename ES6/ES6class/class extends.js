class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return '(' + this.x + ', ' + this.y + ')';
    }
}

class ColorPoint extends Point{
    constructor(x, y, color){
        super(x, y); //调用父类的constructor(x, y)
        this.color = color;
    }
    toString(){
        return this.color + ' ' + super.toString(); //调用父类的toString()
    }
}
//子类必须在constructor方法中调用super方法，否则新建实例会报错

let cp = new ColorPoint(25, 8, 'green');
cp instanceof ColorPoint   //true
cp instanceof Point  //true

Object.getPrototypeOf(ColorPoint) === Point; 
//true

//super关键字
//(1)作为函数调用,代表父类的构造函数
//但是返回的是子类的实例，即super内部的this指的是子类

//(2)作为对象
//在普通方法中，指向父类的原型对象
//在静态方法中，指向父类
class A{
    constructor(){
        this.x = 1;
    }
    print(){
        console.log(this.x);
    }
    p(){
        return 2;
    }
}
class B extends A {
    constructor(){
        super();
        console.log(super.p()); //2
        this.x = 2;
        super.x = 3;
        console.log(super.x); // undefined
        console.log(this.x); // 3
    } //super.p()相当于A.prototype.p()
    m(){
        super.print();
    }
}

let b = new B();
//在子类普通方法中通过super调用父类的方法时，
//方法内部的this指向当前的子类实例
b.m(); //2
//这里实际上执行的时super.print.call(this)

//static method
class Parent{
    static myMethod(msg){
        console.log('static', msg);
    }
    myMethod(msg){
        console.log('instance', msg);
    }
}
class Child extends Parent{
    static myMethod(msg){
        super.myMethod(msg);
    }
    myMethod(msg){
        super.myMethod(msg);
    }
}

Child.myMethod(1); //static 1
var child = new Child();
child.myMethod(2); //instance 2
//子类的静态方法中通过super调用父类的方法时，方法内部
//的this指向当前的子类，而不是子类的实例


//原生构造函数的继承
/**
 * Boolean()
 * Number()
 * String()
 * Array()
 * Date()
 * Function()
 * RegExp()
 * Error()
 * Object()
 */
//以前，这些原生构造函数是无法继承的，如不能自定义一个Array的子类
function MyArray(){
    Array.apply(this, arguments);
}
MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value: MyArray,
        writable: true,
        configurable: true,
        enumerable: true
    }
});
var colors = new MyArray();
colors[0] = "red";
colors.length //0  //是内部属性，无法被子类获取
colors.length = 0;
colors[0] //"red"

//ES6以后
class MyNewArray extends Array{
    constructor(...args){
        super(...args);
    }
}
var arr = new MyNewArray();
arr[0] = 12;
arr.length //1
arr.length = 0;
arr[0]; //undefined

//这说明，extends不仅可以用来继承类，还可以用来继承原生的构造函数

class VersionedArray extends Array{
    constructor(){
        super();
        this.history = [[]];
    }
    commit(){
        this.history.push(this.slice());
    }
    revert(){
        this.splice(0, this.length, ...this.history[this.history.length - 1]);
    }
}

var x = new VersionedArray();
x.push(1);
x.push(2);
x //[1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x  //[1, 2, 3]
x.history //[[], [1, 2]]

x.revert();
x // [1, 2]

//自定义Error子类的例子，可以用来定制报错时的行为
class ExtendableError extends Error{
    constructor(message){
        super();
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
    }
}
class MyError extends ExtendableError{
    constructor(m){
        super(m);
    }
}

var myerror = new MyError('ll');
myerror.message //"ll"
myerror instanceof Error //true
myerror.name //"MyError"
myerror.stack
// Error
//      at MyError.ExtendableError
//      ...


//继承Object的子类，有一个行为差异
class NewObj extends Object{
    constructor(){
        super(...arguments);
    }
}
var o = new NewObj({attr: true});
o.attr === true //false
//子类无法通过super方法向父类Object传参，
//一旦发现Object方法不是通过new Object调用
//Object构造函数会忽略参数


function mix(...mixins){
    class Mix{}
    for(let mixin of mixins){
        copyProperties(Mix.prototype, mixin); //拷贝实例属性
        copyProperties(Mix.prototype, Reflect.getPrototypeOf(mixin)); //拷贝原型属性
    }
    return Mix;
}
function copyProperties(target, source){
    for(let key of Reflect.ownKeys(source)){
        if(key !== "constructor"
        && key !== "prototype"
        && key !== "name"
        ){
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
}
//这个mix函数，可以将多个对象合成为一个类，使用的时候，
//只要继承这个类即可
class DistributedEdit extends mix(Loggable, Serializable){
    //...
}