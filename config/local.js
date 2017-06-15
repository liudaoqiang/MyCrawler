/**
 * Created by bozhang on 2017/6/1.
 */
module.exports = {
    mysql: {
        dbname: 'chgg_erp_local', // 数据库名
        config: {
            'dialect': 'mysql', // 数据库使用mysql
            'port': 3306, // 数据库服务器端口
            'define': {
                // 字段以下划线（_）来分割（默认是驼峰命名风格）
                'underscored': true
            },
            replication: {
                read: [
                    {
                        host: 'rr-2ze6s6q222q8480oo.mysql.rds.aliyuncs.com',
                        username: 'prod_mng',
                        password: 'QM-timemg2016'
                    }
                ],
                write: {
                    'host': 'rdsko7x2f31ur3su9s6h.mysql.rds.aliyuncs.com',
                    username: 'prod_mng',
                    password: 'QM-timemg2016'
                }
            },
            pool: {
                max: 30,
                min: 0,
                idle: 10000
            },
            timezone: '+08:00',
            logging: false
        }
    },
    mongo: {
        conn: 'mongodb://root:root@localhost:27017/HanGreat',
        options: {server: {poolSize: 2}, replset: {poolSize: 2}},
    },
    redis: {
        host: '127.0.0.1',
        port: '6379'
    }
};
