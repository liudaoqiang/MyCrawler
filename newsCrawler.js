/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const Crawler = require("crawler");
const schedule = require("node-schedule");

const redis = require("./model/redis/RedisDB");
const RedisKeys = require("./model/redis/RedisKeys");

let TiandiProcesser = require('./newsProcesser/tiandi');


var c = new Crawler({
    maxConnections : 10,
    rateLimit:600,
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

function crawleInternetnews() {
    const tiandiProcesser = new TiandiProcesser();
    const listProcessor = tiandiProcesser.getNewsListProcessor('http://www.zyctd.com/zixun/', (newsLinks => {
        newsLinks.forEach(link => {
            const zyctdProcesser = tiandiProcesser.getNewsProcessor(link, tiandiProcesser.saveDataToMongo);
            c.queue(zyctdProcesser);
        });
    }));
    c.queue(listProcessor);
}
const env = process.env.NODE_ENV ?  process.env.NODE_ENV : 'local';
if (env === 'local') {
    crawleInternetnews();
} else {
    schedule.scheduleJob('33 10 * * *', function() {
        crawleInternetnews();
    });
}
