'use strict'

const Patrun = require('patrun')
const rabbit = require('../extend/helper/rabbit-mq-client')
const {EndOfCycleEvent, PresentableConsumptionEvent} = require('../enum/app-event-emitter-enum')

module.exports = class RabbitMessageQueueSubscribeHandler {

    constructor(app) {
        this.app = app
        this.handlerPatrun = Patrun()
        this.__registerEventHandler__()
        this.subscribe()
    }

    /**
     * 订阅rabbitMQ消息
     */
    subscribe() {
        new rabbit(this.app.config.rabbitMq).connect().then(client => {
            //订阅周期结束事件
            client.subscribe('statistics#end-of-cycle-queue', this.handleMessage.bind(this))
            //订阅presentable消费记录队列
            client.subscribe('statistics#presentable-consumption-queue', this.handleMessage.bind(this))
        }).catch(console.error)
    }

    /**
     * rabbitMq事件处理主函数
     */
    async handleMessage(message, headers, deliveryInfo, messageObject) {
        try {
            const givenEventHandler = this.handlerPatrun.find({
                queue: deliveryInfo.queue,
                eventName: headers.eventName,
                routingKey: messageObject.routingKey
            })
            if (givenEventHandler) {
                await givenEventHandler({message, headers, deliveryInfo, messageObject})
            } else {
                console.log(`不能处理的未知事件,queueName:${deliveryInfo.queue},routingKey:${messageObject.routingKey},eventName:${headers.eventName}`)
            }
        } catch (e) {
            this.app.logger.error(`rabbitMq事件执行异常`, e)
        } finally {
            messageObject.acknowledge(false)
        }
    }

    /**
     * 注册事件处理函数
     * @private
     */
    __registerEventHandler__() {

        const {handlerPatrun, app} = this

        //周期结束队列
        handlerPatrun.add({queue: 'statistics#end-of-cycle-queue'}, ({message}) => {
            app.emit(EndOfCycleEvent, message)
        })

        //presentable消费队列
        handlerPatrun.add({queue: 'statistics#presentable-consumption-queue'}, ({message, headers}) => {
            app.emit(PresentableConsumptionEvent, message)
        })
    }
}