/**
 * Created by bozhang on 2017/5/19.
 */
"use strict";

const util = require('../util');

function _convertIdToString(id) {
    let str = '' + id;
    const added = 4 - str.length;
    let result = ''
    for (let i=0;i<added;i++) {
        str='0'+str
    };
    return str;
}


function KangmeiDoc(id, handleResultFunciton) {
    this.id = _convertIdToString(id);
    this.handleResult = handleResultFunciton;
}

KangmeiDoc.prototype.getProcesser = function () {
    let docId = this.id;
    let callback = this.handleResult;
    return [{
        uri: 'http://www.kmzyw.com.cn/yaocai/zs_' + this.id + '.html', //id >= 1 && id <= 5349
        jquery: true,

        callback: function (error, res, done) {
            if(error){
                console.log(error);
                console.log("yaobiaozhun get ", docId, ' error! ')
            }else{
                let $ = res.$;
                let docInfo = {};
                docInfo.doc_id = docId;
                docInfo.resource_link = 'http://www.kmzyw.com.cn/yaocai/zs_' + docId + '.html';
                docInfo.herb_name = util.decodeUTF8($(".left_content_title h3").html());
                docInfo.herb_des = util.decodeUTF8($(".left_content_title p:nth-child(3)").html());

                let key = null, value = null;

                docInfo.herb_attributes = {};
                $(".detailedness .detailedness_dashed").each(function () {
                    $(this).find('div').each(function () {
                        key = util.decodeUTF8($(this).find('span').html());
                        value = util.decodeUTF8($(this).find('p').html());

                        docInfo.herb_attributes[key] = value;
                    });
                });

                //主治功效
                docInfo.herb_efficacy = {};
                $("#Efficacy .appraisal_content_list").children().each(function () {
                    if($(this).is('h3')) {
                        key = util.decodeUTF8($(this).html());
                    } else if ($(this).is('p')) {
                        value = util.decodeUTF8($(this).html());
                        docInfo.herb_efficacy[key] = value;
                    }
                });

                //用法用量Directions
                docInfo.herb_directions = {};
                docInfo.herb_directions['用法用量'] = util.decodeUTF8($("#Directions .appraisal_content_list p").html());

                //采收加工
                docInfo.herb_harvesting = {};
                $("#harvesting .appraisal_content_list").children().each(function () {
                    if($(this).is('h3')) {
                        key = util.decodeUTF8($(this).html());
                        docInfo.herb_harvesting[key] = [];
                    } else if ($(this).is('p')) {
                        value = util.decodeUTF8($(this).html());
                        docInfo.herb_harvesting[key].push(value);
                    }
                });

                //药方选录
                docInfo.herb_excerption = [];
                $("#excerption .appraisal_content_list").children('p').each(function () {
                    docInfo.herb_excerption.push(util.decodeUTF8($(this).html()));
                });


                //药物配伍
                docInfo.herb_drug = [];
                $("#Drug .appraisal_content_list").children('p').each(function () {
                    docInfo.herb_drug.push(util.decodeUTF8($(this).html()));
                });

                console.log(docInfo.resource_link);
                callback(docInfo);
            }
            done();
        }
    }];
};

module.exports = KangmeiDoc;