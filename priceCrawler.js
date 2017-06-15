/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const Crawler = require("crawler");
const schedule = require("node-schedule");

const redis = require("./model/redis/RedisDB");
const RedisKeys = require("./model/redis/RedisKeys");

let DongfangProcesser = require('./priceProcesser/dongfang');
// let KangmeiProcesser = require('./priceProcesser/kangmei');
let YaotongProcesser = require('./priceProcesser/yaotong');
let TiandiProcesser = require('./priceProcesser/tiandi');


var c = new Crawler({
    maxConnections : 10,
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

schedule.scheduleJob('33 10 * * *', function() {
    redis.getAsync(RedisKeys.InternetPriceMedicineName).then(result => {
        if (!!result) {
            const datas = JSON.parse(result);
            datas.forEach(data => {
                const yaotongProcesser = new YaotongProcesser(data);
                const yt1998Processer = yaotongProcesser.getProcesser(yaotongProcesser.saveDataToMongo);
                c.queue(yt1998Processer);

                const tiandiProcesser = new TiandiProcesser(data);
                const zyctdProcesser = tiandiProcesser.getProcesser(tiandiProcesser.saveDataToMongo);
                c.queue(zyctdProcesser);

                const dongfangProcesser = new DongfangProcesser(data);
                const zyczycProcesser = dongfangProcesser.getProcesser(dongfangProcesser.saveDataToMongo);
                c.queue(zyczycProcesser);
            });
        }
    });

});