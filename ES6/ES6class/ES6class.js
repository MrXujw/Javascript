/*
function Point1(x, y){
    this.x = x;
    this.y = y;
}
Point.prototype.toString() = function(){
    return '(' + this.x + ', ' + this.y + ')';
}
var p = new Point(1, 2); //(1, 2)
*/
//ES6的class
class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    toString(){
        return '(' + this.x + ', ' + this.y + ')';
    }
}
let p = new Point(1, 2); //(1, 2)
//ES5的构造函数Point对应了ES6Point类的构造方法

//类的内部所有定义的方法，都是不可枚举的
Object.keys(Point.prototype)
//[]
Object.getOwnPropertyNames(Point.prototype)
//["constrctor", "toString"]

typeof Point; //"function"
//prototype对象的constrctor属性直接指向“类”自身
Point === Point.prototype.constructor //true

//类的所有方法都定义在类的prototype属性上
//在类的实例上面调用方法，其实就是在调用原型上的方法

p.constructor === Point.prototype.constructor //true

//用Object.assign方法可以很方便的一次向类添加多个方法
Object.assign(Point.prototype, {
    toValue(){},
    toSay(){}
});

//可以通过实例的__proto__属性修改原型
var p1 = new Point(2, 3);
var p2 = new Point(3, 2);
p1.__proto__.printName = function() {return "Oops"};
p1.printName() //"Oops"
p2.printName() //"Oops"
var p3 = new Point(3, 3);
p3.printName() //"Oops"


//类的属性名，可以用表达式
let methodName = 'getArea';
class Square{
    constructor(length){
        //...
    }
    [methodName](){
        //...
    }
}
//Square类的方法名getArea，是从表达式得到的

//Class表达式
const MyClass = class Me{
    getClassName(){
        return Me.name;
    }
};  //类的名字是MyClass,Me只在内部使用，代指当前类
let inst = new MyClass();
inst.getClassName() //Me
MyClass.name; //Me
Me.name; //ReferenceError: Me is not defined

let person = new class {
    constructor(name) {
      this.name = name;
    }
  
    sayName() {
      console.log(this.name);
    }
}('张三');
person.sayName(); // "张三"

//不存在声明提升

//在某个方法之前加上*，则表示该方法是一个Generator函数
class Foo{
    constructor(...args){
        this.args = args;
    }
    * [Symbol.interator](){
        for(let arg of args){
            yield arg;
        }
    }
}
for(let x of new Foo('hello', 'world')){
    console.log(x);
}
//hello
//world


//this的指向
//如果类的方法（除去静态方法）内部有this，它默认指向类的实例
class Logger{
    constructor(){
        //this.printName = this.printName.bind(this)//第一种解决方法是，在构造方法中绑定this
        this.printName = (name = 'there') => {
            this.print(`Hello ${name}`);
        };//第二种解决方法是箭头函数
    }
    printName(name = 'there'){
        this.printName(`Hello ${name}`);
    }
    print(text){
        console.log(text);
    }
}
const logger = new Logger();
const { printName } = logger;
printName(); //TypeError: Cannot read property 'print' of undefined

