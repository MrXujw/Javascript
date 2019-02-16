//ES6提供字符串实例的normalize()方法，用来将字符的不同表示方法统一为同样的形式
//这称为Unicode正规化
'\u01D1'==='\u004F\u030C'; //false
'\u01D1'.length; //1
'\u004F\u030C'.length;//2

'\u01D1'.normalize() === '\u004F\u030C'.normalize(); //true

//确定一个字符串是否包含在另外一个字符串中，出了JavaScript的indexOf90以外
//ES6新增了includes(),startsWith(),endsWith()
let s = "Hello World!";
s.startsWith('Hello'); //true
s.endsWith('!'); //true
s.includes('o'); //true
//三个方法都支持第二个参数，表示开始搜索的位置,endswith争对前n个字符，
//而其他俩方法针对从第n个位置知道字符串结束
s.startsWith('world', 6); //true
s.endsWith('Hello', 5); //true
s.includes('Hello', 6); //false

'x'.repeat(3); //'xxx'  repeat()的参数不能是负数(>-1的小数除外)或者Infinity,会报错
'x'.repeat(NaN); //''

//padStart(),padEnd()
'x'.padStart(4, 'ab'); //'abax'
'x'.padEnd(4, 'ab'); //'xaba'
'xxxx'.padStart(3, 'ab'); //'xxxx'
'xxxx'.padEnd(3, 'ab'); //'xxxx'
'x'.padStart(4); //'   x'

//matchAll()放回一个正则表达式在当前字符串的所有匹配

//ES6允许使用第二个参数制定修饰符，而且返回的正则表达式会忽略原有的正则表达式的修饰符,
//而只是用新指定的修饰符
let regex = new RegExp(/abc/ig, 'i').flags; //flags属性，会返回正则表达式的修饰符
// "i"

//字符串的的正则方法
String.prototype.match//调用RegExp.prototype[Symbol.match]
//replace(),search(),split()同理

//u修饰符，含义为"Unicode模式"
/^\uD83D/u.test('\uD83D\uDC2A'); //ES6 false
/^\uD83D/.test('\uD83D\uDC2A'); //ES5 true

let s = '𠮷';
/^.$/.test(s); //false
/^.$/u.test(s); //true  对于码点大于0xFFFF的Unicode字符，点字符不能识别，必须加上u修饰符

//ES6新增{}表示Unicode字符，在正则表达式中必须加上u修饰符

function codePointLength(text){
    let result = text.match(/[\s\S]/gu);
    return result ? result.length : 0;
}
let s = '𠮷𠮷';
s.length; //4
codePointLength(s); //2

//i修饰符加了 u修饰符才能识别非规范的K字符

//ES6正则实例对象新增unicode属性，表示是否设置u修饰符
const r1 = /hello/;
const r2 = /hello/u;
r1.unicode; //false
r2.unicode; //true

// y修饰符，"粘连"修饰符，全局匹配，确保匹配必须从剩余的第一个位置开始
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;
r1.exec(s); //["aaa"]
r2.exec(s); //["aaa"]
r1.exec(s); //["aa"]
r2.exec(s); //null  因为剩下"_aa_a"，而y修饰符要从头开始，所以返回null

const REGEX = /a/g;
REGEX.lastIndex = 2; //从2号位置(y)开始匹配
const match = REGEX.exec('xaya');
match.index; //3    在3号位匹配成功
REGEX.lastIndex; //4  下次匹配从4号位开始
REGEX.exec('xaya'); //null  4号开始匹配失败
//而y修饰符，要求必须在lastIndex指定的位置发现匹配
const REGEX = /a/y;
REGEX.lastIndex = 2; //从2号位置(y)开始匹配
REGEX.exec('xaya'); //null 不是粘连，匹配失败
match.lastIndex = 3; // 指定从3号位置开始匹配
const match = REGEX.exec('xaya'); //3号位置时粘连的，匹配成功
match.index; //3
REGEX.lastIndex; //4
//y修饰符的本意，保证头部匹配的标志^在全局匹配中都有效
REGEX.sticky; //true  sticky属性，表示是否设置了y修饰符

//ES6引入了s修饰符，使得.字符可以匹配任意单个字符 dotAll模式
/foo.bar/.test('foo\nbar'); //false
/foo.bar/s.test('foo\nbar'); //true
//引入dotAll属性，表示该正则表达式是否处在dotAll模式

//先行断言
//匹配百分号前的数字
/\d+(?=%)/.exec('100% of US presidents have been male'); //["100"]
//先行否定断言，匹配不在百分号前的数字
/\d+(?!%)/.exec("that's all 44 of them"); ["44"]

//后行断言
/(?<=\y)x/ //  /(?<=\$)\d+/
//后行否定断言
/(?<!\y)x/
const RE_DOLIAR_PREFIX = /(?<=\$)foo/g;
'$foo %foo foo'.replace(RE_DOLIAR_PREFIX, 'bar');
//'$bar %foo foo'  在$符号后面的foo在会被替换

//ES5写法
parseInt('12.34'); //12
parseFloat('123.45#'); //123.45
//ES6写法,即全局方法移植Number对象上
Number.parseInt('12.34'); //12
Number.parseFloat('123.45#'); //123.45

Number.EPSILON === Math.pow(2, -52); //true
//Number.EPSILON 就是JavaScript能够表示的最小精度

Math.trunc(4.1); //4  Math.trunc()用于去除一个属的小数部分
//对于空值或者无法截取整数的值，返回NaN

Math.sign(-4); //-1
Math.sign(2); //1
Math.sign(0); //0
Math.sign(-0); //-0
Math.sign(NaN); //NaN

Math.cbrt();//用于计算立方根

//ES6之后，可以直接为函数的参数指定默认值 , 而参数默认值的位置通常是函数的尾参数
function log(x, y = 'World'){
    // let y = 'ww'; //error
    console.log(x, y);
}
log('Hello'); //Hello World
log('Hello', 'China'); //Hello China
log('Hello', ''); //Hello
//使用参数默认值时，函数不能有同名参数
let x = 99;
function foo(p = x + 1){
    console.log(p);
}
foo();//100
x = 100;
foo(); //101

//与解构赋值的默认值结合使用
function fo({x, y = 5}){
    console.log(x, y);
}
fo({}); //undefined 5
fo({x: 1}); //1 5
fo({x: 1, y: 2});// 1 2
fo(); //TypeError: Cannot read property 'x' of undefined
//为了避免fo()的情况 =>
function fo({x, y = 5} = {}){
    console.log(x, y);
}
fo(); //undefined 5

//eg
function fetch(url, {body = '', method = 'GET', headers ={} } ={}){
    console.log(method);
}
fetch('http://example.com'); //"GET"

//指定了函数参数默认值以后，函数的length属性会返回没有指定默认值的参数个数
(function (a){}).length; //1
(function (a = 5){}).length; //0
(function (a, b, c = 5){}).length; //2
(function (...args){}).length; //0
(function (a = 0, b, c){}).length; //0
(function (a, b = 0, c){}).length;//1

var x = 1;
function f(x, y = x){
    console.log(y);
}
f(2); //2 ,参数默认值有单独的作用域，默认值变量x指向第一个参数x

let x = 1;
function f(y = x);{
    let x = 2;
    console.log(y);
}
f();// 1   这里变量x指向全局变量，函数内部局部变量x影响不到默认值变量x

let foo = 'outer';
function bar(func = () => foo){
    let foo = 'inner';
    console.log(func);
}
bar(); //outer

//利用参数默认值，可以制定某一个参数不得省略，如果省略就抛出一个错误
function throwIfMissing(){
    throw new Error('Missing parameter');
}
function foo(mustBeProvided = throwIfMissing()){
    return mustBeProvided;
}
foo();
//Error: Missing parameter
//参数默认值为undefined时，表示这个参数可以省略

//ES6引入rest参数(形式为...变量名)
function add(...values){
    let sum = 0;
    for(var val of values){
        sum += val;
    }
    return sum;
}
add(1, 3, 4); //8
//arguments变量写法,arguments是类似数组的对象
function sortNumbers(){
    return Array.prototype.slice.call(arguments).sort();
}
//rest写法   而rest就是数组
const sortNumbers = (...numbers) => numbers.sort();
//rest之后不能有其他参数，length属性不包括rest参数

//ES6函数参数使用了默认值。解构赋值或者扩展运算符，则
//函数内部不能显示设定为严格模式，会报错

var f = v => v;
//等同于
var f = function(v){
    return v;
};
//箭头函数与变量解构结合使用
const full = ({first, last}) => first + '' + last;
//等同于
function full1(person){
    return person.first + '' + person.last;
}

//简化回调函数
[1,2,3].map(x => x * x);
//等同于
[1,2,3].map(function (x){
    return x * x;
})

function baz(){
    setTimeout(() => {
        console.log('id:',this.id);
    }, 100);
}
/*ES5
function baz(){
    var _this = this;
    setTimeout(function(){
        console.log('id:', _this.id);
    }, 100);
}
*/
var id = 21;
baz.call({ id: 42 });
//箭头函数的this总是只想函数定义生效时所在的对象
//箭头函数可以让setTimeout里的this绑定定义时所在的作用域
//而不是指向运行时所在的作用域

var handler = {
    id: '123456',
    init: function(){
        document.addEventListener('click',
        event => this.doSomething(event.type), false);
    },
    doSomething: function(type){
        console.log('Handling ' + type + 'for' + this.id);
    }
};
//实际上，箭头函数没有this，以及arguments,super,new.target
function vvv(){
    setTimeout(() => {
        console.log('args:', arguments);
    }, 100);
}
vvv(2,3,4,5);
//args: [2,3,4,5]   这里的arguments其实是函数vvv的arguments变量
//箭头函数不适用定义函数的方法
//需要动态this的时候也不适合用箭头函数

//双冒号运算符,::左边是一个对象，右边是一个函数
foo::bar;
//等同于
bar.bind(foo);
