'use strict'

const cycleHelper = require('../../extend/helper/cycle-helper')
const {PresentableConsumptionCountChangedEvent} = require('../../enum/mq-event-publish-enum')

module.exports = class PresentableConsumptionEventHandler {

    constructor(app) {
        this.app = app
        this.presentableConsumptionRecordProvider = app.dal.presentableConsumptionRecordProvider
        this.presentableConsumptionStatisticsProvider = app.dal.presentableConsumptionStatisticsProvider
    }

    /**
     * presentable消费事件处理
     */
    async handle(presentableConsumptionEvent) {

        const {presentableId, consumptionDate, userContractId, userId, nodeId} = presentableConsumptionEvent
        const cycleNumber = cycleHelper.getCycleNumber(new Date(consumptionDate))

        const model = {presentableId, consumptionDate, userContractId, userId, nodeId, cycleNumber}
        return this.presentableConsumptionRecordProvider.create(model).then(() => {
            return this.createOrUpdatePresentableStatistics({presentableId, cycleNumber})
        }).then(statisticInfo => this.sendNotice(statisticInfo)).catch(error => this.errorHandler(error, presentableConsumptionEvent))
    }

    /**
     * 发送统计数据变更通告
     */
    sendNotice(statisticInfo) {
        this.app.rabbitClient.publish(Object.assign({}, PresentableConsumptionCountChangedEvent, {body: statisticInfo}))
    }

    /**
     * 创建或更新统计数据
     * @param presentableId
     * @param cycleNumber
     */
    async createOrUpdatePresentableStatistics({presentableId, cycleNumber}) {

        const statistic = await this.presentableConsumptionStatisticsProvider.findOneAndUpdate({
            presentableId, cycleNumber
        }, {$inc: {totalCount: 1, count: 1}}, {new: true})

        if (statistic) {
            return statistic
        }

        return this.presentableConsumptionStatisticsProvider.findOne({presentableId}, null, {sort: {cycleNumber: -1}}).then(prevStatisticsInfo => {
            prevStatisticsInfo = prevStatisticsInfo || {cycleNumber: 0, count: 0, totalCount: 0}
            return {
                cycleNumber, presentableId, count: 1,
                totalCount: prevStatisticsInfo.totalCount + 1,
                startCount: prevStatisticsInfo.totalCount,
                prevCycleNumber: prevStatisticsInfo.cycleNumber
            }
        }).then(statisticsInfo => {
            return this.presentableConsumptionStatisticsProvider.create(statisticsInfo)
        })
    }

    /**
     * 错误处理
     * @param error
     * @param message
     */
    errorHandler() {
        this.app.logger.error('presentable-consumption-event-handler事件执行异常', ...arguments)
    }
}