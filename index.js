require('dotenv').config();
const {stream, stopJobs} = require('./streamer');
const {logger} = require('./logger');
logger.info(`Starting streamer at ${new Date()}`);

const getEnvVarErrorMessage = (env_var) => {
    return `The environment value ${env_var} has not been set`;
}

if(! process.env.AWS_KINESIS_STREAM_NAME) throw new Error(getEnvVarErrorMessage('AWS_KINESIS_STREAM_NAME'))

const streamName = process.env.AWS_KINESIS_STREAM_NAME;
const numOfJobs = process.env.CRON_JOBS_TO_GENERATE || 10;
const numOfMessage = process.env.MESSAGES_PER_CRON_JOB || 10;

stream(streamName,numOfJobs,numOfMessage)
    .then(data =>{
        logger.info(data);
    });
