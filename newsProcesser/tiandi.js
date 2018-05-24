"use strict";
const moment = require('moment');
const util = require('../util');

const InternetNewsData = require('../model/mongodb/InternetNewsData');

function Tiandi() {
}

Tiandi.prototype.getNewsListProcessor = function(link, callback) {
    return [{
        uri: encodeURI(link),
        jquery: true,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                const linksList = [];
                try {
                    const $ = res.$;
                    const liList = $('#hasInfoRegion .list ul>li h2 a');
                    liList.each(li => {
                        linksList.push(liList[li].attribs.href);
                    });
                    callback(linksList);
                } catch (e) {
                    console.error("Tiandi 资讯解析异常：", e);
                    callback(linksList);
                }
            }
            done();
        }
    }];
};

Tiandi.prototype.getNewsProcessor = function (link, callback) {

    return [{
        uri: encodeURI(link),
        jquery: true,

        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                try {
                    let $ = res.$;

                    const news ={
                        site_name: "中药材天地网",
                        news_source: util.decodeUTF8($("#infoDetailRegion .attr span").eq(1).html()),
                        news_category: util.decodeUTF8($(".place a").eq(2).html()),
                        origin_url: link,
                        origin_tags:[util.decodeUTF8($(".sortlist .vm li a:nth-child(1)").html())],
                        news_title: util.decodeUTF8($("#infoDetailRegion h1").html()),
                        news_content: util.decodeUTF8($("#infoContent").html().replace(/<[^>]+>/g,"")),
                        news_editor: util.decodeUTF8($("#infoDetailRegion .attr span").eq(1).html()),
                        public_date: util.decodeUTF8($("#infoDetailRegion .attr span").eq(0).html()),
                        crawled_date: moment().format('YYYY-MM-DD'),
                        time:  parseInt(moment().format('X')) // 时间戳（秒）
                    };

                    callback(news)
                } catch (e) {
                    console.error("Tiandi 价格数据解析异常：", e);
                }
            }
            done();
        }
    }];
};

Tiandi.prototype.saveDataToMongo = function (newData) {
    try {
        const internetnewsData = new InternetNewsData();
        internetnewsData.save(newData);
    } catch (e) {
        console.error("Tiandi 资讯数据保存异常：", e);
    }
};

module.exports = Tiandi;