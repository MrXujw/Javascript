//export.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;

/**或者这样写
 * var firstName = 'Michael';
 * var lastName = 'Jackson';
 * var year = 1958;
 * export {firstName, lastName, year};
 * 优先采用
 */

export function multiply(x, y){
    return x * y;
}

//一般来说export输出的变量就是本来的名字，但是可以使用as关键字重命名
function v1(){
    //...
}
function v2(){
    //...
}
export {
    v1 as streamV1,
    v2 as StreamV2,
    v2 as StreamLatestVersion
}