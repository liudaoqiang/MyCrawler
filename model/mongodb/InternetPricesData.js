/**
 * Created by bozhang on 2017/6/1.
 */
"use strict";
const MongoDB = require('./MongoDB');
const schema = require('./schema/InternetPricesData');
let model = null;

function InternetPricesData() {
    const mongodb = new MongoDB;
    if (!model) {
        model = mongodb.getModel(schema);
    }
}

InternetPricesData.prototype.save = function (data) {
    const m = model(data);
    m.save();
};

module.exports = InternetPricesData;