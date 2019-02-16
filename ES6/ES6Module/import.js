//import.js
import {firstName, lastName, year} from './export.js';
function setName(element){
    element.textContent = firstName + ' ' + lastName;
}
//不允许在加载模块的脚本里，改写接口
//如果加载的变量是对象，则可以改写对象的属性
//import有提升效果
//import也可以通过as对变量进行重命名
