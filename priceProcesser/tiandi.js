/**
 * Created by bozhang on 2017/5/4.
 */
"use strict";
const moment = require('moment');
const util = require('../util');

const InternetPricesData = require('../model/mongodb/InternetPricesData');

function Tiandi(medicineName) {
    this.medicineName = medicineName;
}

Tiandi.prototype.getProcesser = function (callback) {
    const medicineName = this.medicineName;

    return [{
        uri: encodeURI('http://www.zyctd.com/jiage/1-0-0.html?keyword=' + medicineName),
        jquery: true,

        // The global callback won't be called$(".priceTableRows").find('li').length()
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                try {
                    let $ = res.$;
                    const size = $(".priceTableRows li").length;
                    let datas = new Array();
                    for (let i = 1; i <= size; i++) {
                        let doc = {site_name: "zyctd.com"};
                        doc.market_name = util.decodeUTF8($(".priceTableRows li:nth-child("+i+") .w9").html());
                        doc.medicine_name = util.decodeUTF8($(".priceTableRows li:nth-child("+i+") .w1 a").html());
                        doc.medicine_price = $(".priceTableRows li:nth-child("+i+") .w3").html() * 100;
                        let typeAndArea = util.decodeUTF8($(".priceTableRows li:nth-child("+i+") .w2 a").html()).split(' ');
                        doc.produce_area = typeAndArea[1];
                        doc.medicine_type = typeAndArea[0];
                        doc.price_trend = util.decodeUTF8($(".priceTableRows li:nth-child("+i+") .w4").html());
                        doc.time = moment.now();
                        doc.public_date = moment().format('YYYY-MM-DD');

                        // console.log(JSON.stringify(doc));
                        datas[i] = doc;
                    }
                    callback(datas)
                } catch (e) {
                    console.error("Tiandi 价格数据解析异常：", e);
                }
            }
            done();
        }
    }];
};

Tiandi.prototype.saveDataToMongo = function (datas) {
    try {
        const internetPricesData = new InternetPricesData();
        datas.forEach($priceData => {
            if (!!$priceData) {
                internetPricesData.save($priceData)
            }
        });
    } catch (e) {
        console.error("Tiandi 价格数据保存异常：", e);
    }
};

module.exports = Tiandi;