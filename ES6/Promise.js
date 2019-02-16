function add(getX, getY, cb){
    var x, y;
    getX( function(xVal){
        x = xVal;
        //两个都准备好了?
        if(y != undefined){
            cb = x + y; //发送和
        }
    });
    getY( function(yVal){
        y = yVal;
        //xxx
        if(x != undefined){
            cb( x + y);
        }
    });
}
//fetchX(),fetchY()是同步或者异步函数
add( fetchX, fetchY, function(sum){
    console.log( sum );
});
//将x和y当作未来值，并且表达了一个运算add(..)，它把现在和将来归一化了，我们可以确保这个add(..)运算的输出是可预测的
//通过Promise函数表达这个x+y的例子
function add(xPromise, yPromise){
    //Promise.al([..])接受一个promise数组并返回一个新的promise
    //这个新的promise等待数组的所有promise完成
    return Promise.all( [xPromise,yPromise] )
    //这个promise决议之后，我们取得收到的X和Y值并加在一起
    .then( function(values){
        //values是来自与之前决议的promise的消息数组
        return values[0] + values[1];
    });
}
//fetchX()和fetchY()返回相应的值得promise，可能已经就绪，也可能以后就绪
add(fetchX(), fetchY())
//我们得到一个这两个数组的和的promise
//现在链式调用then(..)来等待返回promise的决议
.then( function(sum){
    console.log( sum ); //更简单
})

//反控制反转
function foo(x){
    //spend time to do something
    //build a listener to send massage to deal object to return
    return listener;
}
var evt = foo(42);//evt here is Promise
evt.on( "completion",function(){
    //to run the next step
});
evt.on( "failure",function(err){
    //oh, there is error in foo(..)
});

function foo(x){
    return new Promise( function(resolve, reject){
        //最终调用resolve(..)或者reject(..)
        //这是这个promise的决议回调
    });
}
var p = foo( 42 );
bar(p);
baz(p);
//你可能会猜测bar(..)或者baz(..)的内部实现如下①Promise决议作为未来值查看是会涉及发送消息
function bar(fooPromise){
    //侦听foo(..)完成
    fooPromise.then(
        function(){
            //foo(..)已经完毕
        },
        function(){
            //error
        }
    );
}//baz也一样
//不论foo(..)成功与否，bar(..)都会被调用。并且如果收到了foo(..)失败的通知，它会亲自处理自己的回退逻辑

//②Promise决议也可以只作为一种流程控制信号
//另一种是实现方式：
function bar(){
    //foo(..)肯定已经完成，所以执行bar(..)的任务
}
function oopsBar(){
    //啊，foo(..)出错了，所以bar(..)没有运行
}
function baz(){
    //foo(..)肯定已经完成，所以执行baz(..)的任务
}
function oopsBaz(){
    //啊，foo(..)出错了，所以baz(..)没有运行
}
var p = foo( 42 );
p.then( bar, oopsBar );
p.then( baz, oopsBaz );
//bar(..)和baz(..)只有在foo(..)成功时才会被调用，否则调用oopsbar(..)或oopsbaz(..)

p.then( function(){
    p.then(function(){
        console.log( "C" );
    });
    console.log( "A" );
});
p.then( function(){
    console.log( "B" );
});
//A B C
//这里，"C"无法打断或者抢占"B",这是一百年我Promise的运作方式

//如果Promise本身永远不被决议，Promise也提供了解决方案，其使用了一种称为竞态的高级抽象机制
//用于超时一个Promise的工具
function tiomeoutPromise(delay){
    return new Promise( function(resolve,reject){
        setTimeout( function(){
            reject( "Timeout!" );
        },delay);
    });
}
//设置foo()超时
Promise.race( [
    foo(),                   //试着开始foo()
    tiomeoutPromise( 3000 )  //给她3秒钟
])
.then(
    function(){
        //foo(..)及时完成
    },
    function(err){
        //或者foo()被拒绝，或者只是没能按时完成
        //查看err来了解是哪种情况
    }
);

var p = Promise.resolve( 21 );
var p2 = p.then( function(v){
    console.log( v );//21
    //用值42填充p2
    return v * 2;
});
//连接p2
p2.then( function(v){
    console.log( v ); //42
});

//向封装的promise引入异步
var p = Promise.resolve( 21 );
p.then( function(v){
    console.log( v );  //21
    //创建一个promise并返回
    return new Promise( function(resolve, reject){
        //引入异步！
        setTimeout( function(){
            //用值42填充
            resolve( v * 2 );
        },100);
    });
})
.then( function(v){
    //在前一步中的100ms延迟之后运行
    console.log( v );  //42
});
//现在我们可以构建这样一个序列：不管我们想要多少个异步步骤，每一步都能够根据需要等待下一步（或者不等!)

function delay( time ){
    return new Promise( function(resolve,reject){
        setTimeout( resolve, time );
    });
}

delay (100)
.then( function STEP2(){
    console.log("step 2 (after 100ms)");
    return delay( 200 );
})
.then( function STEP3(){
    console.log("step 3 (after another 200ms");
})
.then( function STEP4(){
    console.log("step 4 (next Job");
    return delay( 50 );
})
.then( function STEP5(){
    console.log("step 5 (after another 50ms")
})
//调用delay(200)创建了一个将在200ms后完成的promise，然后我们从第一个then(..)完成回调总返回这个promise
//这会导致第二个then(..)的promise等待这个200ms的promise

/*
//不用定时器，而是构造ajax请求：
//假定工具ajax( {url},{callback} )存在
//Promise-aware ajax
function request(url){
    return new Promise( function(resolve,reject){
        //ajax(..)回调应该是我们这个promise的resolve(..)函数
        ajax(url,resolve);
    });
}
//我们首先定义一个工具request(..)，用来构造一个表示ajax(..)调用完成的promise
request("http://some.url.1/")
.then( function(request1){
    return request("http://some.url.2/?v=" + request1);
})
.then( function(request2){
    console.log(request2);
});

//有错误的话
//步骤1
request("http://some.ulr.1/")
/步骤2
.then( function(response1){
    foo.bar();//undefinde,出错！
    
    //永远到不了这里
    return request("http://some.url.2/?v=" + response1);
})
//步骤3:
.then(
    function fulfilled(response2){
        //永远不会到这里
    },
    //捕捉错误的拒绝处理函数
    function rejected(err){
        console.log( err );
        //来自foo.bar()的错误TypeError
        return 42;
    }
)
//步骤4：
.then( function(msg){
    console.log(msg);  //42
});
//第2步出错后，第3步的拒绝处理函数会捕捉到这个错误，拒绝处理函数的返回值（这段代码中是42）
//如果有的话，会用来完成交给下一个步骤（第4步）的promise，这样，这个链现在就回到了完成状态

var p = new Promise( function(resolve,reject){
    reject( "Oops" );
});
var p2 = p.then(
    function fulfilled(){
        //永远不会到达这里
    }
    //假定的拒绝处理函数，如果省略或者传入任何非函数值
    //function(err){
    //  throw err;    
    //}
);
//默认拒绝处理函数只是把错误重新抛出，这最终回事得p2（连接的promise）用同样的错误理由拒绝。
//从本质上说，这使得错误可以继续沿着Promise链传播下去，知道遇到显示定义的拒绝处理函数
//同样的，如果没有给then(..)传递一个适当有效的函数作为完成处理函数参数，还是会有作为代替的一个默认处理函数
var p = Promise.resolve( 42 );
p.then(
    //假定的完成处理函数，如果省略或者传入任何非函数值
    //function(v){
    //  return v;
    //}
    null,
    function rejected(err){
        //永远不会到达这里
    }
);
//默认的完成处理函数只是把接收到的任何传入之传递给下一个步骤(Promise)而已
then(null,function(err){..})这个模式--只处理拒绝（如果有的话），但又把完成值传递下去
//有一个缩写形式的API：catch(function(err){..})


//通过本身并不支持Promise的工具（如ajax，它接收的是一个回调）实现支持Promise的一部流程控制
*/
/*
使链式 流程控制可行的Promise固有特性：
1.调用 Promise 的 then(..)会自动创建一个新的 Promise 从调用返回
2.在完成或者拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的（可链接的）
 Promise 就相应地决议
3.如果完成或拒绝处理函数返回一个 Promise，它将会被展开，这样一来，不管它的决议值
是什么，都会称为当前 then(..)返回的链接 Promise 的决议值
*/

//链接的顺序表达（this-then-this-then-this..）

//术语：决议、完成以及拒绝
//决议（resolve）、完成（fulfill）和拒绝（reject）
//Promise(..)构造器的第一个参数回调会展开thenable(和Promise.resolve(..)一样)或真正的Promise
var rejectedPr = new Promise( function(resolve,reject){
    //用一个被拒绝的promise完成这个promise
    resolve( Promise.reject("Oops"));
});
rejectedPr.then(
    function fulfilled(){
        //永远不会到达这里
    },
    function rejected(err){
        console.log( err ); //"Oops"
    }
);
//由此可以清楚地知道，Promise(..)构造器的第一个回调参数的恰当成为是resolve(..)
//reject(..)不会像resolve(..)一样进行展开

//对于提供给then(..)的回调，他们的命名建议是fulfilled(..)和rejected(..):
function fulfilled(msg){
    console.log(msg);
}
function rejected(err){
    console.log( err );
}
p.then(
    fulfilled,
    rejected
);