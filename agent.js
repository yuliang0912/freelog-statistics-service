'use strict'

const {CalculatePresentableStatisticalDataEvent} = require('./app/enum/app-event-emitter-enum')

module.exports = agent => {
    agent.messenger.on(CalculatePresentableStatisticalDataEvent, function (data) {
        agent.messenger.sendRandom(CalculatePresentableStatisticalDataEvent, data)
    })
}