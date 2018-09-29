'use strict'

const Patrun = require('patrun')
const appEventEmitterEnum = require('../enum/app-event-emitter-enum')
const EndOfCycleEventHandler = require('./outside-event-handler/end-of-cycle-event-handler')
const PresentableConsumptionEventHandler = require('./outside-event-handler/presentable-consumption-event-handler')
const CalculateStatisticalDataEventHandler = require('./worker-event-handler/calculate-statistical-data-event-handler')

module.exports = class AppEventsListener {

    constructor(app) {
        this.app = app
        this.patrun = Patrun()
        this.registerEventHandler()
        this.registerEventListener()
    }

    /**
     * 注册事件侦听者
     */
    registerEventListener() {

        const {PresentableConsumptionEvent, EndOfCycleEvent, CalculatePresentableStatisticalDataEvent} = appEventEmitterEnum

        this.registerEventAndHandler(EndOfCycleEvent)
        this.registerEventAndHandler(PresentableConsumptionEvent)

        this.app.messenger.on(CalculatePresentableStatisticalDataEvent, lockedSubject => {
            this.patrun.find(this._buildPatrunKey(CalculatePresentableStatisticalDataEvent)).handle(lockedSubject)
        })
    }

    /**
     * 注册事件以及事件处理者
     * @param eventName
     */
    registerEventAndHandler(eventName) {

        const eventHandler = this.patrun.find(this._buildPatrunKey(eventName))
        if (!eventHandler) {
            throw new Error(`尚未注册事件${eventName}的处理者`)
        }

        this.app.on(eventName, eventHandler.handle.bind(eventHandler))
    }

    /**
     * 注册事件处理者
     */
    registerEventHandler() {

        const {app, patrun} = this
        const {PresentableConsumptionEvent, EndOfCycleEvent, CalculatePresentableStatisticalDataEvent} = appEventEmitterEnum

        patrun.add(this._buildPatrunKey(EndOfCycleEvent), new EndOfCycleEventHandler(app))
        patrun.add(this._buildPatrunKey(PresentableConsumptionEvent), new PresentableConsumptionEventHandler(app))
        patrun.add(this._buildPatrunKey(CalculatePresentableStatisticalDataEvent), new CalculateStatisticalDataEventHandler(app))
    }

    /**
     * 构建patrun匹配key
     * @private
     */
    _buildPatrunKey(eventName) {
        return {event: eventName.toString()}
    }
}