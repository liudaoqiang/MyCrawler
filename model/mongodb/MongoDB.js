/**
 * Created by bozhang on 2017/6/1.
 */
"use strict";
const env = process.env.NODE_ENV;
const mongoose = require('mongoose');
const mongoConf = require('../../config')(env).mongo;

let connection;

function connectDb() {
    console.log(" ------------------ start connect mongoDB ------------------ ");
    console.log("mongoDB Options: ", mongoConf.options);
    console.log(" ------------------ start connect mongoDB ------------------ ");
    const con = mongoose.createConnection(mongoConf.conn, mongoConf.options);
    con.on('error', console.error.bind(console, 'mongoose connection error:'));
    return con;
}

function MongoDB() {
    if (!connection) {
        connection = connectDb()
    }
}

MongoDB.prototype.getModel = function (schemaObj) {
    const modelSchema = mongoose.Schema(schemaObj.data);
    const indexes = schemaObj.index;
    if (indexes && indexes.length > 0) {
        indexes.forEach((index) => {
            modelSchema.index(index);
        });
    }
    return connection.model(schemaObj.name, modelSchema);
};

module.exports = MongoDB;



