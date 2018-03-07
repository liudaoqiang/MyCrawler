/**
 * Created by bozhang on 2017/6/14.
 */
"use strict";
// const util = require("../util");
// console.log(util.decodeUTF8(undefined));

//
// let promise1 = new Promise(function(resolve, reject) {
//     console.log('Promise1');
//     // reject(" Promise1 trigle error")
//     resolve();
// });
// let promise2 = new Promise(function(resolve, reject) {
//     console.log('Promise2');
//     setTimeout(() => {
//         reject(" Promise2 trigle error")
//         // resolve();
//     }, 3000);
// });
//
// promise1.then(function() {
//     console.log('promise1 Resolved.');
//     return promise2;
// }).then(() => {
//     console.log("Then in 2nd step")
// }).catch((error) => {
//     console.log("error:" + error);
// }).finally(() => {
//     console.log("finally!!");
// });
//
// console.log('Hi!');

var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
    var length = a.length;
    for (var i = 0; i < length; i++) {
        var item = a[i];
        if (typeof item !== 'number') {
            yield* flat(item);
        } else {
            yield item;
        }
    }
};

for (var f of flat(arr)) {
    console.log(f);
}
// 1, 2, 3, 4, 5, 6