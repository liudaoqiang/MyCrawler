/**
 * Created by bozhang on 2017/6/1.
 */
"use strict";
const env = process.env.NODE_ENV;
const mongoose = require('mongoose');
const mongoConf = require('../../config')(env).mongo;

function MongoDBSingleton() {
    // 缓存实例
    let instance;
    // 重新构造函数
    MongoDBSingleton = function () {
        // 处理个性化操作
        return instance;
    };
    // 后期处理原型属性
    MongoDBSingleton.prototype = this;
    // 实例
    instance = new MongoDBSingleton();
    // 重设构造函数指针
    instance.constructor = MongoDBSingleton;
    // 处理单例中同一化操作
    this.connection = mongoose.createConnection(mongoConf.conn, mongoConf.options);

    return instance;
}

MongoDBSingleton.prototype.getModel = function(schemaObj) {
    const modelSchema = mongoose.Schema(schemaObj.data);
    const indexes = schemaObj.index;
    if (indexes && indexes.length > 0) {
        indexes.forEach((index) => {
            modelSchema.index(index);
        });
    }
    let model = this.connection.model(schemaObj.name, modelSchema);
    return model;
};
module.exports = MongoDBSingleton;



