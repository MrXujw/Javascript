function foo(str, a){
    eval(str); //欺骗
    console.log(a, b);
}
var b = 2;
foo("var b = 3;", 1); //1, 3

var obj = {
    a: 1,
    b: 2,
    c: 3
};
//单调复杂的重复
obj.a = 2;
obj.b = 3;
obj.c = 4;
//简单快捷的方法
with(obj){
    a = 2;
    b = 3;
    c = 4;
}


function bar(obj){
    with(obj){
        a = 2;
    }
}

var o1 = {
    a: 3
};

var o2 = {
    b: 3
};
bar(o1);
console.log(o1.a); //2

bar(o2);
console.log(o2.a); //undefined
console.log(a); //2 a泄露到全局作用域中了