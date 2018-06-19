const REDIS_KEYS = require('../model/redis/RedisKeys');
class NewsBaseProcesser {
    constructor(redis) {
        this.redis = redis;
    }

    newsNotification(news) {
        this.redis.publish(REDIS_KEYS.CHANNEL_INTERNET_NEWS, JSON.stringify(news));
    }

}

module.exports = NewsBaseProcesser;