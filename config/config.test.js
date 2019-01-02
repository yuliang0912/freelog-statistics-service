'use strict'

module.exports = {

    cluster: {
        listen: {port: 5018}
    },

    rabbitMq: {
        connOptions: {
            host: '172.18.215.231',
            port: 5673,
            login: 'test_user_statistics',
            password: 'rabbit@freelog',
            authMechanism: 'AMQPLAIN'
        }
    },

    mongoose: {
        url: "mongodb://172.18.215.231:27018/statistics"
    },
}