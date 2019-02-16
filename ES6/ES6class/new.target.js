//ES6为new命令引入了一个new.target属性
//一般用在构造函数中，返回new命令作用于的那个构造函数

function Person(name){
    if(new.target !== undefined){
        this.name = name;
    }else{
        throw new Error('必须使用new命令生成实例');
    }
}

//另一种写法
function Person1(name){
    if(new.target === Person1){
        this.name = name;
    }else{
        throw new Error('必须使用new命令生成实例');
    }
}

var person = new Person('张三'); //正确
var notPerson = Person.call(person, '多大'); //Error: 必须使用new命令生成实例

//Class内部调用new.target
class Rectangle{
    constructor(length, width){
        console.log(new.target === Rectangle);
        this.length = length;
        this.width = width;
    }
}

var obj = new Rectangle(3, 4); // 输出 true
//子类继承父类时，new.target会返回子类
class Square extends Rectangle{
    constructor(length){
        super(length, width);
    }
}
var obj1 = new Square(3); //输出 false

//可以利用这个特点，写出不能独立使用，必须继承后才能使用的类
//不能实例化的类

