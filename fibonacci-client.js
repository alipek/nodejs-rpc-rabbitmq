'use strict';
let ampqlibRpc = require('amqplib-rpc');
let sleep = require('sleep');
let LOGGER = require('./logger.js').logger;
let queue = require('./queue.js');

let i = 0;

function next(channel) {
    i++;

    if (i % 1000 === 0) {
        LOGGER.debug(i);
        sleep.msleep(1000);
    }
    LOGGER.info('next', {current: i});
    return ampqlibRpc
        .request(
            channel,
            'fibonacci',
            [i], {
                exchangeName: '',
                timeout: 5000
            }
        )
        .then(function (reply) {
                let result = JSON.parse((reply.content.toString()));
                LOGGER.debug('result', {result: result.result});
                return result.result;
            }
        )
        .finally(() => next(channel))

};


queue
    .connect()
    .then(next)
    .catch((reason => LOGGER.error(reason)));




