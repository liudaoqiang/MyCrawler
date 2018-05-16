/**
 * Created by bozhang on 2017/6/1.
 */
module.exports = {
    mysql: {
        dbname: 'chgg_erp_prod', // 数据库名
        config: {
            dialect: 'mysql', // 数据库使用mysql
            port: 3306, // 数据库服务器端口
            replication: {
                read: [
                    {
                        host: 'rr-2ze193a0s31qh3cej.mysql.rds.aliyuncs.com',
                        username: 'chgg_erp_prod',
                        password: 'ChggERPProd2017'
                    }
                ],
                write: {
                    host: 'rm-2ze8mpi5i65429l1q.mysql.rds.aliyuncs.com',
                    username: 'chgg_erp_prod',
                    password: 'ChggERPProd2017'
                }
            },
            pool: {
                max: 30,
                min: 0,
                idle: 10000
            },
            timezone: '+08:00',
            logging: false,
            benchmark:false
        }
    },
    mongo: {
        conn: 'mongodb://root:prod_Chgg2016@dds-2ze7bad1514e85641.mongodb.rds.aliyuncs.com:3717,dds-2ze7bad1514e85642.mongodb.rds.aliyuncs.com:3717/HanGreat?replicaSet=mgset-3365873',
        options: {poolSize: 10}
    },
    redis: {
        host: 'r-2ze5678b3244ef64.redis.rds.aliyuncs.com',
        port: '6379',
        auth: 'Chgg2016'
    }
};