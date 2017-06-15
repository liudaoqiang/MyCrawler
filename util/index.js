/**
 * Created by bozhang on 2017/5/4.
 */
"use strict";
const fs = require('fs');
const async = require('async');

exports.decodeUTF8 = function (str) {
    if (!!str && typeof str === "string") {
        return unescape(str.replace(/&#x/g, '%u').replace(/;/g, ''));
    } else {
        return str;
    }
};

exports.loadModules = function (path) {
    async.waterfall([
        function (cb) {
            fs.readdir(path, cb)
        },
        function (files, cb) {
            let modles = new Array();
            for (let i = 0; i < files.length; i++) {
                console.log(path + '/' + files[i].split('.')[0]);
                modles[0] = require(path + '/' + files[i].split('.')[0]);
            }
            cb(null, modles);
        }
    ], function (err, results) {
        if (err) {
            console.log(JSON.stringify(err))
            throw err;
        }
        return results;
    });
};