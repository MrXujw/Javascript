const person = {
    isHuman: false,
    printIntroduction: function(){
        console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
    }
};
const me = Object.create(person);
me.name = "Mike"; //在me对象上新建属性，person属性不变
me.isHuman = true; //新对象可以修改继承来属性值

me.printIntroduction();
//"My name is Mike. Am I hunman? true"