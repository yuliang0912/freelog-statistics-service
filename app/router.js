'use strict';

module.exports = app => {

    const {router, controller} = app

    router.get('/v1/statistics/presentableConsumptionRecords', controller.statistics.presentableConsumptionRecords)
    router.get('/v1/statistics/presentableConsumptionStatistics', controller.statistics.presentableConsumptionStatistics)
};
