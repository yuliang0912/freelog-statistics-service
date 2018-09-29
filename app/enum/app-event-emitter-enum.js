'use strict'

module.exports = {

    /**
     * presentable消费事件
     */
    PresentableConsumptionEvent: Symbol('event#presentableConsumptionEvent'),

    /**
     * 周期结束事件
     */
    EndOfCycleEvent: Symbol('event#endOfCycleEvent'),

    /**
     * 计算统计数据事件
     */
    CalculatePresentableStatisticalDataEvent: 'event#CalculatePresentableStatisticalDataEvent'
}