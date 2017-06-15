/**
 * Created by bozhang on 2017/5/24.
 */
"use strict";

const mongo = require("mongodb");
const request = require("request");
const fs = require("fs");
const async = require("async");

const host = "dds-2ze7bad1514e85641.mongodb.rds.aliyuncs.com";
const port = "3717";
const databaseName = "HanGreat";
const user = "root";
const pwd = "prod_Chgg2016";

const mongoDB = openDatabase(host, port, databaseName, user, pwd, (err, mongoDB) => {
    if (!err) {
        openCollection(mongoDB, "doc_medicine_info", (err, collection) => {
            findCollectionNoCondition(collection);
        });
    }
});


/**
 * 创建数据库服务器并开发名为databaseName的数据库
 * @param host ip
 * @param port 端口
 * @param databaseName
 * @return  打开失败返回-1 ，成功返回database
 */
function openDatabase(host, port, databaseName, username, pwd, callback) {
    //创建数据库所在的服务器
    var server = new mongo.Server(host, port, {auto_reconnect: true});
    var db = new mongo.Db(databaseName, server, {safe: true});
    db.open(function (err, db) {
        if (err) {
            console.log('打开数据库失败:', err);
            callback(err, null);
        }
        else {
            console.log('打开数据库成功');

            db.authenticate(username, pwd, function (err, result) {
                if (!result) {
                    console.log(err);
                    callback(err, null);
                } else {
                    console.log('成功连接到数据库');
                    callback(null, db);
                }
            });
        }

    });
}

/**
 * 连接数据集合
 * @param db 数据库
 * @param collectionName 数据集合名称
 * @return 成功返回collection，失败返回-1
 */
function openCollection(db, collectionName, callback) {
    db.collection(collectionName, {safe: true}, callback);
}

/**
 * 查询数据集合 没有条件
 * @param collection
 * @return 成功返回查询到的数据集合内容，失败返回-1
 */
function findCollectionNoCondition(collection) {
    collection.find({"doc_medicine_description": {$regex:/<img src=.*/i}},  { "doc_id": 1, "doc_medicine_description": 1, "doc_medicine_name":1, "_id":0 }).sort({"doc_id": 1}).toArray(function (errfind, cols) {
        if (!errfind) {
            let paths = new Array();
            let i = 0;
            async.eachLimit(cols, 1, (col, cb)=> {
                const old = '<img src="data/pic';
                const pre = '<img src="http://img-doc.chinahanguang.com/yaodian2015/image';
                let str = col.doc_medicine_description;

                while (str.indexOf(old) >= 0) {
                    str = str.replace(old, pre);
                }
                // console.log(collection);
                collection.update({doc_id: col.doc_id}, {$set: {doc_medicine_description: str}}, function (err, doc) {
                    cb();
                });
            });

            return JSON.stringify(cols);
        } else {
            console.log('查询数据集合失败');
            return -1;
        }
    });
}


function _saveFiles(url, filePath, callback) {
    let ws = fs.createWriteStream(filePath);
    request(url).on('error', function (err) {
        console.log(err);
        request(url).pipe(ws);
    }).pipe(ws).on('close', function () {
        console.log(url);
        callback();
    });
}