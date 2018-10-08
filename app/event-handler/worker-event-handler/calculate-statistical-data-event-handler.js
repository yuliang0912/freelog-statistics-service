'use strict'

const queue = require('async/queue')

module.exports = class CalculateStatisticalDataEventHandler {

    constructor(app) {
        this.app = app
        this.queue = queue(this.calculatePresentableStatistical.bind(this), 20)
        this.presentableConsumptionRecordProvider = app.dal.presentableConsumptionRecordProvider
        this.presentableConsumptionStatisticsProvider = app.dal.presentableConsumptionStatisticsProvider
    }

    /**
     * 计算统计数据
     * @param lockedSubjectInfo
     */
    async handle(statisticsInfo) {
        this.queue.push(statisticsInfo, this.callback.bind(this))
    }

    /**
     * 计算presentable消费统计数据
     * @param statisticsInfo
     * @returns {Promise<void>}
     */
    async calculatePresentableStatistical(statisticsInfo) {

        const {presentableId, cycleNumber} = statisticsInfo

        const consumptionCount = await this.presentableConsumptionRecordProvider.count({presentableId, cycleNumber})
        const totalConsumptionCount = await this.presentableConsumptionRecordProvider.count({
            presentableId, cycleNumber: {$lte: cycleNumber}
        })

        const model = {status: 2, count: consumptionCount, totalCount: totalConsumptionCount}

        await this.presentableConsumptionStatisticsProvider.updateOne({presentableId, cycleNumber}, model)
            .catch(error => this.callback(error, statisticsInfo))
    }

    /**
     * 错误处理
     * @param err
     */
    callback(error) {
        if (error instanceof Error) {
            console.log("calculate-statistical-data-event-handler", '事件执行异常', ...arguments)
            this.app.logger.error("calculate-statistical-data-event-handler", '事件执行异常', ...arguments)
        }
    }
}