/**
 * Created by bozhang on 2017/4/28.
 */
"use strict";
const request = require('request');
const Crawler = require("crawler");
const YaoDian2015 = require('../docProcesser/yaodian2015');

var c = new Crawler({
    maxConnections : 3,
    rateLimit: 1000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            let $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});

// Queue URLs with custom callbacks & parameters
let id = 5370;
let yaodianProcesser = new YaoDian2015(id, _postMediDocToSave);
c.queue(yaodianProcesser.getProcesser());


function _postMediDocToSave(data) {
    let postObj = JSON.stringify(data);
    let options = {
        url: 'http://doc.test.chinahanguang.com/doc-medicine-info/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postObj, 'utf8')
        },
        timeout: 20000,
        body: postObj
    };
    request(options, function (error, response, body) {
        if (!!error || response.statusCode !== 200) {
            console.error("chinahanguang save ", data.doc_id, " error!");
        }
    });
}
