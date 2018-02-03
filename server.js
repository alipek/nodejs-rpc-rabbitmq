#!/usr/bin/env node
'use strict';
const program = require('commander');
program
    .version('0.0.1')
    .arguments('');


let reply = require('amqplib-rpc').reply;
let queue = require('./queue.js');
let LOGGER = require('./logger.js').logger;


queue.connect()
    .then(function (channelModel) {
        return Promise.all([channelModel.createChannel(), channelModel.createChannel()]);
    })
    .catch(function (reason) {
        LOGGER.error(reason);
    })
    .then(function (channels) {

        let consumeChannel = channels[0];

        let produceChannel = channels[1];
        return consumeChannel.assertQueue('fibonacci', {exclusive: true})
            .then(function () {
                return consumeChannel.consume('fibonacci', function (message) {
                    let contents = JSON.parse(message.content.toString());
                    LOGGER.info('consume', {request_param: contents});

                    function fibbonaci(num) {
                        var a = 1, b = 0, temp;

                        while (num >= 0) {
                            temp = a;
                            a = a + b;
                            b = temp;
                            num--;
                        }

                        return b;
                    }

                    let result = fibbonaci.apply(this, contents);
                    reply(produceChannel, message, result, {});
                });
            });
    })
    .catch(function (reason) {
        LOGGER.error(reason);
        process.exit();
    });
