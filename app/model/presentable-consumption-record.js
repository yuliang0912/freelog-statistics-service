'use strict'

module.exports = app => {

    const mongoose = app.mongoose

    const PresentableConsumptionRecordSchema = new mongoose.Schema({
        presentableId: {type: String, required: true}, //presentableId
        cycleNumber: {type: Number, required: true}, //消费时的周期号
        consumptionDate: {type: Date, required: true}, //消费日期
        userContractId: {type: String, required: true}, //消费者消费使用的合同ID
        userId: {type: Number, required: true}, //消费者用户ID
        nodeId: {type: Number, required: true}, //节点ID
        status: {type: Number, default: 1, required: true}, // 1:未计入统计  2:已计入统计
    }, {
        versionKey: false,
        timestamps: {createdAt: 'createDate', updatedAt: 'updateDate'},
    })

    PresentableConsumptionRecordSchema.index({cycleNumber: -1})
    PresentableConsumptionRecordSchema.index({presentableId: 1, userContractId: 1}, {unique: true})

    return mongoose.model('presentable-consumption-record', PresentableConsumptionRecordSchema)
}
