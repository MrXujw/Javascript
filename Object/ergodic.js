//给任何想遍历的对象定义@@iterator，这时一个迭代器对象的方法
var myObject = {
    a: 2,
    b: 3,
};
Object.defineProperty(myObject, Symbol.iterator, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function() {
        let o = this;
        let index = 0;
        let ks = Object.keys(o);
        return {
            next: function(){
                return {
                    value: o[ks[index++]],
                    done: (index > ks.length)
                };
            }
        };
    }
});

//手动遍历myObject
var it = myObject[Symbol.iterator]();
it.next(); //{value: 2, done: false}
it.next(); //{value: 3, done: false}
it.next(); //{value: undefined, done: true}
//for...of遍历myObject
for(let v of myObject){
    console.log(v);
}
// 2
// 3