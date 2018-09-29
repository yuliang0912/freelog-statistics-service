'use strict';

const Controller = require('egg').Controller

module.exports = class StatisticsController extends Controller {

    /**
     * presentable消费统计数据
     * @param ctx
     * @returns {Promise<void>}
     */
    async presentableConsumption(ctx) {

        const presentableId = ctx.checkQuery('presentableId').isPresentableId().value
        const cycleNumber = ctx.checkQuery('cycleNumber').optional().toInt().value
        ctx.validate()

        const condition = {presentableId}
        if (cycleNumber) {
            condition.cycleNumber = cycleNumber
        }

        await ctx.dal.presentableConsumptionStatisticsProvider.findOne(condition).sort({cycleNumber: -1})
            .then(ctx.success).catch(ctx.error)
    }
}
