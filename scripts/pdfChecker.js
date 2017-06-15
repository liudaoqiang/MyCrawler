/**
 * Created by bozhang on 2017/5/24.
 */
"use strict";

let docs = require("./data3");
let fs = require("fs");
let async = require("async");
const request = require("request");
let fileArray = [];
const dir = "./3rd/";
const urlPre = 'http://www.drugfuture.com/Pharmacopoeia/CP2015-3/';

let prePage = 3;
let i = 0;
docs.forEach((doc) => {
    let page = doc.doc_book_page_number;
    let fileName = prePage + '-' + page + '.pdf';
    let filePath = dir + fileName;
    // console.log(filePath);
    if (!fs.existsSync(filePath)) {
        fileArray[i] = urlPre + fileName;
        console.log(i, fileArray[i]);
        i++;
    };
    prePage = page;
});


async.eachLimit(fileArray, 2, (url, cb) => {
    let elements = url.split('/');
    let filePath = dir + elements[elements.length -1];
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