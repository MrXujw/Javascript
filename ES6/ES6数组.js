//扩展运算符 ...
console.log(...[1, 2, 3]);
//1 2 3

function push(array, ...items){
    array.push(...items);
}
function add(x ,y){
    return x + y;
}
const numbers = [4, 38];
add(...numbers); //42

//代替apply方法
//ES5写法
function f(x, y, z){
    //...
}
var args = [0, 1, 2];
f.apply(null, args);
//ES6
function f(x, y, z){
    //...
}
let args = [0, 1, 2];
f(...args);

//ES5
var arr1 = [0, 1, 2];
var arr2 = [4, 5, 6];
Array.prototype.push.apply(arr1, arr2);

//ES6
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);

//应用--复制数组
const ar1 = [1, 2];
const ar2 = [...a1];
//const [...a2] = a1;  这两种都是a2对a1的克隆

//应用--合并数组--浅拷贝
//ES5
ar1.concat(ar2);
//ES6
[...ar1, ...ar2]

//字符串
[...'hello'];
//["h", "e", "l", "l", "o"] 

//实现了Iterator(遍历器)接口的对象
let nodeList = document.querySelectorAll('div');
let array = [...nodeList]; //使类数组的对象nodeList变成了真正的数组
//NodeList对象实现了Iterator

//Array.from()可以将类数组对象（array-like-object和可遍历对象（iterable)转化为真正的数组
Array.from();
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};
//ES5写法
var arrr1 = [].slice.call(arrayLike);//['a','b','c']
//ES6
let arrr2 = Array.from(arrayLike);

Array.from(arrayLike, x => x * x);
// ==
Array.from(arrayLike).map(x => x * x);
Array.from([1, 2, 3], (x) => x * x);
// [1, 4, 9]

//Array.of()用于将一组值转化为数组
Array.of(3, 1, 2); //[3, 1, 2]

//数组实例的copyWithin()
Array.prototype.copyWithin(target, start = 0, end = this.length);//start,end均为默认值
//target表示从该位置开始替换数据，负数表示倒数，start表示从该位置开始读取数据
//end表示在该位置前停止读取数据，只有target必需
[1, 2, 3, 4, 5].copyWithin(0, 3);//[4, 5, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, 3 ,4);//[4, 2, 3, 4, 5]

//数组实例的find()和findIndex()
//find()的参数是一个回调函数,返回第一个返回值为true的成员
[1, 2, -4, 10].find((n) => n < 0);//-4
[1, 2, -4, 10].findIndex((n) => n < 0); //2   找不到返回-1
//两个方法都接受第二个函数，用来绑定回调函数的this对象,都可以发现NaN
function f(v){
    return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 22, 11].find(f, person); //22

//数组实例的fill()
['a', 'b', 'c'].fill(7, 1, 2);
//['a', 7, 'c']   从1开始，在2前，用7填充

//数组实例的entries(), keys(), values()
for(let index of ['a', 'b'].keys()){
    console.log(index);
}
//0
//1
for(let elem of ['a', 'b'].values()){
    console.log(elem);
}
//'a'
//'b'
for(let [index, elem] of ['a', 'b'].entries()){
    console.log(index, elem);
}
// 0 'a'
// 1 'b'

//数组实例的includes()
[1, 2, 3].includes(2); //true
//includes第二个参数表示搜索的起始位置，负数表示倒数,如果length为3，而参数为-4，则重置为0
[1, 2, 3].includes(3, 3);//false 

//数组实例的flat(),flatMap()
[1, 2, 3, [1, 2]].flat(); //[1, 2, 3, 1, 2]
[1, [2, [3, 4]]].flat(2); //[1, 2, 3, 4]
//flat(infinity)用于“拉平”多层为一层
//数组有空位，flat()会跳过
[2, 3, 4].flatMap((x) => [x, x * 2]);
//[2, 4, 3, 6, 4, 8]
//flatMap只能展开一层数组

//数组的空位,空位不是undefined
Array(3);//[, , ,]
0 in [undefined,undefined]; //true
0 in [, ,]; //false
//ES6将空位转为undefined