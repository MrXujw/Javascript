export * from './circle'; //import和export的复合写法
export var e = 2.71828182846;
export default function(x) {
    return Math.exp(x);
}
//export *会忽略circle模块的default方法