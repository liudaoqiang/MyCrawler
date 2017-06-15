/**
 * Created by bozhang on 2017/6/1.
 */
"use strict";
const MongoDB = require('./MongoDBSingleton');
const schema = require('./schema/InternetPricesData');

function InternetPricesData() {
    const mongodb = new MongoDB();
    this.model = mongodb.getModel(schema);
}

InternetPricesData.prototype.save = function (data) {
    const m = new this.model(data);
    m.save();
};

module.exports = InternetPricesData;