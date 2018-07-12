/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const Crawler = require("crawler");
const schedule = require("node-schedule");

const redis = require("./model/redis/RedisDB");
const RedisKeys = require("./model/redis/RedisKeys");

let DongfangProcesser = require('./priceProcesser/dongfang');
let KangmeiProcesser = require('./priceProcesser/kangmei');
let YaotongProcesser = require('./priceProcesser/yaotong');
let TiandiProcesser = require('./priceProcesser/tiandi');


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

function crawleInternetPrices() {
    redis.getAsync(RedisKeys.ALL_HERB_NAMES_FOR_INTERNET_PRICE).then(result => {
        console.log(" crawled the medicines : ", result);
        if (!!result) {
            try {
                const datas = JSON.parse(result);
                datas.forEach(data => {
                    const yaotongProcesser = new YaotongProcesser(data.herbName);
                    const yt1998Processer = yaotongProcesser.getProcesser(yaotongProcesser.saveDataToMongo);
                    c.queue(yt1998Processer);

                    const tiandiProcesser = new TiandiProcesser(data.herbName);
                    const zyctdProcesser = tiandiProcesser.getProcesser(tiandiProcesser.saveDataToMongo);
                    c.queue(zyctdProcesser);

                    const dongfangProcesser = new DongfangProcesser(data.herbName);
                    const zyczycProcesser = dongfangProcesser.getProcesser(dongfangProcesser.saveDataToMongo);
                    c.queue(zyczycProcesser);

                    ["亳州", "安国", "成都荷花池","玉林","廉桥","普宁"].forEach(market => {
                        const kangmeiProcesser = new KangmeiProcesser(data.herbName, market);
                        const kmzywProcesser = kangmeiProcesser.getProcesser(kangmeiProcesser.saveDataToMongo);
                        c.queue(kmzywProcesser);
                    });
                });
            } catch (e) {
                console.log("Price Crawler Exception : ", e)
            }
        }
    }).catch(err => {
        console.log("Get medicine names error : ", err);
    });
}
const env = process.env.NODE_ENV;
if (env === 'local') {
    crawleInternetPrices();
} else {
    schedule.scheduleJob('33 10 * * *', function() {
        crawleInternetPrices();
    });
}
