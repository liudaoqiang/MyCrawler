"use strict";
const moment = require('moment');
const util = require('../util');
const NewsBaseProcesser = require('./NewsBaseProcesser');

const InternetNewsData = require('../model/mongodb/InternetNewsData');

class Tiandi extends NewsBaseProcesser {
    constructor(redis) {
        console.log('Tiandi constructor');
        super(redis);
    }

    getNewsListProcessor(link, callback) {
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
    }

    getNewsProcessor(link) {
        const that = this;
        return [{
            uri: encodeURI(link),
            jquery: true,

            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    try {
                        let $ = res.$;

                        const news = {
                            site_name: "中药材天地网",
                            news_source: util.decodeUTF8($("#infoDetailRegion .attr span").eq(1).html()).replace("作者:", ""),
                            news_category: util.decodeUTF8($(".place a").eq(2).html()),
                            origin_url: link,
                            origin_tags: [util.decodeUTF8($(".sortlist .vm li a:nth-child(1)").html())],
                            related_herbs: [util.decodeUTF8($(".sortlist .vm li a:nth-child(1)").html())],
                            news_title: util.decodeUTF8($("#infoDetailRegion h1").html()),
                            news_content_html: util.decodeUTF8($("#infoContent").html()),
                            news_content_text: util.decodeUTF8($("#infoContent").html().replace(/<[^>]+>/g, "")),
                            news_editor: util.decodeUTF8($("#infoDetailRegion .attr span").eq(1).html()).replace("作者:", ""),
                            public_date: util.decodeUTF8($("#infoDetailRegion .attr span").eq(0).html()),
                            crawled_date: moment().format('YYYY-MM-DD'),
                            time: parseInt(moment().format('X')) // 时间戳（秒）
                        };

                        that.saveDataToMongo(news)
                    } catch (e) {
                        console.error("Tiandi 价格数据解析异常：", e);
                    }
                }
                done();
            }
        }];
    }

    saveDataToMongo(newData) {
        try {
            const internetnewsData = new InternetNewsData();
            internetnewsData.save(newData, result => {
                if (result) {
                    this.newsNotification(result);
                }
            });
        } catch (e) {
            console.error("Tiandi 资讯数据保存异常：", e);
        }
    }
}

module.exports = Tiandi;