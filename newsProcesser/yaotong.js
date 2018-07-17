"use strict";
const moment = require('moment');
const util = require('../util');
const NewsBaseProcesser = require('./NewsBaseProcesser');

class Yaotong extends NewsBaseProcesser {
    constructor(redis) {
        console.log('Yaotong constructor');
        super(redis);
    }

    getNewsListProcessor(categoryId, pageIndex, pageSize, callback) {
        const newsConfig = {
            1: {
                category: '品种分析',
                getUrl: function (acid) {
                    return "http://www.yt1998.com/hqMinute--"+acid+".html";
                }
            },
            2: {
                category: '药市动态',
                getUrl: function (acid) {
                    return "http://www.yt1998.com/hqMinute--"+acid+".html";
                }
            },
            3: {
                category: '市场行情',
                getUrl: function (acid) {
                    return "http://www.yt1998.com/hqMinute--"+acid+".html";
                }
            },
            4: {
                category: '新闻法规',
                getUrl: function (acid) {
                    return "http://www.yt1998.com/hqMinute--"+acid+".html";
                }
            },
            5: {
                category: '热点追踪',
                getUrl: function (acid) {
                    return "http://www.yt1998.com/hqMinute--"+acid+".html";
                }
            },
            9: {
                category: '产地信息',
                getUrl: function (acid) {
                    return "http://www.yt1998.com/hqMinute--"+acid+".html";
                }
            },

        };
        return [{
            uri: "http://www.yt1998.com/ytw/second/marketMgr/query.jsp?random=0.587355741268809&scid=&lmid="+categoryId+"&ycnam=&times=4&pageIndex="+pageIndex+"&pageSize="+pageSize,
            jquery: false,
            timeout: 10000,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
                "Accept": "*/*",
                "accept-encoding": "gzip, deflate"
            },

            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    try {
                        let data = JSON.parse(res.body).data;
                        data.forEach(ytNews => {
                            const config = newsConfig[categoryId];
                            let herbs = [];
                            if (ytNews.ycnam.indexOf('、') > 0) {
                                herbs = ytNews.ycnam.split('、');
                            } else {
                                herbs = ytNews.ycnam.split(' ');
                            }
                            const news = {
                                site_name: "药通网",
                                news_source: ytNews.source ? ytNews.source : "药通网",
                                news_category: config.category,
                                origin_url: config.getUrl(ytNews.acid),
                                origin_tags:[ytNews.market].concat(herbs),
                                related_herbs: herbs,
                                news_title: ytNews.title,
                                news_editor: ytNews.writer,
                                public_date: ytNews.dtm,
                                crawled_date: moment().format('YYYY-MM-DD'),
                                time:  parseInt(moment().format('X')) // 时间戳（秒）
                            };

                            callback(news)
                        });
                    } catch (e) {
                        console.error("Yaotong 价格数据解析异常：", e);
                    }
                }
                done();
            }
        }];
    }

    getNewsProcessor(dataNews) {
        const that = this;
        return [{
            uri: encodeURI(dataNews.origin_url),
            jquery: true,
            timeout: 10000,
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
                "Accept": "*/*",
                "accept-encoding": "gzip, deflate"
            },

            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    const $ = res.$;
                    try {
                        const htmlContent  = $(".m-list .lh28").html();
                        dataNews.news_content_html = util.decodeUTF8(htmlContent);
                        dataNews.news_content_text = util.decodeUTF8(htmlContent.replace(/<[^>]+>/g, ""));

                        that.saveDataToMongo(dataNews)
                    } catch (e) {
                        console.error("Tiandi 价格数据解析异常：", e);
                    }
                }
                done();
            }
        }];

    }
}

module.exports = Yaotong;