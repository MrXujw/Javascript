const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
for (let i of s) {
    console.log(i);
}
// 2 3 5 4
//通过add()方法向Set结构加入成员，结果表明Set结构不会添加重复的值

//Set可以接受一个数组(或者具有iterable接口的其他数据结构)作为参数，用来初始化
const set = new Set([1, 2, 3, 4, 4]);
[...set];
//[1, 2, 3, 4]

const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
items.size //5

const set1 = new Set(document.querySelectorAll('div'));
set1.size // 56
//类似于
const set2 = new Set();
document
    .querySelectorAll('div')
    .forEach(div => set2.add('div'));
set2.size //56

//去除数组重复成员的方法
[...new Set(set2)]
//去除字符串的重复字符
[...new Set('adadadad')].join('')
//'ad'

//Set加入值得时候，不会发生类型转换 NaN等于自身，两个对象总是不相等

Set.prototype.constructor //构造函数，默认就是set函数
Set.prototype.size //返回Set实例得成员总数
add(value) //添加某个值，返回Set结构本身
delete(value) //删除某个值，返回一个布尔值，表示删除是否成功
has(value) //返回一个布尔值，表示该值是否为Set的成员
clear() //清楚所有成员，没有返回值

set.add(1).add(2).add(2);
set.size //2
set.has(1) //true
set.has(3) //false
set.delete(2) //true
set.has(2) //false

//对象的写法
const properties = {
    'width': 1,
    'height': 1
};
if(properties[someName]){
    //do something
}

//Set写法
const properties1 = new Set();
properties1.add('width');
properties1.add('height');
if(properties1.has(someName)){
    //do something
}

//Array.from可以把Set结构转为数组
const items = new Set([1, 2, 3, 4, 5]);
const array = new Array.from(items);//提供了去除数组重复成员的另一种方法

let setColor = new Set(['red', 'green', 'blue']);
for(let item of setColor.keys()){
    console.log(item);
}
//red
//green
//blue
for(let item of setColor.values()){
    console.log(item);
}
//red
//green
//blue
for(let item of setColor.entries()){
    console.log(item);
}
//["red", "red"]
//["green", "green"]
//["blue", "blue"]

//Set结构的实例默认可遍历，他的默认遍历器(Iterator)生成函数就是他的values()方法
Set.prototype[Symbol.iterator] === Set.prototype.valus //true
//可以这样循环遍历Set
let set3 = new Set(['red', 'green', 'white']);
for(let item of set3){
    console.log(item);
}
//red
//green
//white

let set4 = new Set([1, 2, 3])
set4.forEach((value, key) => console.log(key + ' : ' + value))
//1 : 1
//2 : 2
//3 : 3

//weakSet的成员只能是对象

//Map数据结构
//Object结构提供了“字符串-值”的对应，Map结构提供了“值-值”的对应
const m = new Map();
const o = {p: 'Hello World'};
m.set(o, 'content');
m.get(o); //"content"
m.has(o); //true
m.delete(o); //true
m.has(o); //false

const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);
map.size //2 
map.has('name'); //true
map.get('name'); //"张三"
map.has('title'); //true
map.get('title'); //"Author"

//实际上是执行下面的算法
const items = [
    ['name', '张三'],
    ['title', 'Author']
];
const map1 = new Map();
items.forEach(
    ([key, value]) => map1.set(key, value)
);

//只有对同一个对象的引用，Map结构才将其视为同一个键
const map2 = new Map();
map2.set(['a'], 555);
map2.get(['a']); //undefined

//Map=>Object
function strMapToObj(strMap){
    let obj = Object.create(null);
    for(let [k, v] of strMap){
        obj[k] = v;
    }
    return obj;
}

//对象转为Map
function objToStrMap(obj){
    let strMap = new Map();
    for(let i of Object.keys(obj)){
        strMap.set(i, obj[i]);
    }
    return strMap;
}
objToStrMap({yes: true, no: false})
//Map{"yes" => true, "no" => false}

//Map => JSON
//键名全是字符串=> 对象JSON
function strMapToJson(strMap){
    return JSON.stringify(strMapToObj(strMap));
}
let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap);

//JSON => Map
function jsonToMap(jsonStr){
    return new Map(JSON.parse(jsonStr));
}
jsonToMap('[[true,7],[{"foo":3,["abc"]]]')
//Map{true => 7, Object{foo: 3} => ['abc']}
