/**
 * Created by bozhang on 2017/5/4.
 */
"use strict";
const moment = require('moment');

const InternetPricesData = require('../model/mongodb/InternetPricesData');

function YaoTong(medicineName) {
    this.medicineName = medicineName;
}

YaoTong.prototype.getProcesser = function (callback) {
    const medicineName = this.medicineName;
    const url = 'http://www.yt1998.com/price/nowDayPriceQ!getPriceList.do?ycnam=' + medicineName + '&market=&leibie=&istoday=&spices=&paramName=&paramValue=&pageIndex=0&pageSize=20';

    console.log('url = '+ url);
    return [{
        // uri: 'http://www.yt1998.com/price/nowDayPriceQ!getPriceList.do?random=0.2658756687406575&ycnam=&market=1&leibie=&istoday=2&spices=&paramName=&paramValue=&pageIndex=0&pageSize=20',
        // uri: 'http://www.yt1998.com/price/nowDayPriceQ!getPriceList.do?random=0.18860058973247018&ycnam='+medicineName+'&market=&leibie=&istoday=&spices=&paramName=&paramValue=&pageIndex=0&pageSize=20',
        uri: encodeURI(url),
        timeout: 10000,
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
            "Accept": "*/*",
            "accept-encoding": "gzip, deflate"
        },
        jquery: false,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                callback(res.body);
            }
            done();
        }
    }];
};

YaoTong.prototype.saveDataToMongo = function (rawData) {
    try {
        const pricesData = JSON.parse(rawData);
        if (pricesData.state === "ok") {
            const internetPricesData = new InternetPricesData();
            pricesData.data.forEach($priceData => {
                if (!!$priceData) {
                    let doc = {
                        site_name: "yt1998.com",
                        market_name: $priceData.shichang === "荷花池" ? "成都" : $priceData.shichang,
                        medicine_name: $priceData.ycnam,
                        medicine_price: $priceData.pri * 100,
                        produce_area: $priceData.chandi,
                        medicine_type: $priceData.guige,
                        price_trend: $priceData.zoushi,
                        time: moment.now(),
                        public_date: moment().format('YYYY-MM-DD')
                    };
                    internetPricesData.save(doc)
                }
            });
        }
    } catch (e) {
        console.error("药通网抓取" + this.medicineName + "出错：", e);
    }
};

module.exports = YaoTong;