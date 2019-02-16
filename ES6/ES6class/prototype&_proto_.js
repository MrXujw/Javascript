/**
 * (1)子类的__proto__属性，表示构造函数的继承，总是指向父类
 * (2)子类prototype属性的__proto__属性，表示方法的继承
 * 总是指向父类的prototype属性
*/
class A{
}
class B extends A{
}
B.__proto__ === A //true
B.prototype.__proto__ === A.prototype //true

var a1 = new A();
var b1 = new B();
b1.__proto__ === a1.__proto__ //false
b1.__proto__.__proto__ === a1.__proto__ //true

b1.__proto__.__proto__.printName = function(){
    console.log('Hi');
}
a1.printName(); //"Hi"