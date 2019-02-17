var myObject = {
    a: 2,
};
Object.getOwnPropertyDescriptor( myObject, "a");
/**{
 *  value: 2,
 * writable: true,
 * enumerable: true,
 * configurable: true 
 * }
 */
var yourObject = {};
Object.defineProperty(yourObject, "a", {
    value: 2,
    writable: false,
    enumerable: true,
    configurable: true,
})
yourObject.a = 3;
yourObject.a; //2
//"use static";下，报错

