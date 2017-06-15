/**
 * Created by bozhang on 2017/5/19.
 */
"use strict";

const request = require('request');
const fs = require('fs');
const async = require('async');
// let urls = new Array();
// for(let i = 1; i<= 5349; i++) {
//     urls[i-1] =
// }
// async.forEach()
let urlPre = 'http://www.drugfuture.com/Pharmacopoeia/CP2015-1';

const START = 3;
const END = 1750;
let urlArray = new Array();
for (let i = 0, j = START, k=0; j <= END; i++, j++) {
    urlArray[k] = urlPre + '/' + i + '-' + i +'.pdf';
    console.log(k, urlArray[k]);
    k++;
    urlArray[k] = urlPre + '/' + i + '-' + (i+1) +'.pdf';
    console.log(k, urlArray[k]);
    k++;
}

async.eachLimit(urlArray, 2, (url, cb) => {
    let elements = url.split('/');
    let filePath = './1st/' + elements[elements.length -1];
    if(!fs.existsSync(filePath)) {
        console.log(filePath + ' is not exists!');
        _saveFiles(url, filePath, cb)
    } else {
        cb();
    }
});

function _saveFiles(url, filePath,callback) {
    let ws = fs.createWriteStream(filePath);
    request(url).on('error', function (err) {
        console.log(err);
        request(url).pipe(ws);
    }).pipe(ws).on('close', function () {
        let fStat = fs.statSync(filePath);
        if (fStat.size < 1024) {
            fs.unlink(filePath);
        }
        callback();
    });
}