function foo(){
    console.log(this.a);
}
var obj = {
    a: 2,
}
var bar = function(){
    foo.call(obj);
};
bar();
setTimeout(bar, 100); //2
//硬绑定的bar不可能再修改它的this
bar.call(window); //2
//创建了函数bar(),并在它的内部手动调用foo.call(obj),强制把foo的this
//绑定到了obj，之后无论怎么样调用bar，它都会手动在obj上调用foo


//new绑定
function fo(a){
    this.a = a;
}
var ba = new fo(2);
console.log(ba.a); //2