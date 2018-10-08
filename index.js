/**
 * Created by yuliang on 2017/9/15.
 */

'use strict';

require('egg').startCluster({
    baseDir: __dirname,
    port: process.env.PORT || 7018,
    workers: 1
});


