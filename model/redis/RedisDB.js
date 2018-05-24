"use strict";

var Redis = require("redis");
var bluebird = require('bluebird');
const cluster = require('cluster');

const env = process.env.NODE_ENV;
const redisConf = require('../../config/index')(env).redis;
const options = {
    host:redisConf.host,
    port:redisConf.port,
    db:redisConf.db,
    retry_strategy: function (options) {
        if (options.total_retry_time > 1000 * 30) {
            // const content = "最高警报：Core API的Redis服务器断开，重连30秒无效，请立即处理！";
            // End reconnecting after a specific timeout and flush all commands with a individual error
            // if (process.env.NODE_ENV.indexOf('prod') && cluster.isMaster) {
            //     const messagePhone = process.configure['monitroPhones'];
            //     const SMSdb = require('../db/SMSdb');
            //     const sms = new SMSHelper();
            //     sms.sendSimpleSMSes(content, messagePhone);
            // }
            // 重连10次无效，系统将退出让pm2将其重启，其为了解决阿里云中redis服务器断开连接，必须客户端重启才能连接上的问题。
            process.exit(0);
        }
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            // const content = "最高警报：Core API的Redis服务器连接被拒绝！";
            // if (process.env.NODE_ENV.indexOf('prod') && cluster.isMaster) {
            //     const messagePhone = process.configure['monitroPhones'];
            //     const sms = new SMSHelper();
            //     sms.sendSimpleSMSes(content, messagePhone);
            // }
            // console.error(content);
            return new Error('The server refused the connection');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in errorgit
            return undefined;
        }
        // reconnect after
        // console.info(' --------------- reconnect to server --------options.total_retry_time ------- ', options.total_retry_time );
        // console.info(' --------------- reconnect to server ~~~~~~~~options.times_connected ~~~~~~~ ', options.times_connected );
        return Math.min(options.attempt * 100, 750);
    }
};

const redis = Redis.createClient(options);
if (!!redisConf.auth) {
     redis.auth(redisConf.auth);
}


bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

redis.on("error", function(err) {
    console.error('redis error - ', err);
});

module.exports = redis;