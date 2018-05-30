/**
 * Created by bozhang on 2017/6/1.
 */
"use strict";
const MongoDB = require('./MongoDB');
const schema = require('./schema/InternetNewsData');
let model = null;

function InternetNewsData() {
    const mongodb = new MongoDB;
    if (!model) {
        model = mongodb.getModel(schema);
    }
}

InternetNewsData.prototype.save = function (data, done) {
    const m = model(data);
    m.save().then(result => {

    }).catch(error => {
        console.log(error.toJSON());
    });
};

module.exports = InternetNewsData;