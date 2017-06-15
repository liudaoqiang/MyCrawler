/**
 * Created by bozhang on 2017/5/4.
 */
"use strict";

module.exports = [{
    uri: 'http://m.kmzyw.com.cn/price/data/price_index_search2.jsp',
    // uri: 'http://m.kmzyw.com.cn/jiage/jsp/data.jsp', 参数 name:名称，获取药品id
    // uri: 'http://m.kmzyw.com.cn/jiage/jsp/get_td_price.jsp',参数 表单 site:市场，drugid："id"，pages:0
    jquery: false,
    callback: function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            let json = res.body;
            console.log(json);
        }
        done();
    }
}];