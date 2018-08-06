class Kmzytp {
    getMedicinesProcessor(herbName, callback) {
        return [{
            //http://www.kmzyw.com.cn/vchart/resouces/jsp/yftp_data_drugname.jsp?drugname=%2525E4%2525B8%252589%2525E4%2525B8%252583
            uri: encodeURI(encodeURI("http://www.kmzyw.com.cn/vchart/resouces/jsp/yftp_data_drugname.jsp?drugname=" + herbName)),
            method: "GET",

            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    const datas = JSON.parse(res.body);
                    callback(datas.list_1);
                }
                done();
            }
        }];
    }

    getMedicinePrescriptions(medicineName, callback) {
        return [{
            uri: encodeURI(encodeURI("http://www.kmzyw.com.cn/vchart/resouces/jsp/yftp_data_fj_drug.jsp?drugname=" + medicineName)),
            method: "GET",

            callback: function (error, res, done) {
                if (error) {
                    console.log(error);
                } else {
                    const datas = JSON.parse(res.body);
                    if (datas.success) {
                        const prescription = datas.list;
                        const factoryList = datas.list1;

                        callback(prescription, factoryList);
                    } else {
                        console.log("获取药品失败 ： " + medicineName);
                    }
                }
                done();
            }
        }];
    }
}

module.exports = Kmzytp;