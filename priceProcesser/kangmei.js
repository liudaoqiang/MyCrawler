/**
 * Created by bozhang on 2017/5/4.
 */
"use strict";
const moment = require('moment');
const request = require("request");

const InternetPricesData = require('../model/mongodb/InternetPricesData');

function Kangmei(medicineName, market) {
    this.medicineName = medicineName;
    this.site = market;
}

Kangmei.prototype.getProcesser = function (callback) {
    const medicineName = this.medicineName;
    const site = this.site;

    return [{
        url: 'http://m.kmzyw.com.cn/jiage/jsp/get_td_price.jsp',
        // 获取药品对应的dragId
        preRequest: function (options, done) {
            const that = this;
            const dragInfoOptions = {
                url: 'http://m.kmzyw.com.cn/resources/jsp/pznamedata_id.jsp',
                form: {
                    name: encodeURI(medicineName),
                    type:1
                }
            };
            request.post(dragInfoOptions, function (err, httpResponse, body) {
                if (body) {
                    try {
                        const DragInfo = JSON.parse(body);
                        options.form = {
                            drugid: DragInfo.rows && DragInfo.rows[0].dvalue.split('-')[0],
                            pages: 0,
                            site: encodeURI(site)
                        };
                    }catch (e) {
                        console.error(e);
                    }
                }
                done();
            });

        },
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "accept-encoding": "gzip, deflate",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        form: {},
        jquery: false,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                try {
                    const data = JSON.parse(res.body);
                    let datas = new Array();
                    datas = data.rows.map(row => {
                        let doc = {site_name: "kmzyw.com.cn"};
                        doc.market_name = site === "成都荷花池" ? "成都" : site;
                        doc.medicine_name = row.drug_name;
                        doc.medicine_price = parseFloat(row.pricenum) * 100;
                        doc.produce_area = row.orgin;
                        doc.medicine_type = row.standards;
                        doc.price_trend = row.week_calculate;
                        doc.time = moment.now();
                        doc.public_date = moment().format('YYYY-MM-DD');
                        return doc;
                    });

                    callback(datas)
                } catch (e) {
                    console.error("KangMei 价格解析异常：", e)
                }
            }
            done();
        }
    }];

};

Kangmei.prototype.saveDataToMongo = function (datas) {
    try {
        const internetPricesData = new InternetPricesData();
        datas.forEach($priceData => {
            if (!!$priceData) {
                internetPricesData.save($priceData)
            }
        });
    } catch (e) {
        console.error("KangMei 价格数据保存异常：", e)

    }
};

module.exports = Kangmei;