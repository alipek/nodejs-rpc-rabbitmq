let winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transport: [
        new winston.transports.File({ filename: '/dev/stdout' }),
        new winston.transports.Console({
            format: winston.format.json()
        })
    ]
});


exports.logger = logger;