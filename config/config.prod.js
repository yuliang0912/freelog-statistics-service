/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5672,
            login: 'prod_user_statistics',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    mongoose: {
        url: "mongodb://172.18.215.231:27017/statistics"
    },
}