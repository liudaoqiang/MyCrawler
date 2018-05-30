/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const Crawler = require("crawler");
const schedule = require("node-schedule");

const redis = require("./model/redis/RedisDB");
const RedisKeys = require("./model/redis/RedisKeys");

let TiandiProcesser = require('./newsProcesser/tiandi');
let KangmeiProcesser = require('./newsProcesser/kangmei');


var c = new Crawler({
    maxConnections: 10,
    rateLimit: 600,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

function crawleInternetnews() {
    // 天地网资讯
    for (let page = 1; page < 10; page++) {
        const tiandiProcesser = new TiandiProcesser();
        const listProcessor = tiandiProcesser.getNewsListProcessor('http://www.zyctd.com/zixun-' + page + '.html', (newsLinks => {
            newsLinks.forEach(link => {
                const zyctdProcesser = tiandiProcesser.getNewsProcessor(link, tiandiProcesser.saveDataToMongo);
                c.queue(zyctdProcesser);
            });
        }));
        c.queue(listProcessor);
    }

    // 康美网资讯
    const kangmeiProcesser = new KangmeiProcesser();
    const kmMarketProcessor = kangmeiProcesser.getNewsListProcessor(10100, 1, 20, (newsLinks => {
        newsLinks.forEach(link => {
            console.log(link);
            const kmzycProcesser = kangmeiProcesser.getNewsProcessor(link, 10100, kangmeiProcesser.saveDataToMongo);
            c.queue(kmzycProcesser);
        });
    }));
    c.queue(kmMarketProcessor);
    const kmOriginPlaceProcessor = kangmeiProcesser.getNewsListProcessor(10200, 1, 20, (newsLinks => {
        newsLinks.forEach(link => {
            const kmzycProcesser = kangmeiProcesser.getNewsProcessor(link, 10200, kangmeiProcesser.saveDataToMongo);
            c.queue(kmzycProcesser);
        });
    }));
    c.queue(kmOriginPlaceProcessor);
}

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'local';
if (env === 'local') {
    crawleInternetnews();
} else {
    schedule.scheduleJob('33 10 * * *', function () {
        crawleInternetnews();
    });
}
