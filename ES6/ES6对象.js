const foo = 'bar';
const baz = {foo};
baz //{foo: 'bar'}

//ES6允许在对象中直接写变量，属性名为变量名，属性值为变量值
function f(x, y){
    return {x, y};
}
//dongtongyu
/*
function f(x, y){
    return {x: x, y: y};
}
*/
f(1, 2); //Object {x: 1, y: 2}
//方法也可以简写
const o = {
    method(){
        return "Hello!";
    }
};
//dengtongyu 
/*
const o = {
    method: function(){
        return "Hello!";
    }
};
*/
let birth = '2000/01/01';
const Person = {
    name: '张三',
    birth,
    hello(){
        console.log('我的名字是', this.name);
    }
};

//ES6允许字面量定义对象时，用表达式作为对象的属性名,而属性名表达式与简洁表示法
let propKey = 'foo';
let obj = {
    [propKey]: true,
    ['a' + 'bc']: 123
};

//方法的name属性
//方法的name属性返回函数名(方法名)
const person = {
    sayName(){
        console.log('hello!');
    },
};  
person.sayName.name; //"sayName"

const obj = {
    get foo(){},
    set foo(x){}
};
obj.foo.name; //TypeError
const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');
//对象的方法使用了getter,setter,则name属性不是在该方法上
//在该方法的属性的描述对象的get和set上
descriptor.get.name; //"get foo"
descriptor.set.name; //"set foo"

//bind方法创造的函数，name属性返回bound加上原函数的名字
//Function构造函数创造的函数，name属性返回anonymous
(new Function()).name //"anonymous"
var doSomething = function(){
    //...
};
doSomething.bind().name; "bound doSomething"

//ES6规定，所有Class的原型的方法都是不可枚举的
Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable;
//false

//（1）for...in循环遍历对象自身的和继承的可枚举属性（不含Symbol属性）
//（2）Object.keys(obj) 返回一个数组，包括对象自身的(不含继承的)所有可枚举属性（不包含Symbol属性）的键名
//（3）Object.getOwnPropertyNames(obj)返回一个包含对象自身的所有属性（不含Symbol）的键名
//（4）Object.getOwnPropertySymbols(obj)返回一个包含对象自身的所有Symbol属性的键名
//（5）Reflect.ownKeys(obj)返回一个数组，包含对象自身的所有键名，不管是不是可枚举，也不管键名是Symbol或字符串
//属性遍历的次序规则，首先遍历所有数值键，按数值顺序排列
//其次遍历所有字符串键，按照加入时间升序排列
//最后遍历所有Symbol键，按照加入时间升序排列
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
//['2', '10', 'b', 'a', Symbol()]

//关键字super指向当前对象的原型对象
//super表示原型对象时，只能用在对象的方法之中，其他地方都会报错
const proto = {
    foo: 'hello'
};
const obj = {
    foo: 'world',
    find(){
        return super.foo;
    }
};
Object.setPrototypeOf(obj, proto);
obj.find() //"hello"

const proto1 = {
    x: 'hello',
    foo(){
        console.log(this.x);
    },
};
const obj1 = {
    x: 'world',
    foo(){
        super.foo();
    }
}
Object.setPrototypeOf(obj1, proto1);
obj1.foo(); //"world"
//super.foo指向原型对象proto1的foo方法，但是绑定的this却还是当前对象obj1，所以输出world

//对象的扩展运算符
//解构赋值 右边时对象，不能是null或者undefined，扩展运算符必须是最后一个参数
let {x, y, ...z} = { x: 1, y: 2, a: 3, b: 4};
x //1
y //2
z //{ a: 3, b: 4}

let o1 = {a: 1};
let o2 = {b: 2};
o2._proto_ = o1;
let {...o3} = o2;
o3; //{b: 2};
o3.a; //undefined

const o = Object.create({x: 1, y: 2});
o.z = 3;
let {x, ...newObj} = 0; //扩展运算符后必须时一个变量名，不能时解构赋值表达式
let {y, z} = newObj;
x //1
y //undefined
z //3

let z = {a: 3, b: 4};
let n = {...z};
n //{a: 3, b: 4}

//对象的扩展运算符等同于使用Object.assign()
let aClone = {...a};
//等同于
//let aClone = Object.assign({}, a);

//完整克隆一个对象
//方法1,_proto_在非浏览器环境不一定部署
const clone1 = {
    _proto_: Object.getPrototypeOf(obj),
    ...obj
};
//2 推荐
const clone2 = Object.assign(
    Object.create(Object, getPrototypeOf(obj)),
    obj
);
//3 推荐
const clone3 = Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptor(obj)
)
