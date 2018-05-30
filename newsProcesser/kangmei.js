"use strict";
const moment = require('moment');
const util = require('../util');

const InternetNewsData = require('../model/mongodb/InternetNewsData');

function Kangmei() {
}

Kangmei.prototype.getNewsListProcessor = function(kmChannel, currentPage, pageSize, callback) {
    return [{
        uri: "http://m.kmzyw.com.cn/news/data/newslists_new.jsp",
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "accept-encoding": "gzip, deflate",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        form: {
            cid: kmChannel,
            pageNum: currentPage,
            maxNum: pageSize,
            query: null
        },
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                const linksList = [];
                try {
                    const datas = JSON.parse(res.body);
                    datas.msg.map(news => {
                        linksList.push('http://kmzyw.com.cn' + news.url)
                    });
                    callback(linksList);
                } catch (e) {
                    console.error("Kangmei 资讯解析异常：", e);
                    callback(linksList);
                }
            }
            done();
        }
    }];
};

Kangmei.prototype.getNewsProcessor = function (link, channel, callback) {

    return [{
        uri: encodeURI(link),
        jquery: true,

        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                try {
                    let $ = res.$;
                    let market = util.decodeUTF8($(".location p a").eq(3).html());
                    const tags = [], herbs = [];
                    if (market) {market = market.replace('快讯', '');tags.push(market);}
                    let otags =$(".tag-wrap a");
                    for(let i=0;i<otags.length;i++) {
                        const tag = util.decodeUTF8(otags.eq(i).html());
                        tags.push(tag);
                        if (channel === 10200) {
                            herbs.push(tag)
                        }
                        if (channel === 10100 && i === 0) {
                            herbs.push(tag);
                        }
                    }
                    const news ={
                        site_name: "康美中药网",
                        news_source: util.decodeUTF8($(".source-wrap span").eq(0).html()).replace("来源：", ""),
                        news_category: util.decodeUTF8($(".location p a").eq(2).html()),
                        origin_url: link,
                        origin_tags:tags,
                        related_herbs:[],
                        news_title: util.decodeUTF8($(".km-article-cont .title-wrap").html()),
                        news_content_html: util.decodeUTF8($(".cont-wrap").html()),
                        news_content_text: util.decodeUTF8($(".cont-wrap").html().replace(/<[^>]+>/g,"")),
                        news_editor: util.decodeUTF8($(".editor-class").html()),
                        public_date: util.decodeUTF8($(".source-wrap span").eq(2).html()),
                        crawled_date: moment().format('YYYY-MM-DD'),
                        time:  parseInt(moment().format('X')) // 时间戳（秒）
                    };
                    // console.log(news);

                    callback(news)
                } catch (e) {
                    console.error("Kangmei getNewsProcessor 数据解析异常 - "+link+"：", e);
                }
            }
            done();
        }
    }];
};

Kangmei.prototype.saveDataToMongo = function (newData) {
    try {
        const internetnewsData = new InternetNewsData();
        internetnewsData.save(newData);
    } catch (e) {
        console.error("Tiandi 资讯数据保存异常：", e);
    }
};

module.exports = Kangmei;