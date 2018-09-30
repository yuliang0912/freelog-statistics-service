'use strict';

const lodash = require('lodash')
const Controller = require('egg').Controller

module.exports = class StatisticsController extends Controller {

    constructor({app}) {
        super(...arguments)
        this.presentableConsumptionRecordProvider = app.dal.presentableConsumptionRecordProvider
        this.presentableConsumptionStatisticsProvider = app.dal.presentableConsumptionStatisticsProvider
    }

    /**
     * presentable消费统计数据
     * @param ctx
     * @returns {Promise<void>}
     */
    async presentableConsumptionStatistics(ctx) {

        const presentableId = ctx.checkQuery('presentableId').isPresentableId().value
        const cycleNumbers = ctx.checkQuery('cycleNumbers').optional().isSplitNumber().toSplitArray().value
        ctx.validate()

        if (!cycleNumbers) { //如果没有指定周期范围,则查询最近一个周期的统计数据
            return await this.presentableConsumptionStatisticsProvider.findOne({presentableId}, null, {sort: {cycleNumber: -1}}).then(statisticsInfo => ctx.success({
                presentableId,
                totalCount: statisticsInfo ? statisticsInfo.totalCount : 0,
                lastCycleNumber: statisticsInfo ? statisticsInfo.cycleNumber : 0,
                updateDate: statisticsInfo ? statisticsInfo.updateDate : null
            }))
        }

        const statisticsInfos = await this.presentableConsumptionStatisticsProvider.find({
            presentableId, cycleNumber: {$in: cycleNumbers}
        })

        if (!statisticsInfos.length) {
            ctx.success({presentableId, totalCount: 0, lastCycleNumber: 0, updateDate: null})
        }
        const totalCount = lodash.sumBy(statisticsInfos, item => item.count)
        const lastCycleNumber = lodash.maxBy(statisticsInfos, item => item.cycleNumber).cycleNumber
        const lastUpdateDate = lodash.maxBy(statisticsInfos, item => item.updateDate).updateDate

        ctx.success({presentableId, totalCount, lastCycleNumber, lastUpdateDate})
    }

    /**
     * presentable消费记录数据
     * @param ctx
     * @returns {Promise<void>}
     */
    async presentableConsumptionRecords(ctx) {
        const presentableId = ctx.checkQuery('presentableId').isPresentableId().value
        const cycleNumbers = ctx.checkQuery('cycleNumbers').optional().isSplitNumber().toSplitArray().value
        const page = ctx.checkQuery("page").default(1).optional().toInt().gt(0).value
        const pageSize = ctx.checkQuery("pageSize").default(10).optional().toInt().gt(0).lt(101).value
        ctx.validate()

        const condition = {presentableId}
        if (cycleNumbers) {
            condition.cycleNumber = {$in: cycleNumbers}
        }

        var dataList = []
        const totalItem = await this.presentableConsumptionRecordProvider.count(condition)
        if (totalItem > (page - 1) * pageSize) {
            dataList = await this.presentableConsumptionRecordProvider.findPageList(condition, page, pageSize, null, {consumptionDate: -1})
        }
        ctx.success({page, pageSize, totalItem, dataList})
    }
}
