//静态方法不会被实例继承、
class Foo{
    static classMethod(){
        return 'hello';
    }
    static bar(){
        this.baz();
    }
    static baz(){
        console.log('Hello');
    }
    baz(){
        console.log('World');
    }
}

Foo.classMethod(); //'hello'
var foo = new Foo();
foo.classMethod(); 
//TypeError: foo.classMethod is not a function

//在静态方法中的this，指向的是类，不是实例
Foo.bar(); //"Hello"

//父类的静态方法，可以被子类继承
class Bar extends Foo{
}
Bar.classMethod() //'hello'

//静态方法也是可以从super对象上调用
class Baz extends Foo{
    static classMethod(){
        return super.classMethod() + ', too';
    }
}
Baz.classMethod() //"hello, too"

//实例属性除了定义在constructor方法里，
//还可以定义在类的最顶层
