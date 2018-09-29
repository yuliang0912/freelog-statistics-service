'use strict'

const globalInfo = require('egg-freelog-base/globalInfo')

module.exports = {

    /**
     * 根据日期计算周期编号
     * @param date
     */
    getCycleNumber(date) {

        if (toString.call(date) !== '[object Date]') {
            throw new Error('参数必须是date类型')
        }

        const {beginDate, startCycleNumber, cycleIntervalMillisecond} = this.getCycleConfigSegment(date)

        const number = Math.floor((date - beginDate) / cycleIntervalMillisecond)

        return number + startCycleNumber
    },

    /**
     * 根据日期获取周期配置段
     * @param date
     */
    getCycleConfigSegment(date) {
        const {config} = globalInfo.app
        const cycleSetting = config.cycleSetting.find(item => {
            return date >= item.beginDate && date < item.endDate
        })
        if (!cycleSetting) {
            throw new Error('日期不在周期配置的范围内')
        }
        return cycleSetting
    }
}
