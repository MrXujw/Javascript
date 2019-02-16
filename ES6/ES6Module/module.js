//ES6之前，有CommonJS和AMD模块
//CommonJS模块,在运行中加载
let { stat, exists, readFile } = require('fs');
//等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readFile = _fs.readFile;

//ES6模块，编译时加载（静态加载）
//ES6模块不是对象
import { stat, exists, readFile } from 'fs';

//模块中，顶层的this关键字返回undefined，而不是指向window