class Widget{
    foo(baz){
        bar.call(this, baz);
    }
    //..
}
function bar(baz){
    return this.snaf = baz;
}
//上面，foo是公开方法，但其内部调用了bar.call(this, baz)
//这使得bar实际上称为了当前模块的私有方法

//或者利用Symbol值的唯一性
const bar = Symbol('bar');
const snaf = Symbol('snaf');
export default class myClass{
    //公有方法
    foo(baz){
        this[bar](baz);
    }

    //私有方法
    [bar](baz){
        return this[snaf] = baz;
    }
    //...
};
//但是Reflect.ownKeys()依然可以拿到他们

