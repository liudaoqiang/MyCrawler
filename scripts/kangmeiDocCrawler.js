/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const Crawler = require("crawler");
const kangmeiDoc = require('../docProcesser/kangmeiDoc');
const MongoDB = require('../model/mongodb/MongoDB');
const herbsWiki = require('../model/mongodb/schema/HerbsWiki');
const mongoDB = new MongoDB();
const wikiModel = mongoDB.getModel(herbsWiki);

var c = new Crawler({
    maxConnections : 4,
    rateLimit: 800,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

// Queue URLs with custom callbacks & parameters
for (let id = 1; id <=849; id ++) {
    let yaodianProcesser = new kangmeiDoc(id, _postMediDocToSave);
    c.queue(yaodianProcesser.getProcesser());
}

// let yaodianProcesser = new kangmeiDoc('0044', _postMediDocToSave);
// c.queue(yaodianProcesser.getProcesser());

function _postMediDocToSave(data) {
    const instance = wikiModel(data);
    instance.save().then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
}

