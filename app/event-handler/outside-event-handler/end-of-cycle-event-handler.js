'use strict'

const {CalculatePresentableStatisticalDataEvent} = require('../../enum/app-event-emitter-enum')

module.exports = class EndOfCycleEventHandler {

    constructor(app) {
        this.app = app
        this.presentableConsumptionStatisticsProvider = app.dal.presentableConsumptionStatisticsProvider
    }

    /**
     * 周期结束事件处理函数
     * @param cycleNumber
     */
    async handle({cycleNumber}) {
        console.log(`end of cycle event:${cycleNumber}`)
        await this.getToBeConfirmedPresentableConsumptionStatistics({cycleNumber})
    }

    /**
     * 获取待确认的presentable消费数据,并且随机分配确认任务到其他的worker
     */
    async getToBeConfirmedPresentableConsumptionStatistics({cycleNumber, skip = 0, limit = 2000}) {

        const triggerEvents = await this.presentableConsumptionStatisticsProvider.find({
            cycleNumber, status: 1
        }, null, {skip, limit})

        if (triggerEvents.length > 0) {
            triggerEvents.forEach(item => this.sendTasks(item))
        }
        if (triggerEvents.length === limit) {
            await this.getToBeConfirmedPresentableConsumptionStatistics({cycleNumber, skip: skip + limit, limit})
        }
    }

    /**
     * 发送任务到egg-agent 然后agent会随机发送任务到一个worker,尽可能保证所有worker平均分配来共同执行统计任务
     */
    async sendTasks(model) {
        this.app.sendMessageToClusterRandomWorker(CalculatePresentableStatisticalDataEvent, model)
    }
}