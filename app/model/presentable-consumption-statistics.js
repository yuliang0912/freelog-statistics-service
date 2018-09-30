'use strict'

const lodash = require('lodash')

module.exports = app => {

    const mongoose = app.mongoose

    const toJsonOptions = {
        transform(doc, ret, options) {
            return Object.assign({recordId: doc.id}, lodash.omit(ret, ['_id']))
        }
    }

    const PresentableConsumptionStatisticsSchema = new mongoose.Schema({
        presentableId: {type: String, required: true}, //presentableId
        count: {type: Number, required: true}, //本周期消费的数量
        totalCount: {type: Number, required: true}, //消费总数量
        startCount: {type: Number, required: true}, //统计周期开始时的数量
        cycleNumber: {type: Number, required: true}, //周期号
        prevCycleNumber: {type: Number, required: true},//上一记录周期号
        status: {type: Number, default: 1, required: true}, //1:未校正确认  2:已校正确认
    }, {
        versionKey: false,
        toJSON: toJsonOptions,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'}
    })

    PresentableConsumptionStatisticsSchema.index({presentableId: 1, cycleNumber: -1}, {unique: true})

    return mongoose.model('presentable-consumption-statistics', PresentableConsumptionStatisticsSchema)
}
