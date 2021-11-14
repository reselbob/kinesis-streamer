const winston = require('winston');
//const fileTransport = new winston.transports.File({level: "silly", filename: "mylogfile.txt" })
const appName = 'kinesis-streamer';
const logFormat = winston.format.printf(info => {
    const formattedDate = info.timestamp.replace('T', ' ').replace('Z', '');
    return `${formattedDate}|${appName}|${info.level}|${
        info.message
    };`;
});

const logFilePath = `${__dirname}/myapp.log`;

const logger = winston.createLogger({
    level: global.loglevel || 'silly',
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [new winston.transports.Console(),
        new (winston.transports.File)({ filename: logFilePath})]
});

module.exports = {logger}
