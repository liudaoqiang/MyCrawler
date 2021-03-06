/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const Crawler = require("crawler");
const schedule = require("node-schedule");

const redis = require("./model/redis/RedisDB");

const TiandiProcesser = require('./newsProcesser/tiandi');
const KangmeiProcesser = require('./newsProcesser/kangmei');
const YaotongProcesser = require('./newsProcesser/yaotong');


const c = new Crawler({
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
    const tiandiProcesser = new TiandiProcesser(redis);
    for (let page = 1; page < 4; page++) {
        const listProcessor = tiandiProcesser.getNewsListProcessor('http://www.zyctd.com/zixun-' + page + '.html', (newsLinks => {
            newsLinks.forEach(link => {
                const zyctdProcesser = tiandiProcesser.getNewsProcessor(link);
                c.queue(zyctdProcesser);
            });
        }));
        c.queue(listProcessor);
    }

    // 康美网资讯
    const kangmeiProcesser = new KangmeiProcesser(redis);
    const kmMarketProcessor = kangmeiProcesser.getNewsListProcessor(10100, 0, 20, (newsLinks => {
        newsLinks.forEach(link => {
            console.log(link);
            const kmzycProcesser = kangmeiProcesser.getNewsProcessor(link, 10100);
            c.queue(kmzycProcesser);
        });
    }));
    c.queue(kmMarketProcessor);
    const kmOriginPlaceProcessor = kangmeiProcesser.getNewsListProcessor(10200, 0, 20, (newsLinks => {
        newsLinks.forEach(link => {
            const kmzycProcesser = kangmeiProcesser.getNewsProcessor(link, 10200);
            c.queue(kmzycProcesser);
        });
    }));
    c.queue(kmOriginPlaceProcessor);

    // 药通网资讯
    const yaotongProcesser = new YaotongProcesser(redis);
    [3, 9].forEach(id => {
        const ytListProcesser = yaotongProcesser.getNewsListProcessor(id, 0, 20, (newsData => {
            const yt1998Processer = yaotongProcesser.getNewsProcessor(newsData);
            c.queue(yt1998Processer);
        }));
        c.queue(ytListProcesser);
    });
}

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'local';
if (env === 'local') {
    crawleInternetnews();
} else {
    schedule.scheduleJob('*/17 8-18 * * *', function () {
        crawleInternetnews();
    });
}
