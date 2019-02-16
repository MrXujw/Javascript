class Myclass{
    constructor(){
        //...
    }
    get prop(){
        return 'getter';
    }
    set prop(value){
        console.log('setter: ' + value);
    }
}

let inst = new Myclass();
inst.prop = 123;
//setter: 123
inst.prop;
//"getter"

var descriptor = Object.getOwnPropertyDescriptor(
    Myclass.prototype, "prop"
);

"get" in descriptor; //true
"set" in descriptor; //true