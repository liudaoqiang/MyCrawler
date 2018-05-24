"use strict";

module.exports = {
    name: "data_internet_news",
    data: {
        site_name: {type: String}, // 采集源网站
        news_source: {type: String}, //资讯来源
        news_category: {type: String}, // 资讯类别
        origin_url: {type: String}, // 采集网址
        origin_tags: [], // 原资讯标签
        news_title: {type: String}, // 资讯标题
        news_content: {type: String}, // 资讯内容
        news_collector: {type: String}, // 采集员
        news_editor: {type: String}, // 编辑
        public_date: {type: String}, // 公布日期
        crawled_date: {tye: Date}, // 采集日期
        time: {type: Number}, // 时间戳（秒）
    },
    // 索引
    index: [
        {origin_url: -1},
        {origin_tags: -1},
        {crawled_date: -1}
    ]
};