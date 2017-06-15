/**
 * Created by bozhang on 2017/5/19.
 */
"use strict";

const util = require('../util');


function Yaodian2015(id, handleResultFunciton) {
    this.id = id;
    this.handleResult = handleResultFunciton;
}

Yaodian2015.prototype.getProcesser = function () {
    let docId = this.id;
    let callback = this.handleResult;
    return [{
        uri: 'http://www.yaobiaozhun.com/yd2015/view.php?v=txt&id=' + this.id, //id >= 1 && id <= 5349
        jquery: true,

        callback: function (error, res, done) {
            if(error){
                console.log(error);
                console.log("yaobiaozhun get ", docId, ' error! ')
            }else{
                let $ = res.$;
                let docInfo = {};
                docInfo.doc_id = docId;
                docInfo.doc_medicine_name = util.decodeUTF8($("#article_info h1").html());
                docInfo.doc_medicine_pinyin_name = $(".cms_list pre center:nth-child(2) b").html();
                docInfo.doc_medicine_english_name = $(".cms_list pre center:nth-child(3) b").html();
                docInfo.doc_book_name = "中国药典(2015版)";
                docInfo.doc_book_category = ["官方", "现代"];
                docInfo.doc_book_page_number = util.decodeUTF8($("#article_info").html().split("</h1>")[1]).split('页码：')[1].replace('%uA0%uA0\r\n\t\t', '')
                docInfo.doc_book_volume = util.decodeUTF8($(".path_box.clearfix ul li:nth-child(2) a").html());
                docInfo.doc_medicine_category = util.decodeUTF8($(".path_box.clearfix ul li:nth-child(3) a").html());
                docInfo.doc_medicine_description = util.decodeUTF8($("#content_text").html());
                docInfo.doc_medicine_tag = [];
                docInfo.doc_origin_page = "";
                docInfo.doc_editor = "";

                callback(docInfo);
            }
            done();
        }
    }];
};

module.exports = Yaodian2015;