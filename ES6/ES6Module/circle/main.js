/**逐一加载
 * import {area, circumference} from './circle';
 * console.log('圆面积：' + area(4));
 * console.log('圆周长：' + circumference(14));
 */
import * as circle from './circle';
console.log('圆面积：' + circle.area(4));
console.log('圆周长：' + circle.circumference(14));

//下面两种写法都不允许
//circle.foo = 'hello';
//circle.area = function (){};