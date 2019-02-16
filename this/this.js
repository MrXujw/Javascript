function identify(){
    return this.name.toUpperCase();
}
function speak(){
    let greeting = "Hello, I'm " + identify.call(this);
    console.log(greeting);
}
var me = {
    name: "Kely",
}
var you = {
    name: "Reader",
}
identify.call( me ); //KELY
identify.call( you ); //READER
speak.call( me ); // Hello, I'm KELY
speak.call( you ); // Hello, I'm READER
//显示绑定
//在调用speak时，强制把它的this绑定到me或者you上

function foo(num){
    console.log("foo: " + num);
    //记录foo被调用的次数
    this.count++;
}
foo.count = 0;
for(let i = 0; i < 10; i++){
    if(i > 5){
        //使用call可以确保this指向函数对象foo本身
        foo.call(foo, i);
    }
}
//foo被调用了多少次
console.log(foo.count); //4

//隐式绑定
function foo1(){
    console.log(this.a);
}
var obj2 = {
    a: 42,
    foo1: foo1,
};
var obj1 = {
    a: 2,
    obj2: obj2,
};
obj1.obj2.foo1(); //42


