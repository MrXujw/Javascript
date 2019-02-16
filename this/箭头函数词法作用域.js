function foo(){
    //返回一个箭头函数
    return (a) => {
        //this继承自foo()，且this的绑定不能修改
        console.log( this.a );
    };
}
var obj1 = {
    a: 2,
};
var obj2 = {
    a: 3,
};
var bar = foo.call( obj1 );  //foo()的this绑定在obj1
bar.call( obj2 ); // 2

