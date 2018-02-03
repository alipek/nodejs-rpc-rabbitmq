"use strict";
let ampqlib = require('amqplib');

let LOGGER = require('./logger.js').logger;

function queueConnect() {
    return ampqlib
        .connect({
            username: process.env['RABBITMQ_USER'] || 'guest',
            password: process.env['RABBITMQ_PASSWORD'] || 'guest',
            hostname: process.env['RABBITMQ_HOST'] || 'localhost',
            vhost: '/',
            heartbeat: 10,
            port: 5672
        })
        .catch(function (err) {
            LOGGER.error(err);
        });
}


exports.connect = queueConnect;

