/**
 * Created by bozhang on 2017/5/4.
 */
"use strict";
const moment = require('moment');
const util = require('../util');

const InternetPricesData = require('../model/mongodb/InternetPricesData');

function Dongfang(medicineName) {
    this.medicineName = medicineName;
}

Dongfang.prototype.getProcesser = function (callback) {
    const medicineName = this.medicineName;

    return [{
        uri: encodeURI('http://www.zyczyc.com/info/JiaGe.aspx?key='+medicineName),
        jquery: true,

        // The global callback won't be called$(".priceTableRows").find('li').length()
        callback: function (error, res, done) {
            // if(error){
            //     console.log(error);
            // }else{
            //     let $ = res.$;
            //     for
            //     console.log(util.decodeUTF8($("#ContentPlaceHolder1_GridView1 tr:nth-child(2)  td:nth-child(1) a").html()));
            // }
            if (error) {
                console.log(error);
            } else {
                let $ = res.$;
                const size = $("#ContentPlaceHolder1_GridView1 tr").length;
                console.log(size);
                let datas = new Array();
                for (let i = 2; i <= size; i++) {
                    if(!!$("#ContentPlaceHolder1_GridView1 tr:nth-child("+i+")").html()) {
                        const medicine_name = util.decodeUTF8($("#ContentPlaceHolder1_GridView1 tr:nth-child("+i+") td:nth-child(1) a").html());
                        let doc = {site_name: "zyczyc.com"};
                        if (!medicine_name) break;

                        doc.market_name = "全国";
                        doc.medicine_name = medicine_name;
                        doc.produce_area = util.decodeUTF8($("#ContentPlaceHolder1_GridView1 tr:nth-child("+i+") td:nth-child(3)").html());
                        doc.medicine_type = util.decodeUTF8($("#ContentPlaceHolder1_GridView1 tr:nth-child("+i+") td:nth-child(2)").html());
                        doc.medicine_price = $("#ContentPlaceHolder1_GridView1 tr:nth-child("+i+") td:nth-child(4)").html() * 100;
                        doc.price_trend = util.decodeUTF8($("#ContentPlaceHolder1_GridView1 tr:nth-child("+i+") td:nth-child(5)").html());
                        doc.time = moment.now();
                        doc.public_date = moment().format('YYYY-MM-DD');

                        console.log(JSON.stringify(doc));
                        datas[i] = doc;

                    }
                }
                callback(datas)
            }
            done();
        }
    }];
};

Dongfang.prototype.saveDataToMongo = function (datas) {

    const internetPricesData = new InternetPricesData();
    datas.forEach($priceData => {
        if (!!$priceData) {
            internetPricesData.save($priceData)
        }
    });
};

module.exports = Dongfang;