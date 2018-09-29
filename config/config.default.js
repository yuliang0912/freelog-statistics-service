'use strict';

module.exports = appInfo => {

    const config = {

        cluster: {
            listen: {port: 7018}
        },

        keys: '20ab72d9397ff78c5058a106c635f008',

        i18n: {
            enable: false
        },

        /**
         * 关闭安全防护
         */
        security: {
            xframe: {
                enable: false,
            },
            csrf: {
                enable: false,
            }
        },

        ua: {
            enable: true
        },

        bodyParser: {
            enable: true,
        },

        middleware: ['errorHandler'],

        /**
         * mongoDB配置
         */
        mongo: {
            uri: 'mongodb://192.168.0.99:27017/auth'
        },

        multipart: {
            autoFields: true,
            defaultCharset: 'utf8',
            fieldNameSize: 100,
            fieldSize: '100kb',
            fields: 10,
            fileSize: '100mb',
            files: 10,
            fileExtensions: [],
            whitelist: (fileName) => true,
        },

        freelogBase: {
            retCodeEnum: {},
            errCodeEnum: {}
        },

        logger: {level: "DEBUG"},

        gatewayUrl: "http://api.freelog.com",

        mongoose: {
            url: "mongodb://127.0.0.1:27017/event"
        },

        rabbitMq: {
            connOptions: {
                host: '192.168.164.129',
                port: 5672,
                login: 'guest',
                password: 'guest',
                authMechanism: 'AMQPLAIN',
                heartbeat: 120  //每2分钟保持一次连接
            },
            implOptions: {
                reconnect: true,
                reconnectBackoffTime: 10000  //10秒尝试连接一次
            },
            exchange: {
                name: 'freelog-statistics-exchange'
            },
            queues: [
                {
                    name: '[statistics]-end-of-cycle-queue',
                    options: {autoDelete: false, durable: true},
                    routingKeys: [
                        {
                            exchange: 'freelog-event-exchange',
                            routingKey: 'event.endOfCycle.event'
                        }
                    ]
                },
                {
                    name: '[statistics]-presentable-consumption-queue',
                    options: {autoDelete: false, durable: true},
                    routingKeys: [
                        {
                            exchange: 'freelog-auth-exchange',
                            routingKey: 'presentable.consumption.event'
                        }
                    ]
                }
            ]
        },

        customLoader: ['app/event-handler', 'app/mq-subscribe']
    }

    return config;
};
