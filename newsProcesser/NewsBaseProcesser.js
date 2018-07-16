const REDIS_KEYS = require('../model/redis/RedisKeys');

const InternetNewsData = require('../model/mongodb/InternetNewsData');

class NewsBaseProcesser {
    constructor(redis) {
        this.redis = redis;
    }

    newsNotification(news) {
        this.redis.publish(REDIS_KEYS.CHANNEL_INTERNET_NEWS, JSON.stringify(news));
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
            console.error("资讯数据保存异常：", e);
        }
    }

}

module.exports = NewsBaseProcesser;