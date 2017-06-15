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

    return [{
        // uri: 'http://www.yt1998.com/price/nowDayPriceQ!getPriceList.do?random=0.2658756687406575&ycnam=&market=1&leibie=&istoday=2&spices=&paramName=&paramValue=&pageIndex=0&pageSize=20',
        // uri: 'http://www.yt1998.com/price/nowDayPriceQ!getPriceList.do?random=0.18860058973247018&ycnam='+medicineName+'&market=&leibie=&istoday=&spices=&paramName=&paramValue=&pageIndex=0&pageSize=20',
        uri: encodeURI('http://www.yt1998.com/price/nowDayPriceQ!getPriceList.do?random=0.18860058973247018&ycnam=' + medicineName + '&market=&leibie=&istoday=&spices=&paramName=&paramValue=&pageIndex=0&pageSize=20'),
        jquery: false,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                console.log(res.body);
                callback(res.body);
            }
            done();
        }
    }];
};

YaoTong.prototype.saveDataToMongo = function (rawData) {
    const pricesData = JSON.parse(rawData);
    if (pricesData.state === "ok") {
        const internetPricesData = new InternetPricesData();
        pricesData.data.forEach($priceData => {
            if (!!$priceData) {
                let doc = {
                    site_name: "yt1998.com",
                    market_name: $priceData.shichang,
                    medicine_name: $priceData.ycnam,
                    medicine_price: $priceData.pri * 100,
                    produce_area: $priceData.chandi,
                    medicine_type: $priceData.guige,
                    price_trend: $priceData.zoushi,
                    time: moment.now()
                };
                internetPricesData.save(doc)
            }
        });
    }
};

module.exports = YaoTong;