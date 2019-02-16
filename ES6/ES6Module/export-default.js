export default function (){
    console.log('foo');
}
//export default用在非匿名函数中，函数名在模块外部无效
//export default后不能跟变量声明语句
//export default本质是输出一个叫default的变量，所以可以赋值
//如export default 42
//export default也可以用来输出类
