'use strict'

const queue = require('async/queue')

module.exports = class CalculateStatisticalDataEventHandler {

    constructor(app) {
        this.app = app
        this.presentableConsumptionRecordProvider = app.dal.PresentableConsumptionRecordProvider
        this.presentableConsumptionStatisticsProvider = app.dal.presentableConsumptionStatisticsProvider
    }

    /**
     * 计算统计数据
     * @param lockedSubjectInfo
     */
    async handle(statisticsInfo) {

        const {presentableId, cycleNumber, count, startCount} = statisticsInfo
        const consumptionCountTask = await this.presentableConsumptionRecordProvider.count({presentableId, cycleNumber})

        const model = {status: 2}
        if (consumptionCountTask !== count) {
            model.count = consumptionCountTask
            model.totalCount = startCount + consumptionCountTask
        }

        await this.presentableConsumptionStatisticsProvider.updateOne({presentableId, cycleNumber}, model)
    }
}