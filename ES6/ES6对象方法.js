//Object.is()  比较两个值是否相等
+0 === -0; //true
NaN === NaN //false
Object.is(+0, -0); //false
Object.is(NaN, NaN);//true

//ES5
Object.defineProperty(Object, 'is', {
    value: function (x, y) {
        if (x === y) {
            //针对+0 === -0
            return x !== 0 || 1 / x === 1 / y;
        }
        //针对NaN !== NaN
        return x !== x && y !== y;
    },
    configurable: true,
    enumerable: false,
    writable: true
})

//Object.assign() 用于对象合并
const target = { a: 1 };
const source1 = { b: 2, c: 2};
const source2 = { c: 3 };
Object.assign = (target, source1, source2);
target //{a: 1, b: 2, c: 3}

const obj = {a: 1};
Object.assign(obj) === obj; //true

typeof Object.assign(2) //object  参数不是对象，会强制转成对象再返回
//不能以null和undefined作为首参数
let obj1 = {a: 1};
Object.assign(obj1, null/*undefined */) ===obj1; //true

const v1 = 'abc';
const v2 = true;
const v3 = 33;
const obj2 = Object.assign({}, v1, v2, v3);
console.log(obj2); //{"0": "a", "1": "b", "2": "c"}

Object.assign([1, 2, 3], [4, 5]);
//[4, 5, 3], 源数组的"0"号属性4覆盖了目标数组的

Object.assign(SomeClass.prototype, {
    someMethod(arg1, arg2){
        //...
    },
    anotherMethod(){
        //...
    }
});
//dengtongyu
SomeClass.prototype.someMethod = function(arg1, arg2){
    //...
};
SomeClass.prototype.anotherMethod = function(){
    //...
};

//合并对象
const merge = (target, ...sources) => Object.assign(target, ...sources);
const merge1 = (...sources) => Object.assign({}, ...sources);

const entires = new Map([
    ['foo', 'bar'],
    ['baz', 42]
]);
Object.fromEntires(entires);
//{foo: "bar", baz: 42}

const map = new Map().set('foo', true).set('bar', false);
Object.fromEntires(map); //{foo: true, bar: false}

//Object.fromEntires一个用处是搭配URLSearchParams对象，将查询字符串转为对象
Object.fromEntires(new URLSearchParams('foo=bra&baz=qux'))
//{foo: "bar", baz: "qux"}

