/**
 * Created by yuliang on 2017/11/8.
 */

'use strict'

module.exports = {

    rabbitMq: {
        connOptions: {
            host: 'rabbitmq-prod.common',
            port: 5672,
            login: 'prod_user_statistics',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    mongoose: {
        url: "mongodb://mongo-prod.common:27017/statistics"
    },
}

